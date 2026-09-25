import { Router } from 'express';
import {
  getCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory
} from '../controllers/categoryController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', getCategories);
router.post('/admin', authenticateToken, requireAdmin, adminCreateCategory);
router.put('/admin/:id', authenticateToken, requireAdmin, adminUpdateCategory);
router.delete('/admin/:id', authenticateToken, requireAdmin, adminDeleteCategory);

export default router;
