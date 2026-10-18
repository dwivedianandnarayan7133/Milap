export interface MotifDefinition {
  id: string;
  name: string;
  category: 'religious' | 'cultural' | 'decorative' | 'flourish';
  svgPath: string;
  viewBox: string;
  defaultWidth: number;
  defaultHeight: number;
  description: string;
}

export const TRADITIONAL_MOTIFS: Record<string, MotifDefinition> = {
  ganesh: {
    id: 'ganesh',
    name: 'Shree Ganesha',
    category: 'religious',
    viewBox: '0 0 100 100',
    defaultWidth: 70,
    defaultHeight: 70,
    description: 'Vighnaharta Ganesha — Auspicious beginning for all events',
    svgPath: `
      <g fill="currentColor">
        <!-- Crown / Mukut -->
        <path d="M42 12 L50 4 L58 12 L54 18 L46 18 Z" />
        <circle cx="50" cy="10" r="2" />
        <!-- Head and Ears -->
        <path d="M36 28 C28 26 22 34 26 44 C29 48 35 48 38 44 C37 36 38 32 44 26 Z" />
        <path d="M64 28 C72 26 78 34 74 44 C71 48 65 48 62 44 C63 36 62 32 56 26 Z" />
        <!-- Forehead & Tilak -->
        <path d="M44 24 C44 22 56 22 56 24 C56 30 44 30 44 24 Z" />
        <line x1="50" y1="20" x2="50" y2="32" stroke="currentColor" stroke-width="2" />
        <circle cx="50" cy="23" r="1.5" />
        <!-- Eyes -->
        <ellipse cx="44" cy="34" rx="2" ry="1" />
        <ellipse cx="56" cy="34" rx="2" ry="1" />
        <!-- Trunk (Curving Right/Left gracefully) -->
        <path d="M47 38 C47 48 42 56 44 68 C46 76 54 80 62 76 C68 72 68 64 62 62 C58 60 54 64 54 68 C54 70 56 72 58 71 C55 72 52 70 51 66 C49 56 53 48 53 38 Z" />
        <!-- Tusk -->
        <path d="M42 42 L38 46 L43 45 Z" />
        <!-- Modak in hand -->
        <circle cx="34" cy="62" r="4" />
        <path d="M34 56 L36 60 L32 60 Z" />
        <!-- Graceful body curve -->
        <path d="M38 66 C40 76 46 84 56 86 C64 88 74 82 72 72" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
      </g>
    `,
  },
  kalash: {
    id: 'kalash',
    name: 'Mangal Kalash',
    category: 'religious',
    viewBox: '0 0 100 100',
    defaultWidth: 65,
    defaultHeight: 65,
    description: 'Sacred pot with coconut and mango leaves, symbol of abundance',
    svgPath: `
      <g fill="currentColor">
        <!-- Coconut -->
        <path d="M50 16 C55 24 64 34 60 42 C56 44 44 44 40 42 C36 34 45 24 50 16 Z" />
        <!-- Coconut fibers -->
        <path d="M50 10 L50 20 M46 14 L50 22 M54 14 L50 22" stroke="currentColor" stroke-width="1.5" />
        <!-- Mango leaves -->
        <path d="M40 38 C30 32 20 38 18 46 C26 48 34 44 40 40 Z" />
        <path d="M60 38 C70 32 80 38 82 46 C74 48 66 44 60 40 Z" />
        <!-- Neck of Kalash -->
        <path d="M35 44 C35 42 65 42 65 44 L62 50 L38 50 Z" />
        <!-- Sacred thread (Mauli) -->
        <line x1="36" y1="47" x2="64" y2="47" stroke="currentColor" stroke-width="2" />
        <!-- Kalash Body -->
        <path d="M38 50 C26 56 24 74 34 82 C42 88 58 88 66 82 C76 74 74 56 62 50 Z" />
        <!-- Swastik on Kalash -->
        <path d="M47 62 H53 M50 59 V65 M47 59 V62 M53 62 V65 M50 59 H53 M47 65 H50" stroke="#FFF" stroke-width="1.5" fill="none" />
        <!-- Base -->
        <path d="M40 84 H60 V88 H40 Z" />
      </g>
    `,
  },
  lotus: {
    id: 'lotus',
    name: 'Pavitra Kamal (Lotus)',
    category: 'cultural',
    viewBox: '0 0 100 100',
    defaultWidth: 60,
    defaultHeight: 60,
    description: 'Divine lotus symbolizing purity, grace, and spiritual elevation',
    svgPath: `
      <g fill="currentColor">
        <!-- Center petal -->
        <path d="M50 20 C56 32 62 48 50 68 C38 48 44 32 50 20 Z" />
        <!-- Inner Left Petal -->
        <path d="M48 30 C40 36 32 46 38 62 C44 56 48 44 48 30 Z" opacity="0.9" />
        <!-- Inner Right Petal -->
        <path d="M52 30 C60 36 68 46 62 62 C56 56 52 44 52 30 Z" opacity="0.9" />
        <!-- Outer Left Petal -->
        <path d="M36 44 C24 50 18 62 26 72 C36 72 40 60 40 50 Z" opacity="0.8" />
        <!-- Outer Right Petal -->
        <path d="M64 44 C76 50 82 62 74 72 C64 72 60 60 60 50 Z" opacity="0.8" />
        <!-- Base Leaves -->
        <path d="M28 72 C38 78 62 78 72 72 C66 80 34 80 28 72 Z" />
      </g>
    `,
  },
  doli: {
    id: 'doli',
    name: 'Royal Doli (Palanquin)',
    category: 'cultural',
    viewBox: '0 0 100 100',
    defaultWidth: 80,
    defaultHeight: 60,
    description: 'Traditional royal bride palanquin (Doli) for Indian weddings',
    svgPath: `
      <g fill="currentColor">
        <!-- Carrying Pole -->
        <path d="M6 34 Q50 28 94 34 L94 37 Q50 31 6 37 Z" />
        <!-- Dome / Canopy -->
        <path d="M30 33 C30 20 70 20 70 33 Z" />
        <!-- Finial on Top -->
        <circle cx="50" cy="18" r="3" />
        <!-- Doli Body -->
        <path d="M26 35 H74 L70 70 H30 Z" />
        <!-- Window Opening with Arch -->
        <path d="M38 44 C38 38 62 38 62 44 V62 H38 Z" fill="#FFFDF9" />
        <path d="M44 48 C44 44 56 44 56 48 V58 H44 Z" fill="currentColor" opacity="0.8" />
        <!-- Hanging tassels / tassels below -->
        <circle cx="28" cy="74" r="2" />
        <circle cx="50" cy="74" r="2" />
        <circle cx="72" cy="74" r="2" />
        <line x1="28" y1="70" x2="28" y2="74" stroke="currentColor" stroke-width="1.5" />
        <line x1="50" y1="70" x2="50" y2="74" stroke="currentColor" stroke-width="1.5" />
        <line x1="72" y1="70" x2="72" y2="74" stroke="currentColor" stroke-width="1.5" />
      </g>
    `,
  },
  peacock: {
    id: 'peacock',
    name: 'Mayur (Royal Peacock)',
    category: 'cultural',
    viewBox: '0 0 100 100',
    defaultWidth: 70,
    defaultHeight: 70,
    description: 'Graceful Indian peacock representing beauty, romance, and festivity',
    svgPath: `
      <g fill="currentColor">
        <!-- Crown feathers -->
        <path d="M36 14 L38 20 M38 13 L39 19 M41 14 L40 20" stroke="currentColor" stroke-width="1.5" />
        <circle cx="36" cy="13" r="1.5" />
        <circle cx="38" cy="12" r="1.5" />
        <circle cx="41" cy="13" r="1.5" />
        <!-- Head and Neck -->
        <path d="M40 20 C42 18 46 20 46 24 C46 28 42 34 42 42 C42 50 48 58 52 64 C48 66 40 60 38 52 C36 44 38 34 36 28 C34 24 38 22 40 20 Z" />
        <!-- Eye -->
        <circle cx="43" cy="22" r="1" fill="#FFF" />
        <!-- Beak -->
        <path d="M46 22 L52 24 L46 26 Z" />
        <!-- Plume / Tail feathers (Ornate fan) -->
        <path d="M52 62 C62 54 76 56 84 66 C78 74 64 76 52 70 Z" opacity="0.9" />
        <path d="M54 68 C68 64 80 72 82 82 C72 86 60 82 52 74 Z" opacity="0.8" />
        <circle cx="74" cy="64" r="3" fill="#FFF" />
        <circle cx="74" cy="64" r="1.5" />
        <circle cx="72" cy="76" r="3" fill="#FFF" />
        <circle cx="72" cy="76" r="1.5" />
      </g>
    `,
  },
  diya: {
    id: 'diya',
    name: 'Deepam / Diya',
    category: 'religious',
    viewBox: '0 0 100 100',
    defaultWidth: 60,
    defaultHeight: 60,
    description: 'Golden auspicious lamp spreading light, joy, and warmth',
    svgPath: `
      <g fill="currentColor">
        <!-- Flame -->
        <path d="M50 16 C54 26 62 36 56 46 C52 50 48 50 44 46 C38 36 46 26 50 16 Z" />
        <path d="M50 26 C52 32 56 38 53 43 C51 45 49 45 47 43 C44 38 48 32 50 26 Z" fill="#FFF" opacity="0.6" />
        <!-- Diya Bowl -->
        <path d="M22 52 C22 48 78 48 78 52 C74 72 26 72 22 52 Z" />
        <!-- Base -->
        <path d="M38 70 C42 68 58 68 62 70 L66 78 H34 Z" />
        <!-- Ornate dots -->
        <circle cx="34" cy="56" r="1.5" fill="#FFF" />
        <circle cx="42" cy="58" r="1.5" fill="#FFF" />
        <circle cx="50" cy="59" r="1.5" fill="#FFF" />
        <circle cx="58" cy="58" r="1.5" fill="#FFF" />
        <circle cx="66" cy="56" r="1.5" fill="#FFF" />
      </g>
    `,
  },
  shehnai: {
    id: 'shehnai',
    name: 'Shehnai & Tasha',
    category: 'cultural',
    viewBox: '0 0 100 100',
    defaultWidth: 70,
    defaultHeight: 70,
    description: 'Celebratory shehnai flute announcing the sacred wedding rituals',
    svgPath: `
      <g fill="currentColor">
        <!-- Shehnai 1 angled -->
        <path d="M20 20 L26 26 L64 68 C68 66 74 70 78 76 C80 80 78 84 74 84 C68 84 64 78 66 74 L24 32 Z" />
        <!-- Flare bell -->
        <path d="M68 70 C72 68 82 74 84 82 C84 88 76 90 70 86 C64 82 66 74 68 70 Z" />
        <!-- Sound holes -->
        <circle cx="38" cy="42" r="1.5" fill="#FFF" />
        <circle cx="46" cy="50" r="1.5" fill="#FFF" />
        <circle cx="54" cy="58" r="1.5" fill="#FFF" />
        <!-- Marigold Garland Ribbon -->
        <path d="M28 34 Q50 48 72 38" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="3 3" />
      </g>
    `,
  },
  mandala_top: {
    id: 'mandala_top',
    name: 'Ornate Crown Arch',
    category: 'flourish',
    viewBox: '0 0 200 60',
    defaultWidth: 160,
    defaultHeight: 50,
    description: 'Symmetrical traditional royal arch for card header or top frame',
    svgPath: `
      <g fill="currentColor">
        <path d="M100 6 C104 12 110 14 118 10 C114 18 122 22 130 18 C124 26 134 32 144 26 C136 34 146 42 160 38 C148 46 160 56 180 50 L180 54 C156 58 140 48 132 40 C124 44 116 38 112 30 C108 34 104 32 100 24 C96 32 92 34 88 30 C84 38 76 44 68 40 C60 48 44 58 20 54 L20 50 C40 56 52 46 40 38 C54 42 64 34 56 26 C66 32 76 26 70 18 C78 22 86 18 82 10 C90 14 96 12 100 6 Z" />
        <circle cx="100" cy="4" r="3" />
        <circle cx="70" cy="14" r="2" />
        <circle cx="130" cy="14" r="2" />
      </g>
    `,
  },
  ornate_divider: {
    id: 'ornate_divider',
    name: 'Royal Floral Divider',
    category: 'flourish',
    viewBox: '0 0 300 30',
    defaultWidth: 220,
    defaultHeight: 25,
    description: 'Graceful floral and paisley separator between sections',
    svgPath: `
      <g fill="currentColor">
        <path d="M150 6 C154 11 160 15 168 15 C162 20 166 26 174 24 C166 27 162 31 160 35 C158 27 154 22 150 20 C146 22 142 27 140 35 C138 31 134 27 126 24 C134 26 138 20 132 15 C140 15 146 11 150 6 Z" />
        <!-- Left line with curl -->
        <path d="M20 20 H120 M120 20 C125 18 130 16 134 20" stroke="currentColor" stroke-width="1.5" fill="none" />
        <circle cx="18" cy="20" r="2.5" />
        <!-- Right line with curl -->
        <path d="M180 20 H280 M180 20 C175 18 170 16 166 20" stroke="currentColor" stroke-width="1.5" fill="none" />
        <circle cx="282" cy="20" r="2.5" />
      </g>
    `,
  },
  corner_flourish: {
    id: 'corner_flourish',
    name: 'Paisley Corner Motif',
    category: 'flourish',
    viewBox: '0 0 80 80',
    defaultWidth: 60,
    defaultHeight: 60,
    description: 'Traditional paisley (kalka/ambi) corner decoration for borders',
    svgPath: `
      <g fill="currentColor">
        <!-- Corner outer angle -->
        <path d="M6 74 V12 C6 8.7 8.7 6 12 6 H74 V10 H14 C11.8 10 10 11.8 10 14 V74 Z" />
        <!-- Paisley leaf -->
        <path d="M18 18 C26 18 36 24 38 34 C40 44 32 52 24 48 C18 44 20 36 26 36 C30 36 32 40 30 42 C30 40 28 38 26 38 C22 38 22 42 25 44 C29 46 34 42 33 34 C31 26 24 22 18 22 Z" />
        <circle cx="14" cy="14" r="2" />
        <circle cx="24" cy="14" r="1.5" />
        <circle cx="14" cy="24" r="1.5" />
      </g>
    `,
  },
  om: {
    id: 'om',
    name: 'Sacred Om (ॐ)',
    category: 'religious',
    viewBox: '0 0 100 100',
    defaultWidth: 60,
    defaultHeight: 60,
    description: 'The primordial sound of the universe, auspicious for all ceremonies',
    svgPath: `
      <g fill="currentColor">
        <text x="50" y="70" font-family="'Rozha One', 'Noto Serif Devanagari', serif" font-size="64" text-anchor="middle" font-weight="bold">ॐ</text>
      </g>
    `,
  },
  ik_onkar: {
    id: 'ik_onkar',
    name: 'Ik Onkar (ੴ)',
    category: 'religious',
    viewBox: '0 0 100 100',
    defaultWidth: 60,
    defaultHeight: 60,
    description: 'One Supreme Reality — Auspicious for Punjabi and Sikh ceremonies',
    svgPath: `
      <g fill="currentColor">
        <text x="50" y="70" font-family="'Noto Serif Gurmukhi', serif" font-size="64" text-anchor="middle" font-weight="bold">ੴ</text>
      </g>
    `,
  },
  bismillah: {
    id: 'bismillah',
    name: 'Bismillah Calligraphy & Hilal',
    category: 'religious',
    viewBox: '0 0 140 70',
    defaultWidth: 100,
    defaultHeight: 50,
    description: 'In the name of Allah, the Most Gracious — Auspicious for Muslim ceremonies',
    svgPath: `
      <g fill="currentColor">
        <!-- Crescent & 5-point Star -->
        <path d="M70 6 C64 6 59 11 59 17 C59 23 64 28 70 28 C73 28 76 27 78 25 C72 26 67 22 67 17 C67 12 72 8 78 9 C76 7 73 6 70 6 Z" />
        <polygon points="77,14 78,16 80,16 78,17 79,19 77,18 75,19 76,17 74,16 76,16" />
        <!-- Calligraphic Bismillah Baseline & Swashes -->
        <path d="M25 48 Q70 38 115 48" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" />
        <text x="70" y="44" font-family="'Noto Nastaliq Urdu', 'Scheherazade New', 'Amiri', serif" font-size="24" text-anchor="middle" font-weight="bold">﷽</text>
        <circle cx="20" cy="48" r="2" />
        <circle cx="120" cy="48" r="2" />
      </g>
    `,
  },
  kashmiri_chinar: {
    id: 'kashmiri_chinar',
    name: 'Kashmiri Chinar Leaf',
    category: 'cultural',
    viewBox: '0 0 100 100',
    defaultWidth: 70,
    defaultHeight: 70,
    description: 'Iconic Kashmiri Chinar leaf motif inspired by Kashmir walnut woodcarvings',
    svgPath: `
      <g fill="currentColor">
        <path d="M50 10 C52 24 58 28 62 26 C64 32 72 34 78 30 C76 38 84 42 88 40 C84 48 88 56 84 62 C78 64 74 58 70 60 C66 66 60 70 56 68 C52 74 48 84 50 92 L48 92 C46 84 44 74 40 68 C36 70 30 66 26 60 C22 58 18 64 12 62 C8 56 12 48 8 40 C12 42 20 38 18 30 C24 34 32 32 34 26 C38 28 44 24 46 10 Z" />
        <path d="M49 20 L49 84 M49 42 L66 32 M49 42 L32 32 M49 56 L72 48 M49 56 L26 48" stroke="#FFF" stroke-width="1.5" fill="none" opacity="0.6" />
      </g>
    `,
  },
  rajasthani_jharokha: {
    id: 'rajasthani_jharokha',
    name: 'Rajasthani Jharokha Arch',
    category: 'cultural',
    viewBox: '0 0 100 100',
    defaultWidth: 75,
    defaultHeight: 75,
    description: 'Royal palace carved balcony arch from Jaipur and Udaipur palaces',
    svgPath: `
      <g fill="currentColor">
        <path d="M20 90 V46 C20 28 35 15 50 15 C65 15 80 28 80 46 V90 H72 V48 C72 34 62 24 50 24 C38 24 28 34 28 48 V90 Z" />
        <path d="M42 14 L50 4 L58 14 Z" />
        <circle cx="50" cy="8" r="2.5" />
        <circle cx="50" cy="36" r="3" />
        <!-- Pillar carvings -->
        <rect x="22" y="80" width="8" height="6" />
        <rect x="70" y="80" width="8" height="6" />
      </g>
    `,
  },
  bengali_alpana: {
    id: 'bengali_alpana',
    name: 'Bengali Alpana Ring',
    category: 'cultural',
    viewBox: '0 0 100 100',
    defaultWidth: 70,
    defaultHeight: 70,
    description: 'Traditional Bengali rice-flour floor alpana pattern symbolizing auspicious fortune',
    svgPath: `
      <g fill="currentColor">
        <circle cx="50" cy="50" r="14" fill="none" stroke="currentColor" stroke-width="2.5" />
        <circle cx="50" cy="50" r="6" />
        <!-- 8 symmetrical kalka petals -->
        <path d="M50 24 C53 14 62 14 60 22 C58 26 54 28 50 30 Z" />
        <path d="M50 76 C53 86 62 86 60 78 C58 74 54 72 50 70 Z" />
        <path d="M24 50 C14 53 14 62 22 60 C26 58 28 54 30 50 Z" />
        <path d="M76 50 C86 53 86 62 78 60 C74 58 72 54 70 50 Z" />
        <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 3" />
      </g>
    `,
  },
  assamese_jaapi: {
    id: 'assamese_jaapi',
    name: 'Assamese Jaapi Crown',
    category: 'cultural',
    viewBox: '0 0 100 80',
    defaultWidth: 75,
    defaultHeight: 60,
    description: 'Conical woven bamboo headgear symbolizing Assamese honor, welcome, and respect',
    svgPath: `
      <g fill="currentColor">
        <!-- Cone dome -->
        <path d="M50 10 L84 56 C74 62 26 62 16 56 Z" />
        <circle cx="50" cy="8" r="3" />
        <!-- Brim -->
        <ellipse cx="50" cy="58" rx="42" ry="12" fill="none" stroke="currentColor" stroke-width="2.5" />
        <!-- Inner red & green felt decorative patches -->
        <circle cx="50" cy="38" r="5" fill="#FFF" />
        <circle cx="38" cy="46" r="3.5" fill="#FFF" />
        <circle cx="62" cy="46" r="3.5" fill="#FFF" />
      </g>
    `,
  },
  odia_konark_wheel: {
    id: 'odia_konark_wheel',
    name: 'Konark Wheel (Odia)',
    category: 'cultural',
    viewBox: '0 0 100 100',
    defaultWidth: 70,
    defaultHeight: 70,
    description: 'Sacred chariot wheel from Konark Sun Temple in Odisha, emblem of cosmic time',
    svgPath: `
      <g fill="currentColor">
        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" stroke-width="4" />
        <circle cx="50" cy="50" r="36" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 2" />
        <circle cx="50" cy="50" r="12" />
        <circle cx="50" cy="50" r="5" fill="#FFF" />
        <!-- 8 Major Spokes -->
        <line x1="50" y1="14" x2="50" y2="86" stroke="currentColor" stroke-width="3" />
        <line x1="14" y1="50" x2="86" y2="50" stroke="currentColor" stroke-width="3" />
        <line x1="24" y1="24" x2="76" y2="76" stroke="currentColor" stroke-width="2" />
        <line x1="76" y1="24" x2="24" y2="76" stroke="currentColor" stroke-width="2" />
      </g>
    `,
  },
  south_kolam: {
    id: 'south_kolam',
    name: 'South Indian Kolam / Muggu',
    category: 'cultural',
    viewBox: '0 0 100 100',
    defaultWidth: 70,
    defaultHeight: 70,
    description: 'Auspicious geometric rice-flour threshold artwork welcoming prosperity to the wedding',
    svgPath: `
      <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <circle cx="50" cy="50" r="4" fill="currentColor" />
        <circle cx="50" cy="30" r="2" fill="currentColor" />
        <circle cx="50" cy="70" r="2" fill="currentColor" />
        <circle cx="30" cy="50" r="2" fill="currentColor" />
        <circle cx="70" cy="50" r="2" fill="currentColor" />
        <!-- Continuous loop lines around dots -->
        <path d="M50 20 Q70 20 70 50 Q70 80 50 80 Q30 80 30 50 Q30 20 50 20 Z" />
        <path d="M20 50 Q20 70 50 70 Q80 70 80 50 Q80 30 50 30 Q20 30 20 50 Z" />
        <!-- Diagonal petals -->
        <path d="M30 30 Q50 40 70 30 Q60 50 70 70 Q50 60 30 70 Q40 50 30 30 Z" opacity="0.7" />
      </g>
    `,
  },
  kerala_nilavilakku: {
    id: 'kerala_nilavilakku',
    name: 'Kerala Nilavilakku Lamp',
    category: 'cultural',
    viewBox: '0 0 100 100',
    defaultWidth: 60,
    defaultHeight: 75,
    description: 'Traditional Kerala standing bell-metal oil lamp lighted at every auspicious event',
    svgPath: `
      <g fill="currentColor">
        <!-- Top Flame -->
        <path d="M50 6 C52 12 56 18 52 24 C50 26 48 26 46 24 C42 18 48 12 50 6 Z" />
        <!-- Crown Bird / Finial -->
        <circle cx="50" cy="27" r="3" />
        <!-- Top Oil Plate -->
        <ellipse cx="50" cy="34" rx="20" ry="5" />
        <!-- Central Column Stem -->
        <path d="M48 36 H52 V72 H48 Z" />
        <ellipse cx="50" cy="52" rx="8" ry="3" />
        <!-- Lower Ring Plate -->
        <ellipse cx="50" cy="72" rx="24" ry="6" />
        <!-- Base Pedestal -->
        <path d="M32 78 H68 L64 92 H36 Z" />
      </g>
    `,
  },
  santali_ol_pattern: {
    id: 'santali_ol_pattern',
    name: 'Santali Geometric Weave',
    category: 'cultural',
    viewBox: '0 0 100 60',
    defaultWidth: 80,
    defaultHeight: 50,
    description: 'Respectful indigenous geometric textile border inspired by Santali handwoven traditions',
    svgPath: `
      <g fill="currentColor">
        <!-- Repeating tribal diamonds with center dots -->
        <polygon points="20,30 30,15 40,30 30,45" />
        <circle cx="30" cy="30" r="2" fill="#FFF" />
        <polygon points="50,30 60,15 70,30 60,45" />
        <circle cx="60" cy="30" r="2" fill="#FFF" />
        <polygon points="80,30 90,15 100,30 90,45" />
        <circle cx="90" cy="30" r="2" fill="#FFF" />
        <!-- Chevron border line -->
        <line x1="6" y1="10" x2="94" y2="10" stroke="currentColor" stroke-width="2" />
        <line x1="6" y1="50" x2="94" y2="50" stroke="currentColor" stroke-width="2" />
      </g>
    `,
  },
  phulkari_flower: {
    id: 'phulkari_flower',
    name: 'Punjabi Phulkari Motif',
    category: 'cultural',
    viewBox: '0 0 100 100',
    defaultWidth: 65,
    defaultHeight: 65,
    description: 'Geometric silk floss embroidery flower from traditional Punjabi Phulkari dupattas',
    svgPath: `
      <g fill="currentColor">
        <!-- 4 Cardinal Petals -->
        <polygon points="50,15 60,35 50,45 40,35" />
        <polygon points="50,85 60,65 50,55 40,65" />
        <polygon points="15,50 35,60 45,50 35,40" />
        <polygon points="85,50 65,60 55,50 65,40" />
        <!-- 4 Diagonal Diamond Petals -->
        <polygon points="25,25 35,45 45,35" opacity="0.85" />
        <polygon points="75,25 65,45 55,35" opacity="0.85" />
        <polygon points="25,75 35,55 45,65" opacity="0.85" />
        <polygon points="75,75 65,55 55,65" opacity="0.85" />
        <!-- Center Gem -->
        <circle cx="50" cy="50" r="6" fill="#FFF" />
        <circle cx="50" cy="50" r="3" />
      </g>
    `,
  },
  diamond_rings: {
    id: 'diamond_rings',
    name: 'Sparkling Solitaire Diamond Rings',
    category: 'cultural',
    viewBox: '0 0 100 100',
    defaultWidth: 70,
    defaultHeight: 70,
    description: 'Two interlocking golden wedding rings crowned with a brilliant sparkling solitaire diamond',
    svgPath: `
      <g fill="currentColor">
        <!-- Interlocked Ring 1 (Left / Lower) -->
        <circle cx="40" cy="58" r="22" fill="none" stroke="currentColor" stroke-width="4.5" />
        <circle cx="40" cy="58" r="17" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.6" />
        <!-- Interlocked Ring 2 (Right / Upper with Diamond) -->
        <circle cx="60" cy="50" r="22" fill="none" stroke="currentColor" stroke-width="4.5" />
        <circle cx="60" cy="50" r="17" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.6" />
        <!-- Overlap cut for 3D interlocking illusion -->
        <path d="M47 38 C51 44 51 52 47 58" stroke="currentColor" stroke-width="5" fill="none" />
        <!-- Solitaire Diamond Crown on Ring 2 -->
        <polygon points="60,14 69,25 51,25" fill="currentColor" />
        <polygon points="51,25 60,14 60,25" fill="#FFF" opacity="0.5" />
        <polygon points="60,25 69,25 60,14" fill="#FFF" opacity="0.8" />
        <polygon points="53,25 67,25 60,32" fill="currentColor" />
        <!-- Prong Mounts -->
        <path d="M54 30 L52 26 M66 30 L68 26" stroke="currentColor" stroke-width="2" />
        <!-- Sparkle Glint Rays -->
        <line x1="60" y1="4" x2="60" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        <line x1="48" y1="8" x2="52" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        <line x1="72" y1="8" x2="68" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        <line x1="42" y1="18" x2="47" y2="19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        <line x1="78" y1="18" x2="73" y2="19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </g>
    `,
  },
  marathi_tutari: {
    id: 'marathi_tutari',
    name: 'Maharashtrian Royal Tutari',
    category: 'cultural',
    viewBox: '0 0 100 100',
    defaultWidth: 75,
    defaultHeight: 75,
    description: 'Iconic royal curved brass horn of Maharashtra, herald of auspicious ceremonies and shubh lagna',
    svgPath: `
      <g fill="currentColor">
        <!-- Curved Horn Tube -->
        <path d="M22 78 C20 72 24 64 32 58 C44 50 68 50 74 36 C78 26 70 18 60 16 C50 14 42 22 42 28 C42 32 46 36 50 34 C54 32 52 26 48 26 C46 26 46 24 50 22 C56 20 62 24 62 30 C62 38 46 44 32 50 C18 56 12 68 16 80 Z" />
        <!-- Flared Mouthpiece -->
        <path d="M14 78 C12 80 14 84 18 84 C22 84 24 80 22 78 Z" />
        <!-- Flared Grand Bell Opening -->
        <path d="M68 12 C72 8 82 10 84 18 C86 24 80 28 72 26 Z" />
        <!-- Royal Zari Tassel hanging from curve -->
        <path d="M48 40 L44 62 L52 62 Z" opacity="0.85" />
        <circle cx="48" cy="40" r="2.5" />
        <circle cx="48" cy="65" r="2" />
        <!-- Marigold garland beads -->
        <circle cx="34" cy="52" r="2" fill="#FFF" />
        <circle cx="40" cy="48" r="2" fill="#FFF" />
        <circle cx="46" cy="44" r="2" fill="#FFF" />
      </g>
    `,
  },
  gujarati_shubh_labh: {
    id: 'gujarati_shubh_labh',
    name: 'Gujarati Shubh Labh Toran',
    category: 'cultural',
    viewBox: '0 0 100 100',
    defaultWidth: 70,
    defaultHeight: 70,
    description: 'Traditional Gujarati Shubh Labh auspicious lettering with mango toran and Swastik',
    svgPath: `
      <g fill="currentColor">
        <!-- Top Toran arch -->
        <path d="M10 20 Q50 30 90 20" stroke="currentColor" stroke-width="2.5" fill="none" />
        <path d="M22 23 C22 30 28 34 28 24 Z" />
        <path d="M38 25 C38 32 44 36 44 26 Z" />
        <path d="M56 26 C56 36 62 32 62 25 Z" />
        <path d="M72 24 C72 34 78 30 78 23 Z" />
        <!-- Central Sacred Swastik -->
        <g transform="translate(36, 36) scale(0.28)">
          <path d="M10 50 H90 M50 10 V90 M10 50 V10 M90 50 V90 M50 10 H90 M50 90 H10" stroke="currentColor" stroke-width="12" fill="none" stroke-linecap="square" />
          <circle cx="30" cy="30" r="5" />
          <circle cx="70" cy="30" r="5" />
          <circle cx="30" cy="70" r="5" />
          <circle cx="70" cy="70" r="5" />
        </g>
        <!-- Shubh Labh Gujarati text below -->
        <text x="24" y="86" font-family="'Noto Sans Gujarati', sans-serif" font-size="14" font-weight="bold" text-anchor="middle">શુભ</text>
        <circle cx="50" cy="82" r="2.5" />
        <text x="76" y="86" font-family="'Noto Sans Gujarati', sans-serif" font-size="14" font-weight="bold" text-anchor="middle">લાભ</text>
      </g>
    `,
  },
  islamic_crescent: {
    id: 'islamic_crescent',
    name: 'Islamic Crescent & Star (Hilal)',
    category: 'religious',
    viewBox: '0 0 100 100',
    defaultWidth: 65,
    defaultHeight: 65,
    description: 'Graceful Islamic crescent moon and five-pointed star surrounded by Mughal floral arch',
    svgPath: `
      <g fill="currentColor">
        <!-- Crescent Moon -->
        <path d="M52 14 C30 14 14 30 14 52 C14 74 32 90 54 90 C66 90 76 84 82 76 C60 82 40 68 40 48 C40 32 50 20 66 16 C62 14 56 14 52 14 Z" />
        <!-- Five Pointed Star -->
        <polygon points="68,36 71,44 80,44 73,50 76,58 68,53 60,58 63,50 56,44 65,44" />
        <!-- Subtle jaali border dots -->
        <circle cx="50" cy="6" r="1.5" />
        <circle cx="32" cy="10" r="1.5" />
        <circle cx="68" cy="10" r="1.5" />
      </g>
    `,
  },
  christian_cross: {
    id: 'christian_cross',
    name: 'Sacred Cross of Matrimony',
    category: 'religious',
    viewBox: '0 0 100 100',
    defaultWidth: 65,
    defaultHeight: 75,
    description: 'Elegant Christian wedding cross with radiating light beams and budded floral terminals',
    svgPath: `
      <g fill="currentColor">
        <!-- Vertical Beam -->
        <path d="M47 16 H53 V84 H47 Z" />
        <!-- Horizontal Beam -->
        <path d="M26 36 H74 V42 H26 Z" />
        <!-- Budded Trefoil Terminals Top -->
        <circle cx="50" cy="14" r="3.5" />
        <circle cx="45" cy="16" r="2.5" />
        <circle cx="55" cy="16" r="2.5" />
        <!-- Left Terminal -->
        <circle cx="24" cy="39" r="3.5" />
        <circle cx="26" cy="34" r="2.5" />
        <circle cx="26" cy="44" r="2.5" />
        <!-- Right Terminal -->
        <circle cx="76" cy="39" r="3.5" />
        <circle cx="74" cy="34" r="2.5" />
        <circle cx="74" cy="44" r="2.5" />
        <!-- Bottom Terminal -->
        <circle cx="50" cy="86" r="3.5" />
        <circle cx="45" cy="84" r="2.5" />
        <circle cx="55" cy="84" r="2.5" />
        <!-- Central Halo / Radiance Ring -->
        <circle cx="50" cy="39" r="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 2" />
        <!-- Radiating Light Rays -->
        <line x1="50" y1="21" x2="50" y2="25" stroke="currentColor" stroke-width="1.5" />
        <line x1="32" y1="39" x2="36" y2="39" stroke="currentColor" stroke-width="1.5" />
        <line x1="68" y1="39" x2="64" y2="39" stroke="currentColor" stroke-width="1.5" />
        <line x1="50" y1="57" x2="50" y2="53" stroke="currentColor" stroke-width="1.5" />
      </g>
    `,
  },
  bal_gopal_cradle: {
    id: 'bal_gopal_cradle',
    name: 'Auspicious Golden Cradle (Palna)',
    category: 'cultural',
    viewBox: '0 0 100 100',
    defaultWidth: 70,
    defaultHeight: 70,
    description: 'Golden baby cradle decorated with flowers and bells for Naamkaran and baby blessings',
    svgPath: `
      <g fill="currentColor">
        <!-- Top Frame Beam -->
        <rect x="20" y="18" width="60" height="4" rx="2" />
        <circle cx="50" cy="16" r="3" />
        <!-- Hanging Ropes with Beads -->
        <line x1="28" y1="22" x2="32" y2="52" stroke="currentColor" stroke-width="2" />
        <line x1="72" y1="22" x2="68" y2="52" stroke="currentColor" stroke-width="2" />
        <circle cx="30" cy="36" r="2" />
        <circle cx="70" cy="36" r="2" />
        <!-- Cradle Body -->
        <path d="M26 52 C26 48 74 48 74 52 L68 76 C64 82 36 82 32 76 Z" />
        <!-- Inner Mat / Cushion -->
        <ellipse cx="50" cy="54" rx="20" ry="4" fill="#FFF" opacity="0.6" />
        <!-- Rocker Bottom Curved Legs -->
        <path d="M22 84 Q50 94 78 84" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" />
        <line x1="34" y1="78" x2="30" y2="86" stroke="currentColor" stroke-width="2.5" />
        <line x1="66" y1="78" x2="70" y2="86" stroke="currentColor" stroke-width="2.5" />
        <!-- Small Hanging Bell / Toy -->
        <circle cx="50" cy="32" r="3" />
        <line x1="50" y1="22" x2="50" y2="30" stroke="currentColor" stroke-width="1.5" />
      </g>
    `,
  },
  sacred_hawan: {
    id: 'sacred_hawan',
    name: 'Sacred Hawan Kund & Agni',
    category: 'religious',
    viewBox: '0 0 100 100',
    defaultWidth: 65,
    defaultHeight: 65,
    description: 'Sacred fire altar (Hawan Kund) for Vedic rituals, puja, and mundan sanskar',
    svgPath: `
      <g fill="currentColor">
        <!-- Sacred Flames (Agni) -->
        <path d="M50 12 C55 24 64 32 58 44 C54 48 48 48 44 44 C38 34 46 24 50 12 Z" />
        <path d="M50 22 C52 30 56 36 53 40 C51 42 49 42 47 40 C44 36 48 30 50 22 Z" fill="#FFF" opacity="0.6" />
        <!-- Left Flame Tongue -->
        <path d="M42 26 C40 34 34 40 38 46 C42 46 44 42 42 36 Z" opacity="0.85" />
        <!-- Right Flame Tongue -->
        <path d="M58 26 C60 34 66 40 62 46 C58 46 56 42 58 36 Z" opacity="0.85" />
        <!-- Hawan Kund Step 1 (Top Tier) -->
        <polygon points="18,48 82,48 76,58 24,58" />
        <!-- Step 2 (Middle Tier) -->
        <polygon points="22,58 78,58 72,68 28,68" opacity="0.9" />
        <!-- Step 3 (Base Tier) -->
        <polygon points="26,68 74,68 70,78 30,78" opacity="0.8" />
        <!-- Altar Platform -->
        <rect x="20" y="78" width="60" height="6" rx="1.5" />
      </g>
    `,
  },
};

