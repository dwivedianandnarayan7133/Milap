import React from 'react';
import { useCardStore } from '../../../store/cardStore';
import { COMMON_BLESSINGS } from '../../../data/languages';
import { Type, Sparkles } from 'lucide-react';

export const TextBlocksTab: React.FC = () => {
  const { addElement, project } = useCardStore();
  const theme = project.theme;
  const blessings = COMMON_BLESSINGS[project.language] || COMMON_BLESSINGS.hi;

  const handleAddText = (
    content: string,
    fontSize: number,
    fontWeight: any = 'normal',
    isFoil = false,
    role: any = 'body'
  ) => {
    addElement({
      type: 'text',
      content,
      fontSize,
      fontFamily: theme.fontFamilyHeading || '"Rozha One", serif',
      fontWeight,
      color: theme.primaryColor || '#6B1224',
      align: 'center',
      lineHeight: 1.4,
      letterSpacing: 0.5,
      isFoil,
      role,
      x: 10,
      y: 40,
      width: 80,
      height: 12,
      rotation: 0,
    } as any);
  };

  return (
    <div className="p-4 space-y-5 text-stone-800 text-sm h-full overflow-y-auto overscroll-y-contain custom-studio-scroller pb-24 sm:pb-8">
      {/* Standard Text Elements */}
      <div>
        <label className="block text-xs font-bold text-royal-maroon uppercase tracking-wider mb-2">
          Add Custom Text
        </label>
        <div className="space-y-1.5">
          <button
            onClick={() => handleAddText('मुख्य शीर्षक / Main Heading', 28, 'bold', true, 'title')}
            className="w-full p-2.5 bg-white border border-stone-200 hover:border-royal-gold rounded text-left text-xs flex items-center justify-between font-bold cursor-pointer"
          >
            <span className="font-serif text-sm">Add Grand Heading</span>
            <span className="text-[10px] text-royal-gold font-bold">+ Add</span>
          </button>
          <button
            onClick={() => handleAddText('उपशीर्षक / Subheading', 18, '600', false, 'title')}
            className="w-full p-2.5 bg-white border border-stone-200 hover:border-royal-gold rounded text-left text-xs flex items-center justify-between font-medium cursor-pointer"
          >
            <span className="font-serif">Add Subheading</span>
            <span className="text-[10px] text-royal-gold font-bold">+ Add</span>
          </button>
          <button
            onClick={() => handleAddText('आप सपरिवार सादर आमंत्रित हैं / Cordially invited', 14, 'normal', false, 'body')}
            className="w-full p-2.5 bg-white border border-stone-200 hover:border-royal-gold rounded text-left text-xs flex items-center justify-between cursor-pointer"
          >
            <span>Add Paragraph Text</span>
            <span className="text-[10px] text-royal-gold font-bold">+ Add</span>
          </button>
        </div>
      </div>

      {/* Cultural Blessings & Shlokas */}
      <div>
        <label className="block text-xs font-bold text-royal-maroon uppercase tracking-wider mb-2">
          Auspicious Blessings & Shlokas ({project.language.toUpperCase()})
        </label>
        <div className="space-y-2">
          {blessings.map((b, idx) => (
            <div
              key={idx}
              onClick={() => handleAddText(b.text, 16, 'bold', true, 'blessing')}
              className="p-2.5 bg-white border border-stone-200 hover:border-royal-gold rounded-lg cursor-pointer hover:shadow-xs transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-royal-gold uppercase tracking-wider">
                  {b.label}
                </span>
                <span className="text-[10px] text-royal-maroon font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  + Insert
                </span>
              </div>
              <p className="text-xs whitespace-pre-line text-stone-800 font-serif leading-relaxed">
                {b.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
