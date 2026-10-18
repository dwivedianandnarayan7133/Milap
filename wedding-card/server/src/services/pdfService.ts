import puppeteer, { Browser } from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { CardPage, PageFormat } from '../types/index.js';

// Resolve system browser executable (Chrome or Edge)
export const findBrowserExecutable = (): string | undefined => {
  if (process.env.PUPPETEER_EXECUTABLE_PATH && fs.existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  const commonPaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ];

  for (const p of commonPaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  return undefined;
};

export interface PDFExportOptions {
  pages: CardPage[];
  format: PageFormat;
  bleed?: boolean; // 3mm bleed
  cropMarks?: boolean;
  dpi?: number;
  quality?: 'print' | 'standard' | 'compressed';
  projectName?: string;
}

export const getDimensionsForFormat = (
  format: PageFormat,
  withBleed = false
): { widthMm: number; heightMm: number; widthPx: number; heightPx: number; clientRefWidthPx: number } => {
  const bleedMm = withBleed ? 6 : 0; // 3mm on each side

  switch (format) {
    case 'a5_portrait':
      return { widthMm: 148 + bleedMm, heightMm: 210 + bleedMm, widthPx: 559, heightPx: 794, clientRefWidthPx: 440 };
    case 'a6_portrait':
      return { widthMm: 105 + bleedMm, heightMm: 148 + bleedMm, widthPx: 397, heightPx: 559, clientRefWidthPx: 380 };
    case 'a5_landscape':
      return { widthMm: 210 + bleedMm, heightMm: 148 + bleedMm, widthPx: 794, heightPx: 559, clientRefWidthPx: 622 };
    case 'five_by_seven':
      return { widthMm: 127 + bleedMm, heightMm: 178 + bleedMm, widthPx: 480, heightPx: 673, clientRefWidthPx: 450 };
    case 'square':
      return { widthMm: 152 + bleedMm, heightMm: 152 + bleedMm, widthPx: 574, heightPx: 574, clientRefWidthPx: 520 };
    case 'whatsapp_story':
      return { widthMm: 108, heightMm: 192, widthPx: 408, heightPx: 726, clientRefWidthPx: 380 };
    default:
      return { widthMm: 148 + bleedMm, heightMm: 210 + bleedMm, widthPx: 559, heightPx: 794, clientRefWidthPx: 440 };
  }
};

/**
 * Generate print-ready PDF using Puppeteer
 */
export const exportProjectToPDF = async (options: PDFExportOptions): Promise<Buffer> => {
  const executablePath = findBrowserExecutable();
  console.log(`[PDFService] Launching browser for PDF generation with executable: ${executablePath || 'default'}`);

  let browser: Browser | null = null;

  try {
    browser = await puppeteer.launch({
      executablePath: executablePath,
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--font-render-hinting=none',
        '--force-color-profile=srgb',
      ],
    });

    const page = await browser.newPage();
    const dims = getDimensionsForFormat(options.format, options.bleed);

    // Set precise viewport matching dimensions
    await page.setViewport({
      width: dims.widthPx,
      height: dims.heightPx,
      deviceScaleFactor: 2,
    });

    // Render full HTML document with Google Fonts & pages
    const html = generatePrintableHTML(options, dims);

    await page.setContent(html, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    // Wait for all web fonts (Indic scripts, Google Fonts) to be fully ready
    try {
      await page.evaluate(async () => {
        if ((document as any).fonts) {
          await (document as any).fonts.ready;
        }
      });
      // Short stabilization delay for layout shaping
      await new Promise((resolve) => setTimeout(resolve, 400));
    } catch (fontErr) {
      console.warn('[PDFService] Font readiness check warning:', fontErr);
    }

    // Generate PDF with exact page size and 0 margins to prevent clipping
    const pdfBuffer = await page.pdf({
      width: `${dims.widthMm}mm`,
      height: `${dims.heightMm}mm`,
      printBackground: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm',
      },
      preferCSSPageSize: true,
    });

    await browser.close();
    return Buffer.from(pdfBuffer);
  } catch (error: any) {
    if (browser) {
      await browser.close();
    }
    console.error('[PDFService] Error generating PDF:', error);
    throw new Error(`PDF generation failed: ${error.message}`);
  }
};

