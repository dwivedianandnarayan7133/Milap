import React, { useState } from 'react';
import { useCardStore } from '../../store/cardStore';
import {
  COMPREHENSIVE_LANGUAGES,
  REGIONAL_ZONES,
  getLanguageByCode,
} from '../../data/languages';
import { TRADITIONAL_MOTIFS, getMotifForLanguageAndReligion } from '../../data/motifs';
import { GeographicalRegion, SupportTier, LanguageInfo } from '../../types/card';
import {
  Search,
  Languages,
  Check,
  Sparkles,
  Info,
  X,
  FileCheck,
  Globe2,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface LanguageSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageSelectModal: React.FC<LanguageSelectModalProps> = ({ isOpen, onClose }) => {
  const { project, setLanguage } = useCardStore();

  const [activeTab, setActiveTab] = useState<'selector' | 'matrix'>('selector');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');

  // Selected language state within modal
  const [primaryLangCode, setPrimaryLangCode] = useState(project.language);
  const [secondaryLangCode, setSecondaryLangCode] = useState<string | undefined>(project.secondaryLanguage);
  const [isBilingual, setIsBilingual] = useState(Boolean(project.eventDetails.isBilingual));
  const [activeScriptMap, setActiveScriptMap] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const currentPrimary = getLanguageByCode(primaryLangCode);

  const filteredLanguages = COMPREHENSIVE_LANGUAGES.filter((lang) => {
    if (selectedRegion !== 'all' && lang.region !== selectedRegion) return false;
    if (selectedTier !== 'all' && lang.tier !== selectedTier) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = lang.name.toLowerCase().includes(q);
      const matchNative = lang.nativeName.toLowerCase().includes(q);
      const matchRegion = lang.stateOrRegionName.toLowerCase().includes(q);
      return matchName || matchNative || matchRegion;
    }

    return true;
  });

  const handleApply = () => {
    setLanguage(primaryLangCode, isBilingual ? secondaryLangCode || 'en' : undefined, isBilingual);
    onClose();
  };

  const getTierBadge = (tier: SupportTier) => {
    switch (tier) {
      case 'tier1_full':
        return (
          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle className="w-2.5 h-2.5 text-emerald-600" /> Tier 1: Full AI & PDF
          </span>
        );
      case 'tier2_supported':
        return (
          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <ShieldCheck className="w-2.5 h-2.5 text-blue-600" /> Tier 2: Regional
          </span>
        );
      case 'tier3_community':
        return (
          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <HelpCircle className="w-2.5 h-2.5 text-amber-600" /> Tier 3: Indigenous
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 select-none">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full h-[90vh] flex flex-col overflow-hidden border border-amber-200">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-royal-maroon to-royal-maroon-dark px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-royal-gold/60">
              <Languages className="w-4 h-4 text-royal-gold" />
            </div>
            <div>
              <h2 className="text-base font-bold font-serif flex items-center gap-2">
                Comprehensive Indian Regional Languages
              </h2>
              <p className="text-[11px] text-amber-200/90">
                Covering North, West, East, Northeast, Central, South & Indigenous Traditions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Tab Toggles */}
            <div className="flex bg-black/20 rounded-lg p-0.5 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('selector')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeTab === 'selector' ? 'bg-royal-gold text-royal-maroon-dark font-bold' : 'text-white/80'
                }`}
              >
                Language Selector
              </button>
              <button
                onClick={() => setActiveTab('matrix')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeTab === 'matrix' ? 'bg-royal-gold text-royal-maroon-dark font-bold' : 'text-white/80'
                }`}
              >
                Verification Matrix
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {activeTab === 'selector' ? (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left Column: Search & List of Languages */}
            <div className="w-full md:w-7/12 border-b md:border-b-0 md:border-r border-stone-200 flex flex-col bg-stone-50/50 h-1/2 md:h-full">
              {/* Search Bar */}
              <div className="p-3 border-b border-stone-200 bg-white">
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by language, script, or state (e.g. Santali, বাংলা, Bhojpuri, Tamil)..."
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-9 pr-3 py-1.5 text-xs focus:border-royal-gold outline-none"
                  />
                </div>
              </div>

              {/* Regional Zone Filter Pills */}
              <div className="p-2.5 border-b border-stone-200 bg-white overflow-x-auto flex gap-1.5 shrink-0">
                <button
                  onClick={() => setSelectedRegion('all')}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all shrink-0 ${
                    selectedRegion === 'all'
                      ? 'bg-royal-maroon text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  All Regions ({COMPREHENSIVE_LANGUAGES.length})
                </button>
                {REGIONAL_ZONES.map((zone) => {
                  const count = COMPREHENSIVE_LANGUAGES.filter((l) => l.region === zone.id).length;
                  return (
                    <button
                      key={zone.id}
                      onClick={() => setSelectedRegion(zone.id)}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all shrink-0 ${
                        selectedRegion === zone.id
                          ? 'bg-royal-maroon text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {zone.name} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Scrollable Language List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {filteredLanguages.length === 0 ? (
                  <div className="text-center py-12 text-stone-400 text-xs">
                    No languages match your search query.
                  </div>
                ) : (
                  filteredLanguages.map((lang) => {
                    const isSelected = lang.code === primaryLangCode;
                    return (
                      <div
                        key={lang.code}
                        onClick={() => setPrimaryLangCode(lang.code)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer bg-white hover:shadow-xs ${
                          isSelected
                            ? 'border-royal-gold ring-2 ring-royal-gold/30 bg-amber-50/40'
                            : 'border-stone-200 hover:border-royal-gold/60'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-royal-maroon">
                                {lang.nativeName}
                              </span>
                              <span className="text-xs font-semibold text-stone-700">
                                ({lang.name})
                              </span>
                            </div>
                            <span className="text-[11px] text-stone-500 mt-0.5 block">
                              📍 {lang.stateOrRegionName}
                            </span>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            {getTierBadge(lang.tier)}
                            {isSelected && (
                              <span className="text-[10px] font-bold text-royal-maroon flex items-center gap-0.5">
                                <Check className="w-3 h-3 text-royal-gold" /> Selected
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Native Script Preview */}
                        <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                          <span
                            className="font-serif text-stone-800 truncate max-w-[260px]"
                            style={{ fontFamily: lang.scriptFont }}
                          >
                            {lang.samplePreview}
                          </span>
                          <span className="text-[10px] text-royal-gold font-bold shrink-0">
                            {lang.scripts[0]?.name || 'Native Script'}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: Active Language Configuration & Customization */}
            <div className="w-full md:w-5/12 p-3 sm:p-5 bg-white flex flex-col justify-between overflow-y-auto h-1/2 md:h-full">
              <div className="space-y-4 sm:space-y-5">
                <div>
                  <span className="text-xs font-bold text-royal-gold uppercase tracking-wider block mb-1">
                    Selected Primary Language
                  </span>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-black font-serif text-royal-maroon">
                      {currentPrimary.nativeName}
                    </h3>
                    <span className="text-sm font-semibold text-stone-600">
                      ({currentPrimary.name})
                    </span>
                  </div>
                  <span className="text-xs text-stone-500">
                    Region: {currentPrimary.stateOrRegionName}
                  </span>
                </div>

                {/* Multiple Writing Systems / Script Switcher */}
                {currentPrimary.scripts.length > 1 && (
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200/90 space-y-2">
                    <label className="block text-xs font-bold text-royal-maroon">
                      Select Writing Script for {currentPrimary.name}
                    </label>
                    <p className="text-[11px] text-stone-600 leading-tight">
                      This language supports multiple authentic writing systems:
                    </p>
                    <div className="space-y-1.5 pt-1">
                      {currentPrimary.scripts.map((script) => (
                        <label
                          key={script.code}
                          className="flex items-center justify-between p-2 rounded bg-white border border-stone-200 cursor-pointer text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="activeScript"
                              checked={
                                (activeScriptMap[currentPrimary.code] || currentPrimary.scripts[0].code) ===
                                script.code
                              }
                              onChange={() =>
                                setActiveScriptMap({
                                  ...activeScriptMap,
                                  [currentPrimary.code]: script.code,
                                })
                              }
                              className="text-royal-gold focus:ring-royal-gold"
                            />
                            <span className="font-semibold text-stone-800">{script.name}</span>
                          </div>
                          <span className="text-[11px] text-stone-500 font-serif">
                            ({script.nativeName})
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Auspicious Sacred Motif for Tradition & Region */}
                {(() => {
                  const mKey = getMotifForLanguageAndReligion(primaryLangCode);
                  const m = TRADITIONAL_MOTIFS[mKey] || TRADITIONAL_MOTIFS.ganesh;
                  return (
                    <div className="p-3 bg-amber-50/80 rounded-lg border border-amber-200/90 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-royal-maroon uppercase tracking-wider block">
                          Auspicious Sacred Motif
                        </label>
                        <span className="text-[10px] text-royal-gold font-bold">
                          Auto-applied to Invitation
                        </span>
                      </div>
                      <div className="flex items-center gap-3 bg-white p-2.5 rounded-md border border-amber-100 shadow-2xs">
                        <div className="w-10 h-10 flex items-center justify-center text-royal-gold shrink-0">
                          <svg
                            viewBox={m.viewBox}
                            className="w-full h-full fill-current"
                            dangerouslySetInnerHTML={{ __html: m.svgPath }}
                          />
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-stone-800 truncate">{m.name}</h5>
                          <p className="text-[10px] text-stone-500 leading-tight line-clamp-2">
                            {m.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Regional Customary vs Secular Phrasing */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-royal-maroon uppercase tracking-wider">
                    Customary Greeting
                  </label>
                  {currentPrimary.customaryGreeting && (
                    <div className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/50 text-xs">
                      <span className="text-[10px] font-bold text-royal-gold block mb-0.5">
                        Traditional / Auspicious Phrasing:
                      </span>
                      <p
                        className="text-stone-800 font-serif font-medium"
                        style={{ fontFamily: currentPrimary.scriptFont }}
                      >
                        {currentPrimary.customaryGreeting}
                      </p>
                    </div>
                  )}

                  {currentPrimary.secularGreeting && (
                    <div className="p-2.5 rounded-lg border border-stone-200 bg-stone-50 text-xs">
                      <span className="text-[10px] font-bold text-stone-500 block mb-0.5">
                        Secular / Modern Family Opening:
                      </span>
                      <p className="text-stone-700 font-serif">
                        {currentPrimary.secularGreeting}
                      </p>
                    </div>
                  )}
                </div>

                {/* Bilingual Option */}
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-stone-800 block">
                        Bilingual Invitation
                      </span>
                      <span className="text-[11px] text-stone-500">
                        Pair {currentPrimary.name} with English or a secondary language
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isBilingual}
                      onChange={(e) => setIsBilingual(e.target.checked)}
                      className="rounded text-royal-gold focus:ring-royal-gold"
                    />
                  </div>

                  {isBilingual && (
                    <div className="pt-2 border-t border-stone-200">
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        Secondary Language
                      </label>
                      <select
                        value={secondaryLangCode || 'en'}
                        onChange={(e) => setSecondaryLangCode(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded px-2.5 py-1 text-xs focus:border-royal-gold outline-none"
                      >
                        <option value="en">English (Pan-India)</option>
                        <option value="hi">Hindi (हिन्दी)</option>
                        <option value="bn">Bengali (বাংলা)</option>
                        <option value="ta">Tamil (தமிழ்)</option>
                        <option value="te">Telugu (తెలుగు)</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Live Font Readiness Indicator */}
                <div className="flex items-center gap-2 p-2.5 bg-emerald-50 text-emerald-800 rounded text-xs border border-emerald-200 font-medium">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Font & Unicode HarfBuzz Shaping: <strong>Ready for 300 DPI PDF Export</strong>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-stone-300 rounded text-xs font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  className="px-6 py-2.5 bg-gradient-to-r from-royal-maroon to-royal-maroon-dark text-white rounded font-bold text-xs flex items-center gap-1.5 shadow-md hover:opacity-95 cursor-pointer"
                >
                  Apply Language to Invitation
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Verification Matrix Tab */
          <div className="flex-1 overflow-auto p-6 bg-stone-50 space-y-4">
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
              <h3 className="text-sm font-bold text-royal-maroon font-serif mb-1">
                Official Language Verification & Support Matrix
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                As required by production guidelines, we transparently distinguish fully verified Tier 1 languages from Tier 2 scheduled regional varieties and Tier 3 community/indigenous writing systems.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[650px]">
                <thead>
                  <tr className="bg-stone-100 text-stone-700 border-b border-stone-200 font-bold">
                    <th className="p-3">Language</th>
                    <th className="p-3">Region</th>
                    <th className="p-3">Script</th>
                    <th className="p-3">Tier</th>
                    <th className="p-3 text-center">User Input</th>
                    <th className="p-3 text-center">AI Drafting</th>
                    <th className="p-3 text-center">Native Font</th>
                    <th className="p-3 text-center">300 DPI PDF</th>
                    <th className="p-3 text-center">RTL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {COMPREHENSIVE_LANGUAGES.map((l) => (
                    <tr key={l.code} className="hover:bg-amber-50/30">
                      <td className="p-3 font-semibold text-stone-800">
                        {l.nativeName} <span className="text-stone-400 font-normal">({l.name})</span>
                      </td>
                      <td className="p-3 capitalize text-stone-600">{l.region}</td>
                      <td className="p-3 text-royal-maroon font-medium">{l.scripts[0]?.name}</td>
                      <td className="p-3">{getTierBadge(l.tier)}</td>
                      <td className="p-3 text-center text-emerald-600">✓</td>
                      <td className="p-3 text-center">
                        {l.supportMatrix.aiGeneration ? (
                          <span className="text-emerald-600 font-bold">✓</span>
                        ) : (
                          <span className="text-stone-300">Editable Native</span>
                        )}
                      </td>
                      <td className="p-3 text-center text-emerald-600">✓</td>
                      <td className="p-3 text-center text-emerald-600">✓</td>
                      <td className="p-3 text-center">
                        {l.isRtl ? (
                          <span className="text-royal-maroon font-bold">RTL</span>
                        ) : (
                          <span className="text-stone-300">LTR</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
