import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { CARD_TEMPLATES } from '../data/templates';
import { EVENT_CATEGORIES } from '../data/categories';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import { TRADITIONAL_MOTIFS } from '../data/motifs';
import {
  Sparkles,
  ArrowRight,
  Download,
  Share2,
  QrCode,
  Languages,
  CheckCircle2,
  Heart,
  Palette,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [demoLang, setDemoLang] = useState('hi');
  const [demoCategory, setDemoCategory] = useState('wedding');
  const [groomDemo, setGroomDemo] = useState('आदित्य');
  const [brideDemo, setBrideDemo] = useState('अनन्या');

  interface UniversalSampleCard {
    groom: string;
    bride: string;
    connector: string;
    blessing: string;
    shloka?: string;
    title: string;
    date: string;
    venue: string;
    rsvp: string;
    font: string;
    motifKey: string;
    religion: string;
    region: string;
  }

  const sampleNames: Record<string, UniversalSampleCard> = {
    hi: {
      groom: 'आयुष्मान आदित्य',
      bride: 'आयुष्मती अनन्या',
      connector: 'संग',
      blessing: '॥ श्री गणेशाय नमः ॥',
      title: 'शुभ विवाह निमंत्रण',
      date: '२८ नवम्बर २०२५ • शुभ मुहूर्त सायं ०८:१५',
      venue: 'लीला पैलेस, पिछोला झील, उदयपुर',
      rsvp: 'दर्शनाभिलाषी: समस्त शर्मा एवं वर्मा परिवार',
      font: '"Rozha One", "Noto Serif Devanagari", serif',
      motifKey: 'ganesh',
      religion: 'Hindu Tradition',
      region: 'North & Central India',
    },
    bn: {
      groom: 'চিরঞ্জীব সৌম্য',
      bride: 'আয়ুষ্মতী ঐন্দ্রিলা',
      connector: 'ও',
      blessing: '॥ ওঁ শ্রী শ্রী প্রজাপতয়ে नमঃ ॥',
      title: 'শুভ বিবাহ নিমন্ত্রণ',
      date: '২৮ নভেম্বর ২০২৫ • শুভ লগ্ন রাত্রি ০৮:১৫',
      venue: 'লীলা প্যালেস, উদয়পুর, রাজস্থান',
      rsvp: 'দর্শনাভিলাষী: শর্মা ও বর্মা পরিবার',
      font: '"Tiro Bangla", "Noto Serif Bengali", serif',
      motifKey: 'bengali_alpana',
      religion: 'Bengali Vedic Tradition',
      region: 'Bengal & Eastern India',
    },
    mr: {
      groom: 'चि. आदित्य',
      bride: 'चि.सौ.कां. अनन्या',
      connector: 'व',
      blessing: '॥ श्री गणेशाय नमः ॥ सस्नेह निमंत्रण',
      title: 'शुभ विवाह पत्रिका',
      date: '२८ नोव्हेंबर २०२५ • शुभ मुहूर्त रात्री ०८:१५',
      venue: 'लीला पॅलेस, उदयपूर, महाराष्ट्र',
      rsvp: 'स्नेही: समस्त शर्मा व वर्मा परिवार',
      font: '"Rozha One", "Noto Serif Devanagari", serif',
      motifKey: 'marathi_tutari',
      religion: 'Maharashtrian Tradition',
      region: 'Maharashtra & Konkan',
    },
    gu: {
      groom: 'ચિ. કુણાલ',
      bride: 'ચિ. તન્વી',
      connector: 'સંગ',
      blessing: '॥ શ્રી ગણેશાય નમઃ ॥ શુભ લાભ ॥',
      title: 'માંગલિક શુભ વિવાહ નિમંત્રણ',
      date: '૨૮ નવેમ્બર ૨૦૨૫ • શુભ મુહૂર્ત રાત્રે ૦૮:૧૫',
      venue: 'લીલા પેલેસ, ઉદયપુર, રાજસ્થાન',
      rsvp: 'દર્શનાભિલાષી: સમસ્ત શર્મા અને વર્મા પરિવાર',
      font: '"Tiro Gujarati", "Noto Serif Gujarati", serif',
      motifKey: 'gujarati_shubh_labh',
      religion: 'Gujarati Tradition',
      region: 'Gujarat & Saurashtra',
    },
    pa: {
      groom: 'ਕਾਕਾ ਗੁਰਪ੍ਰੀਤ ਸਿੰਘ',
      bride: 'ਬੀਬਾ ਹਰਲੀਨ ਕੌਰ',
      connector: 'ਸੰਗ',
      blessing: '॥ ੴ ਸ੍ਰੀ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹਿ ॥',
      title: 'ਅਨੰਦ ਕਾਰਜ ਸਮਾਗਮ ਸੱਦਾ',
      date: '28 ਨਵੰਬਰ 2025 • ਸ਼ੁਭ ਮਹੂਰਤ ਰਾਤ 08:15',
      venue: 'ਲੀਲਾ ਪੈਲੇਸ, ਉਦੈਪੁਰ, ਰਾਜਸਥਾਨ',
      rsvp: 'ਦਰਸ਼ਨਾਭਿਲਾਸ਼ੀ: ਸਮੂਹ ਸ਼ਰਮਾ ਅਤੇ ਵਰਮਾ ਪਰਿਵਾਰ',
      font: '"Tiro Gurmukhi", "Noto Serif Gurmukhi", serif',
      motifKey: 'ik_onkar',
      religion: 'Sikh Anand Karaj',
      region: 'Punjab & North India',
    },
    ta: {
      groom: 'செல்வன் கார்த்திக்',
      bride: 'செல்வி தீபிகா',
      connector: 'இணை',
      blessing: '॥ சுபமுகூர்த்த அழைப்பிதழ் ॥',
      title: 'திருமண அழைப்பிதழ்',
      date: '28 நவம்பர் 2025 • சுப முகூர்த்தம் இரவு 08:15',
      venue: 'லீலா பேலஸ், உதய்பூர், ராஜஸ்தான்',
      rsvp: 'அன்புடன் அழைக்கும்: சர்மா மற்றும் வர்மா குடும்பத்தினர்',
      font: '"Tiro Tamil", "Noto Serif Tamil", serif',
      motifKey: 'south_kolam',
      religion: 'Tamil Vedic Tradition',
      region: 'Tamil Nadu & South India',
    },
    te: {
      groom: 'చిరంజీవి ఆదిత్య',
      bride: 'సౌభాగ్యవతి అనన్య',
      connector: 'మరియు',
      blessing: '॥ శ్రీ విఘ్నేశ్వరాయ నమః ॥',
      title: 'శుభ వివాహ ఆహ్వాన పత్రిక',
      date: '28 నవంబర్ 2025 • శుభ ముహూర్తం రాత్రి 08:15',
      venue: 'లీలా ప్యాలెస్, ఉదయపూర్, రాజస్థాన్',
      rsvp: 'ఆహ్వానించువారు: శర్మ మరియు వర్మ కుటుంబ సభ్యులు',
      font: '"Tiro Telugu", "Noto Serif Telugu", serif',
      motifKey: 'south_kolam',
      religion: 'Telugu Tradition',
      region: 'Andhra & Telangana',
    },
    kn: {
      groom: 'ಚಿರಂಜೀವಿ ಆದಿತ್ಯ',
      bride: 'ಸೌಭಾಗ್ಯವತಿ ಅನನ್ಯ',
      connector: 'ಮತ್ತು',
      blessing: '॥ ಶ್ರೀ ಗಣೇಶಾಯ ನಮಃ ॥',
      title: 'ಶುಭ ವಿವಾಹ ಆಮಂತ್ರಣ ಪತ್ರಿಕೆ',
      date: '28 ನವೆಂಬರ್ 2025 • ಶುಭ ಮುಹೂರ್ತ ರಾತ್ರಿ 08:15',
      venue: 'ಲೀಲಾ ಪ್ಯಾಲೇಸ್, ಉದಯಪುರ, ರಾಜಸ್ಥಾನ',
      rsvp: 'ಆಹ್ವಾನಿಸುವವರು: ಶರ್ಮ ಮತ್ತು ವರ್ಮ ಕುಟುಂಬ',
      font: '"Tiro Kannada", "Noto Serif Kannada", serif',
      motifKey: 'south_kolam',
      religion: 'Kannada Tradition',
      region: 'Karnataka & Deccan',
    },
    ml: {
      groom: 'ചിരഞ്ജീവി ആദിത്യ',
      bride: 'ആയുഷ്മതി അനന്യ',
      connector: '&',
      blessing: '॥ മംഗളകരമായ വിവാഹ ക്ഷണക്കത്ത് ॥',
      title: 'വിവാഹ മംഗളാശംസകൾ',
      date: '28 നവംബർ 2025 • രാത്രി 08:15 മണിക്ക്',
      venue: 'ലീല പാലസ്, ഉദയ്പൂർ, രാജസ്ഥാൻ',
      rsvp: 'സ്നേഹത്തോടെ: ശർമ്മ & വർമ്മ കുടുംബം',
      font: '"Tiro Malayalam", "Noto Serif Malayalam", serif',
      motifKey: 'kerala_nilavilakku',
      religion: 'Kerala Tradition',
      region: 'Kerala & Malabar',
    },
    or: {
      groom: 'ଚିରଞ୍ଜୀବ ଆଦିତ୍ୟ',
      bride: 'ଆୟୁଷ୍ମତୀ ଅନନ୍ୟା',
      connector: 'ଏବଂ',
      blessing: '॥ ଶ୍ରୀ ଗଣେଶାୟ ନମଃ ॥',
      title: 'ଶୁଭ ବିବାହ ନିମନ୍ତ୍ରଣ ପତ୍ର',
      date: '୨୮ ନଭେମ୍ବର ୨୦୨୫ • ରାତ୍ରି ୦୮:୧୫ ଘଟିକା',
      venue: 'ଲୀଳା ପ୍ୟାଲେସ୍, ଉଦୟପୁର, ରାଜସ୍ଥାନ',
      rsvp: 'ନିମନ୍ତ୍ରକ: ଶର୍ମା ଏବଂ ବର୍ମା ପରିବାର',
      font: '"Noto Serif Oriya", serif',
      motifKey: 'odia_konark_wheel',
      religion: 'Odia Tradition',
      region: 'Odisha & Kalinga',
    },
    ur: {
      groom: 'عزیز مکرم آدتیہ',
      bride: 'عزیزہ اننیا',
      connector: 'اور',
      blessing: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      title: 'دعوت نامہ تقریب نکاح',
      date: '28 نومبر 2025 • بوقت شب 08:15 بجے',
      venue: 'لیلا پیلس، ادے پور، راجستھان',
      rsvp: 'چشم براہ: جملہ شرما و ورما خاندان',
      font: '"Noto Nastaliq Urdu", serif',
      motifKey: 'islamic_crescent',
      religion: 'Islamic Nikah Tradition',
      region: 'Urdu & Pan-Islamic',
    },
    sa: {
      groom: 'आयुष्मान् आदित्यः',
      bride: 'आयुष्मती अनन्या',
      connector: 'संग',
      blessing: '॥ मांगल्यं तन्तुनानेन मम जीवनहेतुना ॥',
      title: 'शुभ विवाह आमन्त्रणम्',
      date: '२८ नवम्बर २०२५ • शुभ मुहूर्तः रात्रि ०८:१५',
      venue: 'लीला प्रासादः, उदयपुरम्, राजस्थानम्',
      rsvp: 'दर्शनाभिलाषी: समस्त शर्मा एवं वर्मा परिवारः',
      font: '"Rozha One", "Noto Serif Devanagari", serif',
      motifKey: 'om',
      religion: 'Vedic Sanskrit Tradition',
      region: 'Ancient Heritage',
    },
    en: {
      groom: 'Aditya',
      bride: 'Ananya',
      connector: 'with',
      blessing: 'Together With Their Families',
      title: 'Wedding Invitation',
      date: 'Friday, 28th November 2025 • 08:15 PM',
      venue: 'The Leela Palace, Lake Pichola, Udaipur',
      rsvp: 'With Best Compliments: Sharma & Verma Family',
      font: '"Cinzel", "Playfair Display", serif',
      motifKey: 'diamond_rings',
      religion: 'Contemporary / Pan-India',
      region: 'Global Indian',
    },
  };

  const categorySamples: Record<
    string,
    {
      title: string;
      blessing: string;
      name1: string;
      connector: string;
      name2: string;
      date: string;
      venue: string;
      rsvp: string;
      motifKey: string;
      traditionBadge: string;
    }
  > = {
    wedding: {
      title: 'शुभ विवाह निमंत्रण',
      blessing: '॥ श्री गणेशाय नमः ॥',
      name1: 'आयुष्मान आदित्य',
      connector: 'संग',
      name2: 'आयुष्मती अनन्या',
      date: '२८ नवम्बर २०२५ • शुभ मुहूर्त सायं ०८:१५',
      venue: 'लीला पैलेस, पिछोला झील, उदयपुर',
      rsvp: 'दर्शनाभिलाषी: समस्त शर्मा एवं वर्मा परिवार',
      motifKey: 'ganesh',
      traditionBadge: 'Royal Wedding Celebration',
    },
    ring_ceremony: {
      title: 'मुद्रिका समारोह • RING CEREMONY',
      blessing: '॥ श्री गणेशाय नमः ॥ दो दिलों के पावन बंधन की शुरुआत',
      name1: 'आदित्य',
      connector: 'संग',
      name2: 'अनन्या',
      date: '२४ नवम्बर २०२५ • शुभ मुहूर्त सायं ०७:०० बजे से',
      venue: 'होटल हयात रीजेंसी, मुंबई',
      rsvp: 'RSVP: +91 98765 43210 • शर्मा व वर्मा परिवार',
      motifKey: 'diamond_rings',
      traditionBadge: 'Solitaire Rings & Engagement Gala',
    },
    graduation: {
      title: 'दीक्षांत एवं सफलता समारोह • CONVOCATION',
      blessing: '॥ विद्या ददाति विनयं विनयाद्याति पात्रताम् ॥',
      name1: 'DR. AARAV VERMA',
      connector: '',
      name2: 'Doctor of Medicine (M.D.)',
      date: 'Saturday, 20th December 2025 • 06:30 PM Onwards',
      venue: 'Grand Banquet Hall, The Leela, Bengaluru',
      rsvp: 'Proud Parents: Mrs. Sunita & Mr. Rajesh Verma | RSVP: +91 99887 76655',
      motifKey: 'lotus',
      traditionBadge: 'Academic Excellence & Convocation',
    },
    naming_ceremony: {
      title: 'शुभ नामकरण एवं पालना संस्कार',
      blessing: '॥ श्री गणेशाय नमः ॥ नन्हे बालक का शुभागमन',
      name1: 'आयुष्मान आरव शर्मा',
      connector: '',
      name2: '(सुपुत्र: सौ. पूजा एवं श्री राहुल शर्मा)',
      date: 'रविवार, १४ दिसम्बर २०२५ • प्रातः १०:३० बजे',
      venue: 'शांति निकेतन बैंक्वेट, जयपुर',
      rsvp: 'समस्त शर्मा परिवार | RSVP: +91 98765 43210',
      motifKey: 'bal_gopal_cradle',
      traditionBadge: 'Auspicious Cradle & Naamkaran',
    },
    housewarming: {
      title: 'शुभ गृह प्रवेश एवं वास्तु शांति',
      blessing: '॥ श्री गणेशाय नमः ॥ वास्तु शांति ॥',
      name1: 'नीता एवं सतीश अग्रवाल',
      connector: '',
      name2: 'नवनिर्मित आवास "आनंदम"',
      date: 'रविवार, २१ दिसम्बर २०२५ • प्रातः ०९:०० बजे से',
      venue: 'प्लॉट नं. ४५, वैशाली नगर, जयपुर',
      rsvp: 'विनीत: समस्त अग्रवाल परिवार',
      motifKey: 'kalash',
      traditionBadge: 'Griha Pravesh & Vastu Shanti',
    },
    retirement: {
      title: 'सेवानिवृत्ति अभिनंदन समारोह',
      blessing: '॥ सस्नेह कृतज्ञता एवं अभिनंदन ॥ ३५ वर्षों की गौरवमयी सेवा',
      name1: 'श्री दिनेश कुमार शर्मा',
      connector: '',
      name2: '(वरिष्ठ मुख्य अभियंता, भारतीय रेल)',
      date: 'बुधवार, ३१ दिसम्बर २०२५ • सायं ०६:०० बजे से',
      venue: 'ऑफिसर्स क्लब ऑडिटोरियम, नई दिल्ली',
      rsvp: 'स्नेही: समस्त सहकर्मी एवं परिवार',
      motifKey: 'diya',
      traditionBadge: 'Distinguished Career Felicitation',
    },
  };

  const currentSample = sampleNames[demoLang] || sampleNames.hi;
  const isCustomCategory = demoCategory !== 'wedding' && categorySamples[demoCategory];
  const catSample = categorySamples[demoCategory];

  const activeMotifKey = isCustomCategory ? catSample.motifKey : currentSample.motifKey;
  const activeMotif = TRADITIONAL_MOTIFS[activeMotifKey] || TRADITIONAL_MOTIFS.ganesh;

  const displayTitle = isCustomCategory ? catSample.title : currentSample.title;
  const displayBlessing = isCustomCategory ? catSample.blessing : currentSample.blessing;
  const displayName1 = isCustomCategory ? catSample.name1 : currentSample.groom;
  const displayConnector = isCustomCategory ? catSample.connector : currentSample.connector;
  const displayName2 = isCustomCategory ? catSample.name2 : currentSample.bride;
  const displayDate = isCustomCategory ? catSample.date : currentSample.date;
  const displayVenue = isCustomCategory ? catSample.venue : currentSample.venue;
  const displayRsvp = isCustomCategory ? catSample.rsvp : currentSample.rsvp;
  const displayBadge = isCustomCategory
    ? catSample.traditionBadge
    : `${currentSample.religion} • ${currentSample.region}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/70 via-stone-100 to-[#FAF7F2] py-16 lg:py-24 border-b border-amber-200/60">
        {/* Subtle Decorative Background Arches */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="archGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M0 20 C5 10 15 10 20 20 Z" fill="none" stroke="#6B1224" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#archGrid)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading & Value Prop */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Auspicious Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-royal-maroon text-xs font-bold shadow-2xs">
                <Sparkles className="w-4 h-4 text-royal-gold" />
                <span>Next-Generation Indian Invitation Card Studio</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black font-serif text-stone-900 leading-tight">
                Craft Timeless <span className="text-royal-maroon">Indian Invitations</span> with{' '}
                <span className="gold-text-gradient">VivahPatra AI</span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
                Traditional handmade paper cards meet artificial intelligence. Generate culturally authentic wording in 14 Indian languages, simulated gold foil typography, auspicious shlokas, and download print-ready 300 DPI PDFs.
              </p>

              {/* Primary CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/editor"
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-royal-maroon to-royal-maroon-dark hover:opacity-95 text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-royal-gold" />
                  <span>Start Designing Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/templates"
                  className="w-full sm:w-auto px-6 py-3.5 bg-white border border-stone-300 hover:border-royal-gold text-stone-700 hover:text-royal-maroon rounded-lg font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Palette className="w-4 h-4 text-royal-gold" />
                  <span>Explore 12+ Templates</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-6 border-t border-stone-200/80 text-left">
                <div className="bg-white/60 sm:bg-transparent p-2.5 sm:p-0 rounded-lg sm:rounded-none border sm:border-0 border-stone-200/60">
                  <span className="text-base sm:text-lg font-bold text-royal-maroon font-serif block">30+ Languages</span>
                  <span className="text-xs text-stone-500">All 7 Indian Zones & Scripts</span>
                </div>
                <div className="bg-white/60 sm:bg-transparent p-2.5 sm:p-0 rounded-lg sm:rounded-none border sm:border-0 border-stone-200/60">
                  <span className="text-base sm:text-lg font-bold text-royal-gold-dark font-serif block">Print-Ready</span>
                  <span className="text-xs text-stone-500">300 DPI PDF & Bleed</span>
                </div>
                <div className="bg-white/60 sm:bg-transparent p-2.5 sm:p-0 rounded-lg sm:rounded-none border sm:border-0 border-stone-200/60">
                  <span className="text-base sm:text-lg font-bold text-emerald-700 font-serif block">Auspicious AI</span>
                  <span className="text-xs text-stone-500">Wording & Translation</span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive Card Demo */}
            <div className="lg:col-span-5 flex flex-col items-center">
              {/* Interactive Demo Card */}
              <div className="w-full max-w-sm bg-white p-2 rounded-xl shadow-2xl border-2 border-royal-gold/40 relative">
                {/* Category Switcher Tabs */}
                <div className="flex items-center gap-1 p-1.5 bg-stone-100 rounded-lg mb-2 overflow-x-auto text-[11px] font-semibold">
                  {[
                    { id: 'wedding', label: 'Wedding' },
                    { id: 'ring_ceremony', label: 'Ring Ceremony' },
                    { id: 'graduation', label: 'दीक्षांत (Graduation)' },
                    { id: 'naming_ceremony', label: 'Naamkaran' },
                    { id: 'housewarming', label: 'Griha Pravesh' },
                    { id: 'retirement', label: 'Retirement' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setDemoCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
                        demoCategory === cat.id
                          ? 'bg-royal-maroon text-white font-bold shadow-2xs'
                          : 'text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Language Switcher Pills */}
                <div className="flex items-center justify-start gap-1 p-1.5 bg-stone-50 rounded-lg mb-2 overflow-x-auto text-[11px] font-semibold">
                  {['hi', 'bn', 'mr', 'gu', 'pa', 'ta', 'te', 'kn', 'ml', 'or', 'ur', 'sa', 'en'].map((code) => (
                    <button
                      key={code}
                      onClick={() => setDemoLang(code)}
                      className={`px-2 py-0.5 rounded transition-colors cursor-pointer shrink-0 ${
                        demoLang === code
                          ? 'bg-royal-gold text-royal-maroon-dark font-bold'
                          : 'text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {code.toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* Simulated Physical Wedding Card */}
                <div
                  className="paper-texture-ivory rounded-lg border-4 border-royal-maroon/20 p-5 flex flex-col items-center justify-between text-center relative overflow-hidden shadow-inner min-h-[480px] transition-all"
                  style={{ fontFamily: currentSample.font }}
                >
                  {/* Ornate Gold Border Inside */}
                  <div className="absolute inset-3 border border-royal-gold/80 rounded pointer-events-none" />
                  <div className="absolute inset-4 border border-dashed border-royal-gold/40 rounded pointer-events-none" />

                  {/* Auspicious Sacred Motif SVG */}
                  <div className="pt-1 z-10 flex flex-col items-center">
                    <div className="w-12 h-12 flex items-center justify-center text-royal-gold drop-shadow-sm mb-1">
                      <svg
                        viewBox={activeMotif.viewBox}
                        className="w-full h-full fill-current"
                        dangerouslySetInnerHTML={{ __html: activeMotif.svgPath }}
                      />
                    </div>

                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100/80 border border-amber-300 text-[10px] font-bold text-royal-maroon mb-1">
                      <span>{displayBadge}</span>
                    </div>

                    <span className="text-royal-maroon text-xs font-bold block mb-0.5">
                      {displayBlessing}
                    </span>
                    <span className="text-[11px] text-royal-gold-dark tracking-widest uppercase font-semibold">
                      {displayTitle}
                    </span>
                  </div>

                  {/* Names / Celebrant / Scholar */}
                  <div className="my-auto z-10 space-y-1">
                    <h3 className="text-2xl font-black text-royal-maroon gold-text-gradient drop-shadow-xs">
                      {displayName1}
                    </h3>
                    {displayConnector && (
                      <span className="text-xs text-royal-gold italic block">
                        {displayConnector}
                      </span>
                    )}
                    {displayName2 && (
                      <h3
                        className={`text-royal-maroon drop-shadow-xs ${
                          displayConnector
                            ? 'text-2xl font-black gold-text-gradient'
                            : 'text-sm font-semibold text-stone-700'
                        }`}
                      >
                        {displayName2}
                      </h3>
                    )}
                  </div>

                  {/* Date & Venue */}
                  <div className="pb-1 z-10 space-y-0.5">
                    <p className="text-xs font-bold text-stone-800">
                      {displayDate}
                    </p>
                    <p className="text-[11.5px] text-stone-600">
                      {displayVenue}
                    </p>
                    <span className="text-[10px] text-royal-gold-dark font-semibold block pt-0.5">
                      {displayRsvp}
                    </span>
                  </div>
                </div>

                {/* Direct Customize CTA */}
                <button
                  onClick={() => navigate(`/editor?category=${demoCategory}&lang=${demoLang}`)}
                  className="w-full mt-2.5 py-2.5 bg-gradient-to-r from-royal-maroon to-royal-maroon-dark hover:opacity-95 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-royal-gold" />
                  <span>Customize {demoCategory === 'wedding' ? 'Invitation' : 'Card'} in Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 14 Event Categories Section */}
      <section className="py-16 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-royal-gold uppercase tracking-widest block mb-1">
              Versatile Celebrations
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-stone-900">
              Invitations for Every Sacred Milestone
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-2">
              Specific forms, wording recommendations, and cultural themes customized for every occasion.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {EVENT_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigate(`/editor?category=${cat.id}`)}
                className="p-3 bg-stone-50 hover:bg-amber-50/60 rounded-xl border border-stone-200 hover:border-royal-gold transition-all cursor-pointer text-center group shadow-2xs"
              >
                <div className="w-9 h-9 rounded-full bg-white shadow-xs mx-auto flex items-center justify-center mb-2 group-hover:scale-110 transition-transform text-royal-maroon">
                  <Heart className="w-4 h-4 text-royal-gold" />
                </div>
                <h4 className="text-xs font-bold text-stone-800 group-hover:text-royal-maroon truncate">
                  {cat.name.split(' ')[0]}
                </h4>
                <span className="text-[10px] text-stone-400 block truncate mt-0.5">{cat.hindiName}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Templates Showcase */}
      <section className="py-16 bg-[#FAF7F2] border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-royal-gold uppercase tracking-widest block mb-1">
                Curated Collection
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-serif text-stone-900">
                Traditional & Modern Designs
              </h2>
            </div>
            <Link
              to="/templates"
              className="text-xs font-bold text-royal-maroon hover:text-royal-maroon-dark flex items-center gap-1"
            >
              View All 12+ Templates <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CARD_TEMPLATES.slice(0, 4).map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => navigate(`/editor?template=${tpl.id}`)}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
              >
                {/* Visual Preview */}
                <div
                  className={`h-56 p-4 flex flex-col items-center justify-center relative ${tpl.previewBg}`}
                  style={{ backgroundColor: tpl.theme.backgroundColor }}
                >
                  <div
                    className="w-32 h-44 border-2 border-dashed rounded-xs flex flex-col items-center justify-center p-2 text-center"
                    style={{
                      borderColor: tpl.theme.secondaryColor,
                      color: tpl.theme.secondaryColor,
                    }}
                  >
                    <span className="text-[10px] uppercase font-bold tracking-widest mb-1">
                      {tpl.category}
                    </span>
                    <span className="text-sm font-serif font-bold text-white drop-shadow-xs">
                      {tpl.title.split(' ')[0]}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="text-xs font-bold text-royal-maroon group-hover:text-royal-maroon-dark truncate">
                    {tpl.title}
                  </h3>
                  <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                    {tpl.description}
                  </p>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[10px] text-royal-gold font-bold uppercase">
                      {tpl.format.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-semibold text-stone-700 flex items-center gap-1 group-hover:text-royal-maroon">
                      Customize <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-amber-50/50 border border-amber-200/70 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-royal-maroon text-royal-gold flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-royal-maroon font-serif">
                Auspicious AI Wording Studio
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                One-click formal, poetic, royal, or devotional invitation copywriting. Accurately preserves all your names, dates, and venues without hallucination.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-amber-50/50 border border-amber-200/70 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-royal-maroon text-royal-gold flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-royal-maroon font-serif">
                Print-Ready 300 DPI Export
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Chromium-powered vector PDF rendering with full Indic text shaping (HarfBuzz), embedded fonts, 3mm bleed margin, and crop marks.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-amber-50/50 border border-amber-200/70 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-royal-maroon text-royal-gold flex items-center justify-center">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-royal-maroon font-serif">
                Venue Maps QR Code
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Directly place a scannable Google Maps QR code on your card so guests can tap or scan to navigate effortlessly to the wedding banquet hall.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
