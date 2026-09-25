import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export const adminGetDoctors = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, search, page = '1', limit = '50' } = req.query;
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const where: any = { role: 'DOCTOR' };
    if (status && status !== 'ALL') {
      where.status = status as string;
    }
    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { email: { contains: search as string } },
        { phone: { contains: search as string } },
        { doctorProfile: { clinicName: { contains: search as string } } }
      ];
    }

    const [doctors, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          doctorProfile: true,
          addresses: true,
          _count: {
            select: { orders: true, reviews: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.user.count({ where })
    ]);

    const formatted = doctors.map((d) => ({
      id: d.id,
      name: d.name,
      email: d.email,
      phone: d.phone,
      status: d.status,
      createdAt: d.createdAt,
      clinicName: d.doctorProfile?.clinicName || 'Clinic Not Specified',
      gstNumber: d.doctorProfile?.gstNumber || null,
      regNumber: d.doctorProfile?.regNumber || null,
      totalSpent: d.doctorProfile?.totalSpent || 0,
      orderCount: d._count.orders || d.doctorProfile?.orderCount || 0,
      address: d.addresses.find((a) => a.isDefault) || d.addresses[0] || null
    }));

    res.json({
      success: true,
      doctors: formatted,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminGetDoctorById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const doctor = await prisma.user.findUnique({
      where: { id },
      include: {
        doctorProfile: true,
        addresses: true,
        orders: {
          include: {
            items: true,
            invoice: true
          },
          orderBy: { createdAt: 'desc' }
        },
        reviews: {
          include: { product: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!doctor || doctor.role !== 'DOCTOR') {
      res.status(404).json({ success: false, message: 'Doctor not found' });
      return;
    }

    res.json({ success: true, doctor });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const adminUpdateDoctorStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body; // ACTIVE, BLOCKED, PENDING

    if (!['ACTIVE', 'BLOCKED', 'PENDING'].includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid doctor account status' });
      return;
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { status }
    });

    res.json({
      success: true,
      message: `Doctor account status updated to ${status}`,
      doctor: updated
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
