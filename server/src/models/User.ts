import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  googleId?: string;
  username: string;
  email: string;
  name: string;  // FIXED: was displayName
  avatar?: string;
  bio?: string;
  location?: string;
  joinedAt: Date;
}

const UserSchema: Schema = new Schema({
  googleId: { 
    type: String, 
    unique: true, 
    sparse: true
  },
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true 
  },
  name: {  // FIXED: was displayName
    type: String, 
    required: true 
  },
  avatar: { 
    type: String 
  },
  bio: { 
    type: String, 
    default: '' 
  },
  location: { 
    type: String, 
    default: '' 
  },
  joinedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);
