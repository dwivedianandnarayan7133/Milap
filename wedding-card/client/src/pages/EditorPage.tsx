import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCardStore } from '../store/cardStore';
import { EditorNavbar } from '../components/editor/EditorNavbar';
import { LeftSidebar } from '../components/editor/LeftSidebar';
import { CardCanvas } from '../components/editor/CardCanvas';
import { RightSidebar } from '../components/editor/RightSidebar';
import { PageStrip } from '../components/editor/PageStrip';
import { ExportModal } from '../components/modals/ExportModal';
import { PreviewModal } from '../components/modals/PreviewModal';
import { LanguageSelectModal } from '../components/modals/LanguageSelectModal';
import { CARD_TEMPLATES } from '../data/templates';
import { fetchProjectById } from '../services/api';
import {
  Sparkles,
  Sliders,
  Globe,
  Eye,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from 'lucide-react';

export const EditorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('template');
  const projectId = searchParams.get('project');
  const categoryParam = searchParams.get('category');
  const langParam = searchParams.get('lang');

  const {
    project,
    selectedElementId,
    initNewProject,
    loadProject,
    applyTemplate,
  } = useCardStore();

  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  // Responsive device detection
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 1024 : false;
  });

  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth >= 1024 : true;
  });

  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth >= 1024 : false;
  });

  // Track window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        // Automatically restore desktop view
        setIsLeftSidebarOpen(true);
        setIsRightSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // When an element is selected on mobile, auto-prompt/open RightSidebar if requested
  useEffect(() => {
    if (isMobile && selectedElementId) {
      // Optional: keep canvas visible but user can tap the properties pill
    }
  }, [selectedElementId, isMobile]);

  useEffect(() => {
    if (projectId) {
      fetchProjectById(projectId)
        .then((p) => {
          if (p) loadProject(p);
        })
        .catch((err) => console.error('Failed to load project:', err));
    } else if (templateId) {
      const tpl = CARD_TEMPLATES.find((t) => t.id === templateId);
      if (tpl) {
        initNewProject(tpl.category, tpl.supportedLanguages[0], tpl.id);
        applyTemplate(tpl);
      }
    } else if (categoryParam || langParam) {
      const cat = (categoryParam as any) || 'wedding';
      const catTemplate =
        CARD_TEMPLATES.find((t) => t.category === cat) || CARD_TEMPLATES[0];
      initNewProject(
        cat,
        (langParam as any) || catTemplate.supportedLanguages[0] || 'hi',
        catTemplate.id
      );
      applyTemplate(catTemplate);
      if (langParam) {
        useCardStore.getState().setLanguage(langParam as any);
      }
    }
  }, [projectId, templateId, categoryParam, langParam]);

  // Global Keyboard Shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (cmdOrCtrl && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          useCardStore.getState().redo();
        } else {
          e.preventDefault();
          useCardStore.getState().undo();
        }
      } else if (cmdOrCtrl && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        useCardStore.getState().redo();
      } else if (cmdOrCtrl && e.key.toLowerCase() === 's') {
        e.preventDefault();
        useCardStore.getState().saveCurrentProject();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-stone-100 font-sans">
      {/* Top Navbar */}
      <EditorNavbar
        onOpenPreview={() => setIsPreviewOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
        onToggleLeftSidebar={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
        onToggleRightSidebar={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
        isLeftSidebarOpen={isLeftSidebarOpen}
        isRightSidebarOpen={isRightSidebarOpen}
        isMobile={isMobile}
      />

      {/* Main Workspace (Left Sidebar + Live Canvas + Right Sidebar) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar (Desktop Static / Mobile Slide-Over Drawer) */}
        <LeftSidebar
          isOpen={isLeftSidebarOpen}
          onClose={() => setIsLeftSidebarOpen(false)}
          isMobile={isMobile}
        />

        {/* Center Live Canvas Workspace */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {/* Desktop Collapse Buttons Bar */}
          {!isMobile && (
            <div className="absolute top-2 left-2 z-20 flex items-center gap-1">
              <button
                onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
                className="p-1.5 rounded-md bg-white/90 border border-stone-200 text-stone-600 hover:text-royal-maroon shadow-xs hover:bg-white transition-all text-xs flex items-center gap-1 cursor-pointer"
                title={isLeftSidebarOpen ? 'Collapse Tools Panel' : 'Expand Tools Panel'}
              >
                {isLeftSidebarOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                <span className="text-[10px] font-semibold">{isLeftSidebarOpen ? 'Collapse' : 'Tools'}</span>
              </button>
            </div>
          )}

          {!isMobile && (
            <div className="absolute top-2 right-2 z-20 flex items-center gap-1">
              <button
                onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                className="p-1.5 rounded-md bg-white/90 border border-stone-200 text-stone-600 hover:text-royal-maroon shadow-xs hover:bg-white transition-all text-xs flex items-center gap-1 cursor-pointer"
                title={isRightSidebarOpen ? 'Collapse Properties Panel' : 'Expand Properties Panel'}
              >
                <span className="text-[10px] font-semibold">{isRightSidebarOpen ? 'Collapse' : 'Properties'}</span>
                {isRightSidebarOpen ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}

          {/* Interactive Card Canvas */}
          <CardCanvas />

          {/* Mobile Bottom Action Bar (Floating on < lg) */}
          {isMobile && (
            <div className="p-2 bg-white/95 backdrop-blur-md border-t border-amber-200/80 shadow-lg flex items-center justify-around z-20">
              <button
                onClick={() => {
                  setIsLeftSidebarOpen(true);
                  setIsRightSidebarOpen(false);
                }}
                className="flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 text-stone-700 hover:text-royal-maroon text-[11px] font-bold"
              >
                <Sparkles className="w-4 h-4 text-royal-gold" />
                <span>Tools & AI</span>
              </button>

              <div className="w-[1px] h-6 bg-stone-200" />

              <button
                onClick={() => {
                  setIsRightSidebarOpen(true);
                  setIsLeftSidebarOpen(false);
                }}
                className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 text-[11px] font-bold ${
                  selectedElementId ? 'text-royal-maroon' : 'text-stone-700 hover:text-royal-maroon'
                }`}
              >
                <Sliders className="w-4 h-4 text-royal-maroon" />
                <span>Properties {selectedElementId && '•'}</span>
              </button>

              <div className="w-[1px] h-6 bg-stone-200" />

              <button
                onClick={() => setIsLanguageModalOpen(true)}
                className="flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 text-stone-700 hover:text-royal-maroon text-[11px] font-bold"
              >
                <Globe className="w-4 h-4 text-royal-gold" />
                <span>Language</span>
              </button>

              <div className="w-[1px] h-6 bg-stone-200" />

              <button
                onClick={() => setIsPreviewOpen(true)}
                className="flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 text-stone-700 hover:text-royal-maroon text-[11px] font-bold"
              >
                <Eye className="w-4 h-4 text-royal-maroon" />
                <span>Preview</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Sidebar (Desktop Static / Mobile Slide-Over Drawer) */}
        <RightSidebar
          isOpen={isRightSidebarOpen}
          onClose={() => setIsRightSidebarOpen(false)}
          isMobile={isMobile}
        />
      </div>

      {/* Bottom Page Strip */}
      <PageStrip />

      {/* Modals */}
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onOpenExport={() => setIsExportOpen(true)}
      />
      <LanguageSelectModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
      />
    </div>
  );
};
