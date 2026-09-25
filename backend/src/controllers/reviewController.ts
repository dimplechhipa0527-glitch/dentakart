import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export const getProductReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const reviews = await prisma.review.findMany({
      where: { productId, isApproved: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { productId, rating, title, comment } = req.body;

    if (!productId || !rating || !comment) {
      res.status(400).json({ success: false, message: 'Rating and comment are required' });
      return;
    }

    const doctor = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { doctorProfile: true }
    });

    const review = await prisma.review.create({
      data: {
        productId,
        userId: req.user.id,
        doctorName: doctor?.name || 'Verified Doctor',
        clinicName: doctor?.doctorProfile?.clinicName || null,
        rating: parseInt(rating, 10),
        title: title || null,
        comment,
        isApproved: true
      }
    });

    res.status(201).json({ success: true, message: 'Review posted successfully', review });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminGetReviews = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        product: { select: { name: true, sku: true, brand: true } },
        user: { select: { email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminModerateReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    const updated = await prisma.review.update({
      where: { id },
      data: { isApproved: Boolean(isApproved) }
    });

    res.json({ success: true, message: 'Review moderation updated', review: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminDeleteReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.review.delete({ where: { id } });
    res.json({ success: true, message: 'Review deleted permanently' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
