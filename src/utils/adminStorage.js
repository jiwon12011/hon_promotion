const KEYS = {
  preorder: "hon_preorder_clicks",
  notice: "hon_notice",
  stats: "hon_visitor_stats",
  dailyVisits: "hon_daily_visits",
  deviceStats: "hon_device_stats",
  preorderGoal: "hon_preorder_goal",
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

  const today = new Date().toISOString().slice(0, 10);
  const daily = read(KEYS.dailyVisits, {});
  daily[today] = (daily[today] || 0) + 1;
  write(KEYS.dailyVisits, daily);

  const isMobile = typeof navigator !== "undefined" && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  const devStats = read(KEYS.deviceStats, { mobile: 0, desktop: 0 });
  const key = isMobile ? "mobile" : "desktop";
  devStats[key] = (devStats[key] || 0) + 1;
  write(KEYS.deviceStats, devStats);
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

export function getDailyVisits() {
  return read(KEYS.dailyVisits, {});
}

export function getDeviceStats() {
  return read(KEYS.deviceStats, { mobile: 0, desktop: 0 });
}

export function getPreorderGoal() {
  return read(KEYS.preorderGoal, { target: 0 });
}

export function setPreorderGoal(target) {
  write(KEYS.preorderGoal, { target });
}

export function clearStats() {
  write(KEYS.stats, { visits: 0, sections: { ...DEFAULT_SECTIONS } });
  write(KEYS.dailyVisits, {});
  write(KEYS.deviceStats, { mobile: 0, desktop: 0 });
}
