import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const {
      items, // array of { productId, quantity }
      shippingAddress,
      billingAddress,
      paymentMethod = 'UPI',
      couponCode,
      doctorNotes
    } = req.body;

    if (!items || !items.length || !shippingAddress) {
      res.status(400).json({ success: false, message: 'Cart items and shipping address are required' });
      return;
    }

    // 1. Fetch fresh product details and verify stock
    const productIds = items.map((i: any) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    for (const item of items) {
      const prod = productMap.get(item.productId);
      if (!prod) {
        res.status(404).json({ success: false, message: `Product ${item.productId} not found` });
        return;
      }
      if (prod.stock < item.quantity) {
        res.status(400).json({
          success: false,
          message: `Insufficient stock for "${prod.name}". Available: ${prod.stock}, Requested: ${item.quantity}`
        });
        return;
      }
    }

    // 2. Calculate Subtotal, GST, Shipping, Discount
    let subtotal = 0;
    let gstAmount = 0;
    const orderItemsData: any[] = [];

    for (const item of items) {
      const prod = productMap.get(item.productId)!;
      const itemSubtotal = prod.price * item.quantity;
      const itemGst = (itemSubtotal * (prod.gstPercent || 12)) / 100;

      subtotal += itemSubtotal;
      gstAmount += itemGst;

      orderItemsData.push({
        productId: prod.id,
        productName: prod.name,
        brand: prod.brand,
        sku: prod.sku,
        price: prod.price,
        mrp: prod.mrp,
        gstPercent: prod.gstPercent,
        quantity: item.quantity,
        total: itemSubtotal
      });
    }

    let discountAmount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase(), isActive: true }
      });

      if (coupon && subtotal >= coupon.minOrderValue) {
        if (coupon.discountType === 'PERCENTAGE') {
          discountAmount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
            discountAmount = coupon.maxDiscount;
          }
        } else {
          discountAmount = coupon.discountValue;
        }

        // Increment coupon usage
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { usageCount: { increment: 1 } }
        });
      }
    }

    const shippingFee = subtotal >= 5000 ? 0 : 100;
    const totalAmount = Math.max(0, subtotal + gstAmount + shippingFee - discountAmount);

    // Generate Order Number
    const count = await prisma.order.count();
    const orderNumber = `DK${10255 + count}`;
    const invoiceNumber = `INV-2026-${10255 + count}`;
    const transactionId = `TXN${Date.now().toString().slice(-9)}`;

    // 3. Create Order, OrderItems, StatusLogs, and Invoice in Transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: req.user!.id,
          status: 'CONFIRMED',
          subtotal: Number(subtotal.toFixed(2)),
          gstAmount: Number(gstAmount.toFixed(2)),
          discountAmount: Number(discountAmount.toFixed(2)),
          shippingFee,
          totalAmount: Number(totalAmount.toFixed(2)),
          paymentStatus: 'SUCCESS',
          paymentMethod,
          transactionId,
          shippingAddress: typeof shippingAddress === 'string' ? shippingAddress : JSON.stringify(shippingAddress),
          billingAddress: typeof billingAddress === 'string' ? billingAddress : JSON.stringify(billingAddress || shippingAddress),
          couponCode: couponCode || null,
          doctorNotes: doctorNotes || null,
          items: {
            create: orderItemsData
          },
          statusLogs: {
            create: [
              { status: 'PLACED', note: `Order placed online via ${paymentMethod}`, updatedBy: 'System' },
              { status: 'CONFIRMED', note: `Payment confirmed (Txn #${transactionId})`, updatedBy: 'Payment Gateway' }
            ]
          },
          invoice: {
            create: {
              invoiceNumber,
              subtotal: Number(subtotal.toFixed(2)),
              gstAmount: Number(gstAmount.toFixed(2)),
              discountAmount: Number(discountAmount.toFixed(2)),
              shippingFee,
              totalAmount: Number(totalAmount.toFixed(2)),
              clinicName: (shippingAddress && shippingAddress.clinicName) || 'Dental Clinic',
              doctorName: (shippingAddress && shippingAddress.name) || req.user!.name,
              gstNumber: (shippingAddress && shippingAddress.gstNumber) || null,
              clinicAddress: `${shippingAddress.addressLine1 || ''}, ${shippingAddress.city || ''}, ${shippingAddress.state || ''} - ${shippingAddress.pincode || ''}`
            }
          }
        },
        include: {
          items: true,
          statusLogs: true,
          invoice: true
        }
      });

      // Deduct inventory & create inventory logs
      for (const item of items) {
        const prod = productMap.get(item.productId)!;
        const newStock = prod.stock - item.quantity;
        await tx.product.update({
          where: { id: prod.id },
          data: { stock: newStock }
        });

        await tx.inventoryLog.create({
          data: {
            productId: prod.id,
            previousStock: prod.stock,
            newStock,
            changeQuantity: item.quantity,
            changeType: 'ORDER_DEDUCTION',
            reason: `Order deduction for #${orderNumber}`,
            adminName: 'System'
          }
        });
      }

      // Update Doctor Profile spending & order count
      await tx.doctorProfile.upsert({
        where: { userId: req.user!.id },
        create: {
          userId: req.user!.id,
          clinicName: (shippingAddress && shippingAddress.clinicName) || 'Dental Clinic',
          totalSpent: totalAmount,
          orderCount: 1
        },
        update: {
          totalSpent: { increment: totalAmount },
          orderCount: { increment: 1 }
        }
      });

      // Clear user cart
      await tx.cartItem.deleteMany({
        where: { userId: req.user!.id }
      });

      // Create Notification
      await tx.notification.create({
        data: {
          userId: req.user!.id,
          title: `Order Placed Successfully #${orderNumber}`,
          message: `Your order for ₹${totalAmount.toLocaleString('en-IN')} is confirmed and will be dispatched shortly.`,
          type: 'ORDER',
          link: `/orders/${orderNumber}`
        }
      });

      return newOrder;
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDoctorOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { status, page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const where: any = { userId: req.user.id };
    if (status) {
      where.status = status as string;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                select: { id: true, images: true }
              }
            }
          },
          invoice: true,
          statusLogs: { orderBy: { createdAt: 'desc' } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.order.count({ where })
    ]);

    const formatted = orders.map((o) => {
      let shipAddr = {};
      let billAddr = {};
      try { shipAddr = JSON.parse(o.shippingAddress); } catch (e) {}
      try { billAddr = JSON.parse(o.billingAddress); } catch (e) {}

      const formattedItems = o.items.map((it) => {
        let imgs: string[] = [];
        try { imgs = JSON.parse(it.product.images); } catch (e) { imgs = [it.product.images]; }
        return {
          ...it,
          productImages: imgs
        };
      });

      return {
        ...o,
        shippingAddress: shipAddr,
        billingAddress: billAddr,
        items: formattedItems
      };
    });

    res.json({
      success: true,
      orders: formatted,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderByNumberOrId = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { identifier } = req.params;

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: identifier }, { orderNumber: identifier }]
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true, doctorProfile: true }
        },
        items: {
          include: {
            product: true
          }
        },
        statusLogs: { orderBy: { createdAt: 'asc' } },
        invoice: true
      }
    });

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    // Role check: non-admin can only see their own order
    if (req.user?.role !== 'ADMIN' && order.userId !== req.user?.id) {
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }

    let shipAddr = {};
    let billAddr = {};
    try { shipAddr = JSON.parse(order.shippingAddress); } catch (e) {}
    try { billAddr = JSON.parse(order.billingAddress); } catch (e) {}

    const formattedItems = order.items.map((it) => {
      let imgs: string[] = [];
      try { imgs = JSON.parse(it.product.images); } catch (e) { imgs = [it.product.images]; }
      return {
        ...it,
        productImages: imgs
      };
    });

    res.json({
      success: true,
      order: {
        ...order,
        shippingAddress: shipAddr,
        billingAddress: billAddr,
        items: formattedItems
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    if (req.user?.role !== 'ADMIN' && order.userId !== req.user?.id) {
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }

    if (['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.status)) {
      res.status(400).json({
        success: false,
        message: 'Order has already been dispatched. You can request a return after delivery.'
      });
      return;
    }

    // Restore inventory and update status
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          paymentStatus: order.paymentStatus === 'SUCCESS' ? 'REFUNDED' : 'FAILED'
        }
      });

      await tx.orderStatusLog.create({
        data: {
          orderId: id,
          status: 'CANCELLED',
          note: `Order cancelled. Reason: ${reason || 'Customer request'}`,
          updatedBy: req.user?.name || 'User'
        }
      });

      // Restore product stocks
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } }
        });

        await tx.inventoryLog.create({
          data: {
            productId: item.productId,
            previousStock: 0,
            newStock: 0,
            changeQuantity: item.quantity,
            changeType: 'RETURN_RESTOCK',
            reason: `Restocked from cancelled order #${order.orderNumber}`,
            adminName: req.user?.name || 'System'
          }
        });
      }
    });

    res.json({ success: true, message: 'Order cancelled successfully and refund initiated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const requestReturn = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    await prisma.order.update({
      where: { id },
      data: { status: 'RETURN_REQUESTED' }
    });

    await prisma.orderStatusLog.create({
      data: {
        orderId: id,
        status: 'RETURN_REQUESTED',
        note: `Return/Refund requested by Doctor. Reason: ${reason || 'Damaged/Defective item'}`,
        updatedBy: req.user?.name || 'Doctor'
      }
    });

    res.json({ success: true, message: 'Return request submitted. Our team will review within 24 hours.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin Endpoints
export const adminGetOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, search, page = '1', limit = '50' } = req.query;
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status as string;
    }
    if (search) {
      where.OR = [
        { orderNumber: { contains: search as string } },
        { user: { name: { contains: search as string } } },
        { user: { email: { contains: search as string } } },
        { trackingNumber: { contains: search as string } }
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true, doctorProfile: true }
          },
          items: {
            include: {
              product: {
                select: { id: true, images: true, categoryId: true, packSize: true, stock: true }
              }
            }
          },
          invoice: true,
          statusLogs: { orderBy: { createdAt: 'desc' } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.order.count({ where })
    ]);

    const formatted = orders.map((o) => {
      let shipAddr = {};
      let billAddr = {};
      try { shipAddr = JSON.parse(o.shippingAddress); } catch (e) {}
      try { billAddr = JSON.parse(o.billingAddress); } catch (e) {}

      const formattedItems = o.items.map((it: any) => {
        let imgs: string[] = [];
        if (it.product && it.product.images) {
          try { imgs = JSON.parse(it.product.images); } catch (e) { imgs = [it.product.images]; }
        }
        return {
          ...it,
          productImages: imgs
        };
      });

      return {
        ...o,
        shippingAddress: shipAddr,
        billingAddress: billAddr,
        items: formattedItems
      };
    });

    res.json({
      success: true,
      orders: formatted,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminUpdateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, courierName, trackingNumber, note, paymentStatus } = req.body;

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: status || undefined,
        courierName: courierName !== undefined ? courierName : undefined,
        trackingNumber: trackingNumber !== undefined ? trackingNumber : undefined,
        paymentStatus: paymentStatus || undefined
      }
    });

    // Add status history log
    await prisma.orderStatusLog.create({
      data: {
        orderId: id,
        status: status || order.status,
        note: note || `Order status updated to ${status}${trackingNumber ? ` (Tracking: ${trackingNumber})` : ''}`,
        updatedBy: req.user?.name || 'Operations Admin'
      }
    });

    // Notify doctor
    await prisma.notification.create({
      data: {
        userId: order.userId,
        title: `Order Update #${order.orderNumber} is now ${status}`,
        message: note || `Your order #${order.orderNumber} status changed to ${status}.${trackingNumber ? ` Courier: ${courierName || 'Partner'} - ${trackingNumber}` : ''}`,
        type: 'ORDER',
        link: `/orders/${order.orderNumber}`
      }
    });

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order: updated
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
