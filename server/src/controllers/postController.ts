import { Request, Response } from 'express'
import Post from '../models/Post.js'
import mongoose from 'mongoose'

type PostDoc =
  mongoose.Document & Record<string, any>

const formatPost = (post: PostDoc) => {
  const obj = post.toObject()
  const author = obj.author

  return {
    ...obj,
    authorId: author._id.toString(),
    author: {
      username: author.username,
      avatar: author.avatar,
    },
  }
}

export const createPost = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: 'Unauthorized' })
    }

    const {
      title,
      content,
      space,
      imageUrl,
      tags,
      flair,
    } = req.body

    const newPost = await Post.create({
      title,
      content,
      space,
      imageUrl,
      tags,
      flair,
      author: (req.user as any)._id,
    })

    await newPost.populate(
      'author',
      'username avatar',
    )
    res.status(201).json(formatPost(newPost))
  } catch (error) {
    res
      .status(400)
      .json({ message: (error as Error).message })
  }
}

export const getPosts = async (
  req: Request,
  res: Response,
) => {
  try {
    const { space, sort } = req.query

    const limit = Math.min(
      parseInt(req.query.limit as string) || 15,
      100,
    )
    const offset = Math.max(
      parseInt(req.query.offset as string) || 0,
      0,
    )

    const query = space
      ? { space: space as string }
      : {}

    // 'new' sorts by date only
    if (sort === 'new') {
      const [total, results] =
        await Promise.all([
          Post.countDocuments(query),
          Post.find(query)
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit)
            .populate(
              'author',
              'username avatar',
            ),
        ])

      return res.json({
        data: results.map(formatPost),
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      })
    }

    // Score-based sort via aggregation
    const total =
      await Post.countDocuments(query)
    const results = await Post.aggregate([
      { $match: query },
      {
        $addFields: {
          score: {
            $subtract: [
              '$upvotes',
              '$downvotes',
            ],
          },
        },
      },
      { $sort: { score: -1, createdAt: -1 } },
      { $skip: offset },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'authorData',
        },
      },
      { $unwind: '$authorData' },
      {
        $addFields: {
          authorId: {
            $toString: '$authorData._id',
          },
          author: {
            username: '$authorData.username',
            avatar: '$authorData.avatar',
          },
        },
      },
      { $project: { authorData: 0 } },
    ])

    res.json({
      data: results,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    res
      .status(500)
      .json({ message: (error as Error).message })
  }
}

export const getPostById = async (
  req: Request,
  res: Response,
) => {
  try {
    const post = await Post.findById(
      req.params.id,
    ).populate('author', 'username avatar')

    if (!post) {
      return res
        .status(404)
        .json({ message: 'Post not found' })
    }

    res.json(formatPost(post))
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Invalid Post ID' })
  }
}

export const deletePost = async (
  req: Request,
  res: Response,
) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res
        .status(404)
        .json({ message: 'Post not found' })
    }

    const uid =
      (req.user as any)._id.toString()
    if (post.author.toString() !== uid) {
      return res
        .status(403)
        .json({ message: 'Not authorized' })
    }

    await post.deleteOne()
    res.json({ message: 'Post removed' })
  } catch (error) {
    res
      .status(500)
      .json({ message: (error as Error).message })
  }
}

export const updatePost = async (
  req: Request,
  res: Response,
) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res
        .status(404)
        .json({ message: 'Post not found' })
    }

    const uid =
      (req.user as any)._id.toString()
    if (post.author.toString() !== uid) {
      return res
        .status(403)
        .json({ message: 'Not authorized' })
    }

    const {
      title,
      content,
      imageUrl,
      tags,
      flair,
    } = req.body

    if (title) post.title = title
    if (content) post.content = content
    if (imageUrl !== undefined) {
      post.imageUrl = imageUrl
    }
    if (tags) post.tags = tags
    if (flair) post.flair = flair
    post.isEdited = true

    await post.save()
    await post.populate(
      'author',
      'username avatar',
    )

    res.json(formatPost(post))
  } catch (error) {
    res
      .status(400)
      .json({ message: (error as Error).message })
  }
}
