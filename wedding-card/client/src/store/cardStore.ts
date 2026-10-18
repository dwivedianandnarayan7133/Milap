import { create } from 'zustand';
import {
  InvitationProject,
  CardPage,
  CardElement,
  PageFormat,
  SupportedLanguage,
  EventCategory,
  EventDetails,
  TemplateDefinition,
} from '../types/card';
import { CARD_TEMPLATES } from '../data/templates';
import { getLanguageByCode } from '../data/languages';
import { getMotifForLanguageAndReligion, getMotifForCategory } from '../data/motifs';
import { saveProjectApi } from '../services/api';

interface HistoryState {
  past: InvitationProject[];
  future: InvitationProject[];
}

interface CardStore {
  project: InvitationProject;
  activePageIndex: number;
  selectedElementId: string | null;
  zoom: number;
  showBleedGuide: boolean;
  showSafeGuide: boolean;
  showGridGuide: boolean;
  isSaving: boolean;
  isDirty: boolean;
  lastSavedAt: Date | null;
  history: HistoryState;

  // Guest Session
  guestSessionId: string;

  // Actions
  initNewProject: (category?: EventCategory, language?: SupportedLanguage, templateId?: string) => void;
  loadProject: (project: InvitationProject) => void;
  updateTitle: (title: string) => void;
  setCategory: (category: EventCategory) => void;
  setLanguage: (lang: SupportedLanguage, secondaryLang?: SupportedLanguage, isBilingual?: boolean) => void;
  setReligion: (religion: string) => void;
  setRegionalMotif: (motifKey: string, mantraText?: string) => void;
  setFormat: (format: PageFormat) => void;
  updateEventDetails: (details: Partial<EventDetails>) => void;
  setTheme: (theme: Partial<InvitationProject['theme']>) => void;

  // Page Actions
  setActivePageIndex: (index: number) => void;
  addPage: (role?: CardPage['role'], title?: string) => void;
  removePage: (index: number) => void;
  duplicatePage: (index: number) => void;
  reorderPages: (sourceIndex: number, destIndex: number) => void;
  updatePageBackground: (pageIndex: number, bg: Partial<CardPage['background']>) => void;

  // Element Actions
  selectElement: (id: string | null) => void;
  addElement: (element: Omit<CardElement, 'id' | 'zIndex'>) => void;
  updateElement: (pageIndex: number, elementId: string, updates: Partial<CardElement>) => void;
  removeElement: (pageIndex: number, elementId: string) => void;
  duplicateElement: (pageIndex: number, elementId: string) => void;
  reorderElementZ: (pageIndex: number, elementId: string, action: 'front' | 'back' | 'forward' | 'backward') => void;
  toggleElementLock: (pageIndex: number, elementId: string) => void;

  // Template Switching (Preserves user event details!)
  applyTemplate: (template: TemplateDefinition) => void;

  // View Controls
  setZoom: (zoom: number) => void;
  toggleBleedGuide: () => void;
  toggleSafeGuide: () => void;
  toggleGridGuide: () => void;

  // Undo / Redo
  undo: () => void;
  redo: () => void;
  recordHistory: () => void;

  // Persistence
  saveCurrentProject: () => Promise<void>;
}

// Generate or retrieve guest session
const getGuestSessionId = (): string => {
  let id = localStorage.getItem('vivahpatra_guest_id');
  if (!id) {
    id = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('vivahpatra_guest_id', id);
  }
  return id;
};

// Default initial project based on template 1
const createInitialProject = (
  category: EventCategory = 'wedding',
  language: SupportedLanguage = 'hi',
  templateId?: string
): InvitationProject => {
  const tpl =
    (templateId ? CARD_TEMPLATES.find((t) => t.id === templateId) : null) ||
    CARD_TEMPLATES.find((t) => t.category === category) ||
    CARD_TEMPLATES[0];

  const isCouple = ['wedding', 'engagement', 'ring_ceremony', 'reception', 'anniversary'].includes(category);

  return {
    id: `temp_${Date.now()}`,
    title: `${tpl.title} — ${category === 'wedding' ? 'Shubh Vivah' : tpl.title}`,
    category,
    format: tpl.format,
    language,
    isSaved: false,
    eventDetails: {
      category,
      primaryLanguage: language,
      isBilingual: false,
      ...(isCouple
        ? {
            brideName: 'अनन्या',
            groomName: 'आदित्य',
            brideParents: 'श्रीमती कविता एवं श्री दिनेश वर्मा',
            groomParents: 'श्रीमती संगीता एवं श्री राजेश शर्मा',
            weddingDate: '२८ नवम्बर २०२५',
            weddingTime: 'सायं ०७:०० बजे',
            muhuratTime: 'रात्रि ०८:१५ बजे',
            venueName: 'लीला पैलेस',
            venueAddress: 'पिछोला झील के किनारे, उदयपुर',
            venueCity: 'उदयपुर',
            rsvpName: 'राजेश शर्मा',
            rsvpPhone: '+91 98765 43210',
          }
        : {
            celebrantName:
              category === 'graduation'
                ? 'DR. AARAV VERMA'
                : category === 'retirement'
                ? 'श्री दिनेश कुमार शर्मा'
                : category === 'naming_ceremony'
                ? 'आयुष्मान आरव शर्मा'
                : category === 'mundan'
                ? 'चि. विवान शर्मा'
                : category === 'birthday'
                ? 'चि. आरव'
                : category === 'baby_shower'
                ? 'सौ. राधिका शर्मा'
                : '',
            venueName:
              category === 'graduation'
                ? 'Grand Banquet Hall, The Leela, Bengaluru'
                : category === 'retirement'
                ? 'ऑफिसर्स क्लब ऑडिटोरियम'
                : category === 'mundan'
                ? 'पवित्र गंगा तट'
                : 'भव्य सभागार',
            venueAddress:
              category === 'graduation'
                ? 'Bengaluru'
                : category === 'retirement'
                ? 'नई दिल्ली'
                : category === 'mundan'
                ? 'हरिद्वार'
                : 'सिटी सेंटर',
            venueCity:
              category === 'graduation'
                ? 'बेंगलुरु'
                : category === 'retirement'
                ? 'नई दिल्ली'
                : category === 'mundan'
                ? 'हरिद्वार'
                : 'जयपुर',
            weddingDate:
              category === 'graduation'
                ? 'Saturday, 20th December 2025'
                : category === 'retirement'
                ? 'बुधवार, ३१ दिसम्बर २०२५'
                : category === 'mundan'
                ? 'सोमवार, ०८ दिसम्बर २०२५'
                : '२८ नवम्बर २०२५',
            weddingTime: 'सायं ०६:३० बजे',
            rsvpName: 'शर्मा परिवार',
            rsvpPhone: '+91 99887 76655',
          }),
    },
    templateId: tpl.id,
    theme: { ...tpl.theme },
    pages: (() => {
      const initialPages = JSON.parse(JSON.stringify(tpl.defaultPages));
      if (initialPages.length > 0) {
        const coverPage = initialPages[0];
        const hasMilaap = coverPage.elements.some(
          (el: any) => el.id === 'el_cover_milaap' || (el.content && el.content.trim() === 'MILAAP')
        );
        if (!hasMilaap) {
          coverPage.elements.push({
            id: 'el_cover_milaap',
            type: 'text',
            content: 'MILAAP',
            fontFamily: '"Cinzel", serif',
            fontSize: 9,
            fontWeight: '600',
            color: '#D4AF37',
            align: 'center',
            lineHeight: 1.2,
            letterSpacing: 4,
            isFoil: true,
            x: 20,
            y: 91,
            width: 60,
            height: 4,
            rotation: 0,
            zIndex: 5,
            role: 'quote',
          });
        }
      }
      return initialPages;
    })(),
    exportSettings: {
      bleed: false,
      cropMarks: false,
      dpi: 300,
      colorSpace: 'rgb',
    },
  };
};

