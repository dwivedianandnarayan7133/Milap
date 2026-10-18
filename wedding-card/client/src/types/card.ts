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

export type GeographicalRegion =
  | 'north'
  | 'west'
  | 'east'
  | 'northeast'
  | 'central'
  | 'south'
  | 'tribal';

export type SupportTier =
  | 'tier1_full'      // Fully Tested (AI wording, translation, proofreading, fonts, PDF)
  | 'tier2_supported' // Regional & Scheduled (Native font, verified phrasing, AI draft, PDF tested)
  | 'tier3_community'; // Indigenous / Community Review (Font mapping, script switcher, custom native input)

export interface ScriptOption {
  code: string;
  name: string;
  nativeName: string;
  scriptFont: string;
  isRtl?: boolean;
}

export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  region: GeographicalRegion;
  tier: SupportTier;
  scripts: ScriptOption[];
  activeScript?: string;
  scriptFont: string;
  isRtl?: boolean;
  stateOrRegionName: string;
  customaryGreeting?: string;
  secularGreeting?: string;
  samplePreview: string;
  supportMatrix: {
    userInput: boolean;
    aiGeneration: boolean;
    aiTranslation: boolean;
    spellChecking: boolean;
    nativeFont: boolean;
    editorPreview: boolean;
    pdfExport: boolean;
    imageExport: boolean;
    isRtl: boolean;
  };
}

export type PageFormat =
  | 'a5_portrait'
  | 'a6_portrait'
  | 'a5_landscape'
  | 'five_by_seven'
  | 'square'
  | 'whatsapp_story';

export interface PageFormatConfig {
  id: PageFormat;
  name: string;
  width: number;
  height: number;
  aspectRatio: number;
  printDesc: string;
}

export type ElementType = 'text' | 'motif' | 'image' | 'qrcode' | 'divider' | 'frame';

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number; // percentage (0-100) or pixel
  y: number; // percentage (0-100) or pixel
  width: number;
  height: number;
  rotation: number; // degrees
  zIndex: number;
  isLocked?: boolean;
  opacity?: number;
}

export interface TextElement extends BaseElement {
  type: 'text';
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: '300' | '400' | '500' | '600' | '700' | '900' | 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  color: string;
  align: 'left' | 'center' | 'right' | 'justify';
  lineHeight: number;
  letterSpacing: number;
  isFoil?: boolean;
  foilType?: 'gold' | 'silver' | 'rose_gold';
  textShadow?: string;
  role?: 'title' | 'names' | 'blessing' | 'body' | 'date_time' | 'venue' | 'rsvp' | 'hosts' | 'quote';
}

export interface MotifElement extends BaseElement {
  type: 'motif';
  motifKey: string;
  color: string;
  secondaryColor?: string;
}

export interface ImageElement extends BaseElement {
  type: 'image';
  url: string;
  altText?: string;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  objectFit?: 'cover' | 'contain';
}

export interface QRCodeElement extends BaseElement {
  type: 'qrcode';
  link: string;
  label?: string;
  dataUrl?: string;
  fgColor: string;
  bgColor: string;
}

export interface FrameElement extends BaseElement {
  type: 'frame';
  frameStyle: 'royal_arch' | 'mandala_double' | 'paisley_corner' | 'minimal_gold' | 'temple_pillar' | 'floral_garland' | 'ornate_border';
  color: string;
  thickness: number;
  padding: number;
}

export interface DividerElement extends BaseElement {
  type: 'divider';
  style: 'ornate_flourish' | 'mandala_knot' | 'floral_branch' | 'simple_gold' | 'dots';
  color: string;
}

export type CardElement =
  | TextElement
  | MotifElement
  | ImageElement
  | QRCodeElement
  | FrameElement
  | DividerElement;

export type PageRole =
  | 'cover'
  | 'invitation'
  | 'schedule'
  | 'family'
  | 'reception'
  | 'thank_you'
  | 'custom';

export interface CardPage {
  id: string;
  pageNumber: number;
  role: PageRole;
  title: string;
  background: {
    type: 'solid' | 'gradient' | 'texture' | 'image';
    color: string;
    gradient?: string;
    imageUrl?: string;
    textureName?:
      | 'none'
      | 'ivory'
      | 'parchment'
      | 'maroon_velvet'
      | 'raw_silk'
      | 'royal_silk'
      | 'rose_shimmer'
      | 'navy_velvet'
      | 'turmeric_parchment'
      | 'emerald_parchment'
      | 'burgundy_silk';
    imagePrompt?: string;
    opacity?: number;
  };
  elements: CardElement[];
}

export interface EventDetails {
  category: EventCategory;
  primaryLanguage: SupportedLanguage;
  secondaryLanguage?: SupportedLanguage;
  isBilingual: boolean;

  // Wedding / Engagement specific
  brideName?: string;
  groomName?: string;
  brideParents?: string;
  groomParents?: string;
  weddingDate?: string;
  weddingTime?: string;
  muhuratTime?: string;
  venueName?: string;
  venueAddress?: string;
  venueCity?: string;
  googleMapsUrl?: string;

  // Birthday / Anniversary / Baby Shower / Celebrant
  celebrantName?: string;
  celebrantAge?: number | string;
  anniversaryYears?: number | string;
  babyGenderOrName?: string;

  // Housewarming / Griha Pravesh / Puja
  hosts?: string;
  pujaSchedule?: string;
  mealInfo?: string;

  // Common
  ceremonies?: Array<{
    name: string;
    date: string;
    time: string;
    venue?: string;
  }>;
  rsvpName?: string;
  rsvpPhone?: string;
  rsvpEmail?: string;
  weddingWebsite?: string;
  dressCode?: string;
  customBlessing?: string;
  customNotes?: string;
}

export interface InvitationProject {
  _id?: string;
  id?: string;
  title: string;
  category: EventCategory;
  format: PageFormat;
  language: SupportedLanguage;
  secondaryLanguage?: SupportedLanguage;
  eventDetails: EventDetails;
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
    bleed: boolean; // 3mm bleed
    cropMarks: boolean;
    dpi: number;
    colorSpace: 'rgb' | 'cmyk';
  };
  createdAt?: string;
  updatedAt?: string;
  isSaved?: boolean;
}

export interface TemplateDefinition {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  tags: string[];
  supportedLanguages: SupportedLanguage[];
  format: PageFormat;
  thumbnailUrl: string;
  previewBg: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    fontFamilyHeading: string;
    fontFamilyBody: string;
  };
  defaultPages: CardPage[];
}
