import { Router } from 'express';
import {
  handleGenerateWording,
  handleRewrite,
  handleTranslate,
  handleProofread,
  handleGenerateBackground,
  getAIStatus,
} from '../controllers/aiController.js';

const router = Router();

router.get('/status', getAIStatus);
router.post('/wording', handleGenerateWording);
router.post('/rewrite', handleRewrite);
router.post('/translate', handleTranslate);
router.post('/proofread', handleProofread);
router.post('/background', handleGenerateBackground);

export default router;
