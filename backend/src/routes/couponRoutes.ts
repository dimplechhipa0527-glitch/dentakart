import { Router } from 'express';
import {
  validateCoupon,
  adminGetCoupons,
  adminCreateCoupon,
  adminUpdateCoupon,
  adminDeleteCoupon
} from '../controllers/couponController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.post('/validate', validateCoupon);
router.get('/admin/all', authenticateToken, requireAdmin, adminGetCoupons);
router.post('/admin', authenticateToken, requireAdmin, adminCreateCoupon);
router.put('/admin/:id', authenticateToken, requireAdmin, adminUpdateCoupon);
router.delete('/admin/:id', authenticateToken, requireAdmin, adminDeleteCoupon);

export default router;
