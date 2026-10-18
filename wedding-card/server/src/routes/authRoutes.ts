import { Router } from 'express';
import { handleGuestSession, handleRegister, handleLogin } from '../controllers/authController.js';

const router = Router();

router.post('/guest', handleGuestSession);
router.post('/register', handleRegister);
router.post('/login', handleLogin);

export default router;
