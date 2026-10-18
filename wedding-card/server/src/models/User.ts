import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  isGuest: boolean;
  guestSessionId?: string;
  preferences: {
    defaultLanguage: string;
    favoriteTemplates: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String },
    isGuest: { type: Boolean, default: false },
    guestSessionId: { type: String, index: true },
    preferences: {
      defaultLanguage: { type: String, default: 'hi' },
      favoriteTemplates: [{ type: String }],
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
