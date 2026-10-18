import { Router } from 'express';
import { handleExportPDF, handleExportPNG } from '../controllers/exportController.js';

const router = Router();

router.post('/pdf', handleExportPDF);
router.post('/png', handleExportPNG);

export default router;