export const useCardStore = create<CardStore>((set, get) => ({
  project: createInitialProject(),
  activePageIndex: 0,
  selectedElementId: null,
  zoom: 100,
  showBleedGuide: false,
  showSafeGuide: false,
  showGridGuide: false,
  isSaving: false,
  isDirty: false,
  lastSavedAt: null,
  history: {
    past: [],
    future: [],
  },
  guestSessionId: getGuestSessionId(),

  recordHistory: () => {
    const { project, history } = get();
    set({
      history: {
        past: [...history.past.slice(-20), JSON.parse(JSON.stringify(project))],
        future: [],
      },
      isDirty: true,
    });
  },

  undo: () => {
    const { history, project } = get();
    if (!history.past.length) return;
    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, history.past.length - 1);

    set({
      project: previous,
      history: {
        past: newPast,
        future: [JSON.parse(JSON.stringify(project)), ...history.future],
      },
      isDirty: true,
    });
  },

  redo: () => {
    const { history, project } = get();
    if (!history.future.length) return;
    const next = history.future[0];
    const newFuture = history.future.slice(1);

    set({
      project: next,
      history: {
        past: [...history.past, JSON.parse(JSON.stringify(project))],
        future: newFuture,
      },
      isDirty: true,
    });
  },

  initNewProject: (category = 'wedding', language = 'hi', templateId) => {
    const newProj = createInitialProject(category, language, templateId);
    set({
      project: newProj,
      activePageIndex: 0,
      selectedElementId: null,
      history: { past: [], future: [] },
      isDirty: false,
    });
  },

  loadProject: (project) => {
    set({
      project: JSON.parse(JSON.stringify(project)),
      activePageIndex: 0,
      selectedElementId: null,
      history: { past: [], future: [] },
      isDirty: false,
    });
  },

  updateTitle: (title) => {
    get().recordHistory();
    set((state) => ({
      project: { ...state.project, title },
    }));
  },

  setCategory: (category) => {
    get().recordHistory();
    // 1. Automatically find the dedicated template for this milestone category
    const matchingTemplate =
      CARD_TEMPLATES.find((t) => t.category === category) || CARD_TEMPLATES[0];

    // 2. Apply this template's design, pages, background, theme, and elements
    get().applyTemplate(matchingTemplate);

    // 3. Persist the category choice in project and eventDetails
    set((state) => ({
      project: {
        ...state.project,
        category,
        eventDetails: {
          ...state.project.eventDetails,
          category,
        },
      },
    }));

    // 4. Re-apply current language so the new template reflects selected language, motifs, and sacred mantras
    const curLang = get().project.language;
    if (curLang) {
      get().setLanguage(
        curLang,
        get().project.secondaryLanguage,
        get().project.eventDetails.isBilingual
      );
    }
  },

  setLanguage: (lang, secondaryLang, isBilingual = false) => {
    get().recordHistory();
    const langInfo = getLanguageByCode(lang);
    const targetFont = langInfo?.scriptFont || '"Rozha One", "Noto Serif Devanagari", serif';

    // Sacred Mantras, Shlokas, Ayats & Verses by Language / Region / Religion
    const sacredMantrasMap: Record<string, string> = {
      hi: '॥ श्री गणेशाय नमः ॥\nवक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
      sa: '॥ मांगल्यं तन्तुनानेन मम जीवनहेतुना। कंठे बध्नामि सुभगे त्वं जीव शरदः शतम्॥',
      bn: '॥ ওঁ শ্রী শ্রী প্রজাপতয়ে नमঃ ॥\nযদেতদ্ধৃদয়ং তব তদেতদ্ধৃদয়ং মম। যদিদং হৃদয়ং মম তদেতদ্ধৃদয়ং তব॥',
      mr: '॥ श्री गणेशाय नमः ॥\nमंगलम भगवान विष्णु मंगलम गरुडध्वज। मंगलम पुण्डरीकाक्ष मंगलाय तनो हरि॥',
      gu: '॥ શ્રી ગણેશાય નમઃ ॥ શુભ લાભ ॥\nમાંગલ્યં તન્તુનાનેન મમ જીવનહેતુના। કંઠે બધ્નામિ સુભગ્યે ત્વં જીવ શરદઃ શતમ્॥',
      pa: '॥ ੴ ਸ੍ਰੀ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹਿ ॥\nਲਖ ਖੁਸੀਆ ਪਾਤਿਸਾਹੀਆ ਜੇ ਸਤਿਗੁਰੁ ਨਦਰਿ ਕਰੇਇ ॥',
      ta: '॥ சுபமுகூர்த்த அழைப்பிதழ் ॥\nமாங்கல்யம் தந்துனானேன மம ஜீவனஹேதுனா। கண்டே பத்னாமி சுபகே சஞ்சீவ சரதஃ சதம்॥',
      te: '॥ శ్రీ విఘ్నేశ్వరాయ నమః ॥\nమాంగల్యం తంతునానేన మమ జీవనహేతునా। కంఠే బధ్నామి సుభగే త్వం జీవ శరదః శతమ్॥',
      kn: '॥ ಶ್ರೀ ಗಣೇಶಾಯ ನಮಃ ॥ ಶುಭ ಲಗ್ನ ॥\nಮಾಂಗಲ್ಯಂ ತಂತು ನಾನೇನ ಮಮ ಜೀವನ ಹೇತುನಾ। ಕಂಠೇ ಬಧ್ನಾಮಿ ಸುಭಗೇ ತ್ವಂ ಜೀವ ಶರದಃ ಶತಮ್॥',
      ml: '॥ സർവ്വമംഗള മാംഗല്യേ ശിവേ സർവ്വാർത്ഥ സാധികേ ॥\nശരണ്യേ ത്ര്യംബകേ ഗൗരി നാരായണി നമോസ്തുതേ॥',
      or: '॥ ଶ୍ରୀ ଗଣେଶାୟ ନମଃ ॥\nଯଦେତତ୍ ହୃଦୟଂ ତବ ତଦେତତ୍ ହୃଦୟଂ ମମ। ଯଦିଦଂ ହୃଦୟଂ ମମ ତଦେତତ୍ ହୃଦୟଂ ତବ॥',
      as: '॥ শ্ৰী শ্ৰী প্ৰজাপতয়ে নমঃ ॥\nসৰ্ব্বমংগল মাংগল্যে শিৱে সৰ্বাৰ্থ সাধিকে। শৰণ্যে ত্ৰ্যম্বকে গৌৰী নাৰায়ণী নমোহস্তুতে॥',
      ur: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nوَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
      kas: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nوَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً • تقریبِ خاندر',
      bho: '॥ श्री गणेशाय नमः ॥ हर हर महादेव ॥\nबाबा विश्वनाथ आ माता अन्नपूर्णा के कृपा से पावन बियाह उत्सव॥',
      mai: '॥ श्री गणेशाय नमः ॥ जय जानकी रमण ॥\nमिथिलाक पावन परिणय आमन्त्रण, प्रभु श्रीराम व जानकीजीक शुभाशीर्वाद॥',
      raj: '॥ श्री गणेशाय नमः ॥ खम्मा घणी सा ॥\nविघ्न हरण मंगल करण, श्री गणपति महाराज। प्रथम निमंत्रण आपको, पूरण करियो काज॥',
      kok: '॥ श्री गणेशाय नमः ॥ सस्नेह आमंत्रण\nमंगलम भगवान विष्णु मंगलम गरुडध्वज॥',
      sd: 'بسم الله الرحمن الرحيم\n॥ ਝੂਲੇਲਾਲ ਜੀ ਕਿਰਪਾ ਨਾਲ ਸ਼ੁਭ ਸ਼ਾਦੀ ॥',
      sat: '॥ ᱡᱚᱦᱟᱨ ᱢᱟᱨᱟᱝ ᱵᱩᱨᱩ ᱟᱹᱥᱤᱥ ᱛᱮ ॥\nᱡᱟᱦᱮᱨ ᱟᱭᱳ ᱟᱨ ᱢᱟᱨᱟᱝ ᱵᱩᱨᱩᱣᱟᱜ ᱫᱟᱭᱟ ᱛᱮ ᱥᱟᱹᱜᱩᱱ ᱵᱟᱯᱞᱟ ᱱᱮᱣᱛᱟ॥',
      mni: '॥ ꯂꯨꯍꯣꯡꯕꯒꯤ ꯄꯥꯎ • ꯇꯔꯥꯝꯅꯥ ꯑꯣꯛꯆꯔꯤ ॥\nꯏꯃꯨꯡ ꯑꯅꯤꯒꯤ ꯅꯨꯡꯁꯤ ꯄꯨꯟꯁꯤꯟꯕ',
      chg: '॥ श्री गणेशाय नमः ॥\nछत्तीसगढ़ महतारी के कृपा ले दु परिवार के पावन मिलन',
      en: '“What God has joined together, let no one separate.” — Mark 10:9\nTwo souls with but a single thought, two hearts that beat as one.',
    };

    // Specific Sacred Mantras for Ring Ceremony
    const ringCeremonyMantrasMap: Record<string, string> = {
      hi: '॥ श्री गणेशाय नमः ॥\nदो दिलों के पावन बंधन एवं सगाई की शुभ वेला',
      sa: '॥ श्री गणेशाय नमः ॥\nमुद्रिका बन्धनम् — प्रीतिपूर्वकं पावन सगाई उत्सवः',
      bn: '॥ ওঁ শ্রী শ্রী প্রজাপতয়ে नमঃ ॥\nশুভ বাগদান ও আংটি বদল — দুটি হৃদয়ের মধুর মেলবন্ধন',
      mr: '॥ श्री गणेशाय नमः ॥ साखरपुडा ॥\nदोन जीवांचे रेशीमगाठ व साखरपुड्याचे सस्नेह निमंत्रण',
      gu: '॥ શ્રી ગણેશાય નમઃ ॥ શુભ સગાઈ ॥\nબે પરિવારોનું હેતભર્યું મિલન અને વીંટી પહેરાવવાનો મંગળ ઉત્સવ',
      pa: '॥ ੴ ਸ੍ਰੀ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹਿ ॥\nਸਗਾਈ ਤੇ ਮੁੰਦਰੀ ਪਹਿਨਾਉਣ ਦਾ ਸ਼ੁਭ ਸਮਾਗਮ',
      ta: '॥ சுபமுகூர்த்த நல்வரவு ॥\nநிச்சயதார்த்தம் & மோதிரம் மாற்றும் மங்கள விழா',
      te: '॥ శ్రీ విఘ్నేశ్వరాయ నమః ॥\nనిశ్చితార్థం మరియు ఉంగరాల వేడుక ఆహ్వానం',
      kn: '॥ ಶ್ರೀ ಗಣೇಶಾಯ ನಮಃ ॥\nನಿಶ್ಚಿತಾರ್ಥ ಮತ್ತು ಉಂಗುರ ಬದಲಾವಣೆ ಶುಭ ಸಮಾರಂಭ',
      ml: '॥ മംഗളകരമായ വിവാഹനിശ്ചയം ॥\nമോതിരം മാറ്റൽ ചടങ്ങിലേക്ക് സ്നേഹപൂർവ്വം സ്വാഗതം',
      or: '॥ ଶ୍ରୀ ଗଣେଶାୟ ନମଃ ॥\nନିର୍ବନ୍ଧ ଓ ମୁଦ୍ରିକା ପ୍ରଦାନ ଶୁଭ ଉତ୍ସବ',
      as: '॥ শ্ৰী শ্ৰী প্ৰজাপতয়ে নমঃ ॥\nমঙ্গলাচৰণ আৰু আঙুঠি পিন্ধোৱা পৱিত্ৰ পৰ্ব',
      ur: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nدعوت نامہ تقریب منگنی و رسم انگشتری',
      en: '“A promise to love, honor, and cherish for a lifetime.”\nRing Exchange & Engagement Celebration',
    };

    // Function to get appropriate ceremony title by category and language
    const getCategoryHeading = (cat: string, l: string): string => {
      if (cat === 'ring_ceremony') {
        const titles: Record<string, string> = {
          hi: 'सगाई एवं अंगूठी रस्म निमंत्रण',
          sa: 'सगाई एवं मुद्रिका रस्म आमन्त्रणम्',
          bn: 'বাগদান ও আংটি বদল নিমন্ত্রণ',
          mr: 'साखरपुडा व अंगठी सोहळा',
          gu: 'માંગલિક સગાઈ તથા મુદ્રિકા વિધિ',
          pa: 'ਸ਼ਗਨ ਤੇ ਅੰਗੂਠੀ ਸਮਾਰੋਹ',
          ta: 'நிச்சயதார்த்த அழைப்பிதழ்',
          te: 'నిశ్చితార్థ శుభ ఆహ్వానం',
          kn: 'ನಿಶ್ಚಿತಾರ್ಥ ಆಮಂತ್ರಣ ಪತ್ರಿಕೆ',
          ml: 'വിവാഹനിശ്ചയ ക്ഷണക്കത്ത്',
          or: 'ନିର୍ବନ୍ଧ ନିମନ୍ତ୍ରଣ ପତ୍ର',
          as: 'মঙ্গলাচৰণ নিমন্ত্ৰণী পত্ৰ',
          ur: 'دعوت نامہ تقریب منگنی',
          en: 'Ring Ceremony & Engagement',
        };
        return titles[l] || titles.hi;
      }
      if (cat === 'naming_ceremony') {
        const titles: Record<string, string> = {
          hi: 'शुभ नामकरण संस्कार निमंत्रण',
          bn: 'নামকরণ ও শুভ অন্নপ্রাশন',
          mr: 'शुभ बारसे व नामकरण सोहळा',
          gu: 'શુભ નામકરણ સંસ્કાર',
          pa: 'ਨਾਮਕਰਨ ਸਮਾਗਮ',
          ta: 'பெயர் சூட்டு விழா அழைப்பிதழ்',
          te: 'నామకరణ మహోత్సవ ఆహ్వానం',
          kn: 'ನಾಮಕರಣ ಮಹೋತ್ಸವ',
          en: 'Cradle & Naming Ceremony',
        };
        return titles[l] || titles.hi;
      }
      if (cat === 'housewarming') {
        const titles: Record<string, string> = {
          hi: 'शुभ गृह प्रवेश निमंत्रण',
          bn: 'গৃহপ্রবেশ উৎসব নিমন্ত্রণ',
          mr: 'शुभ वास्तूशांती व गृहप्रवेश',
          gu: 'માંગલિક વાસ્તુપૂજન તથા ગૃહપ્રવેશ',
          pa: 'ਗ੍ਰਹਿ ਪ੍ਰਵੇਸ਼ ਸਮਾਗਮ',
          ta: 'கிரகப்பிரவேச அழைப்பிதழ்',
          te: 'గృహప్రవేశ ఆహ్వాన పత్రిక',
          kn: 'ಗೃಹಪ್ರವೇಶ ಆಮಂತ್ರಣ ಪತ್ರಿಕೆ',
          en: 'Housewarming Ceremony',
        };
        return titles[l] || titles.hi;
      }
      if (cat === 'baby_shower') {
        const titles: Record<string, string> = {
          hi: 'गोद भराई एवं सीमंतोन्नयन संस्कार',
          bn: 'শুভ সাধভক্ষণ অনুষ্ঠান',
          mr: 'डोहळे जेवण सस्नेह निमंत्रण',
          gu: 'શ્રીમંત પ્રસંગ (ખોળો ભરવો)',
          en: 'Baby Shower & Srimantham',
        };
        return titles[l] || titles.hi;
      }
      if (cat === 'anniversary') {
        const titles: Record<string, string> = {
          hi: 'वैवाहिक वर्षगांठ उत्सव निमंत्रण',
          mr: 'लग्नाचा वाढदिवस सस्नेह निमंत्रण',
          en: 'Wedding Anniversary Celebration',
        };
        return titles[l] || titles.hi;
      }
      if (cat === 'mundan') {
        const titles: Record<string, string> = {
          hi: 'शुभ मुंडन एवं चूडाकर्म संस्कार',
          en: 'Sacred Mundan Ceremony',
        };
        return titles[l] || titles.hi;
      }
      if (cat === 'reception') {
        const titles: Record<string, string> = {
          hi: 'शुभ प्रीतिभोज एवं रिसेप्शन',
          en: 'Wedding Reception & Banquet',
        };
        return titles[l] || titles.hi;
      }
      if (cat === 'birthday') {
        const titles: Record<string, string> = {
          hi: 'शुभ जन्मोत्सव निमंत्रण',
          en: 'Birthday Celebration Invitation',
        };
        return titles[l] || titles.hi;
      }
      if (cat === 'religious_ceremony') {
        const titles: Record<string, string> = {
          hi: 'श्री सत्यनारायण कथा एवं हवन',
          en: 'Sacred Puja & Havan Ceremony',
        };
        return titles[l] || titles.hi;
      }
      if (cat === 'graduation') {
        const titles: Record<string, string> = {
          hi: 'दीक्षांत एवं सफलता समारोह',
          en: 'Graduation & Success Gala',
        };
        return titles[l] || titles.hi;
      }
      if (cat === 'retirement') {
        const titles: Record<string, string> = {
          hi: 'स्वर्ण संध्या एवं अभिनंदन समारोह',
          en: 'Retirement Felicitation & Honor',
        };
        return titles[l] || titles.hi;
      }

      // Default to Wedding heading map
      const weddingHeadings: Record<string, string> = {
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
        kas: 'دعوت نامہ تقریب نکاح',
        bho: 'शुभ विवाह नेवता',
        mai: 'शुभ विवाह आमंत्रण',
        raj: 'शुभ ब्याव रो नूतौ',
        kok: 'शुभ लग्न आमंत्रण',
        sd: 'شاديءَ جو دعوت نامو',
        sat: 'ᱵᱟᱯᱞᱟ ᱱᱮᱣᱛᱟ',
        mni: 'লুহোঙবগী পাউজেল',
        chg: 'शुभ बिहा नेवता',
        en: 'Wedding Invitation',
      };
      return weddingHeadings[l] || 'शुभ विवाह निमंत्रण';
    };

    const connectorMap: Record<string, string> = {
      hi: 'संग',
      sa: 'संग',
      bn: 'ও',
      mr: 'व',
      gu: 'સંગ',
      pa: 'ਸੰਗ',
      ta: 'இணை',
      te: 'మరియు',
      kn: 'ಮತ್ತು',
      ml: '&',
      or: 'ଏବଂ',
      as: 'আৰু',
      ur: 'اور',
      kas: 'اور',
      bho: 'संग',
      mai: 'संग',
      raj: 'संग',
      kok: 'आनी',
      sd: '۽',
      sat: 'ᱟᱨ',
      mni: 'অমাশুং',
      chg: 'संग',
      en: 'with',
    };

    const hostsMap: Record<string, string> = {
      hi: 'श्रीमती एवं श्री राजेश शर्मा\nसस्नेह आमंत्रित करते हैं',
      sa: 'श्रीमती एवं श्री राजेश शर्मा\nसस्नेहं निमन्त्रयतः',
      bn: 'শ্রীমতি ও শ্রী রাজেশ শর্মা\nসাদরে আপনাকে আমন্ত্রণ জানাচ্ছেন',
      mr: 'सौ. व श्री राजेश शर्मा\nआपणांस सस्नेह निमंत्रण देतात',
      gu: 'શ્રીમતી અને શ્રી રાજેશ શર્મા\nસ્નેહપૂર્વક આમંત્રણ પાઠવે છે',
      pa: 'ਸ਼੍ਰੀਮਤੀ ਅਤੇ ਸ਼੍ਰੀ ਰਾਜੇਸ਼ ਸ਼ਰਮਾ\nਆਪ ਜੀ ਨੂੰ ਨਿੱਘਾ ਸੱਦਾ ਦਿੰਦੇ ਹਨ',
      ta: 'திருமதி & திரு ராஜேஷ் சர்மா\nஅன்புடன் அழைக்கும் திருமண அழைப்பிதழ்',
      te: 'శ్రీమతి మరియు శ్రీ రాజేష్ శర్మ\nసగౌరవంగా ఆహ్వానించుచున్నారు',
      kn: 'ಶ್ರೀಮತಿ ಮತ್ತು ಶ್ರೀ ರಾಜೇಶ್ ಶರ್ಮ\nಆದರದಿಂದ ಆಹ್ವಾನಿಸುತ್ತಾರೆ',
      ml: 'ശ്രീമതിയും ശ്രീ രാജേഷ് ശർമ്മയും\nസ്നേഹപൂർവ്വം ക്ഷണിക്കുന്നു',
      or: 'ଶ୍ରୀମତୀ ଏବଂ ଶ୍ରୀ ରାଜେଶ ଶର୍ମା\nଆପଣଙ୍କୁ ସସ୍ନେହ ନିମନ୍ତ୍ରଣ କରୁଛନ୍ତି',
      as: 'শ্ৰীমতী আৰু শ্ৰী ৰাজেশ শৰ্মাই\nসাদৰেৰে নিমন্ত্ৰণ জনাইছে',
      ur: 'محترمہ و محترم راجیش شرما\nآپ کو شرکت کی پرخلوص دعوت دیتے ہیں',
      bho: 'श्रीमती आ श्री राजेश शर्मा\nसस्नेह नेवता देत बानी',
      mai: 'श्रीमती आ श्री राजेश शर्मा\nसस्नेह आमंत्रण दैत छथि',
      raj: 'श्रीमती अर श्री राजेश शर्मा\nसस्नेह नूतौ देवै है',
      sat: 'ᱥᱚᱨᱢᱟ ᱜᱷᱟᱨᱚᱸᱡᱽ ᱯᱟᱦᱴᱟ ᱠᱷᱚᱱ\nᱥᱟᱹᱜᱩᱱ ᱱᱮᱣᱛᱟ',
      en: 'Mrs. & Mr. Rajesh Sharma\ncordially invite you to celebrate the occasion with',
    };

    const coupleDetailedMap: Record<string, string> = {
      hi: 'चिरंजीव आदित्य\n(सुपुत्र: श्रीमती संगीता एवं श्री राजेश शर्मा)\n\nसंग\n\nआयुष्मती अनन्या\n(सुपुत्री: श्रीमती कविता एवं श्री दिनेश वर्मा)',
      sa: 'आयुष्मान् आदित्यः\n(सुपुत्रः: श्रीमती संगीता एवं श्री राजेश शर्मा)\n\nसंग\n\nआयुष्मती अनन्या\n(सुपुत्री: श्रीमती कविता एवं श्री दिनेश वर्मा)',
      bn: 'চিরঞ্জীব আদিত্য\n(সুপুত্র: শ্রীমতি সঙ্গীতা ও শ্রী রাজেশ শর্মা)\n\nও\n\nআয়ুষ্মতী অনন্যা\n(সুপুত্রী: শ্রীমতি কবিতা ও শ্রী দীনেশ বর্মা)',
      mr: 'चि. आदित्य\n(सुपुत्र: सौ. संगीता व श्री राजेश शर्मा)\n\nव\n\nचि.सौ.कां. अनन्या\n(सुपुत्री: सौ. कविता व श्री दिनेश वर्मा)',
      gu: 'ચિરંજીવી આદિત્ય\n(સુપુત્ર: શ્રીમતી સંગીતા અને શ્રી રાજેશ શર્મા)\n\nસંગ\n\nઆયુષ્મતી અનન્યા\n(સુપુત્રી: શ્રીમતી કવિતા અને શ્રી દિનેશ વર્મા)',
      pa: 'ਕਾਕਾ ਆਦਿਤਿਆ\n(ਸਪੁੱਤਰ: ਸ਼੍ਰੀਮਤੀ ਸੰਗੀਤਾ ਅਤੇ ਸ਼੍ਰੀ ਰਾਜੇਸ਼ ਸ਼ਰਮਾ)\n\nਸੰਗ\n\nਬੀਬਾ ਅਨੰਨਿਆ\n(ਸਪੁੱਤਰੀ: ਸ਼੍ਰੀਮਤੀ ਕਵਿਤਾ ਅਤੇ ਸ਼੍ਰੀ ਦਿਨੇਸ਼ ਵਰਮਾ)',
      ta: 'செல்வன் ஆதித்யா\n(குமாரன்: திருமதி சங்கீதா & திரு ராஜேஷ் சர்மா)\n\nஇணை\n\nசெல்வி அனன்யா\n(குமாரி: திருமதி கவிதா & திரு தினேஷ் வர்மா)',
      te: 'చిరంజీవి ఆదిత్య\n(సుపుత్రుడు: శ్రీమతి సంగీత & శ్రీ రాజేష్ శర్మ)\n\nమరియు\n\nచిరంజీవి సౌభాగ్యవతి అనన్య\n(సుపుత్రిక: శ్రీమతి కవిత & శ్రీ దినేష్ వర్మ)',
      kn: 'ಚಿರಂಜೀವಿ ಆದಿತ್ಯ\n(ಸುಪುತ್ರ: ಶ್ರೀಮತಿ ಸಂಗೀತಾ ಮತ್ತು ಶ್ರೀ ರಾಜೇಶ್ ಶರ್ಮ)\n\nಮತ್ತು\n\nಸೌಭಾಗ್ಯವತಿ ಅನನ್ಯ\n(ಸುಪುತ್ರಿ: ಶ್ರೀಮತಿ ಕವಿತಾ ಮತ್ತು ಶ್ರೀ ದಿನೇಶ್ ವರ್ಮ)',
      ml: 'ചിരഞ്ജീവി ആദിത്യ\n(പുത്രൻ: ശ്രീമതി സംഗീത & ശ്രീ രാജേഷ് ശർമ്മ)\n\n&\n\nആയുഷ്മതി അനന്യ\n(പുത്രി: ശ്രീമതി കവിത & ശ്രീ ദിനേശ് വർമ്മ)',
      or: 'ଚିରଞ୍ଜୀବ ଆଦିତ୍ୟ\n(ସୁପୁତ୍ର: ଶ୍ରୀମତୀ ସଙ୍ଗୀତା ଏବଂ ଶ୍ରୀ ରାଜେଶ ଶର୍ମା)\n\nଏବଂ\n\nଆୟୁଷ୍ମତୀ ଅନନ୍ୟା\n(ସୁପୁତ୍ରୀ: ଶ୍ରୀମତୀ କବିତା ଏବଂ ଶ୍ରୀ ଦିନେଶ ବର୍ମା)',
      as: 'চিৰঞ্জীৱ আদিত্য\n(সুপুত্ৰ: শ্ৰীমতী সঙ্গীতা আৰু শ্ৰী ৰাজেশ শৰ্মা)\n\nআৰু\n\nআয়ুষ্মতী অনন্যা\n(সুপুত্ৰী: শ্ৰীমতী কবিতা আৰু শ্ৰী দিনেশ বৰ্মা)',
      ur: 'عزیز مکرم آدتیہ\n(فرزند: محترمہ سنگیتا و جناب راجیش شرما)\n\nاور\n\nعزیزہ اننیا\n(دختر: محترمہ کویتا و جناب دنیش ورما)',
      sat: 'ᱟᱫᱤᱛᱭᱚ\n(ᱦᱚᱯᱚᱱ: ᱥᱚᱝᱜᱤᱛᱟ ᱟᱨ ᱨᱟᱡᱮᱥ ᱥᱚᱨᱢᱟ)\n\nᱟᱨ\n\nᱟᱱᱚᱱᱭᱟ\n(ᱦᱚᱯᱚᱱ ᱮᱨᱟ: ᱠᱚᱵᱤᱛᱟ ᱟᱨ ᱫᱤᱱᱮᱥ ᱵᱚᱨᱢᱟ)',
      en: 'Aditya\n(Son of Mrs. Sangeeta & Mr. Rajesh Sharma)\n\nwith\n\nAnanya\n(Daughter of Mrs. Kavita & Mr. Dinesh Verma)',
    };

    const coupleNames3LineMap: Record<string, string> = {
      hi: 'आदित्य\nसंग\nअनन्या',
      sa: 'आदित्यः\nसंग\nअनन्या',
      bn: 'আদিত্য\nও\nঅনন্যা',
      mr: 'आदित्य\nव\nअनन्या',
      gu: 'આદિત્ય\nસંગ\nઅનન્યા',
      pa: 'ਆਦਿਤਿਆ\nਸੰਗ\nਅਨੰਨਿਆ',
      ta: 'ஆதித்யா\nஇணை\nஅனன்யா',
      te: 'ఆదిత్య\nమరియు\nఅనన్య',
      kn: 'ಆದಿತ್ಯ\nಮತ್ತು\nಅನನ್ಯ',
      ml: 'ആദിത്യ\n&\nഅനന്യ',
      or: 'ଆଦିତ୍ୟ\nଏବଂ\nଅନନ୍ୟା',
      as: 'আদিত্য\nআৰু\nঅনন্যা',
      ur: 'آدتیہ\nاور\nاننیا',
      sat: 'ᱟᱫᱤᱛᱭᱚ\nᱟᱨ\nᱟᱱᱚᱱᱭᱟ',
      en: 'Aditya\nwith\nAnanya',
    };

    const venueDateMap: Record<string, string> = {
      hi: 'दिन: शुक्रवार, २८ नवम्बर २०२५\nशुभ मुहूर्त: रात्रि ०८:१५ बजे\nस्थान: लीला पैलेस, पिछोला झील के किनारे, उदयपुर (राज.)',
      sa: 'दिनम्: भृगुवासरः, २८ नवम्बर २०२५\nशुभ मुहूर्तः: रात्रि ०८:१५ वादने\nस्थानम्: लीला प्रासादः, उदयपुरम्',
      bn: 'দিন: শুক্রবার, ২৮ নভেম্বর ২০২৫\nশুভ মুহূর্ত: রাত্রি ০৮:১৫ ঘটিকায়\nস্থান: লীলা প্যালেস, উদয়পুর',
      mr: 'वार: शुक्रवार, २८ नोव्हेंबर २०२५\nशुभ मुहूर्त: रात्री ०८:१५ वाजता\nस्थळ: लीला पॅलेस, उदयपूर',
      gu: 'વાર: શુક્રવાર, ૨૮ નવેમ્બર ૨૦૨૫\nશુભ મુહૂર્ત: રાત્રે ૦૮:૧૫ કલાકે\nસ્થળ: લીલા પેલેસ, ઉદયપુર',
      pa: 'ਦਿਨ: ਸ਼ੁੱਕਰਵਾਰ, 28 ਨਵੰਬਰ 2025\nਸ਼ੁਭ ਮਹੂਰਤ: ਰਾਤ 08:15 ਵਜੇ\nਸਥਾਨ: ਲੀਲਾ ਪੈਲੇਸ, ਉਦੈਪੁਰ',
      ta: 'நாள்: வெள்ளி, 28 நவம்பர் 2025\nசுப முகூர்த்தம்: இரவு 08:15 மணி\nஇடம்: லீலா பேலஸ், உதய்பூர்',
      te: 'తేదీ: శుక్రవారం, 28 నవంబర్ 2025\nశుభ ముహూర్తం: రాత్రి 08:15 గంటలకు\nవేదిక: లీలా ప్యాలెస్, ఉదయపూర్',
      kn: 'ದಿನಾಂಕ: ಶುಕ್ರವಾರ, 28 ನವೆಂಬರ್ 2025\nಶುಭ ಮುಹೂರ್ತ: ರಾತ್ರಿ 08:15 ಗಂಟೆಗೆ\nಸ್ಥಳ: ಲೀಲಾ ಪ್ಯಾಲೇಸ್, ಉದಯಪುರ',
      ml: 'തിയതി: വെള്ളിയാഴ്ച, 28 നവംബർ 2025\nശുഭ മുഹൂർത്തം: രാത്രി 08:15 മണിക്ക്\nസ്ഥലം: ലീല പാലസ്, ഉദയ്പൂർ',
      or: 'ଦିନ: ଶୁକ୍ରବାର, ୨୮ ନଭେମ୍ବର ୨୦୨୫\nଶୁଭ ମୁହୂର୍ତ୍ତ: ରାତ୍ରି ୦୮:୧୫ ଘଟିକା\nସ୍ଥାନ: ଲୀଳା ପ୍ୟାଲେସ୍, ଉଦୟପୁର',
      as: 'দিন: শুকুৰবাৰ, ২৮ নৱেম্বৰ ২০২৫\nশুভ মুহূৰ্ত: নিશા ০৮:১৫ বজাত\nস্থান: লীলা পেলেচ, উদয়পুৰ',
      ur: 'بتاریخ: جمعہ، 28 نومبر 2025\nبوقت: شب 08:15 بجے\nمقام: لیلا پیلس، ادے پور',
      sat: 'ᱢᱟᱹᱦᱤᱛ: ᱥᱩᱠᱨᱩᱵᱟᱹᱨ, ᱒᱘ ᱱᱚᱵᱷᱮᱢᱵᱚᱨ ᱒᱐᱒᱕\nᱴᱷᱟᱶ: ᱞᱤᱞᱟ ᱯᱮᱞᱮᱥ, ᱩᱫᱚᱭᱯᱩᱨ',
      en: 'Friday, 28th November 2025\nAuspicious Muhurat: 08:15 PM\nVenue: The Leela Palace, Udaipur',
    };

    const coverDateMap: Record<string, string> = {
      hi: '२८ नवम्बर २०२५ • उदयपुर, राजस्थान',
      sa: '२८ नवम्बर २०२५ • उदयपुर, राजस्थान',
      bn: '২৮ নভেম্বর ২০২৫ • উদয়পুর, রাজস্থান',
      mr: '२८ नोव्हेंबर २०२५ • उदयपूर, महाराष्ट्र',
      gu: '૨૮ નવેમ્બર ૨૦૨૫ • ઉદયપુર, રાજસ્થાન',
      pa: '28 ਨਵੰਬਰ 2025 • ਉਦੈਪੁਰ, ਰਾਜਸਥਾਨ',
      ta: '28 நவம்பர் 2025 • உதய்பூர், ராஜஸ்தான்',
      te: '28 నవంబర్ 2025 • ఉదయపూర్, రాజస్థాన్',
      kn: '28 ನವೆಂಬರ್ 2025 • ಉದಯಪುರ, ರಾಜಸ್ಥಾನ',
      ml: '28 നവംബർ 2025 • ഉദയ്പൂർ, രാജസ്ഥാൻ',
      or: '୨୮ ନଭେମ୍ବର ୨୦୨୫ • ଉଦୟପୁର, ରାଜସ୍ଥାନ',
      as: '২৮ নৱেম্বৰ ২০২৫ • উদয়পুৰ, ৰাজস্থান',
      ur: '28 نومبر 2025 • ادے پور، راجستھان',
      sat: '᱒᱘ ᱱᱚᱵᱷᱮᱢᱵᱚᱨ ᱒᱐᱒᱕ • ᱩᱫᱚᱭᱯᱩᱨ',
      en: '28th November 2025 • Udaipur, Rajasthan',
    };

    const rsvpMap: Record<string, string> = {
      hi: 'दर्शनाभिलाषी: समस्त शर्मा एवं भारद्वाज परिवार\nRSVP: +91 98765 43210',
      sa: 'दर्शनाभिलाषी: समस्त शर्मा एवं भारद्वाज परिवारः\nRSVP: +91 98765 43210',
      bn: 'দর্শনাভিলাষী: সমস্ত শর্মা ও ভরদ্বাজ পরিবার\nRSVP: +91 98765 43210',
      mr: 'स्नेही: समस्त शर्मा व भारद्वाज परिवार\nRSVP: +91 98765 43210',
      gu: 'દર્શનાભિલાષી: સમસ્ત શર્મા અને ભારદ્વાજ પરિવાર\nRSVP: +91 98765 43210',
      pa: 'ਦਰਸ਼ਨਾਭਿਲਾਸ਼ੀ: ਸਮੂਹ ਸ਼ਰਮਾ ਅਤੇ ਭਾਰਦਵਾਜ ਪਰਿਵਾਰ\nRSVP: +91 98765 43210',
      ta: 'அன்புடன் அழைக்கும் சர்மா & பரத்வாஜ் குடும்பத்தினர்\nRSVP: +91 98765 43210',
      te: 'ఆహ్వానించువారు: శర్మ & భరద్వాజ్ కుటుంబ సభ్యులు\nRSVP: +91 98765 43210',
      kn: 'ಆಹ್ವಾನಿಸುವವರು: ಶರ್ಮ ಮತ್ತು ಭಾರದ್ವಾಜ್ ಕುಟುಂಬ\nRSVP: +91 98765 43210',
      ml: 'സ്നേഹത്തോടെ: ശർമ്മ & ഭരദ്വാജ് കുടുംബം\nRSVP: +91 98765 43210',
      or: 'ନିମନ୍ତ୍ରକ: ଶ୍ରୀ ଶର୍ମା ଏବଂ ଭାରଦ୍ୱାଜ ପରିବାର\nRSVP: +91 98765 43210',
      as: 'নিমন্ত্ৰক: শৰ্মা আৰু ভৰদ্বাজ পৰিয়াল\nRSVP: +91 98765 43210',
      ur: 'چشم براہ: جملہ شرما و بھاردواج خاندان\nRSVP: +91 98765 43210',
      sat: 'ᱱᱮᱣᱛᱟᱭᱤᱡ: ᱥᱚᱨᱢᱟ ᱟᱨ ᱵᱷᱟᱨᱚᱫᱣᱟᱡᱽ ᱜᱷᱟᱨᱚᱸᱡᱽ\nRSVP: +91 98765 43210',
      en: 'Best Compliments: Sharma & Bhardwaj Family\nRSVP: +91 98765 43210',
    };

    const targetConnector = connectorMap[lang] || 'संग';

    set((state) => {
      const currentCat = state.project.category || 'wedding';
      const isCoupleCat = ['wedding', 'engagement', 'ring_ceremony', 'reception', 'anniversary'].includes(currentCat);

      // Select sacred mantra according to category & language
      const targetBlessing =
        currentCat === 'ring_ceremony'
          ? (ringCeremonyMantrasMap[lang] || ringCeremonyMantrasMap.hi)
          : (sacredMantrasMap[lang] || langInfo?.customaryGreeting || sacredMantrasMap.hi);

      // Select category heading
      const targetHeading = getCategoryHeading(currentCat, lang);

      // Determine appropriate motif for the region, religion, and category
      const targetMotifKey =
        (currentCat === 'ring_ceremony' || currentCat === 'engagement')
          ? (lang === 'pa' ? 'ik_onkar' : (lang === 'ur' || lang === 'kas') ? 'islamic_crescent' : 'diamond_rings')
          : (currentCat === 'naming_ceremony' ? 'bal_gopal_cradle' :
             (currentCat === 'mundan' || currentCat === 'religious_ceremony') ? 'sacred_hawan' :
             (currentCat === 'graduation' ? 'lotus' :
              (currentCat === 'retirement' ? 'diya' :
               getMotifForLanguageAndReligion(lang))));

      const updatedPages = state.project.pages.map((page) => ({
        ...page,
        elements: page.elements.map((el) => {
          // Update Motifs Universally
          if (el.type === 'motif') {
            const motifEl = el as any;
            return {
              ...motifEl,
              motifKey: targetMotifKey,
            };
          }

          if (el.type !== 'text') return el;
          const textEl = el as any;

          // Preserve Milaap brand signature intact
          if (textEl.id === 'el_cover_milaap' || (textEl.content && textEl.content.trim() === 'MILAAP')) {
            return textEl;
          }

          const updates: any = {
            fontFamily: targetFont,
          };

          const isBlessing =
            textEl.role === 'blessing' ||
            textEl.id.includes('blessing') ||
            textEl.id.includes('shloka') ||
            textEl.id.includes('om_shree') ||
            textEl.id.includes('ik_onkar') ||
            textEl.id.includes('mantra');
          const isTitle =
            textEl.role === 'title' ||
            textEl.id.includes('title') ||
            textEl.id.includes('subtitle') ||
            textEl.id.includes('sub');
          const isNames =
            textEl.role === 'names' ||
            textEl.id.includes('couple') ||
            textEl.id.includes('names') ||
            textEl.id.includes('celebrant');
          const isHosts = textEl.role === 'hosts' || textEl.id.includes('hosts');
          const isVenue = textEl.role === 'venue' || textEl.id.includes('venue');
          const isDateTime = textEl.role === 'date_time' || textEl.id.includes('date');
          const isRsvp = textEl.role === 'rsvp' || textEl.id.includes('rsvp');

          if (isCoupleCat) {
            if (isBlessing) {
              updates.content = targetBlessing;
            } else if (isTitle) {
              updates.content = targetHeading;
            } else if (isHosts && hostsMap[lang]) {
              updates.content = hostsMap[lang];
            } else if (isNames) {
              if (
                textEl.content &&
                (textEl.content.includes('सुपुत्र') ||
                  textEl.content.includes('সুপুত্র') ||
                  textEl.content.includes('Son of') ||
                  textEl.content.split('\n').length >= 4)
              ) {
                if (coupleDetailedMap[lang]) updates.content = coupleDetailedMap[lang];
              } else if (coupleNames3LineMap[lang]) {
                updates.content = coupleNames3LineMap[lang];
              } else if (textEl.content) {
                const lines = textEl.content.split('\n');
                if (lines.length === 3) {
                  lines[1] = targetConnector;
                  updates.content = lines.join('\n');
                }
              }
            } else if (isVenue && venueDateMap[lang]) {
              updates.content = venueDateMap[lang];
            } else if (isDateTime) {
              if (page.role === 'cover' && coverDateMap[lang]) {
                updates.content = coverDateMap[lang];
              } else if (venueDateMap[lang]) {
                updates.content = venueDateMap[lang];
              }
            } else if (isRsvp && rsvpMap[lang]) {
              updates.content = rsvpMap[lang];
            }
          } else {
            // Milestone & Non-couple Categories (Graduation, Retirement, Mundan, Naamkaran, Housewarming, etc.)
            // ONLY update category title and typography font; NEVER inject wedding couple names, dates, or venues!
            if (isTitle) {
              updates.content = targetHeading;
            }
          }

          return { ...textEl, ...updates };
        }),
      }));

      return {
        project: {
          ...state.project,
          language: lang,
          secondaryLanguage: secondaryLang,
          pages: updatedPages,
          eventDetails: {
            ...state.project.eventDetails,
            primaryLanguage: lang,
            secondaryLanguage: secondaryLang,
            isBilingual,
          },
        },
        isDirty: true,
      };
    });
  },

  setReligion: (religion: string) => {
    get().recordHistory();
    const curLang = get().project.language;
    const motifKey = getMotifForLanguageAndReligion(curLang, religion as any);

    let mantra = '';
    if (religion === 'sikh') {
      mantra = '॥ ੴ ਸ੍ਰੀ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹਿ ॥\nਲਖ ਖੁਸੀਆ ਪਾਤਿਸਾਹੀਆ ਜੇ ਸਤਿਗੁਰੁ ਨਦਰਿ ਕਰੇਇ ॥';
    } else if (religion === 'muslim') {
      mantra =
        'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nوَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُਸِكُمْ أَزْوَاجًا لِّתَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً';
    } else if (religion === 'christian') {
      mantra =
        '“What God has joined together, let no one separate.” — Mark 10:9\nLove is patient, love is kind. It always protects, always trusts.';
    } else if (religion === 'jain') {
      mantra = '॥ ॐ जय जिनेन्द्राय नमः ॥\nणमोकार महामंत्र — परस्पर उपग्रहो जीवानाम्॥';
    } else if (religion === 'buddhist') {
      mantra = '॥ नमो तस्स भगवतो अरहतो सम्मासम्बुद्धस्स ॥\nबुद्धं शरणं गच्छामि • धर्मं शरणं गच्छामि';
    } else if (religion === 'tribal') {
      mantra = '॥ ᱡᱚᱦᱟᱨ ᱢᱟᱨᱟᱝ ᱵᱩᱨᱩ ᱟᱹᱥᱤᱥ ᱛᱮ ॥\nᱡᱟᱦᱮᱨ ᱟᱭᱳ ᱟᱨ ᱢᱟᱨᱟᱝ ᱵᱩᱨᱩᱣᱟᱜ ᱫᱟᱭᱟ ᱛᱮ ᱥᱟᱹᱜᱩᱱ ᱵᱟᱯᱞᱟ ᱱᱮᱣᱛᱟ॥';
    } else {
      mantra = '॥ श्री गणेशाय नमः ॥\nवक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥';
    }

    set((state) => {
      const updatedPages = state.project.pages.map((page) => ({
        ...page,
        elements: page.elements.map((el) => {
          if (el.type === 'motif') {
            return { ...el, motifKey };
          }
          if (el.type === 'text') {
            const textEl = el as any;
            if (
              textEl.role === 'blessing' ||
              textEl.id.includes('blessing') ||
              textEl.id.includes('shloka') ||
              textEl.id.includes('mantra')
            ) {
              return { ...textEl, content: mantra };
            }
          }
          return el;
        }),
      }));
      return { project: { ...state.project, pages: updatedPages }, isDirty: true };
    });
  },

  setRegionalMotif: (motifKey: string, mantraText?: string) => {
    get().recordHistory();
    set((state) => {
      const updatedPages = state.project.pages.map((page) => ({
        ...page,
        elements: page.elements.map((el) => {
          if (el.type === 'motif') {
            return { ...el, motifKey };
          }
          if (mantraText && el.type === 'text') {
            const textEl = el as any;
            if (
              textEl.role === 'blessing' ||
              textEl.id.includes('blessing') ||
              textEl.id.includes('shloka') ||
              textEl.id.includes('mantra')
            ) {
              return { ...textEl, content: mantraText };
            }
          }
          return el;
        }),
      }));
      return { project: { ...state.project, pages: updatedPages }, isDirty: true };
    });
  },

  setFormat: (format) => {
    get().recordHistory();
    set((state) => ({
      project: { ...state.project, format },
    }));
  },

  updateEventDetails: (details) => {
    get().recordHistory();
    set((state) => ({
      project: {
        ...state.project,
        eventDetails: { ...state.project.eventDetails, ...details },
      },
    }));
  },

  setTheme: (themeUpdates) => {
    get().recordHistory();
    set((state) => ({
      project: {
        ...state.project,
        theme: { ...state.project.theme, ...themeUpdates },
      },
    }));
  },

  // Page Management
  setActivePageIndex: (index) => {
    const { project } = get();
    if (index >= 0 && index < project.pages.length) {
      set({ activePageIndex: index, selectedElementId: null });
    }
  },

  addPage: (role = 'custom', title = 'New Page') => {
    get().recordHistory();
    set((state) => {
      const newPageNumber = state.project.pages.length + 1;
      const newPage: CardPage = {
        id: `page_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        pageNumber: newPageNumber,
        role,
        title: title || `Page ${newPageNumber}`,
        background: {
          type: 'solid',
          color: state.project.theme.backgroundColor || '#FFFDF9',
          textureName: 'ivory',
        },
        elements: [],
      };
      return {
        project: {
          ...state.project,
          pages: [...state.project.pages, newPage],
        },
        activePageIndex: state.project.pages.length,
      };
    });
  },

  removePage: (index) => {
    const { project } = get();
    if (project.pages.length <= 1) return; // Keep at least one page
    get().recordHistory();

    set((state) => {
      const newPages = state.project.pages.filter((_, i) => i !== index);
      // Renumber pages
      newPages.forEach((p, i) => {
        p.pageNumber = i + 1;
      });
      const newActive = Math.min(state.activePageIndex, newPages.length - 1);
      return {
        project: { ...state.project, pages: newPages },
        activePageIndex: newActive,
        selectedElementId: null,
      };
    });
  },

  duplicatePage: (index) => {
    get().recordHistory();
    set((state) => {
      const target = state.project.pages[index];
      if (!target) return state;

      const duplicated: CardPage = JSON.parse(JSON.stringify(target));
      duplicated.id = `page_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      duplicated.title = `${target.title} (Copy)`;
      // Re-id all elements
      duplicated.elements.forEach((el) => {
        el.id = `el_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      });

      const newPages = [...state.project.pages];
      newPages.splice(index + 1, 0, duplicated);
      newPages.forEach((p, i) => {
        p.pageNumber = i + 1;
      });

      return {
        project: { ...state.project, pages: newPages },
        activePageIndex: index + 1,
      };
    });
  },

  reorderPages: (sourceIndex, destIndex) => {
    get().recordHistory();
    set((state) => {
      const pages = [...state.project.pages];
      const [removed] = pages.splice(sourceIndex, 1);
      pages.splice(destIndex, 0, removed);
      pages.forEach((p, i) => {
        p.pageNumber = i + 1;
      });
      return {
        project: { ...state.project, pages },
        activePageIndex: destIndex,
      };
    });
  },

  updatePageBackground: (pageIndex, bgUpdates) => {
    get().recordHistory();
    set((state) => {
      const pages = [...state.project.pages];
      if (!pages[pageIndex]) return state;
      pages[pageIndex] = {
        ...pages[pageIndex],
        background: { ...pages[pageIndex].background, ...bgUpdates },
      };
      return {
        project: { ...state.project, pages },
      };
    });
  },

  // Element Management
  selectElement: (id) => {
    set({ selectedElementId: id });
  },

  addElement: (elementData) => {
    get().recordHistory();
    set((state) => {
      const { activePageIndex } = state;
      const pages = [...state.project.pages];
      const page = pages[activePageIndex];
      if (!page) return state;

      const newId = `el_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const maxZ = page.elements.reduce((max, el) => Math.max(max, el.zIndex), 0);

      const newElement: CardElement = {
        ...elementData,
        id: newId,
        zIndex: maxZ + 1,
      } as CardElement;

      page.elements.push(newElement);

      return {
        project: { ...state.project, pages },
        selectedElementId: newId,
      };
    });
  },

  updateElement: (pageIndex, elementId, updates) => {
    get().recordHistory();
    set((state) => {
      const pages = [...state.project.pages];
      const page = pages[pageIndex];
      if (!page) return state;

      page.elements = page.elements.map((el) => {
        if (el.id === elementId) {
          return { ...el, ...updates } as CardElement;
        }
        return el;
      });

      return {
        project: { ...state.project, pages },
      };
    });
  },

  removeElement: (pageIndex, elementId) => {
    get().recordHistory();
    set((state) => {
      const pages = [...state.project.pages];
      const page = pages[pageIndex];
      if (!page) return state;

      page.elements = page.elements.filter((el) => el.id !== elementId);
      return {
        project: { ...state.project, pages },
        selectedElementId: state.selectedElementId === elementId ? null : state.selectedElementId,
      };
    });
  },

  duplicateElement: (pageIndex, elementId) => {
    get().recordHistory();
    set((state) => {
      const pages = [...state.project.pages];
      const page = pages[pageIndex];
      if (!page) return state;

      const target = page.elements.find((el) => el.id === elementId);
      if (!target) return state;

      const newId = `el_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const maxZ = page.elements.reduce((max, el) => Math.max(max, el.zIndex), 0);

      const duplicated: CardElement = {
        ...JSON.parse(JSON.stringify(target)),
        id: newId,
        x: Math.min(target.x + 4, 80),
        y: Math.min(target.y + 4, 80),
        zIndex: maxZ + 1,
      };

      page.elements.push(duplicated);

      return {
        project: { ...state.project, pages },
        selectedElementId: newId,
      };
    });
  },

  reorderElementZ: (pageIndex, elementId, action) => {
    get().recordHistory();
    set((state) => {
      const pages = [...state.project.pages];
      const page = pages[pageIndex];
      if (!page) return state;

      const el = page.elements.find((e) => e.id === elementId);
      if (!el) return state;

      if (action === 'front') {
        const maxZ = page.elements.reduce((max, e) => Math.max(max, e.zIndex), 0);
        el.zIndex = maxZ + 1;
      } else if (action === 'back') {
        const minZ = page.elements.reduce((min, e) => Math.min(min, e.zIndex), 1);
        el.zIndex = Math.max(1, minZ - 1);
      } else if (action === 'forward') {
        el.zIndex += 1;
      } else if (action === 'backward') {
        el.zIndex = Math.max(1, el.zIndex - 1);
      }

      return {
        project: { ...state.project, pages },
      };
    });
  },

  toggleElementLock: (pageIndex, elementId) => {
    set((state) => {
      const pages = [...state.project.pages];
      const page = pages[pageIndex];
      if (!page) return state;

      page.elements = page.elements.map((el) => {
        if (el.id === elementId) {
          return { ...el, isLocked: !el.isLocked } as CardElement;
        }
        return el;
      });

      return {
        project: { ...state.project, pages },
      };
    });
  },

  // Apply template while PRESERVING user's entered event details!
  applyTemplate: (template) => {
    get().recordHistory();
    set((state) => {
      const currentDetails = { ...state.project.eventDetails };

      // Clone template pages
      const newPages: CardPage[] = JSON.parse(JSON.stringify(template.defaultPages));

      // Inject user's existing couple names / dates into new template text elements ONLY if it's a couple category!
      const isCoupleCategory = ['wedding', 'engagement', 'ring_ceremony', 'reception', 'anniversary'].includes(template.category);

      newPages.forEach((page) => {
        page.elements.forEach((el) => {
          if (el.type === 'text') {
            const textEl = el as any;
            if (isCoupleCategory && textEl.role === 'names' && currentDetails.brideName && currentDetails.groomName) {
              textEl.content = `${currentDetails.groomName}\nसंग\n${currentDetails.brideName}`;
            } else if (isCoupleCategory && textEl.role === 'date_time' && currentDetails.weddingDate) {
              textEl.content = `${currentDetails.weddingDate} • ${currentDetails.venueCity || 'राजस्थान'}`;
            }
          }
        });
      });

      // Ensure company branding Milaap at bottom of cover page
      if (newPages.length > 0) {
        const coverPage = newPages[0];
        const hasMilaap = coverPage.elements.some(
          (el: any) => el.id === 'el_cover_milaap' || (el.content && el.content.trim() === 'MILAAP')
        );
        if (!hasMilaap) {
          coverPage.elements.push({
            id: 'el_cover_milaap',
            type: 'text',
            content: 'MILAAP',
            fontFamily: '"Cinzel", serif',
            fontSize: 9,
            fontWeight: '600',
            color: '#D4AF37',
            align: 'center',
            lineHeight: 1.2,
            letterSpacing: 4,
            isFoil: true,
            x: 20,
            y: 91,
            width: 60,
            height: 4,
            rotation: 0,
            zIndex: 5,
            role: 'quote',
          } as any);
        }
      }

      return {
        project: {
          ...state.project,
          category: template.category,
          templateId: template.id,
          format: template.format,
          theme: { ...template.theme },
          pages: newPages,
          eventDetails: {
            ...currentDetails,
            category: template.category,
          },
        },
        activePageIndex: 0,
        selectedElementId: null,
      };
    });
  },

  // View Controls
  setZoom: (zoom) => {
    set({ zoom: Math.min(Math.max(zoom, 40), 180) });
  },
  toggleBleedGuide: () => set((s) => ({ showBleedGuide: !s.showBleedGuide })),
  toggleSafeGuide: () => set((s) => ({ showSafeGuide: !s.showSafeGuide })),
  toggleGridGuide: () => set((s) => ({ showGridGuide: !s.showGridGuide })),

  // Save project to backend / local storage
  saveCurrentProject: async () => {
    const { project, guestSessionId } = get();
    set({ isSaving: true });
    try {
      const toSave = {
        ...project,
        guestSessionId,
      };
      const result = await saveProjectApi(toSave);
      set({
        project: {
          ...project,
          _id: result._id || result.id || project._id,
          isSaved: true,
        },
        isDirty: false,
        lastSavedAt: new Date(),
        isSaving: false,
      });
    } catch (err) {
      console.error('Failed to save project:', err);
      set({ isSaving: false });
    }
  },
}));
