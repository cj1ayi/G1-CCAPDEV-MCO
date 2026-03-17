import { Request, Response } from 'express'
import mongoose from 'mongoose'
import Vote from '../models/Vote.js'
import Post from '../models/Post.js'
import Comment from '../models/Comment.js'

const getTargetModel = (
  targetType: string,
): mongoose.Model<any> =>
  (targetType === 'Post'
    ? Post
    : Comment) as mongoose.Model<any>

export const toggleVote = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: 'Unauthorized' })
    }

    const { targetId, targetType, value } = req.body
    const userId = (req.user as any)._id
    const Model = getTargetModel(targetType)

    // Atomic: find and remove in one operation
    const existing = await Vote.findOneAndDelete({
      userId,
      targetId,
      value,
    })

    // Same button clicked → vote removed
    if (existing) {
      const update =
        value === 1
          ? { $inc: { upvotes: -1 } }
          : { $inc: { downvotes: -1 } }
      await Model.findByIdAndUpdate(
        targetId,
        update,
      )
      return res.json({ voteType: 'none' })
    }

    // Different button or new vote →
    // upsert atomically
    const prev = await Vote.findOneAndUpdate(
      { userId, targetId },
      { userId, targetId, targetType, value },
      { upsert: true, returnDocument: 'before' },
    )

    // prev is null → new vote created
    if (!prev) {
      const update =
        value === 1
          ? { $inc: { upvotes: 1 } }
          : { $inc: { downvotes: 1 } }
      await Model.findByIdAndUpdate(
        targetId,
        update,
      )
      return res.json({
        voteType: value === 1 ? 'up' : 'down',
      })
    }

    // prev existed with opposite value → switched
    const update =
      value === 1
        ? { $inc: { upvotes: 1, downvotes: -1 } }
        : { $inc: { upvotes: -1, downvotes: 1 } }
    await Model.findByIdAndUpdate(
      targetId,
      update,
    )
    return res.json({
      voteType: value === 1 ? 'up' : 'down',
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to process vote',
    })
  }
}

export const getUserVotes = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.user) return res.json([])

    const votes = await Vote.find({
      userId: (req.user as any)._id,
    })
    res.json(votes)
  } catch (error) {
    res.status(500).json({
      message: (error as Error).message,
    })
  }
}
