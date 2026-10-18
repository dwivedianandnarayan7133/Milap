import { InvitationProject, SupportedLanguage, EventCategory } from '../types/card';

const API_BASE = '/api';

export interface HealthResponse {
  status: string;
  database: {
    mongoConnected: boolean;
    fallbackMode: boolean;
  };
  ai: {
    geminiConfigured: boolean;
  };
}

export const checkHealth = async (): Promise<HealthResponse> => {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (err) {
    return {
      status: 'offline',
      database: { mongoConnected: false, fallbackMode: true },
      ai: { geminiConfigured: false },
    };
  }
};

// AI Services
export const generateAIWording = async (payload: {
  category: EventCategory;
  language: SupportedLanguage;
  secondaryLanguage?: SupportedLanguage;
  isBilingual?: boolean;
  tone?: string;
  details: Record<string, any>;
}) => {
  const res = await fetch(`${API_BASE}/ai/wording`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to generate wording');
  }
  return await res.json();
};

export const rewriteAIText = async (text: string, tone: string, language: SupportedLanguage) => {
  const res = await fetch(`${API_BASE}/ai/rewrite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, tone, language }),
  });
  if (!res.ok) throw new Error('Failed to rewrite text');
  return await res.json();
};

export const translateAIText = async (text: string, targetLanguage: SupportedLanguage) => {
  const res = await fetch(`${API_BASE}/ai/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, targetLanguage }),
  });
  if (!res.ok) throw new Error('Failed to translate text');
  return await res.json();
};

export const proofreadAIText = async (text: string, language: SupportedLanguage) => {
  const res = await fetch(`${API_BASE}/ai/proofread`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, language }),
  });
  if (!res.ok) throw new Error('Failed to proofread text');
  return await res.json();
};

export const generateAIBackground = async (payload: {
  theme: string;
  primaryColor?: string;
  secondaryColor?: string;
  texture?: string;
  borderStyle?: string;
  orientation?: string;
  decorationIntensity?: string;
  customPrompt?: string;
}) => {
  const res = await fetch(`${API_BASE}/ai/background`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to generate background');
  return await res.json();
};

// Project persistence
export const fetchProjects = async (guestSessionId?: string, ownerId?: string) => {
  const params = new URLSearchParams();
  if (ownerId) params.append('ownerId', ownerId);
  else if (guestSessionId) params.append('guestSessionId', guestSessionId);

  const res = await fetch(`${API_BASE}/projects?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  return await res.json();
};

export const fetchProjectById = async (id: string) => {
  const res = await fetch(`${API_BASE}/projects/${id}`);
  if (!res.ok) throw new Error('Project not found');
  return await res.json();
};

export const saveProjectApi = async (project: InvitationProject) => {
  const id = project._id || project.id;
  const method = id && !id.startsWith('temp_') ? 'PUT' : 'POST';
  const url = id && !id.startsWith('temp_') ? `${API_BASE}/projects/${id}` : `${API_BASE}/projects`;

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project),
  });
  if (!res.ok) throw new Error('Failed to save project');
  return await res.json();
};

export const deleteProjectApi = async (id: string) => {
  const res = await fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete project');
  return await res.json();
};

export const duplicateProjectApi = async (id: string) => {
  const res = await fetch(`${API_BASE}/projects/${id}/duplicate`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to duplicate project');
  return await res.json();
};

// PDF & Image Export
export const exportPdfApi = async (payload: {
  pages: any[];
  format: string;
  bleed?: boolean;
  cropMarks?: boolean;
  dpi?: number;
  projectName?: string;
}): Promise<Blob> => {
  const res = await fetch(`${API_BASE}/export/pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'PDF export failed');
  }
  return await res.blob();
};

export const exportPngApi = async (payload: {
  page: any;
  format: string;
  dpi?: number;
  pageNumber?: number;
}): Promise<Blob> => {
  const res = await fetch(`${API_BASE}/export/png`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'PNG export failed');
  }
  return await res.blob();
};
