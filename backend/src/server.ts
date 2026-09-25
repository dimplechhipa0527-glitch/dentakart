import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import cartRoutes from './routes/cartRoutes';
import wishlistRoutes from './routes/wishlistRoutes';
import orderRoutes from './routes/orderRoutes';
import inventoryRoutes from './routes/inventoryRoutes';
import doctorRoutes from './routes/doctorRoutes';
import couponRoutes from './routes/couponRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import reviewRoutes from './routes/reviewRoutes';
import notificationRoutes from './routes/notificationRoutes';

dotenv.config();

// Ensure SQLite database exists across all possible working directories
const possibleDbPaths = [
  path.resolve(process.cwd(), 'prisma/dev.db'),
  path.resolve(process.cwd(), 'dev.db'),
  path.resolve(__dirname, '../prisma/dev.db'),
  path.resolve(__dirname, '../dev.db'),
  path.resolve(process.cwd(), 'prisma/prisma/dev.db')
];

const sourceDb = possibleDbPaths.find(p => fs.existsSync(p));
if (sourceDb) {
  possibleDbPaths.forEach(target => {
    try {
      const dir = path.dirname(target);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      if (!fs.existsSync(target)) fs.copyFileSync(sourceDb, target);
    } catch (e) {
      console.warn('Could not mirror db to:', target);
    }
  });
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logger
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'DentaKart B2B Dental Platform API',
    timestamp: new Date().toISOString()
  });
});

// Serve Frontend Web App
const clientDistPath = path.resolve(process.cwd(), 'client_dist');
const altClientDistPath = path.resolve(__dirname, '../client_dist');
const publicStaticPath = fs.existsSync(clientDistPath) ? clientDistPath : altClientDistPath;

if (fs.existsSync(publicStaticPath)) {
  app.use(express.static(publicStaticPath));

  // SPA Route Fallback (Serves Storefront, Admin Portal, Doctor Cart, etc.)
  app.get('*', (req: Request, res: Response, next: NextFunction) => {
    if (req.url.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(publicStaticPath, 'index.html'));
  });
}

// 404 Handler for unmatched API routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: `API route ${req.url} not found` });
});

// Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🚀 DentaKart B2B Backend API running on http://localhost:${PORT}`);
});
