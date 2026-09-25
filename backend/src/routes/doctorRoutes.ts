import { Router } from 'express';
import { adminGetDoctors, adminGetDoctorById, adminUpdateDoctorStatus } from '../controllers/doctorController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/', adminGetDoctors);
router.get('/:id', adminGetDoctorById);
router.put('/:id/status', adminUpdateDoctorStatus);

export default router;
