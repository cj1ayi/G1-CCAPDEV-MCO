import mongoose, { Schema, Document } from 'mongoose';

export interface IVote extends Document {
  userId: mongoose.Types.ObjectId;
  targetId: mongoose.Types.ObjectId;
  targetType: 'Post' | 'Comment';
  value: number; // 1 for upvote, -1 for downvote
}

const VoteSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  targetId: { type: Schema.Types.ObjectId, required: true },
  targetType: { type: String, enum: ['Post', 'Comment'], required: true },
  value: { type: Number, enum: [1, -1], required: true }
}, {
  timestamps: true
});

// Ensure a user can only vote once per target
VoteSchema.index({ userId: 1, targetId: 1 }, { unique: true });

export default mongoose.model<IVote>('Vote', VoteSchema);
