import axios from 'axios';
import { firebaseAuth } from './firebase';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 30000,
});

// Attach Firebase auth token to every request
API.interceptors.request.use(async (config) => {
  try {
    const user = firebaseAuth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    console.log('Auth token error:', e);
  }
  return config;
});

// ─── AUTH ───
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  getMe: () => API.get('/auth/me'),
  updateMe: (data) => API.put('/auth/me', data),
};

// ─── SYMPTOMS ───
export const symptomAPI = {
  check: (data) => API.post('/symptoms/check', data),
  getHistory: (profileId) => API.get(`/symptoms/history/${profileId}`),
  followUp: (data) => API.post('/symptoms/follow-up', data),
};

// ─── AI ANALYSIS ───
export const aiAPI = {
  diseaseProbability: (symptoms) => API.post('/ai-analysis/disease-probability', { symptoms }),
  recoveryPrediction: (data) => API.post('/ai-analysis/recovery-prediction', data),
  riskScore: (data) => API.post('/ai-analysis/risk-score', data),
  explainDesi: (text) => API.post('/ai-analysis/explain-desi', { text }),
  labInterpret: (labResults) => API.post('/ai-analysis/lab-interpret', { labResults }),
  dailyTip: (data) => API.post('/ai-analysis/daily-tip', data),
  dietSuggestion: (data) => API.post('/ai-analysis/diet-suggestion', data),
  medicineInfo: (name) => API.post('/ai-analysis/medicine-info', { medicineName: name }),
  mentalHealth: (messages) => API.post('/ai-analysis/mental-health', { messages }),
  habitFeedback: (habits) => API.post('/ai-analysis/habit-feedback', { habits }),
};

// ─── REPORTS ───
export const reportAPI = {
  generate: (data) => API.post('/reports/generate', data),
  download: (id) => API.get(`/reports/download/${id}`, { responseType: 'blob' }),
  list: (profileId) => API.get(`/reports/list/${profileId}`),
  listAll: () => API.get('/reports/all'),
};

// ─── HABITS ───
export const habitAPI = {
  log: (data) => API.post('/habits/log', data),
  getHistory: (profileId, days) => API.get(`/habits/history/${profileId}?days=${days || 30}`),
  getToday: (profileId) => API.get(`/habits/today/${profileId}`),
};

// ─── PROFILES ───
export const profileAPI = {
  create: (data) => API.post('/profiles', data),
  getAll: () => API.get('/profiles'),
  update: (id, data) => API.put(`/profiles/${id}`, data),
  delete: (id) => API.delete(`/profiles/${id}`),
};

// ─── ALERTS ───
export const alertAPI = {
  getAll: () => API.get('/alerts'),
  setVaccineReminder: (data) => API.post('/alerts/vaccine-reminder', data),
  markRead: (alertId) => API.post('/alerts/mark-read', { alertId }),
  getRegional: () => API.get('/alerts/regional'),
};

// ─── EMERGENCY ───
export const emergencyAPI = {
  getHospitals: (params) => API.get('/emergency/hospitals', { params }),
  getContacts: () => API.get('/emergency/contacts'),
  shareLocation: (data) => API.post('/emergency/share-location', data),
};

// ─── TRENDS ───
export const trendAPI = {
  getRegional: (region) => API.get(`/trends/regional?region=${region || ''}`),
  getSeasonal: () => API.get('/trends/seasonal'),
};

export default API;
