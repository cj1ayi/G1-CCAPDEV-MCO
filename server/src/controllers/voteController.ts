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

    const { targetId, targetType, value } =
      req.body

    if (targetType !== 'Post' && targetType !== 'Comment') {
      return res.status(400).json({ message: 'Invalid targetType' })
    }

    const userId = (req.user as any)._id
    const Model = getTargetModel(targetType)

    const existing = await Vote.findOne({
      userId,
      targetId,
    })

    if (existing) {
      if (existing.value === value) {
        // Same button → remove vote
        await existing.deleteOne()

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

      // Opposite button → switch vote
      existing.value = value
      await existing.save()

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
    }

    // No existing vote → create new
    await Vote.create({
      userId,
      targetId,
      targetType,
      value,
    })

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
  } catch (error: any) {
    // Race condition: parallel request already
    // created the vote. Return current state.
    if (error?.code === 11000) {
      const existing = await Vote.findOne({
        userId: (req.user as any)?._id,
        targetId: req.body.targetId,
      })

      if (!existing) {
        return res.json({ voteType: 'none' })
      }

      return res.json({
        voteType:
          existing.value === 1 ? 'up' : 'down',
      })
    }

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
