import { Router } from 'express';
import {
  createOrder,
  getDoctorOrders,
  getOrderByNumberOrId,
  cancelOrder,
  requestReturn,
  adminGetOrders,
  adminUpdateOrderStatus
} from '../controllers/orderController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

// Doctor & General order routes
router.post('/create', createOrder);
router.get('/my-orders', getDoctorOrders);
router.get('/detail/:identifier', getOrderByNumberOrId);
router.post('/:id/cancel', cancelOrder);
router.post('/:id/return', requestReturn);

// Admin order fulfillment routes
router.get('/admin/all', requireAdmin, adminGetOrders);
router.put('/admin/:id/status', requireAdmin, adminUpdateOrderStatus);

export default router;
