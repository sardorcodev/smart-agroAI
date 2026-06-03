import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
const TOKEN_STORAGE_KEY = 'smart_agro_access_token';
let authFailureHandler = null;

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getStoredToken = () => {
  if (typeof localStorage === 'undefined') {
    return null;
  }
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

export const setAuthToken = (token) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const clearAuthToken = () => {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
  delete api.defaults.headers.common.Authorization;
};

export const setAuthFailureHandler = (handler) => {
  authFailureHandler = handler;
};

export const formatApiError = (error, fallback = "Xatolik yuz berdi. Qayta urinib ko'ring.") => {
  const detail = error?.response?.data?.detail;

  if (Array.isArray(detail)) {
    const firstField = detail[0]?.loc?.slice(-1)?.[0];
    return firstField
      ? `Kiritilgan "${firstField}" qiymatini tekshiring.`
      : "Kiritilgan ma'lumotlarni tekshiring.";
  }

  if (typeof detail === 'string' && detail.length > 0 && detail.length <= 180) {
    return detail;
  }

  if (error?.response?.status === 401) {
    return "Sessiya muddati tugagan. Qayta tizimga kiring.";
  }

  if (error?.response?.status >= 500) {
    return "Serverda vaqtinchalik xatolik yuz berdi. Qayta urinib ko'ring.";
  }

  return fallback;
};

export const fetchCurrentUser = async () => {
  const res = await api.get('/api/me', { skipAuthFailureHandler: true });
  return res.data.user;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.skipAuthFailureHandler) {
      clearAuthToken();
      authFailureHandler?.();
    }
    return Promise.reject(error);
  }
);

const token = getStoredToken();
if (token) {
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
}
