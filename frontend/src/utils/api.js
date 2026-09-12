/**
 * Authoritative API client for Build Your City: Life RPG
 */

const API_BASE = '/api';

export const getAuthToken = () => localStorage.getItem('life_rpg_auth_token');
export const setAuthToken = (token) => localStorage.setItem('life_rpg_auth_token', token);
export const clearAuthToken = () => localStorage.removeItem('life_rpg_auth_token');

export async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (res.status === 401) {
        clearAuthToken();
        // Optional trigger auth change
      }
      throw new Error(data.error || `HTTP error ${res.status}`);
    }

    return data;
  } catch (err) {
    console.error(`[API Error] ${endpoint}:`, err.message);
    throw err;
  }
}

export const api = {
  get: (endpoint) => apiRequest(endpoint, { method: 'GET' }),
  post: (endpoint, body) => apiRequest(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  patch: (endpoint, body) => apiRequest(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' }),
};
