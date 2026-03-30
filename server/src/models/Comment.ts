import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  postId: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
  parentId: mongoose.Types.ObjectId | null;
  content: string;
  depth: number;
  isDeleted: boolean;
  editedAt?: Date;
}

const CommentSchema: Schema = new Schema({
  postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  parentId: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
  content: { type: String, required: true },
  depth: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false },
  editedAt: { type: Date },
}, {
  timestamps: true
})

export default mongoose.model<IComment>('Comment', CommentSchema);
