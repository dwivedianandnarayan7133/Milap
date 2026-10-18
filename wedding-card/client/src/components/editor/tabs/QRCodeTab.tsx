import React, { useState } from 'react';
import { useCardStore } from '../../../store/cardStore';
import { generateQRCodeDataUrl } from '../../../utils/canvasUtils';
import { QrCode, MapPin, Globe, Sparkles } from 'lucide-react';

export const QRCodeTab: React.FC = () => {
  const { addElement, project } = useCardStore();
  const [link, setLink] = useState(project.eventDetails.googleMapsUrl || 'https://maps.google.com');
  const [label, setLabel] = useState('Scan for Venue Directions');
  const [fgColor, setFgColor] = useState('#1A1C29');

  const handleAddQRCode = async () => {
    if (!link.trim()) return;
    const dataUrl = await generateQRCodeDataUrl(link, { fgColor, bgColor: '#FFFFFF' });

    addElement({
      type: 'qrcode',
      link,
      label,
      dataUrl,
      fgColor,
      bgColor: '#FFFFFF',
      x: 38,
      y: 72,
      width: 24,
      height: 18,
      rotation: 0,
    } as any);
  };

  return (
    <div className="p-4 space-y-5 text-stone-800 text-sm h-full overflow-y-auto overscroll-y-contain custom-studio-scroller pb-24 sm:pb-8">
      <div className="bg-amber-50/80 p-3 rounded-lg border border-amber-200/80">
        <div className="flex items-center gap-1.5 text-royal-maroon font-bold text-xs mb-1">
          <QrCode className="w-4 h-4 text-royal-gold" />
          <span>Interactive Guest QR Code</span>
        </div>
        <p className="text-[11px] text-stone-600">
          Guests can scan your printed or digital invitation using their smartphone camera to open Google Maps directions or your RSVP link directly.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Destination URL</label>
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://maps.google.com/..."
            className="w-full bg-white border border-stone-300 rounded px-3 py-1.5 text-xs focus:border-royal-gold outline-none font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Printed Label Text</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Scan for Venue Directions"
            className="w-full bg-white border border-stone-300 rounded px-3 py-1.5 text-xs focus:border-royal-gold outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">QR Code Color</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              className="w-8 h-8 rounded border border-stone-300 cursor-pointer p-0"
            />
            <span className="text-xs text-stone-600 font-mono">{fgColor}</span>
          </div>
        </div>

        <button
          onClick={handleAddQRCode}
          className="w-full py-2.5 bg-royal-maroon hover:bg-royal-maroon-dark text-white rounded font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
        >
          <QrCode className="w-4 h-4 text-royal-gold" />
          Insert QR Code on Card
        </button>
      </div>
    </div>
  );
};
