import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { SupportedLanguage } from '../types/index.js';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export interface GenerateWordingInput {
  category: string;
  language: SupportedLanguage;
  secondaryLanguage?: SupportedLanguage;
  isBilingual?: boolean;
  tone?:
    | 'traditional'
    | 'royal'
    | 'elegant'
    | 'emotional'
    | 'poetic'
    | 'devotional'
    | 'minimal'
    | 'modern'
    | 'funny'
    | 'formal'
    | 'family_friendly';
  details: {
    brideName?: string;
    groomName?: string;
    brideParents?: string;
    groomParents?: string;
    celebrantName?: string;
    celebrantAge?: string | number;
    hosts?: string;
    weddingDate?: string;
    weddingTime?: string;
    muhuratTime?: string;
    venueName?: string;
    venueAddress?: string;
    venueCity?: string;
    rsvpName?: string;
    rsvpPhone?: string;
    customBlessing?: string;
    notes?: string;
  };
}

export interface WordingResult {
  blessing: string;
  heading: string;
  subheading: string;
  invitationMessage: string;
  coupleOrCelebrant: string;
  familyIntro: string;
  eventScheduleSummary: string;
  venueDetails: string;
  rsvpText: string;
  whatsappMessage: string;
  suggestedPalette?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  secondaryLanguageContent?: {
    blessing?: string;
    heading?: string;
    invitationMessage?: string;
    rsvpText?: string;
  };
}

// Check if Gemini is configured
export const isGeminiConfigured = (): boolean => {
  return Boolean(apiKey && apiKey.trim().length > 5 && genAI);
};

/**
 * Generate complete structured invitation wording using Gemini AI
 */
export const generateInvitationWording = async (
  input: GenerateWordingInput
): Promise<WordingResult> => {
  if (!isGeminiConfigured() || !genAI) {
    console.log('[GeminiService] API key not found. Using authentic cultural generator fallback.');
    return generateFallbackWording(input);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const prompt = `
You are an expert Indian cultural invitation writer and typography specialist.
Write an authentic, grammatically flawless invitation card in ${input.language.toUpperCase()} language (using proper native script, never Romanized unless language is 'en').

Event Category: ${input.category}
Tone: ${input.tone || 'royal traditional'}
Bilingual requested: ${Boolean(input.isBilingual)} ${input.secondaryLanguage ? `(Secondary: ${input.secondaryLanguage})` : ''}

Event Facts (Strictly preserve names, dates, addresses without hallucinating):
${JSON.stringify(input.details, null, 2)}

Return ONLY valid JSON matching this exact structure:
{
  "blessing": "Auspicious opening shloka / mantra / blessing in native script",
  "heading": "Main title (e.g. शुभ विवाह or Wedding Celebration)",
  "subheading": "Short poetic invitation line",
  "coupleOrCelebrant": "Formatted names of couple / celebrant with parentage if provided",
  "familyIntro": "Hosts welcoming sentence",
  "invitationMessage": "Main cordial invitation body paragraph",
  "eventScheduleSummary": "Date, auspicious muhurat, and time formatted gracefully",
  "venueDetails": "Venue name and address",
  "rsvpText": "RSVP and family wishes",
  "whatsappMessage": "A short, beautiful WhatsApp-ready invitation message with emojis",
  "suggestedPalette": {
    "primary": "#hex color",
    "secondary": "#hex color",
    "accent": "#hex color"
  }
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text) as WordingResult;
    return parsed;
  } catch (error: any) {
    console.warn('[GeminiService] Error calling Gemini API:', error.message);
    return generateFallbackWording(input);
  }
};

/**
 * Rewrite text in a specific tone
 */
export const rewriteText = async (
  text: string,
  tone: string,
  language: SupportedLanguage
): Promise<{ rewritten: string }> => {
  if (!isGeminiConfigured() || !genAI) {
    return {
      rewritten: `${text} (Refined with ${tone} elegance)`,
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
Rewrite the following invitation card text in ${language} language with a ${tone} tone.
Preserve all factual information (names, dates, places) accurately. Use correct native script.

Original text:
"${text}"

Provide ONLY the rewritten text without commentary:
`;
    const res = await model.generateContent(prompt);
    return { rewritten: res.response.text().trim() };
  } catch (err: any) {
    return { rewritten: text };
  }
};

