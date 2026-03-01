import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Vote from '../models/Vote.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

export const toggleVote = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const { targetId, targetType, value } = req.body; // value is 1 or -1
    const userId = (req.user as any)._id;

    // 1. Find existing vote
    const existingVote = await Vote.findOne({ userId, targetId });

    // 2. Identify the target Model with a generic type cast to satisfy TS
    const TargetModel = (targetType === 'Post' ? Post : Comment) as mongoose.Model<any>;

    if (existingVote) {
      if (existingVote.value === value) {
        // Case A: User clicked the same button -> Remove vote
        await existingVote.deleteOne();
        
        const update = value === 1 
          ? { $inc: { upvotes: -1 } } 
          : { $inc: { downvotes: -1 } };
          
        await TargetModel.findByIdAndUpdate(targetId, update);
        return res.json({ voteType: 'none' });
      } else {
        // Case B: User clicked the opposite button -> Switch vote
        existingVote.value = value;
        await existingVote.save();
        
        const update = value === 1 
          ? { $inc: { upvotes: 1, downvotes: -1 } } 
          : { $inc: { upvotes: -1, downvotes: 1 } };
          
        await TargetModel.findByIdAndUpdate(targetId, update);
        return res.json({ voteType: value === 1 ? 'up' : 'down' });
      }
    } else {
      // Case C: No existing vote -> Create new
      await Vote.create({ userId, targetId, targetType, value });
      
      const update = value === 1 
        ? { $inc: { upvotes: 1 } } 
        : { $inc: { downvotes: 1 } };
        
      await TargetModel.findByIdAndUpdate(targetId, update);
      return res.json({ voteType: value === 1 ? 'up' : 'down' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getUserVotes = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.json([]);
    const votes = await Vote.find({ userId: (req.user as any)._id });
    res.json(votes);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
