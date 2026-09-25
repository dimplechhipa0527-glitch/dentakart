import { Router } from 'express';
import {
  getProductReviews,
  createReview,
  adminGetReviews,
  adminModerateReview,
  adminDeleteReview
} from '../controllers/reviewController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/product/:productId', getProductReviews);
router.post('/', authenticateToken, createReview);

// Admin routes
router.get('/admin/all', authenticateToken, requireAdmin, adminGetReviews);
router.put('/admin/:id/moderate', authenticateToken, requireAdmin, adminModerateReview);
router.delete('/admin/:id', authenticateToken, requireAdmin, adminDeleteReview);

export default router;
