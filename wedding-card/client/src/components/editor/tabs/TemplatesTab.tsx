import React, { useState } from 'react';
import { useCardStore } from '../../../store/cardStore';
import { CARD_TEMPLATES } from '../../../data/templates';
import { EVENT_CATEGORIES } from '../../../data/categories';
import { TemplateDefinition } from '../../../types/card';
import { Layout, Check, Sparkles } from 'lucide-react';

export const TemplatesTab: React.FC = () => {
  const { project, applyTemplate } = useCardStore();
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filtered = CARD_TEMPLATES.filter((t) => {
    if (filterCategory === 'all') return true;
    return t.category === filterCategory;
  });

  const handleSelectTemplate = (tpl: TemplateDefinition) => {
    applyTemplate(tpl);
    const curLang = project.language;
    if (curLang && curLang !== 'hi') {
      useCardStore.getState().setLanguage(curLang, project.secondaryLanguage, project.eventDetails.isBilingual);
    }
  };

  return (
    <div className="p-4 space-y-4 text-stone-800 text-sm h-full overflow-y-auto overscroll-y-contain custom-studio-scroller pb-24 sm:pb-8">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-stone-700">Filter Templates</span>
          <span className="text-[11px] text-stone-500">{filtered.length} designs available</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-2.5 py-1 text-xs rounded-full border transition-all cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-royal-maroon text-white border-royal-maroon'
                : 'bg-white text-stone-600 border-stone-200 hover:border-royal-gold'
            }`}
          >
            All Styles
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
                onClick={() => setFilterCategory(cat.id)}
                className={`px-2.5 py-1 text-xs rounded-full border transition-all cursor-pointer ${
                  filterCategory === cat.id
                    ? 'bg-royal-maroon text-white border-royal-maroon'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-royal-gold'
                }`}
              >
                {shortLabel}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((tpl) => {
          const isActive = project.templateId === tpl.id;

          return (
            <div
              key={tpl.id}
              onClick={() => handleSelectTemplate(tpl)}
              className={`p-3 rounded-lg border transition-all cursor-pointer bg-white hover:shadow-md ${
                isActive
                  ? 'border-royal-gold ring-2 ring-royal-gold/30 bg-amber-50/20'
                  : 'border-stone-200 hover:border-royal-gold/60'
              }`}
            >
              <div className="flex gap-3 items-center">
                {/* Visual Preview Box */}
                <div
                  className={`w-14 h-20 rounded border flex items-center justify-center shadow-xs shrink-0 ${tpl.previewBg}`}
                  style={{ backgroundColor: tpl.theme.backgroundColor }}
                >
                  <div
                    className="w-10 h-14 border border-dashed rounded-xs flex items-center justify-center text-[9px] font-serif text-center px-0.5"
                    style={{
                      borderColor: tpl.theme.secondaryColor,
                      color: tpl.theme.secondaryColor,
                    }}
                  >
                    {tpl.category === 'wedding' ? 'शुभ विवाह' : tpl.title.split(' ')[0]}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-royal-maroon truncate">{tpl.title}</h4>
                    {isActive && (
                      <span className="bg-royal-gold text-royal-maroon-dark text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5" /> Active
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">{tpl.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {tpl.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] px-1.5 py-0.5 bg-stone-100 text-stone-600 rounded font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
