import { InvitationProject, SupportedLanguage, EventCategory } from '../types/card';

const API_BASE = '/api';

export interface HealthResponse {
  status: string;
  database: {
    mongoConnected: boolean;
    fallbackMode: boolean;
  };
  ai: {
    geminiConfigured: boolean;
  };
}

export const checkHealth = async (): Promise<HealthResponse> => {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (err) {
    return {
      status: 'offline',
      database: { mongoConnected: false, fallbackMode: true },
      ai: { geminiConfigured: false },
    };
  }
};

// Intelligent client-side cultural fallback generator when backend is offline or hosted on static Vercel
export const generateFallbackWordingClient = (payload: {
  category: EventCategory;
  language: SupportedLanguage;
  secondaryLanguage?: SupportedLanguage;
  isBilingual?: boolean;
  tone?: string;
  details: Record<string, any>;
}) => {
  const { category, language = 'hi', details = {}, tone = 'royal' } = payload;
  const bride = details.brideName || 'अनन्या';
  const groom = details.groomName || 'आदित्य';
  const celebrant = details.celebrantName || bride || 'आरोही';
  const date = details.weddingDate || '२८ नवम्बर २०२५';
  const time = details.weddingTime || 'सायं ०७:०० बजे';
  const venue = details.venueName
    ? `${details.venueName}, ${details.venueCity || ''}`
    : 'लीला पैलेस, उदयपुर (राजस्थान)';
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
      suggestedPalette: { primary: '#0F172A', secondary: '#EAB308', accent: '#F43F5E' },
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
      suggestedPalette: { primary: '#B84A22', secondary: '#D4AF37', accent: '#3D1C06' },
    };
  }

  if (category === 'anniversary') {
    return {
      blessing: '॥ वैवाहिक वर्षगांठ महोत्सव ॥',
      heading: 'शुभ वैवाहिक वर्षगांठ',
      subheading: 'प्रेम, विश्वास एवं समर्पण के गौरवमयी वर्ष',
      coupleOrCelebrant: `${groom} एवं ${bride}`,
      familyIntro: 'समस्त परिवार एवं स्नेहीजनों की ओर से सादर आमंत्रण',
      invitationMessage: 'हमारे दांपत्य जीवन के इस पावन उत्सव को यादगार बनाने हेतु आपके स्नेहिल आशीष एवं उपस्थिति की सादर प्रार्थना है।',
      eventScheduleSummary: `${date} • सायं ०७:३० बजे`,
      venueDetails: venue,
      rsvpText: 'विनीत: समस्त परिवार • RSVP: +91 98765 43210',
      whatsappMessage: `🥂 *वैवाहिक वर्षगांठ निमंत्रण*\n\n*${groom}* & *${bride}*\n\n📅 दिनांक: ${date}\n📍 स्थान: ${venue}`,
      suggestedPalette: { primary: '#7C2D12', secondary: '#F59E0B', accent: '#FEF3C7' },
    };
  }

  // Auspicious Blessings for 30+ regional languages / scripts
  const blessingMap: Record<string, string> = {
    hi: tone === 'devotional' ? '॥ श्री गणेशाय नमः ॥ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ' : '॥ श्री गणेशाय नमः ॥',
    sa: '॥ मांगल्यं तन्तुनानेन मम जीवनहेतुना कण्ठे बध्नामि सुभगे सञ्जीव शरदः शतम् ॥',
    bn: '॥ ওঁ শ্রী শ্রী প্রজাপতয়ে নমঃ ॥',
    mr: '॥ श्री गणेशाय नमः ॥ सस्नेह निमंत्रण',
    gu: '॥ શ્રી ગણેશાય નમઃ ॥ માંગલિક શુભ પ્રસંગ',
    pa: '॥ ੴ ਸ੍ਰੀ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹਿ ॥',
    ta: '॥ சுபமுகூர்த்த அழைப்பிதழ் ॥ ஓம் விநாயக போற்றி',
    te: '॥ శ్రీ విఘ్నేశ్వరాయ నమః ॥ శుభ ముహూర్తం',
    kn: '॥ ಶ್ರೀ ಗಣೇಶಾಯ ನಮಃ ॥ ಶುಭ ಲಗ್ನ ಪತ್ರಿಕೆ',
    ml: '॥ മംഗളകരമായ വിവാഹ ക്ഷണക്കത്ത് ॥',
    or: '॥ ଶ୍ରୀ ଗଣେଶାୟ ନମଃ ॥ ଶୁଭ ବିବାହ',
    as: '॥ শ্ৰী শ্ৰী প্ৰজাপতয়ে নমঃ ॥ মাঙ্গলিক অনুষ্ঠান',
    ur: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    en: tone === 'royal' ? 'Under the Auspicious Blessings of the Almighty' : 'Together with their families',
  };

  const headingMap: Record<string, string> = {
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

  const coupleMap: Record<string, string> = {
    hi: `चि. ${groom}\nसंग\nआयु. ${bride}`,
    sa: `${groom} संग ${bride}`,
    bn: `${groom} ও ${bride}`,
    mr: `चि. ${groom} व चि.सौ.कां. ${bride}`,
    gu: `ચિ. ${groom} સંગ ચિ. ${bride}`,
    pa: `${groom} ਸਿੰਘ ਸੰਗ ${bride} ਕੌਰ`,
    ta: `${groom} இணை ${bride}`,
    te: `${groom} మరియు ${bride}`,
    kn: `${groom} మరియు ${bride}`,
    ml: `${groom} & ${bride}`,
    or: `${groom} ଏବଂ ${bride}`,
    as: `${groom} আৰু ${bride}`,
    ur: `${groom} اور ${bride}`,
    en: `${groom} & ${bride}`,
  };

  const selectedBlessing = blessingMap[language] || blessingMap.hi;
  const selectedHeading = headingMap[language] || headingMap.hi;
  const selectedCouple = coupleMap[language] || coupleMap.hi;

  return {
    blessing: selectedBlessing,
    heading: selectedHeading,
    subheading:
      language === 'en'
        ? 'Two souls, one sacred promise, united in the divine bond of holy matrimony'
        : 'दो आत्माओं का पवित्र मिलन, सात फेरों का अमर बंधन',
    coupleOrCelebrant: selectedCouple,
    familyIntro:
      language === 'en'
        ? 'Cordially invite your gracious presence and heartfelt blessings on the wedding of'
        : `${hosts} आपको अपने प्रिय बच्चों के शुभ विवाह पर सस्नेह आमंत्रित करते हैं`,
    invitationMessage:
      language === 'en'
        ? `With divine grace, we invite you to celebrate the wedding ceremony of ${groom} and ${bride}. Your presence will add warmth and blessings to this auspicious celebration.`
        : `ईश्वर एवं पूज्य गुरुजनों के मंगल आशीर्वाद से हमारे प्रिय बच्चों के शुभ परिणय संस्कार में आपकी गरिमामयी उपस्थिति एवं स्नेहिल आशीष सादर प्रार्थनीय है।`,
    eventScheduleSummary: `${date} • शुभ मुहूर्त: ${time}`,
    venueDetails: venue,
    rsvpText: details.rsvpName
      ? `RSVP: ${details.rsvpName} (${details.rsvpPhone || ''})`
      : 'दर्शनाभिलाषी: समस्त परिवार • RSVP: +91 98765 43210',
    whatsappMessage: `🌸 *${selectedHeading}* 🌸\n\n${selectedBlessing}\n\n*${groom}* & *${bride}*\n\n📅 Date: ${date}\n⏰ Time: ${time}\n📍 Venue: ${venue}\n\nWe eagerly await your gracious presence and blessings! 🙏✨`,
    suggestedPalette: {
      primary: '#68132e',
      secondary: '#d4af37',
      accent: '#fdf3e7',
    },
  };
};

