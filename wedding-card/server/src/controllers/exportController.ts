import { Request, Response } from 'express';
import { exportProjectToPDF, exportPageToPNG } from '../services/pdfService.js';

export const handleExportPDF = async (req: Request, res: Response) => {
  try {
    const { pages, format, bleed, cropMarks, dpi, projectName } = req.body;

    if (!pages || !pages.length) {
      return res.status(400).json({ error: 'At least one page is required for export' });
    }

    console.log(`[ExportController] Starting PDF export for "${projectName || 'Invitation'}" (${pages.length} pages, format: ${format})`);

    const pdfBuffer = await exportProjectToPDF({
      pages,
      format: format || 'a5_portrait',
      bleed: Boolean(bleed),
      cropMarks: Boolean(cropMarks),
      dpi: dpi || 300,
      projectName: projectName || 'VivahPatra_Invitation',
    });

    const safeFilename = (projectName || 'VivahPatra_Invitation')
      .replace(/[^a-zA-Z0-9_\u0900-\u097F-]/g, '_')
      .substring(0, 50);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${safeFilename}.pdf"`
    );
    res.setHeader('Content-Length', pdfBuffer.length);
    return res.end(pdfBuffer);
  } catch (error: any) {
    console.error('[ExportController] PDF export failure:', error);
    return res.status(500).json({ error: error.message || 'Failed to export PDF' });
  }
};

export const handleExportPNG = async (req: Request, res: Response) => {
  try {
    const { page, format, dpi, pageNumber } = req.body;

    if (!page) {
      return res.status(400).json({ error: 'Page data is required' });
    }

    const pngBuffer = await exportPageToPNG(page, format || 'a5_portrait', dpi || 300);

    res.setHeader('Content-Type', 'image/png');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="Page_${pageNumber || 1}.png"`
    );
    res.setHeader('Content-Length', pngBuffer.length);
    return res.end(pngBuffer);
  } catch (err: any) {
    console.error('[ExportController] PNG export failure:', err);
    return res.status(500).json({ error: err.message || 'Failed to export PNG' });
  }
};
