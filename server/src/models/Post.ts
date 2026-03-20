import mongoose, { Schema, Document } from 'mongoose'

export interface IPost extends Document {
  title: string
  content: string
  author: mongoose.Types.ObjectId
  space: string
  flair?: (
    | 'Question'
    | 'News'
    | 'Marketplace'
    | 'Discussion'
  )
  upvotes: number
  downvotes: number
  commentCount: number
  imageUrl?: string
  tags: string[]
  isEdited: boolean
}

const PostSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    space: {
      type: String,
      required: true,
    },
    flair: {
      type: String,
      enum: [
        'Question',
        'News',
        'Marketplace',
        'Discussion',
      ],
    },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    commentCount: {
      type: Number,
      default: 0,
    },
    imageUrl: { type: String },
    tags: [{ type: String }],
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

PostSchema.index(
  { title: 'text', content: 'text', tags: 'text' },
  {
    weights: { title: 10, tags: 5, content: 1 },
    name: 'post_search_idx',
  },
)

export default mongoose.model<IPost>(
  'Post',
  PostSchema,
)