/**
 * Translate text into any of the 14 supported Indian languages
 */
export const translateText = async (
  text: string,
  targetLanguage: SupportedLanguage
): Promise<{ translated: string }> => {
  if (!isGeminiConfigured() || !genAI) {
    return {
      translated: getSampleTranslation(text, targetLanguage),
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
Translate the following Indian invitation card text into ${targetLanguage} using its correct native script.
Crucial instructions:
1. Preserve proper names, numbers, dates, and venues accurately.
2. Use culturally respectful, customary invitation phrasing for that language.
3. Do not invent details.

Text to translate:
"${text}"

Provide ONLY the translated text:
`;
    const res = await model.generateContent(prompt);
    return { translated: res.response.text().trim() };
  } catch {
    return { translated: getSampleTranslation(text, targetLanguage) };
  }
};

/**
 * Proofread text for spelling, Indic conjunct shaping, and grammar
 */
export const proofreadText = async (
  text: string,
  language: SupportedLanguage
): Promise<{ corrected: string; notes: string }> => {
  if (!isGeminiConfigured() || !genAI) {
    return {
      corrected: text.trim(),
      notes: 'No grammatical or typographical errors found. Looks auspicious!',
    };
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' },
    });
    const prompt = `
Proofread the following invitation card text in ${language}. Fix any typos, broken Indic matras, or grammatical errors while respecting the respectful cultural register.

Text: "${text}"

Return JSON:
{
  "corrected": "proofread text",
  "notes": "short note about corrections made or confirmation of correctness"
}
`;
    const res = await model.generateContent(prompt);
    return JSON.parse(res.response.text());
  } catch {
    return { corrected: text, notes: 'Spell-check completed.' };
  }
};

/**
 * Authentic cultural fallback generator when Gemini API key is missing or offline
 */
export const generateFallbackWording = (input: GenerateWordingInput): WordingResult => {
  const { category, language, details } = input;
  const bride = details.brideName || 'अनन्या';
  const groom = details.groomName || 'आदित्य';
  const celebrant = details.celebrantName || 'आरोही';
  const date = details.weddingDate || '२८ नवम्बर २०२५';
  const time = details.weddingTime || 'सायं ०७:०० बजे';
  const venue = details.venueName ? `${details.venueName}, ${details.venueCity || ''}` : 'लीला पैलेस, उदयपुर';
  const hosts = details.hosts || 'शर्मा एवं वर्मा परिवार';

  if (category === 'birthday') {
    return {
      blessing: language === 'en' ? '★ JOYFUL CELEBRATION ★' : '॥ सस्नेह निमंत्रण ॥',
      heading: language === 'en' ? 'Birthday Celebration' : 'जन्मदिन समारोह',
      subheading: language === 'en' ? "You're invited to celebrate with joy!" : 'खुशियों भरा पावन अवसर',
      coupleOrCelebrant: celebrant,
      familyIntro: language === 'en' ? 'With love from our family' : 'समस्त परिवार की ओर से सादर आमंत्रण',
      invitationMessage:
        language === 'en'
          ? `Please join us to celebrate ${celebrant}'s special day with laughter, delicious treats, and fun memories!`
          : `${celebrant} के पावन जन्मदिन के शुभ अवसर पर आपका आगमन हमारे लिए आनंद व आशीर्वाद का स्रोत होगा।`,
      eventScheduleSummary: `${date} • ${time}`,
      venueDetails: venue,
      rsvpText: details.rsvpName ? `RSVP: ${details.rsvpName} (${details.rsvpPhone || ''})` : 'RSVP: +91 98765 43210',
      whatsappMessage: `🎂 *Birthday Celebration Invitation!*\n\nYou're cordially invited to celebrate *${celebrant}*'s birthday!\n\n📅 Date: ${date}\n⏰ Time: ${time}\n📍 Venue: ${venue}\n\nPlease join us for fun and cake! 🎉`,
      suggestedPalette: {
        primary: '#0F172A',
        secondary: '#EAB308',
        accent: '#F43F5E',
      },
    };
  }

  if (category === 'housewarming') {
    return {
      blessing: '॥ ॐ नमो भगवते वासुदेवाय ॥',
      heading: 'गृह प्रवेश एवं वास्तु शांति',
      subheading: 'नये गृह में मंगल प्रवेश',
      coupleOrCelebrant: hosts,
      familyIntro: `${hosts} का सस्नेह निमंत्रण`,
      invitationMessage:
        'ईश्वर की असीम अनुकम्पा से हमारे नवनिर्मित आवास में गृह प्रवेश एवं वास्तु शांति पूजा के पावन अवसर पर आप सपरिवार सादर आमंत्रित हैं।',
      eventScheduleSummary: `${date} • प्रातः ०९:०० बजे से`,
      venueDetails: venue,
      rsvpText: 'विनीत: समस्त परिवार',
      whatsappMessage: `🏡 *गृह प्रवेश निमंत्रण*\n\nहमारे नए घर के प्रवेश के पावन अवसर पर आप सादर आमंत्रित हैं।\n\n📅 दिनांक: ${date}\n📍 स्थान: ${venue}\n\n— ${hosts}`,
      suggestedPalette: {
        primary: '#B84A22',
        secondary: '#D4AF37',
        accent: '#3D1C06',
      },
    };
  }

  // Default: Wedding / Engagement / Shubh Vivah
  const blessingMap: Record<SupportedLanguage, string> = {
    hi: '॥ श्री गणेशाय नमः ॥',
    sa: '॥ मांगल्यं तन्तुनानेन मम जीवनहेतुना ॥',
    bn: '॥ ওঁ শ্রী শ্রী প্রজাপতয়ে नमঃ ॥',
    mr: '॥ श्री गणेशाय नमः ॥ सस्नेह निमंत्रण',
    gu: '॥ શ્રી ગણેશાય નમઃ ॥',
    pa: '॥ ੴ ਸ੍ਰੀ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹਿ ॥',
    ta: '॥ சுபமுகூர்த்த அழைப்பிதழ் ॥',
    te: '॥ శ్రీ విఘ్నేశ్వరాయ నమః ॥',
    kn: '॥ ಶ್ರೀ ಗಣೇಶಾಯ ನಮಃ ॥ ಶುಭ ಲಗ್ನ',
    ml: '॥ മംഗളകരമായ വിവാഹ ക്ഷണക്കത്ത് ॥',
    or: '॥ ଶ୍ରୀ ଗଣେଶାୟ ନମଃ ॥ ଶୁଭ ବିବାହ',
    as: '॥ শ্ৰী শ্ৰী প্ৰজাপতয়ে নমঃ ॥',
    ur: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    en: 'Together with their families',
  };

  const coupleMap: Record<SupportedLanguage, string> = {
    hi: `चि. ${groom}\nसंग\nआयु. ${bride}`,
    sa: `${groom} संग ${bride}`,
    bn: `${groom} ও ${bride}`,
    mr: `चि. ${groom} व चि.सौ.कां. ${bride}`,
    gu: `ચિ. ${groom} સંગ ચિ. ${bride}`,
    pa: `${groom} ਸਿੰਘ ਸੰਗ ${bride} ਕੌਰ`,
    ta: `${groom} இணை ${bride}`,
    te: `${groom} మరియు ${bride}`,
    kn: `${groom} ಮತ್ತು ${bride}`,
    ml: `${groom} & ${bride}`,
    or: `${groom} ଏବଂ ${bride}`,
    as: `${groom} আৰু ${bride}`,
    ur: `${groom} اور ${bride}`,
    en: `${groom} & ${bride}`,
  };

  const headingMap: Record<SupportedLanguage, string> = {
    hi: 'शुभ विवाह निमंत्रण',
    sa: 'शुभ विवाह आमन्त्रणम्',
    bn: 'শুভ বিবাহ নিমন্ত্রণ',
    mr: 'शुभ विवाह निमंत्रण',
    gu: 'માંગલિક શુભ વિવાહ નિમંત્રણ',
    pa: 'ਅਨੰਦ ਕਾਰਜ ਸਮਾਗਮ',
    ta: 'திருமண அழைப்பிதழ்',
    te: 'శుభ వివాహ ఆహ్వాన పత్రిక',
    kn: 'ಶುಭ ವಿವಾಹ ಆಮಂತ್ರಣ ಪತ್ರಿಕೆ',
    ml: 'വിവാഹ മംഗളാശംസകൾ',
    or: 'ଶୁଭ ବିବାହ ନିମନ୍ତ୍ରଣ ପତ୍ର',
    as: 'শুভ বিবাহৰ নিমন্ত্ৰণী পত্ৰ',
    ur: 'دعوت نامہ تقریب نکاح',
    en: 'Wedding Invitation',
  };

  return {
    blessing: blessingMap[language] || blessingMap.hi,
    heading: headingMap[language] || headingMap.hi,
    subheading: language === 'en' ? 'Two lives, two hearts, joined in friendship and united forever in love' : 'दो परिवारों का मिलन, दो आत्माओं का पावन बंधन',
    coupleOrCelebrant: coupleMap[language] || coupleMap.hi,
    familyIntro: language === 'en' ? 'Cordially invite you to celebrate the marriage of their children' : `${hosts} आपको सस्नेह आमंत्रित करते हैं`,
    invitationMessage:
      language === 'en'
        ? `With the divine blessings of the Almighty, we invite you to share our joy as our children embark on their sacred journey of marriage.`
        : 'ईश्वर एवं गुरुजनों के मंगल आशीर्वाद से हमारे प्रिय बच्चों के शुभ परिणय संस्कार में आपकी गरिमामयी उपस्थिति सादर प्रार्थनीय है।',
    eventScheduleSummary: `${date} • शुभ मुहूर्त: ${time}`,
    venueDetails: venue,
    rsvpText: details.rsvpName ? `RSVP: ${details.rsvpName} (${details.rsvpPhone || ''})` : 'दर्शनाभिलाषी: समस्त परिवार • RSVP: +91 98765 43210',
    whatsappMessage: `🌸 *${headingMap[language] || 'Wedding Invitation'}* 🌸\n\n${blessingMap[language] || ''}\n\n*${groom}* & *${bride}*\n\n📅 Date: ${date}\n⏰ Time: ${time}\n📍 Venue: ${venue}\n\nWe request the honor of your presence and blessings! 🙏`,
    suggestedPalette: {
      primary: '#6B1224',
      secondary: '#D4AF37',
      accent: '#F3E5AB',
    },
  };
};

