import React, { useState } from 'react';
import { useCardStore } from '../../../store/cardStore';
import { generateAIWording, translateAIText, proofreadAIText, rewriteAIText } from '../../../services/api';
import { SUPPORTED_LANGUAGES } from '../../../data/languages';
import { Sparkles, Wand2, Copy, Check, ArrowRight, Languages, SpellCheck, RefreshCw } from 'lucide-react';

export const AIStudioTab: React.FC = () => {
  const { project, updateElement, activePageIndex } = useCardStore();
  const [tone, setTone] = useState<string>('royal');
  const [selectedLanguage, setSelectedLanguage] = useState(project.language);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any>(null);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // AI Actions state
  const [actionTab, setActionTab] = useState<'generate' | 'translate' | 'proofread'>('generate');
  const [targetTranslateLang, setTargetTranslateLang] = useState('hi');
  const [textToTranslate, setTextToTranslate] = useState('');
  const [translationResult, setTranslationResult] = useState('');
  const [proofreadResult, setProofreadResult] = useState<{ corrected?: string; notes?: string }>({});

  const tones = [
    { id: 'royal', label: '👑 Royal Traditional (राजसी)' },
    { id: 'devotional', label: '🕉️ Sacred Devotional (भक्तिमय)' },
    { id: 'elegant', label: '✨ Elegant & Contemporary' },
    { id: 'poetic', label: '🌸 Poetic & Romantic (काव्यात्मक)' },
    { id: 'emotional', label: '💖 Warm & Emotional' },
    { id: 'minimal', label: '🌿 Minimalist & Chic' },
    { id: 'funny', label: '🎉 Joyful & Cheerful (Birthday)' },
    { id: 'formal', label: '📜 Formal & Respectful' },
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg('');
    try {
      const res = await generateAIWording({
        category: project.category,
        language: selectedLanguage,
        tone,
        details: project.eventDetails,
        isBilingual: project.eventDetails.isBilingual,
        secondaryLanguage: project.secondaryLanguage,
      });

      if (res.data) {
        setGeneratedResult(res.data);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to generate wording');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyToCanvas = () => {
    if (!generatedResult) return;
    const page = project.pages[activePageIndex];
    if (!page) return;

    // Apply to matching text roles on current page
    page.elements.forEach((el) => {
      if (el.type === 'text') {
        const textEl = el as any;
        if (textEl.role === 'blessing' && generatedResult.blessing) {
          updateElement(activePageIndex, el.id, { content: generatedResult.blessing });
        } else if (textEl.role === 'title' && generatedResult.heading) {
          updateElement(activePageIndex, el.id, { content: generatedResult.heading });
        } else if (textEl.role === 'names' && generatedResult.coupleOrCelebrant) {
          updateElement(activePageIndex, el.id, { content: generatedResult.coupleOrCelebrant });
        } else if (textEl.role === 'body' && generatedResult.invitationMessage) {
          updateElement(activePageIndex, el.id, { content: generatedResult.invitationMessage });
        } else if (textEl.role === 'venue' && (generatedResult.venueDetails || generatedResult.eventScheduleSummary)) {
          updateElement(activePageIndex, el.id, {
            content: `${generatedResult.eventScheduleSummary}\n${generatedResult.venueDetails}`,
          });
        } else if (textEl.role === 'rsvp' && generatedResult.rsvpText) {
          updateElement(activePageIndex, el.id, { content: generatedResult.rsvpText });
        }
      }
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 2000);
  };

  const handleTranslateSubmit = async () => {
    if (!textToTranslate.trim()) return;
    setIsGenerating(true);
    try {
      const res = await translateAIText(textToTranslate, targetTranslateLang as any);
      setTranslationResult(res.translated || '');
    } catch (err: any) {
      setErrorMsg(err.message || 'Translation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleProofreadSubmit = async () => {
    if (!textToTranslate.trim()) return;
    setIsGenerating(true);
    try {
      const res = await proofreadAIText(textToTranslate, selectedLanguage);
      setProofreadResult(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Proofread failed');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4 space-y-5 text-stone-800 text-sm overflow-y-auto max-h-[calc(100vh-140px)]">
      {/* Sub tabs */}
      <div className="flex border-b border-stone-200">
        <button
          onClick={() => setActionTab('generate')}
          className={`flex-1 pb-2 text-xs font-semibold flex items-center justify-center gap-1 border-b-2 transition-colors ${
            actionTab === 'generate'
              ? 'border-royal-gold text-royal-maroon'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-royal-gold" />
          AI Wording
        </button>
        <button
          onClick={() => setActionTab('translate')}
          className={`flex-1 pb-2 text-xs font-semibold flex items-center justify-center gap-1 border-b-2 transition-colors ${
            actionTab === 'translate'
              ? 'border-royal-gold text-royal-maroon'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Languages className="w-3.5 h-3.5" />
          Translate
        </button>
        <button
          onClick={() => setActionTab('proofread')}
          className={`flex-1 pb-2 text-xs font-semibold flex items-center justify-center gap-1 border-b-2 transition-colors ${
            actionTab === 'proofread'
              ? 'border-royal-gold text-royal-maroon'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <SpellCheck className="w-3.5 h-3.5" />
          Proofread
        </button>
      </div>

      {actionTab === 'generate' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3 rounded-lg border border-amber-200/80">
            <div className="flex items-center gap-2 text-royal-maroon font-semibold text-xs mb-1">
              <Sparkles className="w-4 h-4 text-royal-gold" />
              <span>Auspicious AI Content Generator</span>
            </div>
            <p className="text-[11px] text-stone-600">
              Generates culturally authentic wording, mantras, and formatting in your selected Indian script.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Card Tone & Emotion</label>
            <div className="grid grid-cols-2 gap-1.5">
              {tones.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={`text-left text-xs p-2 rounded border transition-all ${
                    tone === t.id
                      ? 'border-royal-gold bg-amber-50 text-royal-maroon font-semibold shadow-xs'
                      : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Script & Language</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as any)}
              className="w-full bg-white border border-stone-300 rounded px-3 py-1.5 text-xs focus:border-royal-gold outline-none"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-royal-maroon to-royal-maroon-dark text-white rounded-md font-semibold text-xs flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50 shadow-md transition-all cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-royal-gold" />
                Generating Auspicious Wording...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-royal-gold" />
                Generate Complete Invitation Wording
              </>
            )}
          </button>

          {errorMsg && <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded border border-red-200">{errorMsg}</div>}

          {/* Generated Result Preview */}
          {generatedResult && (
            <div className="mt-4 p-3.5 bg-white rounded-lg border border-amber-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <span className="text-xs font-bold text-royal-maroon">Generated Content Preview</span>
                <button
                  onClick={handleApplyToCanvas}
                  className="px-2.5 py-1 bg-royal-gold hover:bg-royal-gold-dark text-royal-maroon-dark text-xs font-semibold rounded flex items-center gap-1 shadow-xs cursor-pointer transition-colors"
                >
                  Apply to Card
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {generatedResult.blessing && (
                <div>
                  <span className="text-[10px] text-stone-400 font-bold uppercase">Opening Blessing</span>
                  <p className="text-xs font-semibold text-royal-maroon mt-0.5">{generatedResult.blessing}</p>
                </div>
              )}

              {generatedResult.heading && (
                <div>
                  <span className="text-[10px] text-stone-400 font-bold uppercase">Main Heading</span>
                  <p className="text-sm font-bold text-stone-800 mt-0.5">{generatedResult.heading}</p>
                </div>
              )}

              {generatedResult.coupleOrCelebrant && (
                <div>
                  <span className="text-[10px] text-stone-400 font-bold uppercase">Couple / Celebrant</span>
                  <p className="text-xs whitespace-pre-line text-stone-800 font-medium mt-0.5">
                    {generatedResult.coupleOrCelebrant}
                  </p>
                </div>
              )}

              {generatedResult.invitationMessage && (
                <div>
                  <span className="text-[10px] text-stone-400 font-bold uppercase">Invitation Body</span>
                  <p className="text-xs text-stone-700 mt-0.5 leading-relaxed">
                    {generatedResult.invitationMessage}
                  </p>
                </div>
              )}

              {/* WhatsApp Sharable Card */}
              {generatedResult.whatsappMessage && (
                <div className="bg-emerald-50/80 p-2.5 rounded border border-emerald-200 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-emerald-800 flex items-center gap-1">
                      📱 WhatsApp Ready Message
                    </span>
                    <button
                      onClick={() => copyToClipboard(generatedResult.whatsappMessage)}
                      className="text-[11px] text-emerald-700 hover:text-emerald-900 font-medium flex items-center gap-1"
                    >
                      {copiedWhatsApp ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="text-[11px] text-stone-700 whitespace-pre-wrap font-sans bg-white p-2 rounded border border-emerald-100 max-h-32 overflow-y-auto">
                    {generatedResult.whatsappMessage}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Translation Tab */}
      {actionTab === 'translate' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Text to Translate</label>
            <textarea
              value={textToTranslate}
              onChange={(e) => setTextToTranslate(e.target.value)}
              placeholder="Paste invitation text to translate..."
              className="w-full h-24 p-2 text-xs border border-stone-300 rounded focus:border-royal-gold outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Target Language</label>
            <select
              value={targetTranslateLang}
              onChange={(e) => setTargetTranslateLang(e.target.value)}
              className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-xs focus:border-royal-gold outline-none"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleTranslateSubmit}
            disabled={isGenerating || !textToTranslate.trim()}
            className="w-full py-2 bg-royal-maroon text-white rounded font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? 'Translating...' : 'Translate to Native Script'}
          </button>

          {translationResult && (
            <div className="p-3 bg-amber-50 rounded border border-amber-200 text-xs">
              <span className="font-bold text-royal-maroon block mb-1">Translated Text:</span>
              <p className="whitespace-pre-wrap">{translationResult}</p>
            </div>
          )}
        </div>
      )}

      {/* Proofread Tab */}
      {actionTab === 'proofread' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Text to Proofread</label>
            <textarea
              value={textToTranslate}
              onChange={(e) => setTextToTranslate(e.target.value)}
              placeholder="Enter Hindi, Bengali, Tamil, etc. text to verify Indic glyphs and spellings..."
              className="w-full h-24 p-2 text-xs border border-stone-300 rounded focus:border-royal-gold outline-none"
            />
          </div>

          <button
            onClick={handleProofreadSubmit}
            disabled={isGenerating || !textToTranslate.trim()}
            className="w-full py-2 bg-royal-maroon text-white rounded font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? 'Analyzing Wording...' : 'Verify Grammar & Indic Shaping'}
          </button>

          {proofreadResult.corrected && (
            <div className="p-3 bg-emerald-50 rounded border border-emerald-200 text-xs space-y-2">
              <div>
                <span className="font-bold text-emerald-800 block">Corrected Text:</span>
                <p className="whitespace-pre-wrap mt-0.5">{proofreadResult.corrected}</p>
              </div>
              {proofreadResult.notes && (
                <p className="text-[11px] text-emerald-700 italic">{proofreadResult.notes}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
