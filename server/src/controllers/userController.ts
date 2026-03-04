import { Request, Response } from 'express';
import User from '../models/User.js';

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-googleId');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Invalid user ID' });
  }
};

export const getUserByUsername = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({
      username: req.params.username
    }).select('-googleId');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const { id } = req.params;

    // Users can only update their own profile
    if ((req.user as any)._id.toString() !== id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const allowedFields = ['username', 'bio', 'location', 'avatar'];
    const updates: Record<string, any> = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-googleId');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
