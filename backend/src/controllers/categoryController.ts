import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        subcategories: {
          include: {
            _count: { select: { products: true } }
          },
          orderBy: { displayOrder: 'asc' }
        },
        _count: { select: { products: true } }
      },
      orderBy: { displayOrder: 'asc' }
    });

    res.json({ success: true, categories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminCreateCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, icon, description, parentId } = req.body;
    if (!name) {
      res.status(400).json({ success: false, message: 'Category name is required' });
      return;
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        icon: icon || 'Package',
        description: description || null,
        parentId: parentId || null
      }
    });

    res.status(201).json({ success: true, message: 'Category created', category });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminUpdateCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, icon, description, parentId } = req.body;

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: name || undefined,
        icon: icon !== undefined ? icon : undefined,
        description: description !== undefined ? description : undefined,
        parentId: parentId !== undefined ? parentId : undefined
      }
    });

    res.json({ success: true, message: 'Category updated', category });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminDeleteCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id } });
    res.json({ success: true, message: 'Category deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
