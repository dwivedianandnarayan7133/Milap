import React from 'react';
import { useCardStore } from '../../store/cardStore';
import { Plus, Copy, Trash2 } from 'lucide-react';

export const PageStrip: React.FC = () => {
  const {
    project,
    activePageIndex,
    setActivePageIndex,
    addPage,
    duplicatePage,
    removePage,
  } = useCardStore();

  return (
    <div className="h-16 sm:h-20 bg-white border-t border-stone-200 px-2 sm:px-6 flex items-center justify-between shrink-0 z-10 shadow-xs">
      {/* Left: Page Counter */}
      <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 min-w-0 pr-1">
        <span className="shrink-0 font-mono text-[11px] sm:text-xs">
          P.{activePageIndex + 1}/{project.pages.length}
        </span>
        <span className="text-stone-300 hidden sm:inline">•</span>
        <span className="text-royal-maroon font-serif truncate max-w-[80px] sm:max-w-xs text-[11px] sm:text-xs">
          {project.pages[activePageIndex]?.title}
        </span>
      </div>

      {/* Center: Interactive Thumbnails (Responsive Horizontal Scroller) */}
      <div className="flex-1 min-w-0 mx-2 sm:mx-4 flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto scroll-smooth overscroll-x-contain py-1 custom-studio-scroller-h">
        {project.pages.map((p, idx) => {
          const isActive = idx === activePageIndex;
          const bg = p.background;

          return (
            <div
              key={p.id}
              onClick={() => setActivePageIndex(idx)}
              className={`relative group cursor-pointer flex flex-col items-center transition-all shrink-0 ${
                isActive ? 'scale-105' : 'opacity-70 hover:opacity-100'
              }`}
            >
              {/* Mini Card Preview */}
              <div
                className={`w-8 h-11 sm:w-10 sm:h-14 rounded-xs border shadow-xs overflow-hidden flex flex-col items-center justify-center p-0.5 ${
                  isActive
                    ? 'border-royal-gold ring-2 ring-royal-gold/40'
                    : 'border-stone-300'
                }`}
                style={{
                  backgroundColor: bg.color || '#FFFDF9',
                  backgroundImage: bg.type === 'gradient' ? bg.gradient : undefined,
                }}
              >
                <span className="text-[6px] sm:text-[7px] text-center font-serif text-stone-500 font-bold truncate max-w-full">
                  {p.title.split(' ')[0]}
                </span>
              </div>

              <span className="text-[9px] sm:text-[10px] font-medium text-stone-600 mt-0.5 sm:mt-1">
                P.{idx + 1}
              </span>
            </div>
          );
        })}

        {/* Add Page Button */}
        <button
          onClick={() => addPage('custom', `Page ${project.pages.length + 1}`)}
          className="w-8 h-11 sm:w-10 sm:h-14 rounded-xs border border-dashed border-stone-300 hover:border-royal-gold hover:bg-amber-50/50 flex flex-col items-center justify-center gap-0.5 text-stone-500 hover:text-royal-maroon transition-all cursor-pointer shrink-0"
          title="Add New Card Page"
        >
          <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="text-[7px] sm:text-[8px] font-bold">Add</span>
        </button>
      </div>

      {/* Right: Quick Page Tools */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 pl-1">
        <button
          onClick={() => duplicatePage(activePageIndex)}
          title="Duplicate Current Page"
          className="p-1 sm:p-1.5 border border-stone-200 hover:bg-stone-50 rounded text-stone-600 hover:text-stone-900 text-xs flex items-center gap-1 cursor-pointer"
        >
          <Copy className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Duplicate</span>
        </button>
        {project.pages.length > 1 && (
          <button
            onClick={() => removePage(activePageIndex)}
            title="Delete Current Page"
            className="p-1 sm:p-1.5 border border-stone-200 hover:bg-red-50 rounded text-stone-500 hover:text-red-600 text-xs flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Delete</span>
          </button>
        )}
      </div>
    </div>
  );
};
