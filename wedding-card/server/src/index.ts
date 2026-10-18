import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB, getStorageMode } from './config/db.js';
import aiRoutes from './routes/aiRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import exportRoutes from './routes/exportRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { isGeminiConfigured } from './services/geminiService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Middleware
app.use(
  cors({
    origin: [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'],
    credentials: true,
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health Check API
app.get('/api/health', (req: Request, res: Response) => {
  const storage = getStorageMode();
  res.json({
    status: 'healthy',
    application: 'VivahPatra AI - Indian Invitation Card Studio Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: {
      mongoConnected: storage.isConnected,
      fallbackMode: storage.memoryStoreMode,
    },
    ai: {
      geminiConfigured: isGeminiConfigured(),
    },
  });
});

// API Routes
app.use('/api/ai', aiRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/auth', authRoutes);

// Centralized error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[ServerError]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// Start Server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` VivahPatra AI Server running on http://localhost:${PORT}`);
    console.log(` Gemini AI Integration: ${isGeminiConfigured() ? 'Active (API Key loaded)' : 'Demo/Cultural Generator Mode'}`);
    console.log(`=======================================================`);
  });
};

startServer();

export default app;
