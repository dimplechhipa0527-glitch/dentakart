import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export const getWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const items = await prisma.wishlistItem.findMany({
      where: { userId: req.user.id },
      include: {
        product: {
          include: { category: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = items.map((item) => {
      let imgList: string[] = [];
      try { imgList = JSON.parse(item.product.images); } catch (e) { imgList = [item.product.images]; }
      return {
        id: item.id,
        productId: item.productId,
        product: {
          ...item.product,
          images: imgList
        },
        createdAt: item.createdAt
      };
    });

    res.json({ success: true, wishlist: formatted });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { productId } = req.body;
    if (!productId) {
      res.status(400).json({ success: false, message: 'productId is required' });
      return;
    }

    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId
        }
      }
    });

    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } });
      res.json({ success: true, message: 'Removed from wishlist', inWishlist: false });
    } else {
      await prisma.wishlistItem.create({
        data: {
          userId: req.user.id,
          productId
        }
      });
      res.json({ success: true, message: 'Added to wishlist', inWishlist: true });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
