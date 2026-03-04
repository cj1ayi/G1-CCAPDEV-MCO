import { Request, Response } from 'express';
import Post from '../models/Post.js';

interface PopulatedAuthor {
  _id: import('mongoose').Types.ObjectId;
  username: string;
  avatar?: string;
}

interface PopulatedPost {
  _id: import('mongoose').Types.ObjectId;
  title: string;
  content: string;
  space: string;
  author: PopulatedAuthor;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  [key: string]: any;
}

export const createPost = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

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

    await newPost.populate('author', 'username avatar');

    const populated = newPost as unknown as PopulatedPost;

    const formatted = {
      ...populated.toObject(),
      authorId: populated.author._id.toString(),
      author: {
        username: populated.author.username,
        avatar: populated.author.avatar
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
    const query = space ? { space: space as string } : {};

    let postsQuery = Post.find(query).populate('author', 'username avatar');

    if (sort === 'new') {
      postsQuery = postsQuery.sort({ createdAt: -1 });
    } else {
      postsQuery = postsQuery.sort({ upvotes: -1 });
    }

    const results = await postsQuery;

    const formatted = results.map((post) => {
      const populated = post as unknown as PopulatedPost;
      const obj = populated.toObject();

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

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const populated = post as unknown as PopulatedPost;
    const obj = populated.toObject();

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

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== (req.user as any)._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await post.deleteOne();
    res.json({ message: 'Post removed' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
