const KEYS = {
  preorder: "hon_preorder_clicks",
  notice: "hon_notice",
  stats: "hon_visitor_stats",
};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

const DEFAULT_SECTIONS = {
  hero: { views: 0, totalMs: 0 },
  preorder: { views: 0, totalMs: 0 },
  jobs: { views: 0, totalMs: 0 },
  "monster-dex": { views: 0, totalMs: 0 },
  ost: { views: 0, totalMs: 0 },
};

const DEFAULT_STATS = { visits: 0, sections: DEFAULT_SECTIONS };

export function logPreorderClick() {
  const clicks = read(KEYS.preorder, []);
  clicks.push({ ts: Date.now() });
  write(KEYS.preorder, clicks);
}

export function getPreorderClicks() {
  return read(KEYS.preorder, []);
}

export function clearPreorderClicks() {
  write(KEYS.preorder, []);
}

export function getNotice() {
  return read(KEYS.notice, { text: "", enabled: false });
}

export function saveNotice(notice) {
  write(KEYS.notice, notice);
}

export function logPageVisit() {
  const stats = read(KEYS.stats, DEFAULT_STATS);
  stats.visits = (stats.visits || 0) + 1;
  if (!stats.sections) stats.sections = { ...DEFAULT_SECTIONS };
  write(KEYS.stats, stats);
}

export function logSectionDwell(sectionId, durationMs) {
  const stats = read(KEYS.stats, DEFAULT_STATS);
  if (!stats.sections) stats.sections = { ...DEFAULT_SECTIONS };
  if (!stats.sections[sectionId]) stats.sections[sectionId] = { views: 0, totalMs: 0 };
  stats.sections[sectionId].views += 1;
  stats.sections[sectionId].totalMs += durationMs;
  write(KEYS.stats, stats);
}

export function getStats() {
  const stats = read(KEYS.stats, DEFAULT_STATS);
  if (!stats.sections) stats.sections = { ...DEFAULT_SECTIONS };
  return stats;
}

export function clearStats() {
  write(KEYS.stats, { visits: 0, sections: { ...DEFAULT_SECTIONS } });
}
