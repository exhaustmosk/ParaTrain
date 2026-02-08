// Use 127.0.0.1 — Electron often fails to reach "localhost"
export const API_BASE = "http://127.0.0.1:5000";

export function apiUrl(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${p}`;
}
