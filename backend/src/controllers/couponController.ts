import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export const validateCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, orderAmount = 0 } = req.body;

    if (!code) {
      res.status(400).json({ success: false, message: 'Coupon code required' });
      return;
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!coupon || !coupon.isActive) {
      res.status(404).json({ success: false, message: 'Invalid or inactive coupon code' });
      return;
    }

    if (coupon.validTo && new Date() > new Date(coupon.validTo)) {
      res.status(400).json({ success: false, message: 'This coupon has expired' });
      return;
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      res.status(400).json({ success: false, message: 'Coupon redemption limit reached' });
      return;
    }

    const amount = parseFloat(orderAmount);
    if (amount < coupon.minOrderValue) {
      res.status(400).json({
        success: false,
        message: `Minimum order value for code ${coupon.code} is ₹${coupon.minOrderValue.toLocaleString('en-IN')}`
      });
      return;
    }

    let discount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discount = (amount * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    res.json({
      success: true,
      valid: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: Number(discount.toFixed(2)),
        minOrderValue: coupon.minOrderValue
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminGetCoupons = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, coupons });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminCreateCoupon = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      validTo,
      usageLimit
    } = req.body;

    if (!code || discountValue === undefined) {
      res.status(400).json({ success: false, message: 'Coupon code and discount value are required' });
      return;
    }

    const existing = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
    if (existing) {
      res.status(409).json({ success: false, message: 'Coupon code already exists' });
      return;
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase().trim(),
        description: description || '',
        discountType: discountType || 'PERCENTAGE',
        discountValue: parseFloat(discountValue),
        minOrderValue: parseFloat(minOrderValue || '0'),
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        validTo: validTo ? new Date(validTo) : null,
        usageLimit: usageLimit ? parseInt(usageLimit, 10) : null,
        isActive: true
      }
    });

    res.status(201).json({ success: true, message: 'Coupon created', coupon });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminUpdateCoupon = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      description,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      validTo,
      usageLimit,
      isActive
    } = req.body;

    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        description: description !== undefined ? description : undefined,
        discountType: discountType !== undefined ? discountType : undefined,
        discountValue: discountValue !== undefined ? parseFloat(discountValue) : undefined,
        minOrderValue: minOrderValue !== undefined ? parseFloat(minOrderValue) : undefined,
        maxDiscount: maxDiscount !== undefined ? (maxDiscount ? parseFloat(maxDiscount) : null) : undefined,
        validTo: validTo !== undefined ? (validTo ? new Date(validTo) : null) : undefined,
        usageLimit: usageLimit !== undefined ? (usageLimit ? parseInt(usageLimit, 10) : null) : undefined,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined
      }
    });

    res.json({ success: true, message: 'Coupon updated', coupon });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminDeleteCoupon = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.coupon.delete({ where: { id } });
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
