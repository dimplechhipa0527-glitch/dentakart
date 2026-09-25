import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const items = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: {
        product: {
          include: { category: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    let subtotal = 0;
    let totalGst = 0;

    const formattedItems = items.map((item) => {
      let imgList: string[] = [];
      try { imgList = JSON.parse(item.product.images); } catch (e) { imgList = [item.product.images]; }

      const itemTotal = item.product.price * item.quantity;
      const itemGst = (itemTotal * (item.product.gstPercent || 12)) / 100;
      subtotal += itemTotal;
      totalGst += itemGst;

      return {
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        product: {
          ...item.product,
          images: imgList
        },
        itemTotal,
        itemGst
      };
    });

    const shipping = subtotal >= 5000 || subtotal === 0 ? 0 : 100;
    const finalTotal = subtotal + totalGst + shipping;

    res.json({
      success: true,
      items: formattedItems,
      summary: {
        subtotal: Number(subtotal.toFixed(2)),
        gst: Number(totalGst.toFixed(2)),
        shipping,
        finalTotal: Number(finalTotal.toFixed(2)),
        freeShippingThreshold: 5000,
        amountToFreeShipping: Math.max(0, 5000 - subtotal)
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addToCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { productId, quantity = 1 } = req.body;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    if (product.stock < quantity) {
      res.status(400).json({ success: false, message: `Only ${product.stock} items available in stock` });
      return;
    }

    const existing = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId
        }
      }
    });

    let cartItem;
    if (existing) {
      const newQty = existing.quantity + quantity;
      if (product.stock < newQty) {
        res.status(400).json({ success: false, message: `Cannot add more than ${product.stock} units` });
        return;
      }
      cartItem = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: newQty }
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          userId: req.user.id,
          productId,
          quantity
        }
      });
    }

    res.json({ success: true, message: 'Added to cart', cartItem });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCartQuantity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id } });
      res.json({ success: true, message: 'Item removed from cart' });
      return;
    }

    const item = await prisma.cartItem.findUnique({
      where: { id },
      include: { product: true }
    });

    if (!item) {
      res.status(404).json({ success: false, message: 'Cart item not found' });
      return;
    }

    if (item.product.stock < quantity) {
      res.status(400).json({ success: false, message: `Only ${item.product.stock} items available` });
      return;
    }

    const updated = await prisma.cartItem.update({
      where: { id },
      data: { quantity }
    });

    res.json({ success: true, message: 'Quantity updated', item: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.cartItem.delete({ where: { id } });
    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const clearCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }
    await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
