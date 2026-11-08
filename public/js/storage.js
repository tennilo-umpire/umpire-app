export const MATCH_KEY = 'tennilo-umpire:match:v1';
export function loadMatch() {
  try { const raw = localStorage.getItem(MATCH_KEY); return raw ? JSON.parse(raw) : null; }
  catch { return null; }
}
export function saveMatch(match) { localStorage.setItem(MATCH_KEY, JSON.stringify(match)); }