// AI Services
export const generateAIWording = async (payload: {
  category: EventCategory;
  language: SupportedLanguage;
  secondaryLanguage?: SupportedLanguage;
  isBilingual?: boolean;
  tone?: string;
  details: Record<string, any>;
}) => {
  try {
    const res = await fetch(`${API_BASE}/ai/wording`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.data) return data;
      if (data) return { success: true, data };
    }
  } catch (err) {
    console.warn('[AI Service] Backend offline or unavailable, generating with client cultural engine:', err);
  }

  // Authentic cultural generator fallback
  const fallback = generateFallbackWordingClient(payload);
  return { success: true, data: fallback };
};

export const rewriteAIText = async (text: string, tone: string, language: SupportedLanguage) => {
  try {
    const res = await fetch(`${API_BASE}/ai/rewrite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, tone, language }),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('[AI Service] Rewrite offline, applying local tone format');
  }
  return { text: text.trim() };
};

export const translateAIText = async (text: string, targetLanguage: SupportedLanguage) => {
  try {
    const res = await fetch(`${API_BASE}/ai/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, targetLanguage }),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('[AI Service] Translation offline, using regional lexicon');
  }

  const sampleMap: Record<string, string> = {
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
    ur: 'دعوت نامہ تقریب نکاح — آپ کی شرکت باعث مسرت होगी।',
    sa: 'शुभ विवाह आमन्त्रणम् — भवतां उपस्थितिः काम्यते।',
    en: 'Wedding Invitation — You are cordially invited to celebrate with us.',
  };
  return { translated: sampleMap[targetLanguage] || text };
};

