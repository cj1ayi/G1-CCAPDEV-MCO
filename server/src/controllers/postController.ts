import { Request, Response } from 'express';
import Post from '../models/Post.js';

export const createPost = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const { title, content, space, imageUrl, tags, flair } = req.body;
    
    const newPost = await Post.create({
      title,
      content,
      space,
      imageUrl,
      tags,
      flair,
      author: (req.user as any)._id
    });

    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const { space, sort } = req.query;
    let query = space ? { space: space as string } : {};
    
    let posts = Post.find(query).populate('author', 'username displayName avatar');

    const results = await posts;
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username displayName avatar');
    
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Invalid Post ID' });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Check ownership
    if (post.author.toString() !== (req.user as any)._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    res.json({ message: 'Post removed' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
