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

    // Populate author before returning
    await newPost.populate('author', 'username avatar');
    
    const formatted = {
      ...newPost.toObject(),
      authorId: newPost.author._id.toString(),
      author: {
        username: (newPost.author as any).username,
        avatar: (newPost.author as any).avatar
      }
    };

    res.status(201).json(formatted);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const { space, sort } = req.query;
    let query = space ? { space: space as string } : {};
    
    let posts = Post.find(query).populate('author', 'username avatar');

    if (sort === 'new') posts = posts.sort({ createdAt: -1 });
    else posts = posts.sort({ upvotes: -1 });

    const results = await posts;
    
    // Map to include both authorId and author object
    const formatted = results.map(post => {
      const obj = post.toObject();
      return {
        ...obj,
        authorId: obj.author._id.toString(),
        author: {
          username: obj.author.username,
          avatar: obj.author.avatar
        }
      };
    });
    
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username avatar');
    
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    const obj = post.toObject();
    const formatted = {
      ...obj,
      authorId: obj.author._id.toString(),
      author: {
        username: obj.author.username,
        avatar: obj.author.avatar
      }
    };
    
    res.json(formatted);
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
