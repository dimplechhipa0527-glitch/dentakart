import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export const getInventory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, search, categoryId, page = '1', limit = '50' } = req.query;
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { brand: { contains: search as string } },
        { sku: { contains: search as string } }
      ];
    }
    if (categoryId) {
      where.categoryId = categoryId as string;
    }
    if (status === 'OUT_OF_STOCK') {
      where.stock = 0;
    } else if (status === 'LOW_STOCK') {
      where.stock = { gt: 0, lte: 15 };
    } else if (status === 'IN_STOCK') {
      where.stock = { gt: 15 };
    }

    const [products, total, outOfStockCount, lowStockCount, totalUnits] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { name: true } },
          inventoryLogs: {
            take: 3,
            orderBy: { createdAt: 'desc' }
          }
        },
        orderBy: { stock: 'asc' },
        skip,
        take: limitNum
      }),
      prisma.product.count({ where }),
      prisma.product.count({ where: { stock: 0 } }),
      prisma.product.count({ where: { stock: { gt: 0, lte: 15 } } }),
      prisma.product.aggregate({ _sum: { stock: true } })
    ]);

    const formatted = products.map((p) => {
      let stockStatus = 'In Stock';
      if (p.stock === 0) stockStatus = 'Out of Stock';
      else if (p.stock <= p.lowStockThreshold) stockStatus = 'Low Stock';

      return {
        ...p,
        stockStatus
      };
    });

    res.json({
      success: true,
      inventory: formatted,
      stats: {
        totalProducts: total,
        outOfStockCount,
        lowStockCount,
        totalUnits: totalUnits._sum.stock || 0
      },
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

export const adjustStock = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId, changeType, quantity, reason } = req.body;

    if (!productId || !quantity || quantity <= 0) {
      res.status(400).json({ success: false, message: 'Invalid product or quantity' });
      return;
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    const previousStock = product.stock;
    let newStock = previousStock;

    if (changeType === 'RESTOCK' || changeType === 'MANUAL_INCREASE') {
      newStock = previousStock + parseInt(quantity, 10);
    } else if (changeType === 'MANUAL_DECREASE' || changeType === 'DAMAGED_WRITE_OFF') {
      newStock = Math.max(0, previousStock - parseInt(quantity, 10));
    } else if (changeType === 'SET_EXACT') {
      newStock = parseInt(quantity, 10);
    }

    const updated = await prisma.product.update({
      where: { id: productId },
      data: { stock: newStock }
    });

    const log = await prisma.inventoryLog.create({
      data: {
        productId,
        previousStock,
        newStock,
        changeQuantity: parseInt(quantity, 10),
        changeType: changeType || 'MANUAL_ADJUSTMENT',
        reason: reason || 'Admin inventory manual calibration',
        adminName: req.user?.name || 'Admin'
      }
    });

    res.json({
      success: true,
      message: 'Stock adjusted successfully',
      product: updated,
      log
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getInventoryLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId, limit = '50' } = req.query;
    const where: any = {};
    if (productId) where.productId = productId as string;

    const logs = await prisma.inventoryLog.findMany({
      where,
      include: {
        product: { select: { name: true, sku: true, brand: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string, 10) || 50
    });

    res.json({ success: true, logs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
