import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { EditorPage } from './pages/EditorPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { DashboardPage } from './pages/DashboardPage';
import { checkHealth } from './services/api';

export const App: React.FC = () => {
  useEffect(() => {
    // Check backend health on mount
    checkHealth()
      .then((h) => {
        console.log('[VivahPatra AI] Backend Health Status:', h);
      })
      .catch((e) => console.warn('[VivahPatra AI] Health check info:', e));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
