import { Router } from 'express';
import { getWishlist, toggleWishlist } from '../controllers/wishlistController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);
router.get('/', getWishlist);
router.post('/toggle', toggleWishlist);

export default router;
