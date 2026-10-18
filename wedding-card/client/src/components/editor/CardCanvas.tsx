import React, { useRef, useState, useEffect } from 'react';
import { useCardStore } from '../../store/cardStore';
import { CardElement, TextElement, MotifElement, FrameElement, DividerElement, QRCodeElement } from '../../types/card';
import { TRADITIONAL_MOTIFS } from '../../data/motifs';
import { getDimensionsForFormat } from '../../utils/canvasUtils';

export const CardCanvas: React.FC = () => {
  const {
    project,
    activePageIndex,
    selectedElementId,
    selectElement,
    updateElement,
    zoom,
    showBleedGuide,
    showSafeGuide,
    showGridGuide,
  } = useCardStore();

  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, elX: 0, elY: 0 });
  const [editingTextId, setEditingTextId] = useState<string | null>(null);

  const currentPage = project.pages[activePageIndex] || project.pages[0];
  const dims = getDimensionsForFormat(project.format);

  // Background styling
  const bg = currentPage?.background;
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

  // Touch event handlers for mobile devices
  const handleTouchStart = (e: React.TouchEvent, el: CardElement) => {
    if (el.isLocked) return;
    e.stopPropagation();
    selectElement(el.id);

    const touch = e.touches[0];
    if (touch && canvasRef.current) {
      setDragStart({
        x: touch.clientX,
        y: touch.clientY,
        elX: el.x,
        elY: el.y,
      });
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !selectedElementId || !canvasRef.current) return;
    const touch = e.touches[0];
    if (!touch) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const deltaXPixels = touch.clientX - dragStart.x;
    const deltaYPixels = touch.clientY - dragStart.y;

    const deltaXPercent = (deltaXPixels / canvasRect.width) * 100;
    const deltaYPercent = (deltaYPixels / canvasRect.height) * 100;

    const newX = Math.max(0, Math.min(95, dragStart.elX + deltaXPercent));
    const newY = Math.max(0, Math.min(95, dragStart.elY + deltaYPercent));

    updateElement(activePageIndex, selectedElementId, {
      x: Math.round(newX * 10) / 10,
      y: Math.round(newY * 10) / 10,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Auto-fit zoom on smaller viewports
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const screenWidth = window.innerWidth;
      if (screenWidth < 640) {
        const fitScale = Math.min(90, Math.max(45, Math.floor(((screenWidth - 24) / dims.widthPx) * 100)));
        useCardStore.getState().setZoom(fitScale);
      } else if (screenWidth < 1024) {
        const fitScale = Math.min(100, Math.max(60, Math.floor(((screenWidth - 100) / dims.widthPx) * 100)));
        useCardStore.getState().setZoom(fitScale);
      }
    }
  }, [project.format]);

  // Handle Dragging Elements
  const handleMouseDown = (e: React.MouseEvent, el: CardElement) => {
    if (el.isLocked) return;
    e.stopPropagation();
    selectElement(el.id);

    if (canvasRef.current) {
      setDragStart({
        x: e.clientX,
        y: e.clientY,
        elX: el.x,
        elY: el.y,
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedElementId || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const deltaXPixels = e.clientX - dragStart.x;
    const deltaYPixels = e.clientY - dragStart.y;

    const deltaXPercent = (deltaXPixels / canvasRect.width) * 100;
    const deltaYPercent = (deltaYPixels / canvasRect.height) * 100;

    const newX = Math.max(0, Math.min(95, dragStart.elX + deltaXPercent));
    const newY = Math.max(0, Math.min(95, dragStart.elY + deltaYPercent));

    updateElement(activePageIndex, selectedElementId, {
      x: Math.round(newX * 10) / 10,
      y: Math.round(newY * 10) / 10,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Deselect on canvas background click
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      selectElement(null);
      setEditingTextId(null);
    }
  };

  return (
    <div
      className="flex-1 overflow-auto flex items-center justify-center p-2 sm:p-6 md:p-8 bg-stone-200/70 select-none relative touch-manipulation"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Zoomed Container */}
      <div
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'center center',
          transition: 'transform 0.15s ease-out',
        }}
      >
        {/* Main Card Canvas */}
        <div
          ref={canvasRef}
          onClick={handleCanvasClick}
          className={`relative shadow-2xl transition-all duration-200 rounded-sm overflow-hidden ${
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
          {/* Optional Grid Guide */}
          {showGridGuide && (
            <div
              className="absolute inset-0 pointer-events-none z-50 opacity-20"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />
          )}

          {/* Bleed Guide Marker (3mm red line) */}
          {showBleedGuide && (
            <div className="absolute inset-2 border border-dashed border-red-500/60 pointer-events-none z-50">
              <span className="absolute top-1 left-2 text-[10px] text-red-600 bg-white/80 px-1 rounded font-mono">
                Bleed Area (3mm)
              </span>
            </div>
          )}

          {/* Safe Area Guide Marker (green line) */}
          {showSafeGuide && (
            <div className="absolute inset-6 border border-dashed border-emerald-500/60 pointer-events-none z-50">
              <span className="absolute bottom-1 right-2 text-[10px] text-emerald-700 bg-white/80 px-1 rounded font-mono">
                Safe Margin
              </span>
            </div>
          )}

          {/* Render Elements Sorted by Z-Index */}
          {currentPage?.elements
            .slice()
            .sort((a, b) => a.zIndex - b.zIndex)
            .map((el) => {
              const isSelected = el.id === selectedElementId;
              const isEditing = el.id === editingTextId;

              return (
                <div
                  key={el.id}
                  onMouseDown={(e) => handleMouseDown(e, el)}
                  onTouchStart={(e) => handleTouchStart(e, el)}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectElement(el.id);
                  }}
                  onDoubleClick={() => {
                    if (el.type === 'text') setEditingTextId(el.id);
                  }}
                  className={`absolute transition-shadow cursor-move ${
                    isSelected ? 'ring-2 ring-amber-500 ring-offset-1 z-40' : 'hover:ring-1 hover:ring-amber-300'
                  }`}
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
                  {/* Resizing Handles when selected */}
                  {isSelected && !el.isLocked && (
                    <>
                      <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-amber-500 border border-white rounded-full cursor-nwse-resize" />
                      <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-amber-500 border border-white rounded-full cursor-nesw-resize" />
                      <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-amber-500 border border-white rounded-full cursor-nesw-resize" />
                      <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-amber-500 border border-white rounded-full cursor-nwse-resize" />
                    </>
                  )}

                  {/* Render based on Element Type */}
                  {el.type === 'text' && (
                    <RenderTextElement
                      element={el as TextElement}
                      isEditing={isEditing}
                      onUpdateContent={(content) => {
                        updateElement(activePageIndex, el.id, { content } as any);
                      }}
                      onFinishEditing={() => setEditingTextId(null)}
                    />
                  )}

                  {el.type === 'motif' && <RenderMotifElement element={el as MotifElement} />}

                  {el.type === 'frame' && <RenderFrameElement element={el as FrameElement} />}

                  {el.type === 'divider' && <RenderDividerElement element={el as DividerElement} />}

                  {el.type === 'qrcode' && <RenderQRCodeElement element={el as QRCodeElement} />}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

// Sub-component: Render Text
const RenderTextElement: React.FC<{
  element: TextElement;
  isEditing: boolean;
  onUpdateContent: (text: string) => void;
  onFinishEditing: () => void;
}> = ({ element, isEditing, onUpdateContent, onFinishEditing }) => {
  const isFoil = element.isFoil;

  if (isEditing) {
    return (
      <textarea
        autoFocus
        value={element.content}
        onChange={(e) => onUpdateContent(e.target.value)}
        onBlur={onFinishEditing}
        className="w-full h-full p-0 bg-transparent border border-amber-500 outline-none resize-none font-inherit text-inherit"
        style={{
          fontFamily: element.fontFamily || 'inherit',
          fontSize: `${element.fontSize}px`,
          fontWeight: element.fontWeight || 'normal',
          textAlign: element.align || 'center',
          lineHeight: element.lineHeight || 1.4,
          color: element.color || '#2D2424',
        }}
      />
    );
  }

  return (
    <div
      className={`w-full h-full flex flex-col justify-center whitespace-pre-wrap break-words ${
        isFoil ? 'gold-text-gradient drop-shadow-sm' : ''
      }`}
      style={{
        fontFamily: element.fontFamily || 'inherit',
        fontSize: `${element.fontSize}px`,
        fontWeight: element.fontWeight || 'normal',
        fontStyle: element.fontStyle || 'normal',
        textAlign: element.align || 'center',
        lineHeight: element.lineHeight || 1.4,
        letterSpacing: `${element.letterSpacing || 0}px`,
        color: isFoil ? undefined : element.color || '#2D2424',
        textShadow: element.textShadow || (isFoil ? '0 1px 2px rgba(0,0,0,0.15)' : undefined),
      }}
    >
      {element.content}
    </div>
  );
};

// Sub-component: Render Motif
const RenderMotifElement: React.FC<{ element: MotifElement }> = ({ element }) => {
  const motif = TRADITIONAL_MOTIFS[element.motifKey] || TRADITIONAL_MOTIFS.ganesh;

  return (
    <div
      className="w-full h-full flex items-center justify-center pointer-events-none"
      style={{ color: element.color || '#D4AF37' }}
    >
      <svg
        viewBox={motif.viewBox}
        className="w-full h-full drop-shadow-sm"
        dangerouslySetInnerHTML={{ __html: motif.svgPath }}
      />
    </div>
  );
};

// Sub-component: Render Frame
const RenderFrameElement: React.FC<{ element: FrameElement }> = ({ element }) => {
  return (
    <div
      className="w-full h-full pointer-events-none rounded-sm"
      style={{
        border: `${element.thickness}px solid ${element.color || '#D4AF37'}`,
        boxShadow: `inset 0 0 0 ${element.padding || 8}px #FFFDF9, inset 0 0 0 ${
          Number(element.padding || 8) + 1.5
        }px ${element.color || '#D4AF37'}`,
      }}
    />
  );
};

// Sub-component: Render Divider
const RenderDividerElement: React.FC<{ element: DividerElement }> = ({ element }) => {
  return (
    <div
      className="w-full h-full flex items-center justify-center pointer-events-none"
      style={{ color: element.color || '#D4AF37' }}
    >
      <svg viewBox="0 0 300 20" width="100%" height="100%" fill="currentColor">
        <line x1="10" y1="10" x2="130" y2="10" stroke="currentColor" stroke-width="1.5" />
        <circle cx="150" cy="10" r="4" fill="currentColor" />
        <polygon points="144,10 150,4 156,10 150,16" fill="currentColor" />
        <line x1="170" y1="10" x2="290" y2="10" stroke="currentColor" stroke-width="1.5" />
      </svg>
    </div>
  );
};

// Sub-component: Render QR Code
const RenderQRCodeElement: React.FC<{ element: QRCodeElement }> = ({ element }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-white p-2 rounded shadow-sm border border-stone-200">
      {element.dataUrl ? (
        <img src={element.dataUrl} alt="QR Code" className="w-full h-auto object-contain" />
      ) : (
        <div className="w-full h-full bg-stone-100 flex items-center justify-center text-xs text-stone-500">
          QR Code
        </div>
      )}
      {element.label && (
        <span className="text-[10px] text-stone-700 mt-1 font-semibold text-center truncate max-w-full">
          {element.label}
        </span>
      )}
    </div>
  );
};
