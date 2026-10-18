import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { CARD_TEMPLATES } from '../data/templates';
import { EVENT_CATEGORIES } from '../data/categories';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import { Sparkles, ArrowRight, Check } from 'lucide-react';

export const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const catFromUrl = searchParams.get('category');
  const [selectedCategory, setSelectedCategory] = useState<string>(catFromUrl || 'all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');

  useEffect(() => {
    if (catFromUrl) {
      setSelectedCategory(catFromUrl);
    }
  }, [catFromUrl]);

  const filtered = CARD_TEMPLATES.filter((t) => {
    if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
    if (selectedFormat !== 'all' && t.format !== selectedFormat) return false;
    if (selectedLanguage !== 'all' && !t.supportedLanguages.includes(selectedLanguage as any)) return false;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-royal-gold uppercase tracking-widest block mb-1">
            Handcrafted Indian Invitation Cards
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-serif text-stone-900">
            Invitation Card Template Library
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-2">
            Choose from royal rajputana heritage, modern minimalist gold, regional traditions (Bengali, South Indian, Punjabi, Marathi, Gujarati), and festive milestones.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs mb-8 space-y-4">
          {/* Category Filter */}
          <div>
            <span className="text-xs font-bold text-royal-maroon uppercase tracking-wider block mb-2">
              Category
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-royal-maroon text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                All Celebrations
              </button>
              {EVENT_CATEGORIES.map((cat) => {
                const shortLabel =
                  cat.id === 'wedding' ? 'Wedding' :
                  cat.id === 'engagement' ? 'Engagement' :
                  cat.id === 'ring_ceremony' ? 'Ring Ceremony' :
                  cat.id === 'birthday' ? 'Birthday' :
                  cat.id === 'anniversary' ? 'Anniversary' :
                  cat.id === 'baby_shower' ? 'Baby Shower' :
                  cat.id === 'naming_ceremony' ? 'Naamkaran' :
                  cat.id === 'housewarming' ? 'Housewarming' :
                  cat.id === 'religious_ceremony' ? 'Puja & Havan' :
                  cat.id === 'reception' ? 'Reception' :
                  cat.id === 'mundan' ? 'Mundan' :
                  cat.id === 'graduation' ? 'Graduation' :
                  cat.id === 'retirement' ? 'Retirement' : 'Custom';

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-royal-maroon text-white'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {shortLabel}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language & Format Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-stone-100 pt-3">
            <div>
              <span className="text-xs font-semibold text-stone-700 block mb-1">Language / Script</span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-1.5 text-xs text-stone-700 outline-none focus:border-royal-gold"
              >
                <option value="all">All Languages</option>
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.name} ({l.nativeName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="text-xs font-semibold text-stone-700 block mb-1">Print / Digital Format</span>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-1.5 text-xs text-stone-700 outline-none focus:border-royal-gold"
              >
                <option value="all">All Card Formats</option>
                <option value="a5_portrait">A5 Portrait (Standard Wedding)</option>
                <option value="a6_portrait">A6 Card</option>
                <option value="five_by_seven">5 × 7" Classic</option>
                <option value="square">Square 6 × 6"</option>
                <option value="whatsapp_story">WhatsApp & Story (9:16)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => navigate(`/editor?template=${tpl.id}`)}
              className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
            >
              {/* Card Thumbnail */}
              <div
                className={`h-64 p-6 flex flex-col items-center justify-center relative ${tpl.previewBg}`}
                style={{ backgroundColor: tpl.theme.backgroundColor }}
              >
                <div
                  className="w-36 h-52 border-2 border-dashed rounded-xs flex flex-col items-center justify-between p-3 text-center shadow-md bg-white/5 backdrop-blur-2xs"
                  style={{
                    borderColor: tpl.theme.secondaryColor,
                    color: tpl.theme.secondaryColor,
                  }}
                >
                  <span className="text-[10px] uppercase font-bold tracking-widest">
                    {tpl.category}
                  </span>
                  <span className="text-base font-serif font-black text-white drop-shadow-sm leading-tight">
                    {tpl.title}
                  </span>
                  <span className="text-[10px] text-stone-200 font-serif">
                    शुभ निमंत्रण
                  </span>
                </div>
              </div>

              {/* Card Meta */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-royal-maroon group-hover:text-royal-maroon-dark truncate">
                    {tpl.title}
                  </h3>
                  <span className="text-[10px] font-bold text-royal-gold bg-amber-50 px-2 py-0.5 rounded uppercase">
                    {tpl.format.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                  {tpl.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tpl.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 bg-stone-100 text-stone-600 rounded font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button className="w-full mt-2 py-2.5 bg-gradient-to-r from-royal-maroon to-royal-maroon-dark group-hover:opacity-95 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer">
                  <Sparkles className="w-3.5 h-3.5 text-royal-gold" />
                  Customize this Card
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};
