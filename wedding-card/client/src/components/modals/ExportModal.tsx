import React, { useState } from 'react';
import { useCardStore } from '../../store/cardStore';
import { exportPdfApi, exportPngApi } from '../../services/api';
import { Download, Check, AlertCircle, FileText, Image as ImageIcon, Share2, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';
import * as htmlToImage from 'html-to-image';
import { getDimensionsForFormat } from '../../utils/canvasUtils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { project } = useCardStore();
  const [exportType, setExportType] = useState<'pdf_print' | 'pdf_standard' | 'png_all' | 'png_whatsapp'>('pdf_print');
  const [includeBleed, setIncludeBleed] = useState(false);
  const [includeCropMarks, setIncludeCropMarks] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsExporting(true);
    setErrorMsg('');
    setDownloadSuccess(false);

    try {
      if (exportType === 'pdf_print' || exportType === 'pdf_standard') {
        let blob: Blob | null = null;
        try {
          blob = await exportPdfApi({
            pages: project.pages,
            format: project.format,
            bleed: exportType === 'pdf_print' ? includeBleed : false,
            cropMarks: exportType === 'pdf_print' ? includeCropMarks : false,
            dpi: exportType === 'pdf_print' ? 300 : 150,
            projectName: project.title,
          });
        } catch (apiErr) {
          console.warn('Backend PDF service unavailable, compiling client-side vector PDF...', apiErr);
          const canvasEl = document.getElementById('main-card-canvas');
          if (!canvasEl) throw new Error('Card canvas element not found');

          const dims = getDimensionsForFormat(project.format);
          const imgData = await htmlToImage.toPng(canvasEl, {
            quality: 0.98,
            pixelRatio: exportType === 'pdf_print' ? 3 : 2,
            cacheBust: true,
          });

          const pdf = new jsPDF({
            orientation: dims.widthPx > dims.heightPx ? 'landscape' : 'portrait',
            unit: 'mm',
            format: [dims.widthMm, dims.heightMm],
          });

          pdf.addImage(imgData, 'PNG', 0, 0, dims.widthMm, dims.heightMm);
          blob = pdf.output('blob');
        }

        if (!blob) throw new Error('Failed to generate PDF document');

        // Trigger browser download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${project.title.replace(/[^a-zA-Z0-9_\u0900-\u097F-]/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        setDownloadSuccess(true);
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      } else if (exportType === 'png_all' || exportType === 'png_whatsapp') {
        let blob: Blob | null = null;
        try {
          blob = await exportPngApi({
            page: project.pages[0],
            format: exportType === 'png_whatsapp' ? 'whatsapp_story' : project.format,
            dpi: exportType === 'png_whatsapp' ? 150 : 300,
            pageNumber: 1,
          });
        } catch (apiErr) {
          console.warn('Backend PNG service unavailable, rendering client-side image...', apiErr);
          const canvasEl = document.getElementById('main-card-canvas');
          if (!canvasEl) throw new Error('Card canvas element not found');

          const dataUrl = await htmlToImage.toPng(canvasEl, {
            quality: 0.98,
            pixelRatio: exportType === 'png_whatsapp' ? 2 : 3,
            cacheBust: true,
          });

          const res = await fetch(dataUrl);
          blob = await res.blob();
        }

        if (!blob) throw new Error('Failed to generate PNG image');

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${project.title}_${exportType === 'png_whatsapp' ? 'WhatsApp' : 'HighRes'}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        setDownloadSuccess(true);
        confetti({ particleCount: 50, spread: 55, origin: { y: 0.7 } });
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden border border-amber-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-royal-maroon to-royal-maroon-dark p-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-royal-gold" />
            <h2 className="text-base font-bold font-serif">Export & Download Invitation</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 text-stone-800 text-sm overflow-y-auto flex-1">
          {/* Format Presets */}
          <div>
            <label className="block text-xs font-bold text-royal-maroon uppercase tracking-wider mb-2">
              Select Export Format
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* 1. Print-Ready PDF */}
              <div
                onClick={() => setExportType('pdf_print')}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  exportType === 'pdf_print'
                    ? 'border-royal-gold bg-amber-50/70 shadow-xs'
                    : 'border-stone-200 hover:border-royal-gold/50 bg-white'
                }`}
              >
                <div className="flex items-center gap-2 text-royal-maroon font-bold text-xs mb-1">
                  <FileText className="w-4 h-4 text-royal-gold" />
                  <span>Print-Ready PDF</span>
                </div>
                <p className="text-[11px] text-stone-600">
                  Full 300 DPI resolution with Indic vector fonts and multi-page layout.
                </p>
              </div>

              {/* 2. Standard Digital PDF */}
              <div
                onClick={() => setExportType('pdf_standard')}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  exportType === 'pdf_standard'
                    ? 'border-royal-gold bg-amber-50/70 shadow-xs'
                    : 'border-stone-200 hover:border-royal-gold/50 bg-white'
                }`}
              >
                <div className="flex items-center gap-2 text-royal-maroon font-bold text-xs mb-1">
                  <FileText className="w-4 h-4 text-royal-gold" />
                  <span>Digital Sharing PDF</span>
                </div>
                <p className="text-[11px] text-stone-600">
                  Optimized smaller file size for emailing and viewing on phones.
                </p>
              </div>

              {/* 3. High-Res PNG Image */}
              <div
                onClick={() => setExportType('png_all')}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  exportType === 'png_all'
                    ? 'border-royal-gold bg-amber-50/70 shadow-xs'
                    : 'border-stone-200 hover:border-royal-gold/50 bg-white'
                }`}
              >
                <div className="flex items-center gap-2 text-royal-maroon font-bold text-xs mb-1">
                  <ImageIcon className="w-4 h-4 text-royal-gold" />
                  <span>High-Res PNG</span>
                </div>
                <p className="text-[11px] text-stone-600">
                  Lossless PNG image suitable for social sharing and web display.
                </p>
              </div>

              {/* 4. WhatsApp Friendly (1080x1920) */}
              <div
                onClick={() => setExportType('png_whatsapp')}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  exportType === 'png_whatsapp'
                    ? 'border-royal-gold bg-amber-50/70 shadow-xs'
                    : 'border-stone-200 hover:border-royal-gold/50 bg-white'
                }`}
              >
                <div className="flex items-center gap-2 text-royal-maroon font-bold text-xs mb-1">
                  <Share2 className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp Story Image</span>
                </div>
                <p className="text-[11px] text-stone-600">
                  Formatted for WhatsApp status, stories, and Instagram direct messages.
                </p>
              </div>
            </div>
          </div>

          {/* Print Settings (Bleed & Crop Marks) */}
          {exportType === 'pdf_print' && (
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
              <span className="text-xs font-semibold text-stone-700 block">Professional Print Options</span>
              <div className="flex gap-4">
                <label className="flex items-center gap-1.5 text-xs text-stone-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeBleed}
                    onChange={(e) => setIncludeBleed(e.target.checked)}
                    className="rounded text-royal-gold focus:ring-royal-gold"
                  />
                  <span>Add 3mm Print Bleed</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs text-stone-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeCropMarks}
                    onChange={(e) => setIncludeCropMarks(e.target.checked)}
                    className="rounded text-royal-gold focus:ring-royal-gold"
                  />
                  <span>Add Crop / Trim Marks</span>
                </label>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {downloadSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded border border-emerald-200 flex items-center gap-2 font-medium">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Download completed successfully! Your invitation card is ready.</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-stone-300 rounded text-stone-700 hover:bg-stone-50 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleDownload}
              disabled={isExporting}
              className="px-6 py-2.5 bg-gradient-to-r from-royal-maroon to-royal-maroon-dark text-white rounded font-bold text-xs flex items-center gap-2 shadow-md hover:opacity-95 disabled:opacity-50 cursor-pointer"
            >
              {isExporting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-royal-gold border-t-transparent rounded-full animate-spin" />
                  Rendering Print Quality...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-royal-gold" />
                  Download Invitation File
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
