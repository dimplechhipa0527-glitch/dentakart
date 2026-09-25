import { Router } from 'express';
import { getCart, addToCart, updateCartQuantity, removeFromCart, clearCart } from '../controllers/cartController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);
router.get('/', getCart);
router.post('/add', addToCart);
router.put('/item/:id', updateCartQuantity);
router.delete('/item/:id', removeFromCart);
router.delete('/clear', clearCart);

export default router;
