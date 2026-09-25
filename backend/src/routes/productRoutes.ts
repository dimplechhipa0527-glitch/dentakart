import { Router } from 'express';
import {
  getProducts,
  getProductBySlugOrId,
  getBrandsList,
  adminGetProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct
} from '../controllers/productController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Public / Doctor routes
router.get('/', getProducts);
router.get('/brands', getBrandsList);
router.get('/:identifier', getProductBySlugOrId);

// Admin routes
router.get('/admin/all', authenticateToken, requireAdmin, adminGetProducts);
router.post('/admin', authenticateToken, requireAdmin, adminCreateProduct);
router.put('/admin/:id', authenticateToken, requireAdmin, adminUpdateProduct);
router.delete('/admin/:id', authenticateToken, requireAdmin, adminDeleteProduct);

export default router;
