// API_BASE comes from VITE_API_URL env var — set in Render environment variables
// Local dev: create .env with VITE_API_URL=http://localhost:3001/api
// Production: set VITE_API_URL=https://smart-waste-dashboard-fw7r.onrender.com/api in Render
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';


async function apiFetch(path: string, options?: RequestInit) {
  try {
    const token = localStorage.getItem('ecotrack_token');
    const res = await fetch(`${API_BASE}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...options,
    });

    const data = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));

    if (!res.ok) {
      // Return the error body so callers can show the message (e.g. "Incorrect password")
      return data;
    }
    return data;
  } catch (err) {
    // Only returns null on a true network failure (no internet, DNS failure, etc.)
    console.warn(`API call failed [${path}]:`, err);
    return null;
  }
}


export const api = {
  // Health
  health: () => apiFetch('/health'),

  // Auth
  auth: {
    signup: (name: string, email: string, password: string) =>
      apiFetch('/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
    signin: (email: string, password: string) =>
      apiFetch('/auth/signin', { method: 'POST', body: JSON.stringify({ email, password }) }),
    me: () => apiFetch('/auth/me'),
  },

  // Store endpoints
  stores: {
    getAll: () => apiFetch('/stores'),
    getById: (storeId: string) => apiFetch(`/stores/${storeId}`),
    updateSettings: (storeId: string, settings: any) =>
      apiFetch(`/stores/${storeId}/settings`, { method: 'PUT', body: JSON.stringify(settings) }),
    getProducts: (storeId: string, params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return apiFetch(`/stores/${storeId}/products${qs}`);
    },
    updateProduct: (storeId: string, productId: string, data: any) =>
      apiFetch(`/stores/${storeId}/products/${productId}`, { method: 'PATCH', body: JSON.stringify(data) }),
  },

  // AI endpoints
  ai: {
    chat: (query: string, storeContext: any) =>
      apiFetch('/ai/chat', { method: 'POST', body: JSON.stringify({ query, storeContext }) }),
    recommendations: (product: any, storeContext: any) =>
      apiFetch('/ai/recommendations', { method: 'POST', body: JSON.stringify({ product, storeContext }) }),
    successRates: () => apiFetch('/ai/success-rates'),
  },

  // Alert endpoints
  alerts: {
    getByStore: (storeId: string) => apiFetch(`/alerts?storeId=${storeId}`),
    generate: (storeId: string, thresholds: any) =>
      apiFetch(`/alerts/generate/${storeId}`, { method: 'POST', body: JSON.stringify(thresholds) }),
    resolve: (alertId: string, resolvedBy = 'Manager') =>
      apiFetch(`/alerts/${alertId}/resolve`, { method: 'PATCH', body: JSON.stringify({ resolvedBy }) }),
    markRead: (alertId: string) => apiFetch(`/alerts/${alertId}/read`, { method: 'PATCH' }),
  },

  // Analytics endpoints
  analytics: {
    getStoreAnalytics: (storeId: string) => apiFetch(`/analytics/${storeId}`),
    recordAction: (data: {
      storeId: string;
      productId?: string;
      productName: string;
      actionType: string;
      estimatedSavings?: number;
      discount?: number;
      organization?: string;
      destinationStore?: string;
    }) => apiFetch('/analytics/action', { method: 'POST', body: JSON.stringify(data) }),
    getNetworkComparison: () => apiFetch('/analytics/network/comparison'),
    logActivity: (data: {
      userId?: string;
      userName?: string;
      action: string;
      details?: any;
      path?: string;
    }) => apiFetch('/analytics/activity/log', { method: 'POST', body: JSON.stringify(data) }),
  },
};

export default api;
