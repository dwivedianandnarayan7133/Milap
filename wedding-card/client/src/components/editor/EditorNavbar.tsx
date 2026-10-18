import React, { useState } from 'react';
import { useCardStore } from '../../store/cardStore';
import { SUPPORTED_LANGUAGES, getLanguageByCode } from '../../data/languages';
import { PageFormat } from '../../types/card';
import { AppLogo } from '../common/AppLogo';
import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Eye,
  Download,
  Save,
  Check,
  RefreshCw,
  Globe,
  Sliders,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface EditorNavbarProps {
  onOpenPreview: () => void;
  onOpenExport: () => void;
  onOpenLanguageModal?: () => void;
  onToggleLeftSidebar?: () => void;
  onToggleRightSidebar?: () => void;
  isLeftSidebarOpen?: boolean;
  isRightSidebarOpen?: boolean;
  isMobile?: boolean;
}

export const EditorNavbar: React.FC<EditorNavbarProps> = ({
  onOpenPreview,
  onOpenExport,
  onOpenLanguageModal,
  onToggleLeftSidebar,
  onToggleRightSidebar,
  isLeftSidebarOpen,
  isRightSidebarOpen,
  isMobile = false,
}) => {
  const {
    project,
    updateTitle,
    setLanguage,
    setFormat,
    undo,
    redo,
    history,
    zoom,
    setZoom,
    isSaving,
    isDirty,
    saveCurrentProject,
  } = useCardStore();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(project.title);
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);

  const formats: Array<{ id: PageFormat; label: string }> = [
    { id: 'a5_portrait', label: 'A5 Portrait (Print)' },
    { id: 'a6_portrait', label: 'A6 Card' },
    { id: 'five_by_seven', label: '5 × 7" Classic' },
    { id: 'square', label: 'Square (6 × 6")' },
    { id: 'whatsapp_story', label: 'WhatsApp (9:16)' },
  ];

  const handleTitleSubmit = () => {
    if (titleInput.trim()) updateTitle(titleInput.trim());
    setIsEditingTitle(false);
  };

  const currentLang = getLanguageByCode(project.language);

  return (
    <header className="h-14 bg-white border-b border-stone-200 px-2 sm:px-4 flex items-center justify-between z-30 shadow-xs shrink-0 select-none">
      {/* Left: Brand & Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <Link to="/" className="group flex items-center shrink-0">
          <AppLogo size="xs" subtitle="STUDIO" />
        </Link>

        <div className="h-4 w-[1px] bg-stone-200 hidden sm:block shrink-0" />

        {/* Project Title (Editable) */}
        <div className="flex items-center min-w-0">
          {isEditingTitle ? (
            <input
              type="text"
              autoFocus
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
              className="px-2 py-0.5 border border-royal-gold rounded text-xs font-semibold text-stone-800 outline-none w-32 sm:w-48"
            />
          ) : (
            <button
              onClick={() => {
                setTitleInput(project.title);
                setIsEditingTitle(true);
              }}
              className="text-xs font-semibold text-stone-700 hover:text-royal-maroon px-1.5 py-1 rounded hover:bg-stone-100 flex items-center gap-1 cursor-pointer max-w-[130px] sm:max-w-xs truncate"
              title="Click to rename project"
            >
              <span className="truncate">{project.title}</span>
              <span className="text-[10px] text-stone-400 font-normal shrink-0">✎</span>
            </button>
          )}

          {/* Save Status Badge */}
          <div className="ml-1 sm:ml-2 hidden md:flex items-center shrink-0">
            {isSaving ? (
              <span className="text-[10px] text-amber-600 flex items-center gap-1">
                <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Saving...
              </span>
            ) : isDirty ? (
              <span className="text-[10px] text-stone-400">• Unsaved</span>
            ) : (
              <span className="text-[10px] text-emerald-600 flex items-center gap-0.5">
                <Check className="w-2.5 h-2.5" /> Saved
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Center: Format & Language Controls (Desktop) */}
      <div className="hidden lg:flex items-center gap-2">
        {/* Format Selector */}
        <select
          value={project.format}
          onChange={(e) => setFormat(e.target.value as PageFormat)}
          className="text-xs bg-stone-50 border border-stone-200 rounded px-2.5 py-1 text-stone-700 focus:border-royal-gold outline-none cursor-pointer"
        >
          {formats.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>

        {/* Dedicated Language & Script Modal Trigger */}
        <button
          onClick={onOpenLanguageModal}
          className="text-xs bg-amber-50/80 hover:bg-amber-100/70 border border-amber-300 text-royal-maroon rounded px-2.5 py-1 font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
          title="Open Comprehensive Regional Language Selector"
        >
          <Globe className="w-3.5 h-3.5 text-royal-gold" />
          <span>
            {currentLang ? `${currentLang.name} (${currentLang.nativeName})` : project.language.toUpperCase()}
          </span>
          <ChevronDown className="w-3 h-3 text-stone-400" />
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Undo / Redo */}
        <div className="flex items-center border border-stone-200 rounded overflow-hidden">
          <button
            onClick={undo}
            disabled={!history.past.length}
            title="Undo (Ctrl+Z)"
            className="p-1 sm:p-1.5 hover:bg-stone-50 text-stone-600 disabled:opacity-30 cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <div className="w-[1px] h-3 sm:h-4 bg-stone-200" />
          <button
            onClick={redo}
            disabled={!history.future.length}
            title="Redo (Ctrl+Y)"
            className="p-1 sm:p-1.5 hover:bg-stone-50 text-stone-600 disabled:opacity-30 cursor-pointer"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Zoom (Desktop) */}
        <div className="hidden xl:flex items-center border border-stone-200 rounded px-1.5 py-0.5 text-xs text-stone-600">
          <button
            onClick={() => setZoom(zoom - 10)}
            className="p-0.5 hover:text-stone-900"
            title="Zoom Out"
          >
            <ZoomOut className="w-3 h-3" />
          </button>
          <span className="w-9 text-center font-mono text-[11px]">{zoom}%</span>
          <button
            onClick={() => setZoom(zoom + 10)}
            className="p-0.5 hover:text-stone-900"
            title="Zoom In"
          >
            <ZoomIn className="w-3 h-3" />
          </button>
        </div>

        {/* Mobile Format & Language Trigger (< lg) */}
        {onOpenLanguageModal && (
          <button
            onClick={onOpenLanguageModal}
            className="lg:hidden p-1.5 rounded border border-amber-200 bg-amber-50 text-royal-maroon"
            title="Choose Language & Script"
          >
            <Globe className="w-3.5 h-3.5 text-royal-gold" />
          </button>
        )}

        {/* Save Button */}
        <button
          onClick={saveCurrentProject}
          disabled={isSaving}
          className="p-1.5 sm:px-2.5 sm:py-1.5 border border-stone-200 hover:border-royal-gold text-stone-700 hover:text-royal-maroon text-xs font-semibold rounded flex items-center gap-1 cursor-pointer shadow-2xs transition-colors"
          title="Save Project"
        >
          <Save className="w-3.5 h-3.5 text-royal-gold" />
          <span className="hidden md:inline">Save</span>
        </button>

        {/* Preview Button */}
        <button
          onClick={onOpenPreview}
          className="p-1.5 sm:px-2.5 sm:py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded flex items-center gap-1 cursor-pointer shadow-2xs transition-colors"
          title="Fullscreen Preview"
        >
          <Eye className="w-3.5 h-3.5 text-royal-maroon" />
          <span className="hidden sm:inline">Preview</span>
        </button>

        {/* Download PDF Button */}
        <button
          onClick={onOpenExport}
          className="px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-royal-maroon to-royal-maroon-dark hover:opacity-95 text-white text-xs font-bold rounded flex items-center gap-1 cursor-pointer shadow-sm transition-all"
        >
          <Download className="w-3.5 h-3.5 text-royal-gold" />
          <span className="hidden xs:inline sm:inline">Download PDF</span>
          <span className="xs:hidden sm:hidden">PDF</span>
        </button>
      </div>
    </header>
  );
};
