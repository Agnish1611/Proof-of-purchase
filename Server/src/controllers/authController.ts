import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { generateToken, setTokenCookie, clearTokenCookie } from '../utils/helpers';
import { LoginCredentials, RegisterCredentials } from '../types';
import { AuthRequest } from '../middleware/auth';

export class AuthController {
  
  // Register user
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, email, password }: RegisterCredentials = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }]
      });

      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'User already exists with this email or username'
        });
        return;
      }

      // Create user
      const user = await User.create({
        username,
        email,
        password
      });

      // Generate token and set cookie
      const token = generateToken(user._id);
      setTokenCookie(res, token);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Login user
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password }: LoginCredentials = req.body;

      // Find user and include password for comparison
      const user = await User.findOne({ email }).select('+password');

      if (!user || !user.isActive) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
        return;
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
        return;
      }

      // Generate token and set cookie
      const token = generateToken(user._id);
      setTokenCookie(res, token);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Logout user
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      clearTokenCookie(res);
      
      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Get current user profile
  async getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role,
            isActive: req.user.isActive,
            createdAt: req.user.createdAt
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Update user profile
  async updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const { username, email } = req.body;
      const updates: any = {};

      if (username) updates.username = username;
      if (email) updates.email = email;

      // Check for duplicate username or email
      if (username || email) {
        const existingUser = await User.findOne({
          $and: [
            { _id: { $ne: req.user._id } },
            {
              $or: [
                ...(username ? [{ username }] : []),
                ...(email ? [{ email }] : [])
              ]
            }
          ]
        });

        if (existingUser) {
          res.status(400).json({
            success: false,
            message: 'Username or email already exists'
          });
          return;
        }
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        updates,
        { new: true, runValidators: true }
      );

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: {
            id: updatedUser!._id,
            username: updatedUser!.username,
            email: updatedUser!.email,
            role: updatedUser!.role
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Change password
  async changePassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        res.status(400).json({
          success: false,
          message: 'Current password and new password are required'
        });
        return;
      }

      // Get user with password
      const user = await User.findById(req.user._id).select('+password');

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);

      if (!isCurrentPasswordValid) {
        res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
        return;
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}