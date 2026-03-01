import { Request, Response } from 'express';
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

export const createComment = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const { postId, content, parentId, depth } = req.body;

    const comment = await Comment.create({
      postId,
      content,
      parentId: parentId || null,
      depth: depth || 0,
      authorId: (req.user as any)._id
    });

    // Increment comment count on the post
    await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });

    const populatedComment = await comment.populate('authorId', 'username displayName avatar');
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getCommentsByPost = async (req: Request, res: Response) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .populate('authorId', 'username displayName avatar')
      .sort({ createdAt: 1 }); // Oldest first
    
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // Check ownership
    if (comment.authorId.toString() !== (req.user as any)._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if it has replies
    const hasReplies = await Comment.exists({ parentId: comment._id });

    if (hasReplies) {
      // Soft delete
      // Keep the brick so the thread doesn't break
      comment.content = "[deleted]";
      comment.isDeleted = true;
      await comment.save();
    } else {
      // Hard delete
      await comment.deleteOne();
      await Post.findByIdAndUpdate(comment.postId, { $inc: { commentCount: -1 } });
    }

    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
