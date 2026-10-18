import React from 'react';
import { useCardStore } from '../../../store/cardStore';
import { Layers, Plus, Trash2, Copy, Lock, Unlock, Eye, ArrowUp, ArrowDown } from 'lucide-react';

export const LayersTab: React.FC = () => {
  const {
    project,
    activePageIndex,
    selectedElementId,
    selectElement,
    removeElement,
    toggleElementLock,
    reorderElementZ,
    addPage,
    removePage,
    duplicatePage,
    setActivePageIndex,
  } = useCardStore();

  const currentPage = project.pages[activePageIndex];
  const elements = currentPage?.elements || [];

  return (
    <div className="p-4 space-y-6 text-stone-800 text-sm overflow-y-auto max-h-[calc(100vh-140px)]">
      {/* Pages Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-royal-maroon uppercase tracking-wider">
            Card Pages ({project.pages.length})
          </label>
          <button
            onClick={() => addPage('custom', `Page ${project.pages.length + 1}`)}
            className="text-[11px] font-bold text-royal-gold hover:text-royal-gold-dark flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Page
          </button>
        </div>

        <div className="space-y-1.5">
          {project.pages.map((p, idx) => (
            <div
              key={p.id}
              onClick={() => setActivePageIndex(idx)}
              className={`p-2.5 rounded border flex items-center justify-between transition-all cursor-pointer ${
                activePageIndex === idx
                  ? 'bg-amber-50 border-royal-gold font-bold text-royal-maroon shadow-xs'
                  : 'bg-white border-stone-200 hover:border-royal-gold/60 text-stone-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-royal-gold/20 text-royal-maroon text-[10px] flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                <span className="text-xs">{p.title}</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicatePage(idx);
                  }}
                  title="Duplicate Page"
                  className="p-1 text-stone-400 hover:text-stone-700"
                >
                  <Copy className="w-3 h-3" />
                </button>
                {project.pages.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removePage(idx);
                    }}
                    title="Delete Page"
                    className="p-1 text-stone-400 hover:text-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Layers Section for Current Page */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-royal-maroon uppercase tracking-wider">
            Page Elements & Layers ({elements.length})
          </label>
        </div>

        <div className="space-y-1">
          {elements.length === 0 ? (
            <p className="text-xs text-stone-400 italic py-2">No elements on this page yet.</p>
          ) : (
            elements
              .slice()
              .reverse()
              .map((el) => {
                const isSelected = el.id === selectedElementId;
                let desc = el.type.toUpperCase();
                if (el.type === 'text') desc = `Text: ${(el as any).content.substring(0, 18)}...`;
                else if (el.type === 'motif') desc = `Motif: ${(el as any).motifKey}`;
                else if (el.type === 'frame') desc = 'Ornate Frame';

                return (
                  <div
                    key={el.id}
                    onClick={() => selectElement(el.id)}
                    className={`p-2 rounded border flex items-center justify-between transition-all cursor-pointer text-xs ${
                      isSelected
                        ? 'bg-amber-100/70 border-amber-400 font-semibold'
                        : 'bg-white border-stone-200 hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    <span className="truncate max-w-[150px]">{desc}</span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          reorderElementZ(activePageIndex, el.id, 'forward');
                        }}
                        title="Bring Forward"
                        className="p-1 text-stone-400 hover:text-stone-700"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          reorderElementZ(activePageIndex, el.id, 'backward');
                        }}
                        title="Send Backward"
                        className="p-1 text-stone-400 hover:text-stone-700"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleElementLock(activePageIndex, el.id);
                        }}
                        title={el.isLocked ? 'Unlock Element' : 'Lock Element'}
                        className={`p-1 ${el.isLocked ? 'text-amber-600' : 'text-stone-400 hover:text-stone-700'}`}
                      >
                        {el.isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeElement(activePageIndex, el.id);
                        }}
                        title="Delete Element"
                        className="p-1 text-stone-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </div>
    </div>
  );
};
