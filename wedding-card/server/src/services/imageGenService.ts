import fs from 'fs';
import path from 'path';

export interface BackgroundGenInput {
  theme:
    | 'wedding'
    | 'birthday'
    | 'floral'
    | 'religious'
    | 'royal_traditional'
    | 'minimalist'
    | 'festival'
    | 'luxury'
    | 'custom';
  primaryColor?: string;
  secondaryColor?: string;
  texture?: 'ivory' | 'parchment' | 'maroon_velvet' | 'raw_silk' | 'none';
  borderStyle?: 'royal_arch' | 'mandala_double' | 'paisley_corner' | 'minimal_gold' | 'temple_pillar' | 'floral_garland';
  orientation?: 'portrait' | 'landscape' | 'square';
  decorationIntensity?: 'subtle' | 'medium' | 'ornate';
  customPrompt?: string;
}

export interface GeneratedBackgroundResult {
  id: string;
  url: string;
  svgData?: string;
  provider: 'procedural_vector' | 'gemini_imagen' | 'preset';
  metadata: {
    theme: string;
    colors: { primary: string; secondary: string };
    texture: string;
    description: string;
  };
}

/**
 * Generate traditional Indian invitation background artwork
 * High-resolution vector background that strictly reserves central space for editable text!
 */
export const generateBackgroundArtwork = async (
  input: BackgroundGenInput
): Promise<GeneratedBackgroundResult> => {
  const primary = input.primaryColor || '#6B1224';
  const secondary = input.secondaryColor || '#D4AF37';
  const texture = input.texture || 'ivory';
  const orientation = input.orientation || 'portrait';

  const width = orientation === 'landscape' ? 842 : orientation === 'square' ? 700 : 595;
  const height = orientation === 'landscape' ? 595 : orientation === 'square' ? 700 : 842;

  // Build high-res traditional Indian background SVG
  const svg = buildIndianBackgroundSVG({
    width,
    height,
    primary,
    secondary,
    texture,
    theme: input.theme,
    borderStyle: input.borderStyle || 'royal_arch',
    intensity: input.decorationIntensity || 'medium',
    customPrompt: input.customPrompt,
  });

  const bgId = `bg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  
  // Store or convert to data URL for instantaneous client rendering
  const base64Svg = Buffer.from(svg).toString('base64');
  const dataUrl = `data:image/svg+xml;base64,${base64Svg}`;

  return {
    id: bgId,
    url: dataUrl,
    svgData: svg,
    provider: 'procedural_vector',
    metadata: {
      theme: input.theme,
      colors: { primary, secondary },
      texture,
      description: input.customPrompt || `${input.theme} traditional Indian background with ${texture} paper and gold border`,
    },
  };
};

/**
 * Procedural traditional Indian invitation background builder
 */
function buildIndianBackgroundSVG(params: {
  width: number;
  height: number;
  primary: string;
  secondary: string;
  texture: string;
  theme: string;
  borderStyle: string;
  intensity: string;
  customPrompt?: string;
}): string {
  const { width, height, primary, secondary, texture, theme } = params;

  let bgFill = '#FFFDF9';
  if (texture === 'maroon_velvet') bgFill = primary;
  else if (texture === 'parchment') bgFill = '#F8F3E8';
  else if (texture === 'raw_silk') bgFill = '#FDFBF5';

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <!-- Metallic Gold Foil Gradient -->
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDF4D4" />
      <stop offset="35%" stop-color="${secondary}" />
      <stop offset="70%" stop-color="#AA7C11" />
      <stop offset="100%" stop-color="#F5E5AB" />
    </linearGradient>

    <!-- Royal Velvet Gradient -->
    <linearGradient id="velvetGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${primary}" />
      <stop offset="100%" stop-color="#2D060E" />
    </linearGradient>

    <!-- Paper Texture Pattern -->
    <pattern id="paperDots" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="0.75" fill="#E8DEC8" opacity="0.4" />
      <circle cx="12" cy="12" r="0.5" fill="#D4AF37" opacity="0.2" />
    </pattern>

    <!-- Corner Paisley / Kalka Symbol -->
    <g id="kalkaCorner">
      <path d="M0,0 L70,0 C65,15 45,25 35,45 C25,65 15,65 0,70 Z" fill="url(#goldGrad)" opacity="0.15" />
      <path d="M10,10 L50,10 C45,20 30,30 25,40 C20,50 15,50 10,50 Z" fill="none" stroke="url(#goldGrad)" stroke-width="1.5" />
      <circle cx="18" cy="18" r="3" fill="url(#goldGrad)" />
      <circle cx="28" cy="18" r="2" fill="url(#goldGrad)" />
      <circle cx="18" cy="28" r="2" fill="url(#goldGrad)" />
    </g>
  </defs>

  <!-- Background Base -->
  <rect width="${width}" height="${height}" fill="${texture === 'maroon_velvet' ? 'url(#velvetGrad)' : bgFill}" />
  <rect width="${width}" height="${height}" fill="url(#paperDots)" />

  <!-- Outer Double Border -->
  <rect x="20" y="20" width="${width - 40}" height="${height - 40}" fill="none" stroke="url(#goldGrad)" stroke-width="3" rx="4" />
  <rect x="28" y="28" width="${width - 56}" height="${height - 56}" fill="none" stroke="${primary}" stroke-width="1" stroke-dasharray="4 4" rx="2" opacity="0.8" />
  <rect x="34" y="34" width="${width - 68}" height="${height - 68}" fill="none" stroke="url(#goldGrad)" stroke-width="1" rx="2" opacity="0.6" />

  <!-- Four Ornate Corners -->
  <use href="#kalkaCorner" transform="translate(22, 22)" />
  <use href="#kalkaCorner" transform="translate(${width - 22}, 22) scale(-1, 1)" />
  <use href="#kalkaCorner" transform="translate(22, ${height - 22}) scale(1, -1)" />
  <use href="#kalkaCorner" transform="translate(${width - 22}, ${height - 22}) scale(-1, -1)" />

  <!-- Top Ornate Arch / Crown -->
  <g transform="translate(${width / 2 - 80}, 36)">
    <path d="M80,0 C90,12 110,16 130,12 C120,24 135,32 160,26 C140,36 120,32 100,42 C80,32 60,36 40,26 C65,32 80,24 70,12 C90,16 110,12 80,0 Z" fill="url(#goldGrad)" opacity="0.85" />
    <circle cx="80" cy="4" r="3" fill="url(#goldGrad)" />
  </g>

  <!-- Bottom Arch Symmetry -->
  <g transform="translate(${width / 2 - 80}, ${height - 65}) scale(1, -1)">
    <path d="M80,0 C90,12 110,16 130,12 C120,24 135,32 160,26 C140,36 120,32 100,42 C80,32 60,36 40,26 C65,32 80,24 70,12 C90,16 110,12 80,0 Z" fill="url(#goldGrad)" opacity="0.85" />
    <circle cx="80" cy="4" r="3" fill="url(#goldGrad)" />
  </g>

  <!-- Central Reserved Space (Clean area for text) -->
  <!-- Note: Intentionally left transparent & uncluttered so user's native Indic script renders crisply -->
</svg>
`.trim();
}
