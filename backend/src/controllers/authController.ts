import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'dentakart_b2b_super_secret_jwt_key_2026';

export const registerDoctor = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      email,
      password,
      phone,
      clinicName,
      gstNumber,
      regNumber,
      clinicAddress,
      city,
      state,
      pincode
    } = req.body;

    if (!name || !email || !password || !clinicName) {
      res.status(400).json({ success: false, message: 'Name, email, password, and clinic name are required.' });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ success: false, message: 'An account with this email already exists.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: 'DOCTOR',
        status: 'ACTIVE',
        doctorProfile: {
          create: {
            clinicName,
            gstNumber: gstNumber || null,
            regNumber: regNumber || null,
            clinicPhone: phone || null,
            clinicEmail: email,
            addressLine: clinicAddress || null,
            city: city || null,
            state: state || null,
            pincode: pincode || null
          }
        },
        addresses: clinicAddress ? {
          create: [
            {
              type: 'SHIPPING',
              name,
              clinicName,
              phone: phone || '',
              addressLine1: clinicAddress,
              city: city || '',
              state: state || '',
              pincode: pincode || '',
              gstNumber: gstNumber || null,
              isDefault: true
            }
          ]
        } : undefined
      },
      include: {
        doctorProfile: true,
        addresses: true
      }
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Doctor registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        status: user.status,
        doctorProfile: user.doctorProfile,
        addresses: user.addresses
      }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        doctorProfile: true,
        addresses: true
      }
    });

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    if (user.status === 'BLOCKED') {
      res.status(403).json({ success: false, message: 'Your clinic account is currently suspended. Please contact DentaKart support.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        status: user.status,
        doctorProfile: user.doctorProfile,
        addresses: user.addresses
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        doctorProfile: true,
        addresses: true,
        _count: {
          select: {
            orders: true,
            wishlistItems: true,
            cartItems: true
          }
        }
      }
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        status: user.status,
        doctorProfile: user.doctorProfile,
        addresses: user.addresses,
        stats: user._count
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDoctorProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const {
      name,
      phone,
      clinicName,
      gstNumber,
      regNumber,
      clinicAddress,
      city,
      state,
      pincode
    } = req.body;

    // Update user name/phone
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: name || undefined,
        phone: phone || undefined,
        doctorProfile: {
          upsert: {
            create: {
              clinicName: clinicName || 'Dental Clinic',
              gstNumber: gstNumber || null,
              regNumber: regNumber || null,
              clinicPhone: phone || null,
              addressLine: clinicAddress || null,
              city: city || null,
              state: state || null,
              pincode: pincode || null
            },
            update: {
              clinicName: clinicName || undefined,
              gstNumber: gstNumber !== undefined ? gstNumber : undefined,
              regNumber: regNumber !== undefined ? regNumber : undefined,
              clinicPhone: phone || undefined,
              addressLine: clinicAddress !== undefined ? clinicAddress : undefined,
              city: city !== undefined ? city : undefined,
              state: state !== undefined ? state : undefined,
              pincode: pincode !== undefined ? pincode : undefined
            }
          }
        }
      },
      include: {
        doctorProfile: true,
        addresses: true
      }
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ success: false, message: 'No registered doctor or admin found with this email' });
      return;
    }

    // In a production setup, send email token. For simulation, provide instant reset pin.
    res.json({
      success: true,
      message: 'Password reset link and OTP have been simulated to your registered email.',
      resetOtp: '849201'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