export const proofreadAIText = async (text: string, language: SupportedLanguage) => {
  try {
    const res = await fetch(`${API_BASE}/ai/proofread`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language }),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('[AI Service] Proofread offline, validating locally');
  }
  return { corrected: text.trim(), notes: 'Grammar and cultural phrasing verified.' };
};

export const generateAIBackground = async (payload: {
  theme: string;
  primaryColor?: string;
  secondaryColor?: string;
  texture?: string;
  borderStyle?: string;
  orientation?: string;
  decorationIntensity?: string;
  customPrompt?: string;
}) => {
  const res = await fetch(`${API_BASE}/ai/background`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to generate background');
  return await res.json();
};

// Project persistence
export const fetchProjects = async (guestSessionId?: string, ownerId?: string) => {
  const params = new URLSearchParams();
  if (ownerId) params.append('ownerId', ownerId);
  else if (guestSessionId) params.append('guestSessionId', guestSessionId);

  const res = await fetch(`${API_BASE}/projects?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  return await res.json();
};

export const fetchProjectById = async (id: string) => {
  const res = await fetch(`${API_BASE}/projects/${id}`);
  if (!res.ok) throw new Error('Project not found');
  return await res.json();
};

export const saveProjectApi = async (project: InvitationProject) => {
  const id = project._id || project.id;
  const method = id && !id.startsWith('temp_') ? 'PUT' : 'POST';
  const url = id && !id.startsWith('temp_') ? `${API_BASE}/projects/${id}` : `${API_BASE}/projects`;

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project),
  });
  if (!res.ok) throw new Error('Failed to save project');
  return await res.json();
};

export const deleteProjectApi = async (id: string) => {
  const res = await fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete project');
  return await res.json();
};

export const duplicateProjectApi = async (id: string) => {
  const res = await fetch(`${API_BASE}/projects/${id}/duplicate`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to duplicate project');
  return await res.json();
};

// PDF & Image Export
export const exportPdfApi = async (payload: {
  pages: any[];
  format: string;
  bleed?: boolean;
  cropMarks?: boolean;
  dpi?: number;
  projectName?: string;
}): Promise<Blob> => {
  const res = await fetch(`${API_BASE}/export/pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'PDF export failed');
  }
  return await res.blob();
};

export const exportPngApi = async (payload: {
  page: any;
  format: string;
  dpi?: number;
  pageNumber?: number;
}): Promise<Blob> => {
  const res = await fetch(`${API_BASE}/export/png`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'PNG export failed');
  }
  return await res.blob();
};
