import { Router } from 'express';
import { getAdminAnalytics } from '../controllers/analyticsController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/dashboard', getAdminAnalytics);

export default router;
