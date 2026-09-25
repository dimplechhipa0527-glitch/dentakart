import { Router } from 'express';
import { getInventory, adjustStock, getInventoryLogs } from '../controllers/inventoryController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/', getInventory);
router.post('/adjust', adjustStock);
router.get('/logs', getInventoryLogs);

export default router;