/**
 * Returns the authentic auspicious motif based on language, region, and religion
 */
export function getMotifForLanguageAndReligion(
  langCode: string,
  religion?: 'hindu' | 'sikh' | 'muslim' | 'christian' | 'jain' | 'buddhist' | 'tribal' | 'secular'
): string {
  // If religion is explicitly given
  if (religion === 'sikh') return 'ik_onkar';
  if (religion === 'muslim') return 'islamic_crescent';
  if (religion === 'christian') return 'christian_cross';
  if (religion === 'jain') return 'kalash';
  if (religion === 'tribal') return 'santali_ol_pattern';
  if (religion === 'secular') return 'lotus';

  // Otherwise, select by regional cultural tradition of the language
  const map: Record<string, string> = {
    hi: 'ganesh',
    sa: 'om',
    pa: 'ik_onkar',
    ur: 'islamic_crescent',
    bn: 'bengali_alpana',
    mr: 'marathi_tutari',
    gu: 'gujarati_shubh_labh',
    ta: 'south_kolam',
    te: 'south_kolam',
    kn: 'south_kolam',
    ml: 'kerala_nilavilakku',
    or: 'odia_konark_wheel',
    as: 'assamese_jaapi',
    kas: 'islamic_crescent',
    raj: 'rajasthani_jharokha',
    mai: 'lotus',
    bho: 'kalash',
    doi: 'diya',
    sat: 'santali_ol_pattern',
    en: 'diamond_rings',
  };

  return map[langCode] || 'ganesh';
}

/**
 * Returns the default motif for a celebration milestone category
 */
export function getMotifForCategory(category: string): string {
  switch (category) {
    case 'ring_ceremony':
    case 'engagement':
      return 'diamond_rings';
    case 'wedding':
      return 'ganesh';
    case 'naming_ceremony':
      return 'bal_gopal_cradle';
    case 'baby_shower':
      return 'lotus';
    case 'housewarming':
      return 'kalash';
    case 'religious_ceremony':
    case 'mundan':
      return 'sacred_hawan';
    case 'anniversary':
      return 'peacock';
    case 'birthday':
      return 'diya';
    case 'reception':
      return 'mandala_top';
    case 'graduation':
      return 'lotus';
    case 'retirement':
      return 'diya';
    default:
      return 'om';
  }
}

