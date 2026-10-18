import React, { useState } from 'react';
import { useCardStore } from '../../../store/cardStore';
import { generateAIBackground } from '../../../services/api';
import { Sparkles, Palette, RefreshCw, Layers } from 'lucide-react';

export const BackgroundsTab: React.FC = () => {
  const { project, activePageIndex, updatePageBackground } = useCardStore();
  const [customPrompt, setCustomPrompt] = useState(
    'An elegant Indian wedding invitation background with ivory handmade paper, a fine maroon floral border, subtle gold foil details, traditional paisley corners, and an empty central area for Hindi text.'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('royal_traditional');

  const currentPage = project.pages[activePageIndex];
  const bg = currentPage?.background;

  const textures = [
    { id: 'ivory', name: 'Ivory Handmade Paper', color: '#FFFDF9' },
    { id: 'parchment', name: 'Antique Parchment', color: '#F8F3E8' },
    { id: 'raw_silk', name: 'Raw Silk Texture', color: '#FDFBF5' },
    { id: 'maroon_velvet', name: 'Royal Maroon Velvet', color: '#4A0815' },
    { id: 'none', name: 'Plain Pure Paper', color: '#FFFFFF' },
  ];

  const gradients = [
    { name: 'Royal Maroon & Gold', value: 'linear-gradient(135deg, #5B0C1D 0%, #36050E 100%)' },
    { name: 'Midnight Navy & Gold', value: 'linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)' },
    { name: 'Emerald Temple & Gold', value: 'linear-gradient(135deg, #064E3B 0%, #022C22 100%)' },
    { name: 'Terracotta & Sandalwood', value: 'linear-gradient(135deg, #C85A32 0%, #872E0F 100%)' },
    { name: 'Ivory & Warm Cream', value: 'linear-gradient(180deg, #FFFFFF 0%, #FBF7EE 100%)' },
  ];

  const handleApplyTexture = (textureId: string, baseColor: string) => {
    updatePageBackground(activePageIndex, {
      type: textureId === 'maroon_velvet' ? 'gradient' : 'solid',
      color: baseColor,
      textureName: textureId as any,
      imageUrl: undefined,
    });
  };

  const handleApplyGradient = (grad: string) => {
    updatePageBackground(activePageIndex, {
      type: 'gradient',
      gradient: grad,
      textureName: 'none',
      imageUrl: undefined,
    });
  };

  const handleGenerateAIArtwork = async () => {
    setIsGenerating(true);
    try {
      const res = await generateAIBackground({
        theme: selectedTheme,
        primaryColor: project.theme.primaryColor,
        secondaryColor: project.theme.secondaryColor,
        texture: bg?.textureName || 'ivory',
        customPrompt,
      });

      if (res.data?.url) {
        updatePageBackground(activePageIndex, {
          type: 'image',
          imageUrl: res.data.url,
          imagePrompt: customPrompt,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4 space-y-5 text-stone-800 text-sm overflow-y-auto max-h-[calc(100vh-140px)]">
      {/* AI Background Generator */}
      <div className="bg-amber-50/70 p-3.5 rounded-lg border border-amber-200/90 space-y-3">
        <div className="flex items-center gap-1.5 text-royal-maroon font-bold text-xs">
          <Sparkles className="w-4 h-4 text-royal-gold" />
          <span>AI Indian Artwork Background Generator</span>
        </div>
        <p className="text-[11px] text-stone-600 leading-tight">
          Creates authentic Indian invitation backgrounds with borders & motifs, keeping the central area clean for editable text.
        </p>

        <div>
          <label className="block text-[11px] font-semibold text-stone-700 mb-1">Theme</label>
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            className="w-full bg-white border border-stone-300 rounded px-2.5 py-1 text-xs focus:border-royal-gold outline-none"
          >
            <option value="royal_traditional">Royal Rajputana Traditional</option>
            <option value="wedding">Hindu Wedding Shubh Vivah</option>
            <option value="floral">Pastel Garden Floral</option>
            <option value="luxury">Luxury Gold Foil & Ivory</option>
            <option value="festival">Festive Dhol & Marigold</option>
            <option value="minimalist">Minimalist Contemporary</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-stone-700 mb-1">Artwork Description</label>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="w-full h-18 p-2 text-xs border border-stone-300 rounded bg-white focus:border-royal-gold outline-none"
          />
        </div>

        <button
          onClick={handleGenerateAIArtwork}
          disabled={isGenerating}
          className="w-full py-2 bg-royal-gold hover:bg-royal-gold-dark text-royal-maroon-dark rounded font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Generating Artwork...
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              Generate & Apply Background
            </>
          )}
        </button>
      </div>

      {/* Traditional Indian Paper Textures */}
      <div>
        <label className="block text-xs font-bold text-royal-maroon uppercase tracking-wider mb-2">
          Traditional Paper Textures
        </label>
        <div className="space-y-1.5">
          {textures.map((tex) => (
            <button
              key={tex.id}
              onClick={() => handleApplyTexture(tex.id, tex.color)}
              className={`w-full p-2.5 rounded border text-left text-xs flex items-center justify-between transition-all ${
                bg?.textureName === tex.id && !bg.imageUrl
                  ? 'border-royal-gold bg-amber-50 font-bold text-royal-maroon'
                  : 'border-stone-200 bg-white hover:border-royal-gold/60 text-stone-700'
              }`}
            >
              <span>{tex.name}</span>
              <div
                className="w-6 h-6 rounded border border-stone-300 shadow-xs"
                style={{ backgroundColor: tex.color }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Royal Gradients */}
      <div>
        <label className="block text-xs font-bold text-royal-maroon uppercase tracking-wider mb-2">
          Royal Color Gradients
        </label>
        <div className="grid grid-cols-2 gap-2">
          {gradients.map((grad, i) => (
            <button
              key={i}
              onClick={() => handleApplyGradient(grad.value)}
              className="p-2 rounded border border-stone-200 hover:border-royal-gold transition-all text-left bg-white"
            >
              <div className="w-full h-8 rounded mb-1.5 shadow-xs" style={{ background: grad.value }} />
              <span className="text-[10px] text-stone-700 font-medium block truncate">{grad.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
