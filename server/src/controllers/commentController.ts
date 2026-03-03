import { Request, Response } from 'express';
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import User from '../models/User.js';

export const createComment = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const { postId } = req.params;
    const { content, parentId } = req.body;

    const newComment = await Comment.create({
      content,
      authorId: (req.user as any)._id,
      postId,
      parentId: parentId || null
    });

    // Increment comment count on the post
    await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });

    // Fetch author data
    const author = await User.findById(newComment.authorId).select('username avatar');

    const formatted = {
      ...newComment.toObject(),
      author: author ? {
        username: author.username,
        avatar: author.avatar
      } : null
    };

    res.status(201).json(formatted);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getCommentsByPostId = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    
    const comments = await Comment.find({ postId })
      .sort({ createdAt: 1 });

    // Fetch all unique author IDs
    const authorIds = [...new Set(comments.map(c => c.authorId.toString()))];
    const authors = await User.find({ _id: { $in: authorIds } }).select('username avatar');
    
    // Create author lookup map
    const authorMap = new Map(
      authors.map(a => [a._id.toString(), { username: a.username, avatar: a.avatar }])
    );

    // Format comments with author object
    const formatted = comments.map(comment => {
      const obj = comment.toObject();
      return {
        ...obj,
        author: authorMap.get(obj.authorId.toString()) || null
      };
    });

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // Check ownership
    if (comment.authorId.toString() !== (req.user as any)._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this comment' });
    }

    comment.content = content;
    await comment.save();

    // Fetch author data
    const author = await User.findById(comment.authorId).select('username avatar');

    const formatted = {
      ...comment.toObject(),
      author: author ? {
        username: author.username,
        avatar: author.avatar
      } : null
    };

    res.json(formatted);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { postId, commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // Check ownership
    if (comment.authorId.toString() !== (req.user as any)._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();

    // Decrement comment count on the post
    await Post.findByIdAndUpdate(postId, { $inc: { commentCount: -1 } });

    res.json({ message: 'Comment removed' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const voteComment = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const { commentId } = req.params;
    const { voteType } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // Note: Comment model doesn't have upvotes/downvotes fields
    // This is a placeholder - voting would need to be implemented differently
    // (e.g., separate Vote collection or adding fields to Comment model)

    // Fetch author data
    const author = await User.findById(comment.authorId).select('username avatar');

    const formatted = {
      ...comment.toObject(),
      author: author ? {
        username: author.username,
        avatar: author.avatar
      } : null
    };

    res.json(formatted);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

