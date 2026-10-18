import React, { useState, useEffect } from 'react';
import { useCardStore } from '../../store/cardStore';
import { getDimensionsForFormat } from '../../utils/canvasUtils';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenExport: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, onOpenExport }) => {
  const { project } = useCardStore();
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [scale, setScale] = useState(1);

  const totalPages = project.pages.length;
  const page = project.pages[currentPageIdx] || project.pages[0];
  const dims = getDimensionsForFormat(project.format);

  // Responsive scale factor calculation
  useEffect(() => {
    if (!isOpen) return;

    const calculateScale = () => {
      const availWidth = window.innerWidth - (window.innerWidth < 640 ? 24 : 100);
      const availHeight = window.innerHeight - (window.innerWidth < 640 ? 140 : 170);

      const scaleX = availWidth / dims.widthPx;
      const scaleY = availHeight / dims.heightPx;
      const calculated = Math.min(1, Math.min(scaleX, scaleY));
      setScale(Math.max(0.35, Math.round(calculated * 100) / 100));
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, [isOpen, dims.widthPx, dims.heightPx]);

  if (!isOpen) return null;

  const bg = page?.background;
  let bgStyle: React.CSSProperties = {
    backgroundColor: bg?.color || '#FFFDF9',
  };
  if (bg?.type === 'gradient' && bg.gradient) {
    bgStyle.backgroundImage = bg.gradient;
  } else if (bg?.type === 'image' && bg.imageUrl) {
    bgStyle.backgroundImage = `url(${bg.imageUrl})`;
    bgStyle.backgroundSize = 'cover';
    bgStyle.backgroundPosition = 'center';
  }

  const prevPage = () => setCurrentPageIdx((i) => Math.max(0, i - 1));
  const nextPage = () => setCurrentPageIdx((i) => Math.min(totalPages - 1, i + 1));

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col select-none">
      {/* Top Header */}
      <div className="h-14 px-3 sm:px-6 flex items-center justify-between text-white border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-2">
          <span className="font-serif font-bold text-royal-gold tracking-wide truncate max-w-[150px] sm:max-w-md text-xs sm:text-base">
            {project.title}
          </span>
          <span className="text-[10px] sm:text-xs text-white/60 shrink-0">
            ({currentPageIdx + 1}/{totalPages})
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => {
              onClose();
              onOpenExport();
            }}
            className="px-2.5 sm:px-3.5 py-1.5 bg-royal-gold text-royal-maroon-dark font-bold text-xs rounded flex items-center gap-1.5 shadow-sm hover:bg-royal-gold-dark cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden xs:inline sm:inline">Download PDF</span>
            <span className="xs:hidden sm:hidden">PDF</span>
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            title="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Preview Center with Auto-Scaling Container */}
      <div className="flex-1 overflow-hidden flex items-center justify-center p-2 sm:p-6 relative">
        {/* Navigation Arrows */}
        {currentPageIdx > 0 && (
          <button
            onClick={prevPage}
            className="absolute left-2 sm:left-6 z-20 p-2 sm:p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all backdrop-blur-xs cursor-pointer border border-white/20"
            title="Previous Page"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {currentPageIdx < totalPages - 1 && (
          <button
            onClick={nextPage}
            className="absolute right-2 sm:right-6 z-20 p-2 sm:p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all backdrop-blur-xs cursor-pointer border border-white/20"
            title="Next Page"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Scaled Wrapper for Card */}
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            transition: 'transform 0.15s ease-out',
          }}
        >
          {/* Card Canvas */}
          <div
            className={`relative shadow-2xl rounded-sm overflow-hidden transition-all duration-300 ${
              bg?.textureName === 'ivory'
                ? 'paper-texture-ivory'
                : bg?.textureName === 'parchment'
                ? 'paper-texture-parchment'
                : ''
            }`}
            style={{
              width: `${dims.widthPx}px`,
              height: `${dims.heightPx}px`,
              ...bgStyle,
            }}
          >
            {page.elements
              .slice()
              .sort((a, b) => a.zIndex - b.zIndex)
              .map((el) => {
                return (
                  <div
                    key={el.id}
                    className="absolute"
                    style={{
                      left: `${el.x}%`,
                      top: `${el.y}%`,
                      width: `${el.width}%`,
                      height: `${el.height}%`,
                      transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
                      zIndex: el.zIndex,
                      opacity: el.opacity ?? 1,
                    }}
                  >
                    {/* Text Element */}
                    {el.type === 'text' && (
                      <div
                        className={`w-full h-full flex flex-col justify-center whitespace-pre-wrap select-none leading-relaxed ${
                          (el as any).isFoil || (el as any).foilEffect ? 'gold-foil-text' : ''
                        }`}
                        style={{
                          fontFamily: (el as any).fontFamily,
                          fontSize: `${(el as any).fontSize}px`,
                          color: (el as any).color,
                          textAlign: (el as any).align || (el as any).textAlign || 'center',
                          fontWeight: (el as any).fontWeight || 400,
                          fontStyle: (el as any).fontStyle || 'normal',
                          lineHeight: (el as any).lineHeight || 1.3,
                        }}
                      >
                        {(el as any).content}
                      </div>
                    )}

                    {/* Motif Element */}
                    {el.type === 'motif' && (
                      <div
                        className="w-full h-full flex items-center justify-center p-1"
                        style={{ color: (el as any).color || '#D4AF37' }}
                        dangerouslySetInnerHTML={{ __html: (el as any).svgContent }}
                      />
                    )}

                    {/* Frame Element */}
                    {el.type === 'frame' && (
                      <div
                        className="w-full h-full pointer-events-none"
                        style={{ color: (el as any).borderColor || '#D4AF37' }}
                        dangerouslySetInnerHTML={{ __html: (el as any).frameSvg }}
                      />
                    )}

                    {/* Divider Element */}
                    {el.type === 'divider' && (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ color: (el as any).color || '#D4AF37' }}
                        dangerouslySetInnerHTML={{ __html: (el as any).svgContent }}
                      />
                    )}

                    {/* QR Code Element */}
                    {el.type === 'qrcode' && (
                      <div className="w-full h-full p-1 bg-white rounded-xs shadow-xs flex items-center justify-center">
                        {(el as any).dataUrl && (
                          <img src={(el as any).dataUrl} alt="QR Code" className="w-full h-auto object-contain" />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Bottom Thumbnails */}
      <div className="h-14 sm:h-16 px-4 bg-black/60 flex items-center justify-center gap-2 sm:gap-3 shrink-0 overflow-x-auto">
        {project.pages.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => setCurrentPageIdx(idx)}
            className={`px-3 py-1 rounded text-xs font-semibold transition-all cursor-pointer truncate max-w-[120px] ${
              idx === currentPageIdx
                ? 'bg-royal-gold text-royal-maroon-dark shadow-sm'
                : 'text-white/60 hover:text-white bg-white/5'
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>
    </div>
  );
};
