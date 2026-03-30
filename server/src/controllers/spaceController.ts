import { Request, Response } from 'express';
import Space from '../models/Space.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import Vote from '../models/Vote.js';

export const createSpace = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const { name, displayName, description, category, icon, rules} = req.body;

    if (!rules || rules.length === 0) {
      return res.status(400).json({ message: 'At least one rule is required' })
    }

    const space = await Space.create({
      name,
      displayName,
      description,
      category,
      icon,
      rules: rules || [],
      owner: (req.user as any)._id,
      members: [(req.user as any)._id]
    });

    res.status(201).json(space);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getSpaces = async (req: Request, res: Response) => {
  try {
    const spaces = await Space.find().sort({ createdAt: -1 });
    res.json(spaces);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getSpaceByName = async (req: Request, res: Response) => {
  try {
    const spaceName = (req.params.name as string).toLowerCase();
    const space = await Space.findOne({ name: spaceName })
    .populate('owner', 'username name avatar');

    if (!space) return res.status(404).json({ message: 'Space not found' });
    res.json(space);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateSpace = async (req: Request, res: Response) => {
  try {
    const space = await Space.findById(req.params.id)
    if (!space) return res.status(404).json({ message: 'Space not found' })

    if (space.owner.toString() !== (req.user as any)._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const { displayName, description, category, icon, rules } = req.body

    space.displayName = displayName ?? space.displayName
    space.description = description ?? space.description
    space.category = category ?? space.category
    space.icon = icon ?? space.icon
    space.rules = rules ?? space.rules

    await space.save()
    // Re-populate after save
    await space.populate('owner', 'username name avatar');
    
    res.json(space)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export const toggleJoinSpace = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const space = await Space.findById(req.params.id);
    if (!space) return res.status(404).json({ message: 'Space not found' });

    const userId = (req.user as any)._id;
    const isMember = space.members.some(id => id.toString() === userId.toString());

    if (isMember) {
      space.members = space.members.filter(id => id.toString() !== userId.toString());
    } else {
      space.members.push(userId);
    }

    await space.save();
    res.json({ isJoined: !isMember, memberCount: space.members.length });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteSpace = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' })

    const space = await Space.findById(req.params.id)
    if (!space) return res.status(404).json({ message: 'Space not found' })

    if (space.owner.toString() !== (req.user as any)._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    // Cascade: delete all posts in this space and their comments/votes
    const posts = await Post.find({ space: space.name }).select('_id')
    const postIds = posts.map(p => p._id)

    if (postIds.length > 0) {
      await Comment.deleteMany({ postId: { $in: postIds } })
      await Vote.deleteMany({ targetId: { $in: postIds }, targetType: 'Post' })
      await Post.deleteMany({ space: space.name })
    }

    await space.deleteOne()
    res.json({ message: 'Space deleted' })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}
