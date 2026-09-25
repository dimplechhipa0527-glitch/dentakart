import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      inStock,
      isFeatured,
      isBestseller,
      sortBy = 'newest',
      page = '1',
      limit = '20'
    } = req.query;

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      isActive: true
    };

    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { brand: { contains: search as string } },
        { sku: { contains: search as string } },
        { description: { contains: search as string } }
      ];
    }

    if (category) {
      // Find category by slug or id, or get child categories
      const cat = await prisma.category.findFirst({
        where: {
          OR: [{ slug: category as string }, { id: category as string }]
        },
        include: { subcategories: true }
      });

      if (cat) {
        const categoryIds = [cat.id, ...cat.subcategories.map((s) => s.id)];
        where.categoryId = { in: categoryIds };
      }
    }

    if (brand) {
      const brands = (brand as string).split(',').map((b) => b.trim());
      where.brand = { in: brands };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }

    if (inStock === 'true') {
      where.stock = { gt: 0 };
    }

    if (isFeatured === 'true') {
      where.isFeatured = true;
    }

    if (isBestseller === 'true') {
      where.isBestseller = true;
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'price-asc') orderBy = { price: 'asc' };
    else if (sortBy === 'price-desc') orderBy = { price: 'desc' };
    else if (sortBy === 'name-asc') orderBy = { name: 'asc' };
    else if (sortBy === 'discount') orderBy = { discount: 'desc' };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, slug: true }
          },
          reviews: {
            where: { isApproved: true },
            select: { rating: true }
          }
        },
        orderBy,
        skip,
        take: limitNum
      }),
      prisma.product.count({ where })
    ]);

    // Format products with avgRating and parsed JSON fields
    const formatted = products.map((p) => {
      const ratings = p.reviews.map((r) => r.rating);
      const avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 4.8;
      let specs = {};
      let imgList: string[] = [];
      try { specs = JSON.parse(p.specifications); } catch (e) {}
      try { imgList = JSON.parse(p.images); } catch (e) { imgList = [p.images]; }

      return {
        ...p,
        specifications: specs,
        images: imgList,
        avgRating: Number(avgRating.toFixed(1)),
        reviewCount: p.reviews.length
      };
    });

    res.json({
      success: true,
      products: formatted,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    console.error('getProducts error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductBySlugOrId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ slug: identifier }, { id: identifier }]
      },
      include: {
        category: {
          include: {
            parent: true
          }
        },
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!product) {
      res.status(404).json({ success: false, message: 'Dental product not found' });
      return;
    }

    let specs = {};
    let imgList: string[] = [];
    try { specs = JSON.parse(product.specifications); } catch (e) {}
    try { imgList = JSON.parse(product.images); } catch (e) { imgList = [product.images]; }

    const ratings = product.reviews.map((r) => r.rating);
    const avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 4.8;

    // Get related products from same category
    const related = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isActive: true
      },
      take: 4
    });

    const formattedRelated = related.map((r) => {
      let rImgs: string[] = [];
      try { rImgs = JSON.parse(r.images); } catch (e) { rImgs = [r.images]; }
      return {
        ...r,
        images: rImgs
      };
    });

    res.json({
      success: true,
      product: {
        ...product,
        specifications: specs,
        images: imgList,
        avgRating: Number(avgRating.toFixed(1)),
        reviewCount: product.reviews.length,
        relatedProducts: formattedRelated
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBrandsList = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { brand: true },
      distinct: ['brand']
    });

    const brands = products.map((p) => p.brand).filter(Boolean).sort();
    res.json({ success: true, brands });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin Endpoints
export const adminGetProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { search, categoryId, lowStock, page = '1', limit = '50' } = req.query;
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
    if (lowStock === 'true') {
      where.stock = { lte: 15 };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          _count: {
            select: { orderItems: true, reviews: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.product.count({ where })
    ]);

    const formatted = products.map((p) => {
      let specs = {};
      let imgList: string[] = [];
      try { specs = JSON.parse(p.specifications); } catch (e) {}
      try { imgList = JSON.parse(p.images); } catch (e) { imgList = [p.images]; }
      return {
        ...p,
        specifications: specs,
        images: imgList
      };
    });

    res.json({
      success: true,
      products: formatted,
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

export const adminCreateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      name,
      brand,
      sku,
      hsnCode,
      categoryId,
      price,
      mrp,
      discount,
      gstPercent,
      stock,
      lowStockThreshold,
      packSize,
      manufacturer,
      expiryInfo,
      isFeatured,
      isBestseller,
      images,
      description,
      specifications
    } = req.body;

    if (!name || !brand || !sku || !categoryId || price === undefined || !packSize) {
      res.status(400).json({ success: false, message: 'Missing required product fields' });
      return;
    }

    const existingSku = await prisma.product.findUnique({ where: { sku } });
    if (existingSku) {
      res.status(409).json({ success: false, message: `Product with SKU ${sku} already exists` });
      return;
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        brand,
        sku,
        hsnCode: hsnCode || '90184900',
        categoryId,
        price: parseFloat(price),
        mrp: parseFloat(mrp || price),
        discount: parseFloat(discount || '0'),
        gstPercent: parseFloat(gstPercent || '12'),
        stock: parseInt(stock || '0', 10),
        lowStockThreshold: parseInt(lowStockThreshold || '10', 10),
        packSize,
        manufacturer: manufacturer || brand,
        expiryInfo: expiryInfo || null,
        isFeatured: Boolean(isFeatured),
        isBestseller: Boolean(isBestseller),
        isActive: true,
        images: typeof images === 'string' ? images : JSON.stringify(images || []),
        description: description || '',
        specifications: typeof specifications === 'string' ? specifications : JSON.stringify(specifications || {})
      },
      include: { category: true }
    });

    // Create inventory intake log
    if (product.stock > 0) {
      await prisma.inventoryLog.create({
        data: {
          productId: product.id,
          previousStock: 0,
          newStock: product.stock,
          changeQuantity: product.stock,
          changeType: 'RESTOCK',
          reason: 'Initial Product Creation Intake',
          adminName: req.user?.name || 'Admin'
        }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Dental product created successfully',
      product
    });
  } catch (error: any) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminUpdateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      name,
      brand,
      sku,
      hsnCode,
      categoryId,
      price,
      mrp,
      discount,
      gstPercent,
      stock,
      lowStockThreshold,
      packSize,
      manufacturer,
      expiryInfo,
      isFeatured,
      isBestseller,
      isActive,
      images,
      description,
      specifications
    } = req.body;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    const currentStock = existing.stock;
    const newStockNum = stock !== undefined ? parseInt(stock, 10) : currentStock;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: name !== undefined ? name : undefined,
        brand: brand !== undefined ? brand : undefined,
        sku: sku !== undefined ? sku : undefined,
        hsnCode: hsnCode !== undefined ? hsnCode : undefined,
        categoryId: categoryId !== undefined ? categoryId : undefined,
        price: price !== undefined ? parseFloat(price) : undefined,
        mrp: mrp !== undefined ? parseFloat(mrp) : undefined,
        discount: discount !== undefined ? parseFloat(discount) : undefined,
        gstPercent: gstPercent !== undefined ? parseFloat(gstPercent) : undefined,
        stock: newStockNum,
        lowStockThreshold: lowStockThreshold !== undefined ? parseInt(lowStockThreshold, 10) : undefined,
        packSize: packSize !== undefined ? packSize : undefined,
        manufacturer: manufacturer !== undefined ? manufacturer : undefined,
        expiryInfo: expiryInfo !== undefined ? expiryInfo : undefined,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : undefined,
        isBestseller: isBestseller !== undefined ? Boolean(isBestseller) : undefined,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
        images: images !== undefined ? (typeof images === 'string' ? images : JSON.stringify(images)) : undefined,
        description: description !== undefined ? description : undefined,
        specifications: specifications !== undefined ? (typeof specifications === 'string' ? specifications : JSON.stringify(specifications)) : undefined
      },
      include: { category: true }
    });

    // If stock changed, log it
    if (newStockNum !== currentStock) {
      const diff = newStockNum - currentStock;
      await prisma.inventoryLog.create({
        data: {
          productId: id,
          previousStock: currentStock,
          newStock: newStockNum,
          changeQuantity: Math.abs(diff),
          changeType: diff > 0 ? 'RESTOCK' : 'MANUAL_ADJUSTMENT',
          reason: 'Admin Product Edit Update',
          adminName: req.user?.name || 'Admin'
        }
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updated
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminDeleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.json({ success: true, message: 'Product deleted permanently' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
