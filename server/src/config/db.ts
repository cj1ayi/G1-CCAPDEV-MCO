import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const ensureIndexes = async () => {
  const db = mongoose.connection.db
  if (!db) return

  try {
    await db.collection('posts').createIndexes([
      { key: { space: 1, createdAt: -1 } },
      { key: { author: 1 } },
      { key: { upvotes: -1, downvotes: 1 } },
    ])

    await db.collection('comments').createIndexes([
      { key: { postId: 1, createdAt: 1 } },
    ])

    await db.collection('votes').createIndexes([
      {
        key: {
          targetId: 1,
          targetType: 1,
          userId: 1,
        },
      },
      { key: { userId: 1 } },
    ])

    console.log('Database indexes ensured')
  } catch (err) {
    console.warn('Index creation warning:', err)
  }
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI as string,
    )
    console.log(
      `MongoDB Connected: ${conn.connection.host}`,
    )

    await ensureIndexes()
  } catch (error) {
    console.error(
      `Error: ${(error as Error).message}`,
    )
    process.exit(1)
  }
}

export default connectDB