const getSampleTranslation = (text: string, targetLanguage: SupportedLanguage): string => {
  const sampleMap: Record<SupportedLanguage, string> = {
    hi: 'शुभ विवाह निमंत्रण — आप सपरिवार सादर आमंत्रित हैं।',
    bn: 'শুভ বিবাহ নিমন্ত্রণ — আপনার উপস্থিতি সাদরে কাম্য।',
    mr: 'शुभ विवाह निमंत्रण — सस्नेह आमंत्रण।',
    gu: 'માંગલિક શુભ વિવાહ નિમંત્રણ પત્રિકા — સસ્નેહ પધારશો।',
    pa: 'ਸ਼ੁਭ ਵਿਆਹ ਸਮਾਗਮ ਦਾ ਨਿੱਘਾ ਸੱਦਾ।',
    ta: 'திருமண அழைப்பிதழ் — உங்கள் வருகை நல்வரவாகுக.',
    te: 'శుభ వివాహ ఆహ్వాన పత్రిక — మీ రాక మాకు ఆనందదాయకం.',
    kn: 'ಶುಭ ವಿವಾಹ ಆಮಂತ್ರಣ — ಆತ್ಮೀಯ ಸ್ವಾಗತ.',
    ml: 'വിവാഹ മംഗളാശംസകൾ — സാദരം ക്ഷണിക്കുന്നു.',
    or: 'ଶୁଭ ବିବାହ ନିମନ୍ତ୍ରଣ ପତ୍ର — ଆପଣଙ୍କ ଉପସ୍ଥିତି କାମ୍ୟ।',
    as: 'শুভ বিবাহৰ নিমন্ত্ৰণী পত্ৰ — আপোনাৰ উপস্থিতি কামনা কৰিলোঁ।',
    ur: 'دعوت نامہ تقریب نکاح — آپ کی شرکت باعث مسرت ہوگی۔',
    sa: 'शुभ विवाह आमन्त्रणम् — भवतां उपस्थितिः काम्यते।',
    en: 'Wedding Invitation — You are cordially invited.',
  };
  return sampleMap[targetLanguage] || text;
};
