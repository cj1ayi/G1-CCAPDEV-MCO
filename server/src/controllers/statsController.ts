import { Request, Response } from 'express';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Space from '../models/Space.js';

export const getStats = async (_req: Request, res: Response) => {
  try {
    const [userCount, postCount, spaceCount] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      Space.countDocuments(),
    ]);

    res.json({ userCount, postCount, spaceCount });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};