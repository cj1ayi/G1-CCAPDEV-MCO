import mongoose, { Schema, Document } from 'mongoose';

export interface ISpace extends Document {
  name: string;
  displayName: string;
  description: string;
  icon?: string;
  category: 'Official' | 'Batch' | 'Lifestyle' | 'Academic' | 'Interest';
  ownerId: mongoose.Types.ObjectId;  // FIXED: was owner
  members: mongoose.Types.ObjectId[];
  rules: { title: string; description: string }[];
  bannerUrl?: string;
}

const SpaceSchema: Schema = new Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  displayName: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String },
  category: { 
    type: String, 
    enum: ['Official', 'Batch', 'Lifestyle', 'Academic', 'Interest'],
    default: 'Interest'
  },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },  // FIXED
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  rules: [{
    title: { type: String },
    description: { type: String }
  }],
  bannerUrl: { type: String }
}, {
  timestamps: true
});

export default mongoose.model<ISpace>('Space', SpaceSchema);
