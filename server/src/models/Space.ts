import mongoose, { Schema, Document } from 'mongoose'

export interface ISpace extends Document {
  name: string
  displayName: string
  description: string
  icon?: string
  category: (
    | 'Official'
    | 'Batch'
    | 'Lifestyle'
    | 'Academic'
    | 'Interest'
  )
  owner: mongoose.Types.ObjectId
  members: mongoose.Types.ObjectId[]
  rules: {
    title: string
    description: string
  }[]
  bannerUrl?: string
}

const SpaceSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: { type: String },
    category: {
      type: String,
      enum: [
        'Official',
        'Batch',
        'Lifestyle',
        'Academic',
        'Interest',
      ],
      default: 'Interest',
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    rules: [
      {
        title: { type: String },
        description: { type: String },
      },
    ],
    bannerUrl: { type: String },
  },
  { timestamps: true },
)

SpaceSchema.index(
  {
    name: 'text',
    displayName: 'text',
    description: 'text',
  },
  {
    weights: {
      name: 10,
      displayName: 10,
      description: 1,
    },
    name: 'space_search_idx',
  },
)

export default mongoose.model<ISpace>(
  'Space',
  SpaceSchema,
)
