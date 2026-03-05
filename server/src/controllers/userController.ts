import { Request, Response } from 'express';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import Space from '../models/Space.js';
import Vote from '../models/Vote.js';

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

    if ((req.user as any)._id.toString() !== id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const allowedFields = ['username', 'name', 'bio', 'location', 'avatar'];
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

export const getUserPosts = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const posts = await Post.find({ author: req.params.id })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getUserComments = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const comments = await Comment.find({ 
      authorId: req.params.id,
      isDeleted: false
    }).sort({ createdAt: -1 });

    // Populate post info for context
    const postIds = [...new Set(comments.map(c => c.postId.toString()))];
    const posts = await Post.find({ _id: { $in: postIds } }).select('title space');
    const postMap = new Map(posts.map(p => [p._id.toString(), p]));

    const formatted = comments.map(comment => ({
      ...comment.toObject(),
      post: postMap.get(comment.postId.toString()) || null
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getUserSpaces = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const spaces = await Space.find({ members: req.params.id })
      .select('name displayName description icon category members')
      .sort({ createdAt: -1 });

    res.json(spaces);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getUserUpvotedPosts = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const upvotes = await Vote.find({ 
      userId: req.params.id,
      targetType: 'Post',
      value: 1
    });

    const postIds = upvotes.map(v => v.targetId);
    const posts = await Post.find({ _id: { $in: postIds } })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
