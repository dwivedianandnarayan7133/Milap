import { Request, Response } from 'express';
import {
  generateInvitationWording,
  rewriteText,
  translateText,
  proofreadText,
  isGeminiConfigured,
} from '../services/geminiService.js';
import { generateBackgroundArtwork } from '../services/imageGenService.js';

export const getAIStatus = async (req: Request, res: Response) => {
  res.json({
    geminiConfigured: isGeminiConfigured(),
    message: isGeminiConfigured()
      ? 'Google Gemini API is configured and operational.'
      : 'Demo / Cultural generator mode active. Add GEMINI_API_KEY in .env for live Gemini generations.',
  });
};

export const handleGenerateWording = async (req: Request, res: Response) => {
  try {
    const { category, language, secondaryLanguage, isBilingual, tone, details } = req.body;

    if (!category || !language) {
      return res.status(400).json({ error: 'category and language are required fields' });
    }

    const wording = await generateInvitationWording({
      category,
      language,
      secondaryLanguage,
      isBilingual,
      tone,
      details: details || {},
    });

    res.json({
      success: true,
      data: wording,
      isAiGenerated: isGeminiConfigured(),
    });
  } catch (error: any) {
    console.error('[AIController] Error generating wording:', error);
    res.status(500).json({ error: error.message || 'Failed to generate wording' });
  }
};

export const handleRewrite = async (req: Request, res: Response) => {
  try {
    const { text, tone, language } = req.body;
    if (!text || !tone) {
      return res.status(400).json({ error: 'text and tone are required' });
    }

    const result = await rewriteText(text, tone, language || 'hi');
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const handleTranslate = async (req: Request, res: Response) => {
  try {
    const { text, targetLanguage } = req.body;
    if (!text || !targetLanguage) {
      return res.status(400).json({ error: 'text and targetLanguage are required' });
    }

    const result = await translateText(text, targetLanguage);
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const handleProofread = async (req: Request, res: Response) => {
  try {
    const { text, language } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'text is required' });
    }

    const result = await proofreadText(text, language || 'hi');
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const handleGenerateBackground = async (req: Request, res: Response) => {
  try {
    const {
      theme,
      primaryColor,
      secondaryColor,
      texture,
      borderStyle,
      orientation,
      decorationIntensity,
      customPrompt,
    } = req.body;

    const artwork = await generateBackgroundArtwork({
      theme: theme || 'royal_traditional',
      primaryColor,
      secondaryColor,
      texture,
      borderStyle,
      orientation,
      decorationIntensity,
      customPrompt,
    });

    res.json({
      success: true,
      data: artwork,
    });
  } catch (error: any) {
    console.error('[AIController] Error generating background:', error);
    res.status(500).json({ error: error.message || 'Failed to generate artwork' });
  }
};