/**
 * Export a single page as a high-resolution PNG image
 */
export const exportPageToPNG = async (
  pageData: CardPage,
  format: PageFormat,
  dpi = 300
): Promise<Buffer> => {
  const executablePath = findBrowserExecutable();
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    const dims = getDimensionsForFormat(format, false);

    // Set high resolution device scale factor for 300 DPI sharpness
    const scale = dpi === 300 ? 2 : 1;
    await page.setViewport({
      width: dims.widthPx,
      height: dims.heightPx,
      deviceScaleFactor: scale,
    });

    const html = generatePrintableHTML(
      { pages: [pageData], format, bleed: false, cropMarks: false },
      dims
    );

    await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 30000 });

    try {
      await page.evaluate(async () => {
        if ((document as any).fonts) {
          await (document as any).fonts.ready;
        }
      });
      await new Promise((resolve) => setTimeout(resolve, 400));
    } catch {
      // Continue even if font check has non-blocking notice
    }

    const screenshotBuffer = await page.screenshot({
      type: 'png',
      fullPage: true,
    });

    await browser.close();
    return Buffer.from(screenshotBuffer);
  } catch (err: any) {
    await browser.close();
    throw new Error(`PNG export failed: ${err.message}`);
  }
};

/**
 * Assembles clean HTML containing all pages, SVG motifs, and Indic script Google Fonts
 */
