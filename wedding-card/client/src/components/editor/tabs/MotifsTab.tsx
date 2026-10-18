import React, { useState } from 'react';
import { useCardStore } from '../../../store/cardStore';
import { TRADITIONAL_MOTIFS } from '../../../data/motifs';
import { Sparkles, Check, Plus, Globe, Moon, Heart } from 'lucide-react';

export const MotifsTab: React.FC = () => {
  const { addElement, project, setRegionalMotif, activePageIndex } = useCardStore();
  const primaryColor = project.theme.secondaryColor || '#D4AF37';
  const [filterCategory, setFilterCategory] = useState<'all' | 'sacred' | 'milestones' | 'regional'>('all');

  const activePage = project.pages[activePageIndex] || project.pages[0];
  const activeMotifEl = activePage?.elements?.find((el) => el.type === 'motif') as any;
  const currentActiveMotifKey = activeMotifEl?.motifKey;

  // When a motif is clicked:
  // If the card already has a motif element, replace it immediately so the invitation updates!
  // If no motif exists on the page, add one cleanly at the top header location.
  const handleSelectMotif = (motifKey: string) => {
    if (activeMotifEl) {
      setRegionalMotif(motifKey);
    } else {
      addElement({
        type: 'motif',
        motifKey,
        color: primaryColor,
        x: 40,
        y: 12,
        width: 20,
        height: 15,
        rotation: 0,
      } as any);
    }
  };

  const handleAddDuplicate = (e: React.MouseEvent, motifKey: string) => {
    e.stopPropagation();
    addElement({
      type: 'motif',
      motifKey,
      color: primaryColor,
      x: 40,
      y: 25,
      width: 18,
      height: 14,
      rotation: 0,
    } as any);
  };

  const handleAddDivider = () => {
    addElement({
      type: 'divider',
      style: 'ornate_flourish',
      color: primaryColor,
      x: 20,
      y: 50,
      width: 60,
      height: 4,
      rotation: 0,
    } as any);
  };

  const handleAddFrame = (frameStyle: any) => {
    addElement({
      type: 'frame',
      frameStyle,
      color: primaryColor,
      thickness: 2,
      padding: 10,
      x: 4,
      y: 4,
      width: 92,
      height: 92,
      rotation: 0,
      isLocked: true,
    } as any);
  };

  const motifsList = Object.values(TRADITIONAL_MOTIFS);

  const filteredMotifs = motifsList.filter((m) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'sacred') {
      return [
        'ganesh',
        'islamic_crescent',
        'bismillah',
        'ik_onkar',
        'christian_cross',
        'om',
        'sacred_hawan',
        'kalash',
      ].includes(m.id);
    }
    if (filterCategory === 'milestones') {
      return [
        'diamond_rings',
        'bal_gopal_cradle',
        'lotus',
        'peacock',
        'diya',
        'doli',
        'shehnai',
      ].includes(m.id);
    }
    if (filterCategory === 'regional') {
      return [
        'marathi_tutari',
        'gujarati_shubh_labh',
        'bengali_alpana',
        'south_kolam',
        'kerala_nilavilakku',
        'odia_konark_wheel',
        'rajasthani_jharokha',
        'kashmiri_chinar',
        'assamese_jaapi',
        'santali_ol_pattern',
        'phulkari_flower',
      ].includes(m.id);
    }
    return true;
  });

  return (
    <div className="p-4 space-y-5 text-stone-800 text-sm h-full overflow-y-auto overscroll-y-contain custom-studio-scroller pb-24 sm:pb-8">
      {/* Traditional Motifs */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-royal-maroon uppercase tracking-wider">
            Auspicious Motifs & Symbols
          </label>
          <span className="text-[10px] text-stone-400">Click to apply to card</span>
        </div>

        {/* Quick Filter Categories */}
        <div className="flex items-center gap-1 mb-3 overflow-x-auto pb-1 text-[11px] font-semibold">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-royal-maroon text-white font-bold'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All ({motifsList.length})
          </button>
          <button
            onClick={() => setFilterCategory('sacred')}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
              filterCategory === 'sacred'
                ? 'bg-royal-maroon text-white font-bold'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <span>Faith & Sacred</span>
          </button>
          <button
            onClick={() => setFilterCategory('milestones')}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
              filterCategory === 'milestones'
                ? 'bg-royal-maroon text-white font-bold'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <span>Milestones & Rings</span>
          </button>
          <button
            onClick={() => setFilterCategory('regional')}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
              filterCategory === 'regional'
                ? 'bg-royal-maroon text-white font-bold'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <span>Regional Heritage</span>
          </button>
        </div>

        {/* Motifs Grid */}
        <div className="grid grid-cols-3 gap-2">
          {filteredMotifs.map((m) => {
            const isCurrent = currentActiveMotifKey === m.id;
            return (
              <div
                key={m.id}
                onClick={() => handleSelectMotif(m.id)}
                className={`p-2 rounded-lg border transition-all flex flex-col items-center justify-between group cursor-pointer relative ${
                  isCurrent
                    ? 'bg-amber-50/90 border-royal-gold shadow-xs ring-1 ring-royal-gold'
                    : 'bg-white border-stone-200 hover:border-royal-gold hover:shadow-xs'
                }`}
                title={`${m.name} — ${m.description}\nClick to apply to invitation`}
              >
                {/* Active Indicator Badge */}
                {isCurrent && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-royal-gold text-royal-maroon flex items-center justify-center text-[10px] shadow-xs">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}

                <div className="w-10 h-10 flex items-center justify-center text-royal-gold group-hover:scale-110 transition-transform">
                  <svg
                    viewBox={m.viewBox}
                    className="w-full h-full fill-current"
                    dangerouslySetInnerHTML={{ __html: m.svgPath }}
                  />
                </div>

                <div className="w-full text-center mt-1">
                  <span className="text-[10px] text-stone-800 font-semibold block truncate leading-tight">
                    {m.name.split(' (')[0].split(' / ')[0]}
                  </span>
                  <span className="text-[9px] text-stone-400 block truncate">
                    {m.category}
                  </span>
                </div>

                {/* Add Extra Button */}
                <button
                  onClick={(e) => handleAddDuplicate(e, m.id)}
                  title="Add extra instance on canvas"
                  className="opacity-0 group-hover:opacity-100 transition-opacity mt-1 text-[9px] text-royal-maroon hover:underline flex items-center gap-0.5"
                >
                  <Plus className="w-2.5 h-2.5" /> Extra
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Borders & Frames */}
      <div>
        <label className="block text-xs font-bold text-royal-maroon uppercase tracking-wider mb-2">
          Borders & Arches
        </label>
        <div className="space-y-1.5">
          <button
            onClick={() => handleAddFrame('royal_arch')}
            className="w-full p-2.5 bg-white border border-stone-200 hover:border-royal-gold rounded text-left text-xs flex items-center justify-between font-medium cursor-pointer"
          >
            <span>Royal Arch Double Border</span>
            <span className="text-[10px] text-royal-gold font-bold">+ Add Frame</span>
          </button>
          <button
            onClick={() => handleAddFrame('mandala_double')}
            className="w-full p-2.5 bg-white border border-stone-200 hover:border-royal-gold rounded text-left text-xs flex items-center justify-between font-medium cursor-pointer"
          >
            <span>Mandala Floral Border</span>
            <span className="text-[10px] text-royal-gold font-bold">+ Add Frame</span>
          </button>
          <button
            onClick={() => handleAddFrame('minimal_gold')}
            className="w-full p-2.5 bg-white border border-stone-200 hover:border-royal-gold rounded text-left text-xs flex items-center justify-between font-medium cursor-pointer"
          >
            <span>Minimalist Thin Gold Line</span>
            <span className="text-[10px] text-royal-gold font-bold">+ Add Frame</span>
          </button>
        </div>
      </div>

      {/* Dividers */}
      <div>
        <label className="block text-xs font-bold text-royal-maroon uppercase tracking-wider mb-2">
          Flourish Dividers
        </label>
        <button
          onClick={handleAddDivider}
          className="w-full p-2.5 bg-white border border-stone-200 hover:border-royal-gold rounded text-left text-xs flex items-center justify-between font-medium cursor-pointer"
        >
          <span>Royal Center Knot Divider</span>
          <span className="text-[10px] text-royal-gold font-bold">+ Add Line</span>
        </button>
      </div>
    </div>
  );
};
