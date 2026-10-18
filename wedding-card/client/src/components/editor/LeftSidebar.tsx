import React, { useState } from 'react';
import { EventFormTab } from './tabs/EventFormTab';
import { AIStudioTab } from './tabs/AIStudioTab';
import { TemplatesTab } from './tabs/TemplatesTab';
import { BackgroundsTab } from './tabs/BackgroundsTab';
import { MotifsTab } from './tabs/MotifsTab';
import { TextBlocksTab } from './tabs/TextBlocksTab';
import { LayersTab } from './tabs/LayersTab';
import { QRCodeTab } from './tabs/QRCodeTab';
import {
  FileText,
  Sparkles,
  LayoutTemplate,
  Image as ImageIcon,
  Flower2,
  Type,
  Layers,
  QrCode,
  X,
} from 'lucide-react';

interface LeftSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  isOpen = true,
  onClose,
  isMobile = false,
  activeTab: controlledActiveTab,
  onTabChange,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState<string>('ai');

  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;
  const setActiveTab = (tab: string) => {
    if (onTabChange) onTabChange(tab);
    else setInternalActiveTab(tab);
  };

  const tabs = [
    { id: 'details', label: 'Details', icon: FileText },
    { id: 'ai', label: 'AI Studio', icon: Sparkles, highlight: true },
    { id: 'templates', label: 'Templates', icon: LayoutTemplate },
    { id: 'backgrounds', label: 'Artwork', icon: ImageIcon },
    { id: 'motifs', label: 'Motifs', icon: Flower2 },
    { id: 'text', label: 'Text', icon: Type },
    { id: 'layers', label: 'Pages', icon: Layers },
    { id: 'qrcode', label: 'QR Code', icon: QrCode },
  ];

  // If mobile and not open, do not render
  if (isMobile && !isOpen) return null;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white">
      {/* Mobile Drawer Header */}
      {isMobile && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-amber-200/80 bg-gradient-to-r from-royal-maroon to-royal-maroon-dark text-white shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-royal-gold" />
            <span className="font-serif font-bold text-sm tracking-wide">Design Tools & AI Studio</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Tab Nav Strip */}
      <div className="flex border-b border-stone-200 overflow-x-auto bg-stone-50/70 shrink-0 scrollbar-thin">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;

          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 min-w-[50px] py-2.5 flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-all border-b-2 cursor-pointer ${
                isActive
                  ? 'border-royal-gold text-royal-maroon bg-white font-bold shadow-2xs'
                  : 'border-transparent text-stone-500 hover:text-stone-800 hover:bg-white/60'
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  t.highlight && !isActive ? 'text-amber-500' : isActive ? 'text-royal-gold' : ''
                }`}
              />
              <span className="truncate max-w-[50px]">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Body */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'details' && <EventFormTab />}
        {activeTab === 'ai' && <AIStudioTab />}
        {activeTab === 'templates' && <TemplatesTab />}
        {activeTab === 'backgrounds' && <BackgroundsTab />}
        {activeTab === 'motifs' && <MotifsTab />}
        {activeTab === 'text' && <TextBlocksTab />}
        {activeTab === 'layers' && <LayersTab />}
        {activeTab === 'qrcode' && <QRCodeTab />}
      </div>
    </div>
  );

  // Mobile Drawer Overlay
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />
        {/* Slide-in Container */}
        <div className="relative w-full sm:w-[420px] max-w-[90vw] bg-white h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
          {sidebarContent}
        </div>
      </div>
    );
  }

  // Desktop Static Sidebar
  return (
    <aside
      className={`w-80 lg:w-96 bg-white border-r border-stone-200 flex flex-col shrink-0 h-full z-20 shadow-xs transition-all duration-200 ${
        !isOpen ? 'hidden' : ''
      }`}
    >
      {sidebarContent}
    </aside>
  );
};