export function generatePrintableHTML(
  options: PDFExportOptions,
  dims: { widthMm: number; heightMm: number; widthPx: number; heightPx: number; clientRefWidthPx: number }
): string {
  // Calculate exact scale factor from editor canvas pixels to print dimensions
  const printWidthPx = (dims.widthMm * 96) / 25.4;
  const scaleRatio = printWidthPx / dims.clientRefWidthPx;

  const pagesHtml = options.pages
    .map((p, idx) => {
      return renderSinglePageHTML(p, dims, scaleRatio, idx, options.pages.length);
    })
    .join('\n');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${options.projectName || 'VivahPatra Invitation'}</title>
  
  <!-- Preload Indic, English Calligraphy, and Royal Typography -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cinzel:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Galada&family=Kavivanar&family=Mandali&family=Noto+Nastaliq+Urdu:wght@400;700&family=Noto+Sans+Arabic:wght@400;600;700&family=Noto+Sans+Meetei+Mayek:wght@400;600;700&family=Noto+Sans+Ol+Chiki:wght@400;600;700&family=Noto+Serif+Bengali:wght@400;600;700&family=Noto+Serif+Devanagari:wght@400;600;700&family=Noto+Serif+Gujarati:wght@400;600;700&family=Noto+Serif+Gurmukhi:wght@400;600;700&family=Noto+Serif+Kannada:wght@400;600;700&family=Noto+Serif+Malayalam:wght@400;600;700&family=Noto+Serif+Oriya:wght@400;600;700&family=Noto+Serif+Tamil:wght@400;600;700&family=Noto+Serif+Telugu:wght@400;600;700&family=Rozha+One&family=Shrikhand&family=Tiro+Bangla&family=Tiro+Devanagari+Hindi&family=Tiro+Gujarati&family=Tiro+Gurmukhi&family=Tiro+Kannada&family=Tiro+Malayalam&family=Tiro+Tamil&family=Tiro+Telugu&family=Yatra+One&display=swap" rel="stylesheet">

  <style>
    @page {
      size: ${dims.widthMm}mm ${dims.heightMm}mm;
      margin: 0;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    html, body {
      margin: 0;
      padding: 0;
      background: #FFFFFF;
      font-family: 'Playfair Display', 'Rozha One', 'Noto Serif Devanagari', serif;
    }
    .card-page-container {
      width: ${dims.widthMm}mm;
      height: ${dims.heightMm}mm;
      position: relative;
      overflow: hidden;
      page-break-after: always;
      page-break-inside: avoid;
      break-after: page;
      break-inside: avoid;
      display: block;
    }
    .card-page-container:last-child {
      page-break-after: auto;
      break-after: auto;
    }
    .element-absolute {
      position: absolute;
      transform-origin: center center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      box-sizing: border-box;
    }
    /* Simulated Gold Foil Typography with solid high-contrast fallback for PDF print */
    .gold-foil-text {
      color: #D4AF37;
      background: linear-gradient(135deg, #FFF3C4 0%, #D4AF37 35%, #9E7410 70%, #F5D061 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: #D4AF37;
      text-shadow: 0 1px 1px rgba(80, 50, 10, 0.25);
    }
    @media print {
      .gold-foil-text {
        color: #D4AF37 !important;
        -webkit-text-fill-color: #D4AF37 !important;
        text-shadow: 0 0.5px 1px rgba(100, 70, 15, 0.35) !important;
      }
    }
  </style>
</head>
<body>
  ${pagesHtml}
</body>
</html>
  `.trim();
}

/**
 * Render a single card page to HTML
 */
function renderSinglePageHTML(
  page: CardPage,
  dims: { widthMm: number; heightMm: number; widthPx: number; heightPx: number },
  scaleRatio: number,
  pageIndex: number,
  totalPages: number
): string {
  const bg = page.background;
  let bgStyle = `background-color: ${bg.color || '#FFFDF9'};`;

  if (bg.type === 'gradient' && bg.gradient) {
    bgStyle = `background: ${bg.gradient};`;
  } else if (bg.type === 'image' && bg.imageUrl) {
    bgStyle += `background-image: url('${bg.imageUrl}'); background-size: cover; background-position: center;`;
  }

  const isCoverPage = page.role === 'cover' || pageIndex === 0;

  // Render elements sorted by zIndex
  const sortedElements = [...page.elements].sort((a, b) => a.zIndex - b.zIndex);

  const elementsHtml = sortedElements
    .map((el) => {
      const left = `${el.x}%`;
      const top = `${el.y}%`;
      const width = `${el.width}%`;
      const height = `${el.height}%`;
      const transform = el.rotation ? `transform: rotate(${el.rotation}deg);` : '';
      const opacity = el.opacity !== undefined ? `opacity: ${el.opacity};` : '';

      // 1. Text Elements
      if (el.type === 'text') {
        const textEl = el as any;
        const isFoil = Boolean(textEl.isFoil || textEl.foilEffect);
        const fontClass = isFoil ? 'gold-foil-text' : '';
        const foilStyle = isFoil
          ? 'color: #D4AF37; -webkit-text-fill-color: #D4AF37; text-shadow: 0 1px 2px rgba(80, 50, 10, 0.3);'
          : `color: ${textEl.color || '#2D2424'};`;

        const safeFontFamily = (textEl.fontFamily || 'serif').replace(/"/g, "'");
        const scaledFontSize = Math.round((textEl.fontSize || 16) * scaleRatio * 10) / 10;
        const scaledLetterSpacing = Math.round((textEl.letterSpacing || 0) * scaleRatio * 10) / 10;
        const textAlign = textEl.align || textEl.textAlign || 'center';

        return `
        <div class="element-absolute" style="left: ${left}; top: ${top}; width: ${width}; height: ${height}; z-index: ${el.zIndex}; ${transform} ${opacity}">
          <div class="${fontClass}" style="
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            font-family: ${safeFontFamily};
            font-size: ${scaledFontSize}px;
            font-weight: ${textEl.fontWeight || 'normal'};
            font-style: ${textEl.fontStyle || 'normal'};
            text-align: ${textAlign};
            line-height: ${textEl.lineHeight || 1.35};
            letter-spacing: ${scaledLetterSpacing}px;
            white-space: pre-wrap;
            word-break: break-word;
            overflow-wrap: break-word;
            ${foilStyle}
          ">${escapeHtml(textEl.content)}</div>
        </div>
        `;
      }

      // 2. Motif Elements
      if (el.type === 'motif') {
        const motifEl = el as any;
        const color = motifEl.color || '#D4AF37';
        const motifSvg = motifEl.svgContent || renderMotifSVG(motifEl.motifKey, color);

        return `
        <div class="element-absolute" style="left: ${left}; top: ${top}; width: ${width}; height: ${height}; z-index: ${el.zIndex}; ${transform} ${opacity} color: ${color};">
          <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
            ${motifSvg}
          </div>
        </div>
        `;
      }

      // 3. QR Code Elements
      if (el.type === 'qrcode') {
        const qrEl = el as any;
        return `
        <div class="element-absolute" style="left: ${left}; top: ${top}; width: ${width}; height: ${height}; z-index: ${el.zIndex}; ${transform} ${opacity}">
          <div style="width: 100%; height: 100%; background: #FFFFFF; border-radius: 4px; padding: 4px; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 1px 4px rgba(0,0,0,0.12);">
            ${qrEl.dataUrl ? `<img src="${qrEl.dataUrl}" alt="QR Code" style="width: 100%; height: 100%; object-fit: contain;" />` : ''}
            ${qrEl.label ? `<span style="font-size: ${Math.round(8 * scaleRatio)}px; color: #444; text-align: center; font-family: sans-serif; font-weight: 600; margin-top: 2px;">${escapeHtml(qrEl.label)}</span>` : ''}
          </div>
        </div>
        `;
      }

      // 4. Frame Elements
      if (el.type === 'frame') {
        const frameEl = el as any;
        if (frameEl.frameSvg) {
          return `
          <div class="element-absolute" style="left: ${left}; top: ${top}; width: ${width}; height: ${height}; z-index: ${el.zIndex}; pointer-events: none; color: ${frameEl.color || '#D4AF37'};">
            ${frameEl.frameSvg}
          </div>
          `;
        }
        return `
        <div class="element-absolute" style="left: ${left}; top: ${top}; width: ${width}; height: ${height}; z-index: ${el.zIndex}; pointer-events: none; border: ${frameEl.thickness || 2}px solid ${frameEl.color || '#D4AF37'}; border-radius: 4px; box-shadow: inset 0 0 0 ${frameEl.padding || 8}px #FFFDF9, inset 0 0 0 ${Number(frameEl.padding || 8) + 1}px ${frameEl.color || '#D4AF37'};">
        </div>
        `;
      }

      // 5. Divider Elements
      if (el.type === 'divider') {
        const divEl = el as any;
        const color = divEl.color || '#D4AF37';
        return `
        <div class="element-absolute" style="left: ${left}; top: ${top}; width: ${width}; height: ${height}; z-index: ${el.zIndex}; color: ${color}; display: flex; align-items: center; justify-content: center;">
          <svg viewBox="0 0 300 20" width="100%" height="100%" fill="currentColor">
            <line x1="10" y1="10" x2="130" y2="10" stroke="currentColor" stroke-width="1.5" />
            <circle cx="150" cy="10" r="4" fill="currentColor" />
            <polygon points="144,10 150,4 156,10 150,16" fill="currentColor" />
            <line x1="170" y1="10" x2="290" y2="10" stroke="currentColor" stroke-width="1.5" />
          </svg>
        </div>
        `;
      }

      // 6. Image Elements
      if (el.type === 'image') {
        const imgEl = el as any;
        return `
        <div class="element-absolute" style="left: ${left}; top: ${top}; width: ${width}; height: ${height}; z-index: ${el.zIndex}; ${transform} ${opacity}">
          <img src="${imgEl.url || imgEl.dataUrl}" style="width: 100%; height: 100%; object-fit: cover;" alt="Artwork" />
        </div>
        `;
      }

      return '';
    })
    .join('\n');

  // Company Branding "Milaap" at the bottom of the cover page (only if not already an element)
  const hasCoverMilaapElement = page.elements.some(
    (el: any) => el.id === 'el_cover_milaap' || (el.content && el.content.trim().toUpperCase() === 'MILAAP')
  );

  const milaapFooter = (isCoverPage && !hasCoverMilaapElement)
    ? `
    <div style="position: absolute; bottom: 12px; left: 0; width: 100%; text-align: center; pointer-events: none; z-index: 25;">
      <span style="font-family: 'Cinzel', 'Playfair Display', serif; font-size: ${Math.round(8.5 * scaleRatio)}px; letter-spacing: 4px; font-weight: 600; color: #D4AF37; text-transform: uppercase;">
        MILAAP
      </span>
    </div>
    `
    : '';

  return `
  <div class="card-page-container" style="${bgStyle}">
    ${elementsHtml}
    ${milaapFooter}
  </div>
  `;
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Complete vector path library for all 20+ traditional and regional motifs
 */
function renderMotifSVG(motifKey: string, color: string): string {
  switch (motifKey) {
    case 'ganesh':
      return `<svg viewBox="0 0 100 100" width="100%" height="100%" fill="${color}">
        <path d="M42 12 L50 4 L58 12 L54 18 L46 18 Z" />
        <path d="M36 28 C28 26 22 34 26 44 C29 48 35 48 38 44 C37 36 38 32 44 26 Z" />
        <path d="M64 28 C72 26 78 34 74 44 C71 48 65 48 62 44 C63 36 62 32 56 26 Z" />
        <path d="M47 38 C47 48 42 56 44 68 C46 76 54 80 62 76 C68 72 68 64 62 62 C58 60 54 64 54 68 C54 70 56 72 58 71" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" />
        <circle cx="50" cy="23" r="2.5" />
      </svg>`;

    case 'kalash':
      return `<svg viewBox="0 0 100 100" width="100%" height="100%" fill="${color}">
        <path d="M50 16 C55 24 64 34 60 42 C56 44 44 44 40 42 C36 34 45 24 50 16 Z" />
        <path d="M35 44 C35 42 65 42 65 44 L62 50 L38 50 Z" />
        <path d="M38 50 C26 56 24 74 34 82 C42 88 58 88 66 82 C76 74 74 56 62 50 Z" />
      </svg>`;

    case 'om':
      return `<svg viewBox="0 0 100 100" width="100%" height="100%" fill="${color}">
        <text x="50" y="70" font-family="'Rozha One', 'Noto Serif Devanagari', serif" font-size="64" text-anchor="middle" font-weight="bold">ॐ</text>
      </svg>`;

    case 'swastik':
      return `<svg viewBox="0 0 100 100" width="100%" height="100%" stroke="${color}" stroke-width="5" fill="none" stroke-linecap="square">
        <line x1="50" y1="20" x2="50" y2="80" />
        <line x1="20" y1="50" x2="80" y2="50" />
        <line x1="50" y1="20" x2="70" y2="20" />
        <line x1="80" y1="50" x2="80" y2="70" />
        <line x1="50" y1="80" x2="30" y2="80" />
        <line x1="20" y1="50" x2="20" y2="30" />
        <circle cx="35" cy="35" r="2.5" fill="${color}" stroke="none" />
        <circle cx="65" cy="35" r="2.5" fill="${color}" stroke="none" />
        <circle cx="65" cy="65" r="2.5" fill="${color}" stroke="none" />
        <circle cx="35" cy="65" r="2.5" fill="${color}" stroke="none" />
      </svg>`;

    case 'peacock':
      return `<svg viewBox="0 0 100 100" width="100%" height="100%" fill="${color}">
        <path d="M48 20 C42 20 36 26 38 34 C40 40 46 44 46 50 C46 58 36 68 40 78 C44 86 58 88 68 82 C80 72 82 50 72 36 C64 26 56 20 48 20 Z" />
        <circle cx="42" cy="28" r="2" fill="#FFFFFF" />
        <path d="M40 26 L30 24 L36 30 Z" />
        <path d="M60 40 C70 42 76 52 72 62 C68 70 58 74 54 68" fill="none" stroke="${color}" stroke-width="2" />
      </svg>`;

    case 'radha_krishna':
      return `<svg viewBox="0 0 100 100" width="100%" height="100%" stroke="${color}" fill="none">
        <!-- Bansuri (Flute) with Morpankh -->
        <line x1="20" y1="45" x2="80" y2="45" stroke-width="3.5" stroke-linecap="round" />
        <circle cx="40" cy="45" r="1.5" fill="${color}" />
        <circle cx="50" cy="45" r="1.5" fill="${color}" />
        <circle cx="60" cy="45" r="1.5" fill="${color}" />
        <!-- Peacock Feather on Flute -->
        <path d="M35 45 C35 30 45 20 55 15 C60 22 55 35 45 42" stroke-width="2" fill="${color}" fill-opacity="0.3" />
        <ellipse cx="48" cy="24" rx="4" ry="7" fill="${color}" />
        <circle cx="48" cy="24" r="2" fill="#FFFFFF" />
      </svg>`;

    case 'diya':
      return `<svg viewBox="0 0 100 100" width="100%" height="100%" fill="${color}">
        <!-- Flame -->
        <path d="M50 20 C54 28 60 38 56 46 C52 50 48 50 44 46 C40 38 46 28 50 20 Z" />
        <circle cx="50" cy="38" r="3" fill="#FFFFFF" opacity="0.8" />
        <!-- Earthen Pot -->
        <path d="M25 54 C35 68 65 68 75 54 C72 50 28 50 25 54 Z" />
        <path d="M42 66 L38 74 H62 L58 66 Z" />
      </svg>`;

    case 'elephant':
      return `<svg viewBox="0 0 100 100" width="100%" height="100%" fill="${color}">
        <path d="M30 40 C30 28 42 22 58 24 C72 26 80 36 80 50 C80 62 76 74 76 80 H66 L66 66 H54 L54 80 H44 L44 60 C38 60 34 54 30 46 Z" />
        <!-- Raised Trunk (Auspicious) -->
        <path d="M30 46 C24 40 18 32 20 24 C22 20 28 20 30 26 C28 32 32 38 34 42" fill="none" stroke="${color}" stroke-width="3.5" stroke-linecap="round" />
        <circle cx="68" cy="34" r="2" fill="#FFFFFF" />
      </svg>`;

    case 'lotus':
      return `<svg viewBox="0 0 100 100" width="100%" height="100%" fill="${color}">
        <!-- Center Petal -->
        <path d="M50 25 C58 40 62 60 50 75 C38 60 42 40 50 25 Z" />
        <!-- Side Petals -->
        <path d="M50 45 C65 48 78 60 74 74 C62 74 54 62 50 56 Z" />
        <path d="M50 45 C35 48 22 60 26 74 C38 74 46 62 50 56 Z" />
        <path d="M40 76 C46 74 54 74 60 76 C56 80 44 80 40 76 Z" />
      </svg>`;

    case 'ik_onkar':
      return `<svg viewBox="0 0 100 100" width="100%" height="100%" fill="${color}">
        <text x="50" y="70" font-family="'Noto Serif Gurmukhi', 'Tiro Gurmukhi', serif" font-size="64" text-anchor="middle" font-weight="bold">ੴ</text>
      </svg>`;

    case 'kashmiri_chinar':
      return `<svg viewBox="0 0 100 100" width="100%" height="100%" fill="${color}">
        <path d="M50 15 L52 28 L59 22 L57 32 L67 30 L62 38 L72 42 L64 48 L70 56 L58 56 L58 75 L52 75 L52 56 L40 56 L46 48 L38 42 L48 38 L43 30 L53 32 L51 22 L58 28 Z" />
      </svg>`;

    case 'rajasthani_jharokha':
      return `<svg viewBox="0 0 100 100" width="100%" height="100%" fill="${color}">
        <path d="M50 15 C54 22 68 28 68 38 L68 75 H32 L32 38 C32 28 46 22 50 15 Z" fill="none" stroke="${color}" stroke-width="2.5" />
        <circle cx="50" cy="15" r="2.5" />
        <line x1="30" y1="75" x2="70" y2="75" stroke="${color}" stroke-width="3" />
      </svg>`;

    case 'bengali_alpana':
      return `<svg viewBox="0 0 100 100" width="100%" height="100%" stroke="${color}" fill="none" stroke-width="2">
        <circle cx="50" cy="50" r="35" stroke-dasharray="3 3" />
        <circle cx="50" cy="50" r="25" />
        <path d="M50 15 C55 25 55 35 50 45 C45 35 45 25 50 15 Z" fill="${color}" />
        <path d="M50 55 C55 65 55 75 50 85 C45 75 45 65 50 55 Z" fill="${color}" />
        <path d="M15 50 C25 55 35 55 45 50 C35 45 25 45 15 50 Z" fill="${color}" />
        <path d="M55 50 C65 55 75 55 85 50 C75 45 65 45 55 50 Z" fill="${color}" />
      </svg>`;

    default:
      return `<svg viewBox="0 0 100 100" width="100%" height="100%" fill="${color}">
        <circle cx="50" cy="50" r="30" fill-opacity="0.2" stroke="${color}" stroke-width="3" />
        <path d="M50 25 L55 45 L75 50 L55 55 L50 75 L45 55 L25 50 L45 45 Z" />
      </svg>`;
  }
}
