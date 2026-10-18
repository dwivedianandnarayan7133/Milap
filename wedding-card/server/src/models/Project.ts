import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  ownerId?: mongoose.Types.ObjectId | string;
  guestSessionId?: string;
  title: string;
  category: string;
  format: string;
  language: string;
  secondaryLanguage?: string;
  eventDetails: Record<string, any>;
  templateId?: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    fontFamilyHeading: string;
    fontFamilyBody: string;
  };
  pages: Array<{
    id: string;
    pageNumber: number;
    role: string;
    title: string;
    background: {
      type: string;
      color: string;
      gradient?: string;
      textureName?: string;
      imageUrl?: string;
      imagePrompt?: string;
      opacity?: number;
    };
    elements: Array<Record<string, any>>;
  }>;
  exportSettings: {
    bleed: boolean;
    cropMarks: boolean;
    dpi: number;
    colorSpace: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    ownerId: { type: Schema.Types.Mixed, ref: 'User', index: true },
    guestSessionId: { type: String, index: true },
    title: { type: String, required: true },
    category: { type: String, required: true, index: true },
    format: { type: String, default: 'a5_portrait' },
    language: { type: String, default: 'hi' },
    secondaryLanguage: { type: String },
    eventDetails: { type: Schema.Types.Mixed, default: {} },
    templateId: { type: String },
    theme: {
      primaryColor: { type: String, default: '#6B1224' },
      secondaryColor: { type: String, default: '#D4AF37' },
      accentColor: { type: String, default: '#F3E5AB' },
      backgroundColor: { type: String, default: '#FFFDF9' },
      fontFamilyHeading: { type: String, default: '"Rozha One", serif' },
      fontFamilyBody: { type: String, default: '"Noto Serif Devanagari", serif' },
    },
    pages: { type: Schema.Types.Mixed, default: [] },
    exportSettings: {
      bleed: { type: Boolean, default: false },
      cropMarks: { type: Boolean, default: false },
      dpi: { type: Number, default: 300 },
      colorSpace: { type: String, default: 'rgb' },
    },
  },
  { timestamps: true }
);

export const ProjectModel =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
