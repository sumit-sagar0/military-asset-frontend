// In production (Vercel), uses VITE_API_BASE_URL env variable pointing to Render backend
// In development (localhost), Vite proxy routes /api → localhost:8080
const BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : '/api';

function getHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export const api = {
  get: (url: string) =>
    fetch(BASE_URL + url, { headers: getHeaders() }).then(r => {
      if (!r.ok) throw new Error(`API Error: ${r.status}`);
      return r.json();
    }),
  post: (url: string, body: any) =>
    fetch(BASE_URL + url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    }).then(r => {
      if (!r.ok) return r.text().then(t => Promise.reject(new Error(t)));
      return r.json();
    }),
};
