export type EventCategory =
  | 'wedding'
  | 'engagement'
  | 'ring_ceremony'
  | 'birthday'
  | 'anniversary'
  | 'baby_shower'
  | 'naming_ceremony'
  | 'housewarming'
  | 'religious_ceremony'
  | 'reception'
  | 'mundan'
  | 'graduation'
  | 'retirement'
  | 'custom';

export type SupportedLanguage = string;

export type PageFormat =
  | 'a5_portrait'
  | 'a6_portrait'
  | 'a5_landscape'
  | 'five_by_seven'
  | 'square'
  | 'whatsapp_story';

export type ElementType = 'text' | 'motif' | 'image' | 'qrcode' | 'divider' | 'frame';

export interface CardElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  isLocked?: boolean;
  opacity?: number;
  [key: string]: any;
}

export interface CardPage {
  id: string;
  pageNumber: number;
  role: string;
  title: string;
  background: {
    type: 'solid' | 'gradient' | 'texture' | 'image';
    color: string;
    gradient?: string;
    textureName?: string;
    imageUrl?: string;
    imagePrompt?: string;
    opacity?: number;
  };
  elements: CardElement[];
}

export interface ProjectData {
  _id?: string;
  id?: string;
  ownerId?: string;
  guestSessionId?: string;
  title: string;
  category: EventCategory;
  format: PageFormat;
  language: SupportedLanguage;
  secondaryLanguage?: SupportedLanguage;
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
  pages: CardPage[];
  exportSettings?: {
    bleed: boolean;
    cropMarks: boolean;
    dpi: number;
    colorSpace: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
