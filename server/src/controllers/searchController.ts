import { Request, Response } from 'express'
import Post from '../models/Post.js'
import Space from '../models/Space.js'
import User from '../models/User.js'

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 50

function parseLimit(raw: unknown): number {
  const n = parseInt(raw as string, 10)
  if (isNaN(n) || n < 1) return DEFAULT_LIMIT
  return Math.min(n, MAX_LIMIT)
}

function parseOffset(raw: unknown): number {
  const n = parseInt(raw as string, 10)
  if (isNaN(n) || n < 0) return 0
  return n
}

function escapeRegex(str: string): string {
  return str.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&',
  )
}

/**
 * Case-insensitive regex $or filter across
 * the given fields. Supports partial matches.
 */
function buildFilter(
  q: string,
  fields: string[],
) {
  const pattern = new RegExp(
    escapeRegex(q),
    'i',
  )
  return {
    $or: fields.map((f) => ({
      [f]: pattern,
    })),
  }
}

async function searchPosts(
  q: string,
  limit: number,
  offset: number,
) {
  const filter = buildFilter(q, [
    'title',
    'content',
    'tags',
    'space',
  ])

  const [total, results] = await Promise.all([
    Post.countDocuments(filter),
    Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate('author', 'username avatar'),
  ])

  const data = results.map((post) => {
    const obj = post.toObject()
    const author = obj.author as any
    return {
      ...obj,
      authorId:
        author?._id?.toString() ?? '',
      author: {
        username:
          author?.username ?? 'deleted',
        avatar: author?.avatar ?? '',
      },
    }
  })

  return { data, total }
}

async function searchSpaces(
  q: string,
  limit: number,
  offset: number,
) {
  const filter = buildFilter(q, [
    'name',
    'displayName',
    'description',
  ])

  const [total, results] = await Promise.all([
    Space.countDocuments(filter),
    Space.find(filter)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit),
  ])

  return { data: results, total }
}

async function searchUsers(
  q: string,
  limit: number,
  offset: number,
) {
  const filter = buildFilter(q, [
    'username',
    'name',
  ])

  const [total, results] = await Promise.all([
    User.countDocuments(filter),
    User.find(filter)
      .select('-googleId -email')
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit),
  ])

  return { data: results, total }
}

async function countCategory(
  q: string,
  type: string,
): Promise<number> {
  switch (type) {
    case 'posts':
      return Post.countDocuments(
        buildFilter(q, [
          'title',
          'content',
        ]),
      )
    case 'spaces':
      return Space.countDocuments(
        buildFilter(q, [
          'name',
          'displayName',
        ]),
      )
    case 'users':
      return User.countDocuments(
        buildFilter(q, [
          'username',
          'name',
        ]),
      )
    default:
      return 0
  }
}

/**
 * GET /api/search?q=term&type=posts|spaces|users
 *
 * Returns paginated results for one category
 * plus counts for all three (for tab badges).
 */
export const search = async (
  req: Request,
  res: Response,
) => {
  const emptyResponse = {
    data: [],
    counts: {
      posts: 0,
      spaces: 0,
      users: 0,
    },
    pagination: {
      total: 0,
      limit: DEFAULT_LIMIT,
      offset: 0,
      hasMore: false,
    },
  }

  try {
    const q = (
      (req.query.q as string) ?? ''
    ).trim()

    if (!q) return res.json(emptyResponse)

    const type =
      (req.query.type as string) ?? 'posts'
    const limit = parseLimit(req.query.limit)
    const offset = parseOffset(
      req.query.offset,
    )

    const [
      postCount,
      spaceCount,
      userCount,
    ] = await Promise.all([
      countCategory(q, 'posts'),
      countCategory(q, 'spaces'),
      countCategory(q, 'users'),
    ])

    const counts = {
      posts: postCount,
      spaces: spaceCount,
      users: userCount,
    }

    let result: {
      data: any[]
      total: number
    }

    switch (type) {
      case 'spaces':
        result = await searchSpaces(
          q, limit, offset,
        )
        break
      case 'users':
        result = await searchUsers(
          q, limit, offset,
        )
        break
      default:
        result = await searchPosts(
          q, limit, offset,
        )
    }

    return res.json({
      data: result.data,
      counts,
      pagination: {
        total: result.total,
        limit,
        offset,
        hasMore:
          offset + limit < result.total,
      },
    })
  } catch (error) {
    console.error('Search error:', error)
    return res.status(500).json({
      message: (error as Error).message,
    })
  }
}
