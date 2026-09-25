import { Router } from 'express';
import { registerDoctor, login, getMe, updateDoctorProfile, forgotPassword } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/register', registerDoctor);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.get('/me', authenticateToken, getMe);
router.put('/profile', authenticateToken, updateDoctorProfile);

export default router;
