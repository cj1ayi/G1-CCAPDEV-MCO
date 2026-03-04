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

    await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });

    const author = await User.findById(newComment.authorId).select('username avatar');

    const formatted = {
      ...newComment.toObject(),
      author: author ? { username: author.username, avatar: author.avatar } : null
    };

    res.status(201).json(formatted);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getCommentsByPostId = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ postId }).sort({ createdAt: 1 });

    const authorIds = [...new Set(comments.map(c => c.authorId.toString()))];
    const authors = await User.find({ _id: { $in: authorIds } }).select('username avatar');
    const authorMap = new Map(
      authors.map(a => [a._id.toString(), { username: a.username, avatar: a.avatar }])
    );

    const formatted = comments.map(comment => {
      const obj = comment.toObject();
      return {
        ...obj,
        author: obj.isDeleted ? null : (authorMap.get(obj.authorId.toString()) || null)
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

    if (comment.isDeleted) return res.status(403).json({ message: 'Cannot edit a deleted comment' });

    if (comment.authorId.toString() !== (req.user as any)._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this comment' });
    }

    comment.content = content;
    await comment.save();

    const author = await User.findById(comment.authorId).select('username avatar');

    const formatted = {
      ...comment.toObject(),
      author: author ? { username: author.username, avatar: author.avatar } : null
    };

    res.json(formatted);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// Recursively checks if a comment has any living (non-deleted) descendants
const hasLivingDescendants = async (commentId: string): Promise<boolean> => {
  const children = await Comment.find({ parentId: commentId });

  for (const child of children) {
    if (!child.isDeleted) return true;
    if (await hasLivingDescendants(child._id.toString())) return true;
  }

  return false;
};

// After a hard delete, walk up the ancestor chain and clean up
// any soft-deleted ancestors that no longer have living descendants
const cleanupAncestors = async (parentId: string | null, postId: string): Promise<void> => {
  if (!parentId) return;

  const parent = await Comment.findById(parentId);
  if (!parent) return;

  // Only clean up soft-deleted ancestors
  if (!parent.isDeleted) return;

  const stillHasLivingDescendants = await hasLivingDescendants(parent._id.toString());
  if (!stillHasLivingDescendants) {
    const grandparentId = parent.parentId?.toString() || null;
    await parent.deleteOne();
    await Post.findByIdAndUpdate(postId, { $inc: { commentCount: -1 } });
    await cleanupAncestors(grandparentId, postId);
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId as string;
    const commentId = req.params.commentId as string;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.authorId.toString() !== (req.user as any)._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    const livingDescendants = await hasLivingDescendants(commentId);

    if (livingDescendants) {
      // Soft delete — keep as structural placeholder
      comment.content = '[deleted]';
      comment.isDeleted = true;
      await comment.save();
    } else {
      // Hard delete
      const parentId = comment.parentId ? comment.parentId.toString() : null;
      await comment.deleteOne();
      await Post.findByIdAndUpdate(postId, { $inc: { commentCount: -1 } });

      // Clean up any soft-deleted ancestors that are now childless
      await cleanupAncestors(parentId, postId);
    }

    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const voteComment = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const { commentId } = req.params;


    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const author = await User.findById(comment.authorId).select('username avatar');

    const formatted = {
      ...comment.toObject(),
      author: author ? { username: author.username, avatar: author.avatar } : null
    };

    res.json(formatted);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
