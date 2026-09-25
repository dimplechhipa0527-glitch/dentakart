import { Router } from 'express';
import {
  getDoctorNotifications,
  markNotificationRead,
  markAllNotificationsRead
} from '../controllers/notificationController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);
router.get('/', getDoctorNotifications);
router.put('/:id/read', markNotificationRead);
router.put('/read-all', markAllNotificationsRead);

export default router;
