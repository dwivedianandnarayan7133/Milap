import React from 'react';
import { useCardStore } from '../../store/cardStore';
import { FONT_OPTIONS, ROYAL_COLORS } from '../../utils/canvasUtils';
import { TextElement, MotifElement, FrameElement } from '../../types/card';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Sparkles,
  Lock,
  Unlock,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Layers,
  Eye,
  X,
  Sliders,
} from 'lucide-react';

interface RightSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  isOpen = true,
  onClose,
  isMobile = false,
}) => {
  const {
    project,
    activePageIndex,
    selectedElementId,
    updateElement,
    removeElement,
    duplicateElement,
    toggleElementLock,
    reorderElementZ,
    updatePageBackground,
    showBleedGuide,
    showSafeGuide,
    showGridGuide,
    toggleBleedGuide,
    toggleSafeGuide,
    toggleGridGuide,
  } = useCardStore();

  const currentPage = project.pages[activePageIndex];
  const selectedElement = currentPage?.elements.find((el) => el.id === selectedElementId);

  // If mobile and not open, don't render
  if (isMobile && !isOpen) return null;

  // Render Inner Content
  const renderContent = () => {
    // If no element is selected: show Page & Canvas settings
    if (!selectedElement) {
      const bg = currentPage?.background;

      return (
        <div className="p-4 space-y-6 text-stone-800 text-sm overflow-y-auto flex-1">
          <div>
            <h3 className="text-xs font-bold text-royal-maroon uppercase tracking-wider mb-1">
              Page Properties
            </h3>
            <p className="text-[11px] text-stone-500">
              {currentPage?.title || `Page ${activePageIndex + 1}`} ({project.format.replace('_', ' ')})
            </p>
          </div>

          {/* Canvas Guides */}
          <div className="space-y-2 border-t border-stone-100 pt-3">
            <label className="block text-xs font-semibold text-stone-700">Print & Safe Guides</label>
            <div className="space-y-1.5">
              <label className="flex items-center justify-between text-xs text-stone-600 bg-stone-50 p-2 rounded cursor-pointer hover:bg-stone-100/70">
                <span>Show Safe Area (Margin)</span>
                <input
                  type="checkbox"
                  checked={showSafeGuide}
                  onChange={toggleSafeGuide}
                  className="rounded text-royal-gold focus:ring-royal-gold"
                />
              </label>
              <label className="flex items-center justify-between text-xs text-stone-600 bg-stone-50 p-2 rounded cursor-pointer hover:bg-stone-100/70">
                <span>Show Print Bleed (3mm)</span>
                <input
                  type="checkbox"
                  checked={showBleedGuide}
                  onChange={toggleBleedGuide}
                  className="rounded text-royal-gold focus:ring-royal-gold"
                />
              </label>
              <label className="flex items-center justify-between text-xs text-stone-600 bg-stone-50 p-2 rounded cursor-pointer hover:bg-stone-100/70">
                <span>Show Alignment Grid</span>
                <input
                  type="checkbox"
                  checked={showGridGuide}
                  onChange={toggleGridGuide}
                  className="rounded text-royal-gold focus:ring-royal-gold"
                />
              </label>
            </div>
          </div>

          {/* Background Color */}
          <div className="space-y-2 border-t border-stone-100 pt-3">
            <label className="block text-xs font-semibold text-stone-700">Card Base Color</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={bg?.color || '#FFFDF9'}
                onChange={(e) => updatePageBackground(activePageIndex, { color: e.target.value })}
                className="w-8 h-8 rounded border border-stone-300 cursor-pointer p-0"
              />
              <span className="text-xs font-mono text-stone-600">{bg?.color || '#FFFDF9'}</span>
            </div>

            <div className="grid grid-cols-6 gap-1.5 pt-1">
              {ROYAL_COLORS.slice(0, 12).map((c) => (
                <button
                  key={c.name}
                  onClick={() => updatePageBackground(activePageIndex, { color: c.value })}
                  title={c.name}
                  className="w-7 h-7 rounded border border-stone-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }

    // When an element is selected
    const handleUpdate = (updates: any) => {
      updateElement(activePageIndex, selectedElement.id, updates);
    };

    const isText = selectedElement.type === 'text';
    const textEl = isText ? (selectedElement as TextElement) : null;

    return (
      <div className="p-4 space-y-5 text-stone-800 text-sm overflow-y-auto flex-1">
        {/* Header: Element Type & Quick Actions */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h3 className="text-xs font-bold text-royal-maroon uppercase tracking-wider">
              {selectedElement.type} Element
            </h3>
            <span className="text-[10px] text-stone-400 font-mono">ID: {selectedElement.id.slice(0, 8)}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleElementLock(activePageIndex, selectedElement.id)}
              className={`p-1.5 rounded hover:bg-stone-100 cursor-pointer ${
                selectedElement.isLocked ? 'text-amber-600 bg-amber-50' : 'text-stone-500'
              }`}
              title={selectedElement.isLocked ? 'Unlock Element' : 'Lock Element'}
            >
              {selectedElement.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => duplicateElement(activePageIndex, selectedElement.id)}
              className="p-1.5 rounded hover:bg-stone-100 text-stone-500 cursor-pointer"
              title="Duplicate Element"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => removeElement(activePageIndex, selectedElement.id)}
              className="p-1.5 rounded hover:bg-red-50 text-red-500 cursor-pointer"
              title="Delete Element"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Text Specific Controls */}
        {isText && textEl && (
          <div className="space-y-4">
            {/* Direct Content Editor */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Text Content</label>
              <textarea
                value={textEl.content}
                onChange={(e) => handleUpdate({ content: e.target.value })}
                rows={3}
                className="w-full text-xs p-2 border border-stone-200 rounded focus:border-royal-gold outline-none font-sans"
              />
            </div>

            {/* Typography Font Picker */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Font Family</label>
              <select
                value={textEl.fontFamily}
                onChange={(e) => handleUpdate({ fontFamily: e.target.value })}
                className="w-full text-xs p-1.5 border border-stone-200 rounded focus:border-royal-gold outline-none bg-stone-50"
              >
                {FONT_OPTIONS.map((f, i) => (
                  <option key={i} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size & Alignment */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Font Size</label>
                <div className="flex items-center gap-1">
                  <input
                    type="range"
                    min="10"
                    max="72"
                    value={textEl.fontSize}
                    onChange={(e) => handleUpdate({ fontSize: Number(e.target.value) })}
                    className="w-full accent-royal-maroon"
                  />
                  <span className="text-xs font-mono w-6 text-right">{textEl.fontSize}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Alignment</label>
                <div className="flex border border-stone-200 rounded overflow-hidden">
                  {(['left', 'center', 'right', 'justify'] as const).map((align) => {
                    const Icon =
                      align === 'left'
                        ? AlignLeft
                        : align === 'center'
                        ? AlignCenter
                        : align === 'right'
                        ? AlignRight
                        : AlignJustify;
                    const isActive = textEl.align === align;

                    return (
                      <button
                        key={align}
                        onClick={() => handleUpdate({ align })}
                        className={`flex-1 p-1 flex items-center justify-center cursor-pointer ${
                          isActive ? 'bg-royal-maroon text-white' : 'hover:bg-stone-50 text-stone-600'
                        }`}
                      >
                        <Icon className="w-3 h-3" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Simulated Gold Foil Toggle */}
            <div className="pt-1">
              <label className="flex items-center justify-between p-2 rounded-lg bg-amber-50/80 border border-amber-200 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-royal-gold" />
                  <div>
                    <span className="text-xs font-bold text-royal-maroon block leading-tight">
                      Simulated Gold Foil
                    </span>
                    <span className="text-[10px] text-stone-500">Royal metallic gold gradient</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(textEl.isFoil)}
                  onChange={(e) => handleUpdate({ isFoil: e.target.checked })}
                  className="rounded text-royal-gold focus:ring-royal-gold cursor-pointer"
                />
              </label>
            </div>

            {/* Text Color Picker */}
            {!textEl.isFoil && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Text Color</label>
                <div className="flex gap-2 items-center mb-2">
                  <input
                    type="color"
                    value={textEl.color}
                    onChange={(e) => handleUpdate({ color: e.target.value })}
                    className="w-8 h-8 rounded border border-stone-300 cursor-pointer p-0"
                  />
                  <span className="text-xs font-mono text-stone-600">{textEl.color}</span>
                </div>

                <div className="grid grid-cols-6 gap-1.5">
                  {ROYAL_COLORS.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => handleUpdate({ color: c.value })}
                      title={c.name}
                      className="w-7 h-7 rounded border border-stone-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: c.value }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Motif Color Controls */}
        {selectedElement.type === 'motif' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Motif Color</label>
              <div className="flex gap-2 items-center mb-2">
                <input
                  type="color"
                  value={(selectedElement as any).color || '#D4AF37'}
                  onChange={(e) => handleUpdate({ color: e.target.value })}
                  className="w-8 h-8 rounded border border-stone-300 cursor-pointer p-0"
                />
                <span className="text-xs font-mono text-stone-600">{(selectedElement as any).color}</span>
              </div>
              <div className="grid grid-cols-6 gap-1.5">
                {ROYAL_COLORS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => handleUpdate({ color: c.value })}
                    title={c.name}
                    className="w-7 h-7 rounded border border-stone-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Layer Depth Controls */}
        <div className="border-t border-stone-100 pt-3">
          <label className="block text-xs font-semibold text-stone-700 mb-2">Layer Ordering</label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => reorderElementZ(activePageIndex, selectedElement.id, 'forward')}
              className="p-1.5 border border-stone-200 hover:bg-stone-50 rounded text-xs flex items-center justify-center gap-1 cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5 text-stone-600" /> Bring Forward
            </button>
            <button
              onClick={() => reorderElementZ(activePageIndex, selectedElement.id, 'backward')}
              className="p-1.5 border border-stone-200 hover:bg-stone-50 rounded text-xs flex items-center justify-center gap-1 cursor-pointer"
            >
              <ArrowDown className="w-3.5 h-3.5 text-stone-600" /> Send Backward
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Mobile Drawer Overlay
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />
        {/* Slide-in Container from Right */}
        <div className="relative w-full sm:w-[360px] max-w-[85vw] bg-white h-full shadow-2xl z-10 flex flex-col animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-amber-200/80 bg-gradient-to-r from-royal-maroon to-royal-maroon-dark text-white shrink-0">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-royal-gold" />
              <span className="font-serif font-bold text-sm tracking-wide">
                {selectedElement ? `${selectedElement.type.toUpperCase()} Properties` : 'Page Properties'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              title="Close Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {renderContent()}
        </div>
      </div>
    );
  }

  // Desktop Static Sidebar
  return (
    <aside
      className={`w-72 lg:w-80 bg-white border-l border-stone-200 flex flex-col shrink-0 h-full z-20 shadow-xs transition-all duration-200 ${
        !isOpen ? 'hidden' : ''
      }`}
    >
      {renderContent()}
    </aside>
  );
};
