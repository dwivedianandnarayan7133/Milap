import QRCode from 'qrcode';
import { PageFormat } from '../types/card';

export const getDimensionsForFormat = (
  format: PageFormat
): { widthPx: number; heightPx: number; widthMm: number; heightMm: number; aspectRatio: string } => {
  switch (format) {
    case 'a5_portrait':
      return { widthPx: 440, heightPx: 622, widthMm: 148, heightMm: 210, aspectRatio: '148/210' };
    case 'a6_portrait':
      return { widthPx: 380, heightPx: 536, widthMm: 105, heightMm: 148, aspectRatio: '105/148' };
    case 'a5_landscape':
      return { widthPx: 622, heightPx: 440, widthMm: 210, heightMm: 148, aspectRatio: '210/148' };
    case 'five_by_seven':
      return { widthPx: 450, heightPx: 630, widthMm: 127, heightMm: 178, aspectRatio: '5/7' };
    case 'square':
      return { widthPx: 520, heightPx: 520, widthMm: 152, heightMm: 152, aspectRatio: '1/1' };
    case 'whatsapp_story':
      return { widthPx: 380, heightPx: 675, widthMm: 108, heightMm: 192, aspectRatio: '9/16' };
    default:
      return { widthPx: 440, heightPx: 622, widthMm: 148, heightMm: 210, aspectRatio: '148/210' };
  }
};

/**
 * Generate a QR Code Data URL from a link
 */
export const generateQRCodeDataUrl = async (
  link: string,
  options?: { fgColor?: string; bgColor?: string }
): Promise<string> => {
  try {
    return await QRCode.toDataURL(link, {
      margin: 1,
      color: {
        dark: options?.fgColor || '#1A1C29',
        light: options?.bgColor || '#FFFFFF',
      },
      width: 256,
    });
  } catch (err) {
    console.error('Error generating QR code:', err);
    return '';
  }
};

export const FONT_OPTIONS = [
  // Devanagari / Hindi / Marathi / Sanskrit
  { label: 'Rozha One (Royal Devanagari)', value: '"Rozha One", serif', script: 'Devanagari' },
  { label: 'Yatra One (Traditional Devanagari)', value: '"Yatra One", serif', script: 'Devanagari' },
  { label: 'Tiro Devanagari Hindi', value: '"Tiro Devanagari Hindi", serif', script: 'Devanagari' },
  { label: 'Noto Serif Devanagari', value: '"Noto Serif Devanagari", serif', script: 'Devanagari' },

  // Bengali & Assamese
  { label: 'Tiro Bangla (Traditional Bengali)', value: '"Tiro Bangla", serif', script: 'Bengali' },
  { label: 'Noto Serif Bengali', value: '"Noto Serif Bengali", serif', script: 'Bengali' },
  { label: 'Galada (Bengali Calligraphic)', value: '"Galada", cursive', script: 'Bengali' },

  // Gujarati
  { label: 'Tiro Gujarati', value: '"Tiro Gujarati", serif', script: 'Gujarati' },
  { label: 'Noto Serif Gujarati', value: '"Noto Serif Gujarati", serif', script: 'Gujarati' },
  { label: 'Shrikhand (Gujarati Display)', value: '"Shrikhand", cursive', script: 'Gujarati' },

  // Punjabi / Gurmukhi
  { label: 'Tiro Gurmukhi', value: '"Tiro Gurmukhi", serif', script: 'Gurmukhi' },
  { label: 'Noto Serif Gurmukhi', value: '"Noto Serif Gurmukhi", serif', script: 'Gurmukhi' },

  // South Indian: Tamil, Telugu, Kannada, Malayalam
  { label: 'Tiro Tamil', value: '"Tiro Tamil", serif', script: 'Tamil' },
  { label: 'Noto Serif Tamil', value: '"Noto Serif Tamil", serif', script: 'Tamil' },
  { label: 'Tiro Telugu', value: '"Tiro Telugu", serif', script: 'Telugu' },
  { label: 'Noto Serif Telugu', value: '"Noto Serif Telugu", serif', script: 'Telugu' },
  { label: 'Tiro Kannada', value: '"Tiro Kannada", serif', script: 'Kannada' },
  { label: 'Noto Serif Kannada', value: '"Noto Serif Kannada", serif', script: 'Kannada' },
  { label: 'Tiro Malayalam', value: '"Tiro Malayalam", serif', script: 'Malayalam' },
  { label: 'Noto Serif Malayalam', value: '"Noto Serif Malayalam", serif', script: 'Malayalam' },

  // Odia
  { label: 'Noto Serif Oriya', value: '"Noto Serif Oriya", serif', script: 'Odia' },

  // Urdu, Kashmiri, Sindhi (Perso-Arabic)
  { label: 'Noto Nastaliq Urdu (RTL)', value: '"Noto Nastaliq Urdu", serif', script: 'Urdu / Kashmiri' },
  { label: 'Noto Sans Arabic', value: '"Noto Sans Arabic", sans-serif', script: 'Arabic' },

  // Santali (Ol Chiki)
  { label: 'Noto Sans Ol Chiki (Santali)', value: '"Noto Sans Ol Chiki", sans-serif', script: 'Ol Chiki' },

  // Meitei / Manipuri (Meitei Mayek)
  { label: 'Noto Sans Meetei Mayek (Manipuri)', value: '"Noto Sans Meetei Mayek", sans-serif', script: 'Meitei Mayek' },

  // English Royal & Serif
  { label: 'Playfair Display (Luxury Serif)', value: '"Playfair Display", serif', script: 'English' },
  { label: 'Cinzel (Royal Engraved)', value: '"Cinzel", serif', script: 'English' },
  { label: 'Cormorant Garamond (Classic)', value: '"Cormorant Garamond", serif', script: 'English' },
  { label: 'Great Vibes (Romantic Script)', value: '"Great Vibes", cursive', script: 'English' },
  { label: 'Alex Brush (Calligraphy)', value: '"Alex Brush", cursive', script: 'English' },
  { label: 'Inter (Clean Modern)', value: '"Inter", sans-serif', script: 'English' },
];

export const ROYAL_COLORS = [
  { name: 'Royal Maroon', value: '#6B1224' },
  { name: 'Pure Gold', value: '#D4AF37' },
  { name: 'Antique Gold', value: '#AA7C11' },
  { name: 'Sindoor Red', value: '#8B0000' },
  { name: 'Emerald Green', value: '#134E3F' },
  { name: 'Peacock Blue', value: '#005F73' },
  { name: 'Terracotta', value: '#C85A32' },
  { name: 'Midnight Navy', value: '#1A1C29' },
  { name: 'Ivory Cream', value: '#FFFDF9' },
  { name: 'Charcoal Black', value: '#1E1E1E' },
  { name: 'Blush Pink', value: '#D9777F' },
  { name: 'Turmeric Yellow', value: '#E5A93B' },
];
