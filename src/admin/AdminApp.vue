<script setup>
import { computed, onMounted, ref } from "vue";
import {
  clearPreorderClicks, clearStats,
  getDailyVisits, getDeviceStats,
  getNotice, getPreorderClicks, getPreorderGoal,
  getStats, saveNotice, setPreorderGoal,
} from "@/utils/adminStorage";

const ADMIN_PIN = "1234";
const SESSION_KEY = "hon_admin_auth";

const isAuthed = ref(false);
const pin = ref("");
const pinError = ref(false);
const activeTab = ref("preorder");

const tabs = [
  { id: "preorder", label: "사전예약", icon: "📋" },
  { id: "notice",   label: "공지사항", icon: "📢" },
  { id: "stats",    label: "방문자 통계", icon: "📊" },
];

// 사전예약
const clicks = ref([]);
const clicksReversed = computed(() => [...clicks.value].reverse());
const goalTarget = ref(0);
const goalInput = ref("");
const goalProgress = computed(() =>
  goalTarget.value ? Math.min(100, (clicks.value.length / goalTarget.value) * 100) : 0
);
const todayClicks = computed(() => {
  const today = new Date().toISOString().slice(0, 10);
  return clicks.value.filter((c) => new Date(c.ts).toISOString().slice(0, 10) === today).length;
});

// 공지사항
const noticeText = ref("");
const noticeEnabled = ref(false);
const noticeSaved = ref(false);
let noticeSaveTimer;

// 방문자 통계
const stats = ref(null);
const dailyVisits = ref({});
const deviceStats = ref({ mobile: 0, desktop: 0 });

const SECTION_LABELS = {
  hero: "메인",
  preorder: "사전예약",
  jobs: "직업소개",
  "monster-dex": "요괴도감",
  ost: "OST",
};

const TODAY = new Date().toISOString().slice(0, 10);

const dailyChartData = computed(() => {
  const items = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    items.push({
      key,
      count: dailyVisits.value[key] || 0,
      label: i % 2 === 0 ? `${d.getMonth() + 1}/${d.getDate()}` : "",
      isToday: key === TODAY,
    });
  }
  const maxCount = Math.max(1, ...items.map((d) => d.count));
  return items.map((d) => ({ ...d, heightPct: (d.count / maxCount) * 100 }));
});

const totalDevices = computed(() => (deviceStats.value.mobile || 0) + (deviceStats.value.desktop || 0));
const mobilePct  = computed(() => totalDevices.value ? Math.round((deviceStats.value.mobile  / totalDevices.value) * 100) : 0);
const desktopPct = computed(() => totalDevices.value ? 100 - mobilePct.value : 0);

// ── Auth ──
function tryLogin() {
  if (pin.value === ADMIN_PIN) {
    sessionStorage.setItem(SESSION_KEY, "1");
    isAuthed.value = true;
    pinError.value = false;
    loadAll();
  } else {
    pinError.value = true;
    pin.value = "";
  }
}

function loginAsDemo() {
  pin.value = ADMIN_PIN;
  tryLogin();
}

function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  isAuthed.value = false;
  pin.value = "";
}

// ── Data ──
function loadAll() {
  clicks.value = getPreorderClicks();
  const n = getNotice();
  noticeText.value = n.text;
  noticeEnabled.value = n.enabled;
  stats.value = getStats();
  dailyVisits.value = getDailyVisits();
  deviceStats.value = getDeviceStats();
  const goal = getPreorderGoal();
  goalTarget.value = goal.target || 0;
  goalInput.value = goal.target ? String(goal.target) : "";
}

// ── Preorder ──
function handleClearClicks() {
  if (!confirm("사전예약 클릭 데이터를 모두 삭제하시겠습니까?")) return;
  clearPreorderClicks();
  clicks.value = [];
}

function downloadCSV() {
  const header = "순번,날짜,시간";
  const rows = clicksReversed.value.map((c, i) => {
    const d = new Date(c.ts);
    return `${clicks.value.length - i},${d.toLocaleDateString("ko-KR")},${d.toLocaleTimeString("ko-KR")}`;
  });
  const csv = "﻿" + [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), { href: url, download: `preorder_${TODAY}.csv` });
  a.click();
  URL.revokeObjectURL(url);
}

function handleSaveGoal() {
  const val = parseInt(goalInput.value, 10);
  if (!val || val < 1) return;
  goalTarget.value = val;
  setPreorderGoal(val);
}

// ── Notice ──
function handleSaveNotice() {
  saveNotice({ text: noticeText.value, enabled: noticeEnabled.value });
  noticeSaved.value = true;
  clearTimeout(noticeSaveTimer);
  noticeSaveTimer = setTimeout(() => { noticeSaved.value = false; }, 2200);
}

// ── Stats ──
function handleClearStats() {
  if (!confirm("방문자 통계를 모두 초기화하시겠습니까?")) return;
  clearStats();
  stats.value = getStats();
  dailyVisits.value = getDailyVisits();
  deviceStats.value = getDeviceStats();
}

function maxSectionViews() {
  if (!stats.value?.sections) return 1;
  return Math.max(1, ...Object.values(stats.value.sections).map((s) => s.views));
}

function fmtDuration(ms) {
  if (!ms || ms < 1000) return "-";
  const s = Math.round(ms / 1000);
  return s >= 60 ? `${Math.floor(s / 60)}분 ${s % 60}초` : `${s}초`;
}

function fmtDate(ts) { return new Date(ts).toLocaleDateString("ko-KR"); }
function fmtTime(ts) { return new Date(ts).toLocaleTimeString("ko-KR"); }

onMounted(() => {
  if (sessionStorage.getItem(SESSION_KEY)) {
    isAuthed.value = true;
    loadAll();
  }
});
</script>

<template>
  <!-- ── 로그인 ── -->
  <div v-if="!isAuthed" class="auth-screen">
    <div class="auth-glow" />
    <div class="auth-card">
      <div class="auth-badge">귀혼M</div>
      <h1 class="auth-title">관리자 대시보드</h1>
      <p class="auth-sub">PIN을 입력하여 로그인하세요</p>
      <form @submit.prevent="tryLogin">
        <input
          v-model="pin"
          class="auth-input"
          :class="{ 'is-error': pinError }"
          type="password"
          placeholder="• • • • • • • •"
          maxlength="20"
          autocomplete="current-password"
          autofocus
        />
        <p v-if="pinError" class="auth-error">PIN이 올바르지 않습니다</p>
        <button class="auth-btn" type="submit">로그인</button>
      </form>
      <div class="auth-or"><span>또는</span></div>
      <button class="auth-demo" type="button" @click="loginAsDemo">데모로 체험하기</button>
    </div>
  </div>

  <!-- ── 대시보드 ── -->
  <div v-else class="dash">
    <!-- Header -->
    <header class="dash-header">
      <div class="dash-brand">
        <span class="dash-brand__name">귀혼M</span>
        <span class="dash-brand__sep">/</span>
        <span class="dash-brand__sub">관리자</span>
      </div>
      <nav class="dash-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="dash-tab"
          :class="{ 'is-active': activeTab === tab.id }"
          type="button"
          @click="activeTab = tab.id"
        >
          <span class="dash-tab__icon">{{ tab.icon }}</span>
          {{ tab.label }}
        </button>
      </nav>
      <button class="dash-logout" type="button" @click="logout">로그아웃</button>
    </header>

    <!-- Content -->
    <main class="dash-body">

      <!-- ══ 사전예약 ══ -->
      <section v-show="activeTab === 'preorder'" class="view">
        <!-- Goal card -->
        <div class="card goal-card">
          <div class="card-head">
            <span class="card-title">🎯 목표 달성 현황</span>
          </div>
          <div class="card-body">
            <div class="goal-nums">
              <span class="goal-current">{{ clicks.length.toLocaleString() }}</span>
              <span class="goal-div">/</span>
              <span class="goal-target-val">{{ goalTarget ? goalTarget.toLocaleString() : "미설정" }}</span>
              <span v-if="goalTarget" class="goal-pct-badge">{{ goalProgress.toFixed(1) }}%</span>
            </div>
            <div class="goal-track">
              <div class="goal-fill" :style="{ width: goalProgress + '%' }" />
            </div>
            <div class="goal-set-row">
              <input
                v-model="goalInput"
                class="goal-input"
                type="number"
                min="1"
                placeholder="목표 클릭 수 입력"
                @keyup.enter="handleSaveGoal"
              />
              <button class="btn btn-gold btn-sm" @click="handleSaveGoal">설정</button>
            </div>
          </div>
        </div>

        <!-- Metrics -->
        <div class="metrics">
          <div class="metric">
            <span class="metric-ico">📊</span>
            <span class="metric-val">{{ clicks.length.toLocaleString() }}</span>
            <span class="metric-lbl">총 클릭 수</span>
          </div>
          <div class="metric">
            <span class="metric-ico">⚡</span>
            <span class="metric-val">{{ todayClicks }}</span>
            <span class="metric-lbl">오늘 클릭</span>
          </div>
          <div class="metric">
            <span class="metric-ico">🗓</span>
            <span class="metric-val">{{ clicks.length ? fmtDate(clicks[clicks.length - 1].ts) : "-" }}</span>
            <span class="metric-lbl">마지막 클릭</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="action-row">
          <button class="btn btn-gold" :disabled="!clicks.length" @click="downloadCSV">↓ CSV 다운로드</button>
          <button class="btn btn-danger" :disabled="!clicks.length" @click="handleClearClicks">데이터 초기화</button>
        </div>

        <!-- Table -->
        <div class="card">
          <div class="card-head">
            <span class="card-title">클릭 기록</span>
            <span class="card-badge">{{ clicks.length }}건</span>
          </div>
          <div class="tbl-wrap">
            <table v-if="clicks.length" class="tbl">
              <thead><tr><th>#</th><th>날짜</th><th>시간</th></tr></thead>
              <tbody>
                <tr v-for="(c, i) in clicksReversed" :key="c.ts">
                  <td class="td-dim">{{ clicks.length - i }}</td>
                  <td>{{ fmtDate(c.ts) }}</td>
                  <td class="td-dim">{{ fmtTime(c.ts) }}</td>
                </tr>
              </tbody>
            </table>
            <div v-else class="empty">
              <div class="empty-ico">📭</div>
              <p>아직 클릭 데이터가 없습니다</p>
              <p class="empty-sub">프로모션 페이지 <strong>탑 도전하기</strong> 버튼 클릭이 기록됩니다</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ══ 공지사항 ══ -->
      <section v-show="activeTab === 'notice'" class="view">
        <div class="card">
          <div class="card-head">
            <span class="card-title">📢 공지사항 관리</span>
            <label class="toggle">
              <input v-model="noticeEnabled" type="checkbox" />
              <span class="toggle-track"><span class="toggle-thumb" /></span>
            </label>
          </div>
          <div class="card-body notice-body">
            <label class="field-lbl">공지 내용</label>
            <textarea
              v-model="noticeText"
              class="notice-ta"
              placeholder="프로모션 페이지 상단에 표시될 공지사항을 입력하세요."
              rows="4"
            />
            <label class="field-lbl">미리보기</label>
            <div class="notice-preview" :class="{ 'is-on': noticeEnabled }">
              <span class="notice-dot" />
              <span v-if="noticeText" class="notice-text">{{ noticeText }}</span>
              <span v-else class="notice-ph">공지 내용이 여기에 표시됩니다</span>
            </div>
            <button
              class="btn btn-gold"
              :class="{ 'btn-saved': noticeSaved }"
              style="width: 100%; max-width: 260px;"
              @click="handleSaveNotice"
            >
              {{ noticeSaved ? "✓ 저장 완료" : "저장하기" }}
            </button>
          </div>
        </div>
      </section>

      <!-- ══ 방문자 통계 ══ -->
      <section v-show="activeTab === 'stats'" class="view">
        <!-- Summary -->
        <div class="metrics" v-if="stats">
          <div class="metric">
            <span class="metric-ico">👥</span>
            <span class="metric-val">{{ (stats.visits || 0).toLocaleString() }}</span>
            <span class="metric-lbl">총 방문 수</span>
          </div>
          <div class="metric">
            <span class="metric-ico">🎯</span>
            <span class="metric-val">
              {{ stats.visits && clicks.length ? ((clicks.length / stats.visits) * 100).toFixed(1) + "%" : "-" }}
            </span>
            <span class="metric-lbl">예약 전환율</span>
          </div>
          <div class="metric metric-blue">
            <span class="metric-ico">📱</span>
            <span class="metric-val">{{ mobilePct }}%</span>
            <span class="metric-lbl">모바일</span>
          </div>
          <div class="metric metric-purple">
            <span class="metric-ico">🖥</span>
            <span class="metric-val">{{ desktopPct }}%</span>
            <span class="metric-lbl">데스크톱</span>
          </div>
        </div>

        <!-- Daily chart -->
        <div class="card">
          <div class="card-head">
            <span class="card-title">📈 일별 방문 추이 <span class="card-sub">최근 14일</span></span>
          </div>
          <div class="card-body">
            <div class="chart">
              <div class="chart-bars">
                <div v-for="d in dailyChartData" :key="d.key" class="bar-col">
                  <span class="bar-cnt">{{ d.count || "" }}</span>
                  <div class="bar-track">
                    <div class="bar-fill" :class="{ today: d.isToday }" :style="{ height: d.heightPct + '%' }" />
                  </div>
                </div>
              </div>
              <div class="chart-labels">
                <span v-for="d in dailyChartData" :key="d.key" :class="{ today: d.isToday }">{{ d.label }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Device stats -->
        <div class="card">
          <div class="card-head">
            <span class="card-title">📱 기기 유형 통계</span>
          </div>
          <div class="card-body device-body">
            <div v-if="totalDevices" class="device-items">
              <div class="device-item">
                <span class="device-ico">📱</span>
                <div>
                  <div class="device-name">모바일</div>
                  <div class="device-val">{{ deviceStats.mobile.toLocaleString() }}명</div>
                </div>
                <span class="device-pct device-pct-blue">{{ mobilePct }}%</span>
              </div>
              <div class="device-item">
                <span class="device-ico">🖥</span>
                <div>
                  <div class="device-name">데스크톱</div>
                  <div class="device-val">{{ deviceStats.desktop.toLocaleString() }}명</div>
                </div>
                <span class="device-pct device-pct-gold">{{ desktopPct }}%</span>
              </div>
            </div>
            <div v-else class="device-empty">아직 방문 데이터가 없습니다</div>
            <div class="split-bar">
              <div class="split-mobile" :style="{ width: mobilePct + '%' }" />
              <div class="split-desktop" :style="{ width: desktopPct + '%' }" />
            </div>
            <div v-if="totalDevices" class="split-lbls">
              <span class="is-blue">모바일 {{ mobilePct }}%</span>
              <span class="is-gold">데스크톱 {{ desktopPct }}%</span>
            </div>
          </div>
        </div>

        <!-- Section dwell -->
        <div class="card" v-if="stats">
          <div class="card-head">
            <span class="card-title">⏱ 섹션별 체류 현황</span>
          </div>
          <table class="tbl">
            <thead>
              <tr>
                <th>섹션</th>
                <th>조회 수</th>
                <th>평균 체류</th>
                <th class="th-bar"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(data, id) in stats.sections" :key="id">
                <td>{{ SECTION_LABELS[id] ?? id }}</td>
                <td class="td-gold">{{ data.views }}</td>
                <td class="td-dim">{{ data.views ? fmtDuration(data.totalMs / data.views) : "-" }}</td>
                <td class="td-bar-cell">
                  <div class="inline-bar">
                    <div class="inline-fill" :style="{ width: (data.views / maxSectionViews() * 100) + '%' }" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <button class="btn btn-danger" @click="handleClearStats">통계 초기화</button>
      </section>

    </main>
  </div>
</template>

<style>
/* ── Base ── */
*, *::before, *::after { box-sizing: border-box; }
html, body {
  margin: 0;
  min-height: 100vh;
  background: #090a0e;
  color: #d8dcea;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Pretendard, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
button, input, textarea { font: inherit; }
button { cursor: pointer; }
#admin-app { min-height: 100vh; }

/* ── Auth ── */
.auth-screen {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background:
    radial-gradient(ellipse 700px 500px at 50% 0%, rgba(232,168,48,0.06) 0%, transparent 70%),
    #090a0e;
}

.auth-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(ellipse 400px 300px at 50% 50%, rgba(232,168,48,0.04), transparent 70%);
}

.auth-card {
  position: relative;
  z-index: 1;
  width: 360px;
  padding: 40px 32px 36px;
  border: 1px solid rgba(232,168,48,0.14);
  border-radius: 18px;
  background: #10121a;
  box-shadow: 0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04);
  text-align: center;
}

.auth-badge {
  display: inline-block;
  padding: 4px 14px;
  border: 1px solid rgba(232,168,48,0.28);
  border-radius: 999px;
  background: rgba(232,168,48,0.08);
  color: #e8a830;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 18px;
}

.auth-title {
  margin: 0 0 6px;
  font-size: 22px;
  font-weight: 700;
  color: #e8ecf8;
}

.auth-sub {
  margin: 0 0 24px;
  font-size: 13px;
  color: #4e5264;
}

.auth-input {
  display: block;
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  background: rgba(255,255,255,0.04);
  color: #e0e4f2;
  font-size: 18px;
  letter-spacing: 0.22em;
  text-align: center;
  outline: none;
  margin-bottom: 10px;
  transition: border-color 150ms;
}
.auth-input:focus { border-color: rgba(232,168,48,0.4); }
.auth-input.is-error { border-color: rgba(255,80,80,0.5); animation: shake 220ms; }

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  30% { transform: translateX(-6px); }
  70% { transform: translateX(6px); }
}

.auth-error {
  margin: -4px 0 10px;
  color: #e87070;
  font-size: 12px;
}

.auth-btn {
  width: 100%;
  height: 48px;
  border: 0;
  border-radius: 10px;
  background: linear-gradient(135deg, #cf8520, #a86018);
  color: #fff8e8;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.02em;
  box-shadow: 0 8px 24px rgba(180,100,20,0.32);
  transition: filter 150ms, transform 100ms;
}
.auth-btn:hover { filter: brightness(1.1); }
.auth-btn:active { transform: scale(0.98); }

.auth-or {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0 0;
  color: #2e3040;
  font-size: 12px;
}
.auth-or::before, .auth-or::after { flex: 1; height: 1px; background: rgba(255,255,255,0.05); content: ""; }

.auth-demo {
  width: 100%;
  height: 44px;
  margin-top: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  background: transparent;
  color: #585c70;
  font-size: 13px;
  font-weight: 600;
  transition: color 150ms, border-color 150ms, background 150ms;
}
.auth-demo:hover { color: #b0b4c8; border-color: rgba(255,255,255,0.16); background: rgba(255,255,255,0.03); }

/* ── Dashboard ── */
.dash { display: grid; grid-template-rows: 58px 1fr; min-height: 100vh; }

.dash-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: #10121a;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  position: sticky;
  top: 0;
  z-index: 50;
  gap: 20px;
}

.dash-brand { display: flex; align-items: center; gap: 6px; white-space: nowrap; }
.dash-brand__name { font-size: 15px; font-weight: 800; color: #e8a830; letter-spacing: 0.04em; }
.dash-brand__sep { color: #2e3040; }
.dash-brand__sub { font-size: 13px; font-weight: 500; color: #5a5e74; }

.dash-tabs {
  display: flex;
  gap: 2px;
  padding: 4px;
  border-radius: 10px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
}

.dash-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: #585c70;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  transition: color 150ms, background 150ms;
}
.dash-tab:hover { color: #9096b0; background: rgba(255,255,255,0.04); }
.dash-tab.is-active { background: rgba(232,168,48,0.12); color: #e8a830; }
.dash-tab__icon { font-size: 14px; }

.dash-logout {
  padding: 7px 16px;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  background: transparent;
  color: #585c70;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  transition: color 150ms, border-color 150ms;
}
.dash-logout:hover { color: #c0c4d8; border-color: rgba(255,255,255,0.16); }

.dash-body { padding: 24px; overflow-y: auto; background: #090a0e; }

.view { display: grid; gap: 18px; max-width: 960px; }

/* ── Card ── */
.card {
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 14px;
  background: #10121a;
  overflow: hidden;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.card-title {
  font-size: 13px;
  font-weight: 700;
  color: #c0c4d8;
}

.card-sub {
  font-size: 12px;
  font-weight: 400;
  color: #4e5264;
  margin-left: 6px;
}

.card-badge {
  padding: 2px 10px;
  border-radius: 999px;
  background: rgba(232,168,48,0.1);
  color: #e8a830;
  font-size: 11px;
  font-weight: 700;
}

.card-body { padding: 20px; }

/* ── Metrics ── */
.metrics { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }

.metric {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 18px 18px 16px;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  background: #10121a;
}

.metric-ico { font-size: 20px; line-height: 1; }
.metric-val { font-size: 26px; font-weight: 700; color: #e8ecf8; line-height: 1; letter-spacing: -0.01em; }
.metric-lbl { font-size: 10px; font-weight: 700; color: #4e5264; text-transform: uppercase; letter-spacing: 0.1em; }
.metric-blue .metric-val { color: #5aafff; }
.metric-purple .metric-val { color: #b080ff; }

/* ── Goal card ── */
.goal-card .card-head { border-bottom: 0; }

.goal-nums {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 14px;
}

.goal-current { font-size: 38px; font-weight: 700; color: #e8a830; line-height: 1; }
.goal-div { font-size: 24px; color: #2e3040; }
.goal-target-val { font-size: 22px; font-weight: 600; color: #4e5264; }
.goal-pct-badge {
  margin-left: 4px;
  padding: 2px 10px;
  border-radius: 999px;
  background: rgba(61,196,122,0.12);
  color: #3dc47a;
  font-size: 13px;
  font-weight: 700;
}

.goal-track {
  height: 8px;
  border-radius: 999px;
  background: rgba(255,255,255,0.06);
  overflow: hidden;
  margin-bottom: 14px;
}

.goal-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #c97f20, #f5d080);
  min-width: 3px;
  transition: width 800ms cubic-bezier(0.23,1,0.32,1);
}

.goal-set-row { display: flex; gap: 8px; }

.goal-input {
  flex: 1;
  height: 38px;
  padding: 0 12px;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  background: rgba(255,255,255,0.04);
  color: #e0e4f2;
  outline: none;
  transition: border-color 150ms;
}
.goal-input:focus { border-color: rgba(232,168,48,0.4); }
.goal-input::placeholder { color: #3a3e4e; }

/* ── Buttons ── */
.action-row { display: flex; gap: 10px; flex-wrap: wrap; }

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 18px;
  border: 0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  transition: filter 150ms, transform 100ms, opacity 150ms;
}
.btn:active { transform: scale(0.97); }
.btn:disabled { opacity: 0.3; cursor: not-allowed; transform: none !important; pointer-events: none; }

.btn-sm { padding: 7px 14px; font-size: 12px; }

.btn-gold {
  background: linear-gradient(135deg, #cf8520, #a86018);
  color: #fff8e8;
  box-shadow: 0 4px 14px rgba(180,100,20,0.28);
}
.btn-gold:not(:disabled):hover { filter: brightness(1.1); }
.btn-gold.btn-saved { background: linear-gradient(135deg, #268c54, #1e6e42); box-shadow: none; }

.btn-danger {
  background: rgba(200,60,60,0.1);
  border: 1px solid rgba(200,60,60,0.22);
  color: #e07070;
}
.btn-danger:not(:disabled):hover { background: rgba(200,60,60,0.18); }

/* ── Table ── */
.tbl-wrap { overflow-x: auto; }

.tbl { width: 100%; border-collapse: collapse; }

.tbl th {
  padding: 10px 16px;
  background: rgba(255,255,255,0.02);
  color: #404458;
  font-size: 10px;
  font-weight: 700;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.tbl td {
  padding: 11px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  color: #9096a8;
  font-size: 13px;
}

.tbl tbody tr:last-child td { border-bottom: 0; }
.tbl tbody tr:hover td { background: rgba(255,255,255,0.02); }

.td-gold { color: #e8a830; font-weight: 600; font-variant-numeric: tabular-nums; }
.td-dim { color: #4e5264; font-variant-numeric: tabular-nums; }
.th-bar { width: 180px; }
.td-bar-cell { padding-right: 20px !important; }

/* ── Inline bar ── */
.inline-bar {
  height: 5px;
  border-radius: 999px;
  background: rgba(255,255,255,0.06);
  overflow: hidden;
}
.inline-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #c97f20, #f5d080);
  min-width: 2px;
  transition: width 500ms ease;
}

/* ── Empty ── */
.empty { padding: 52px 24px; text-align: center; color: #404458; }
.empty-ico { font-size: 36px; margin-bottom: 12px; }
.empty p { margin: 0 0 4px; font-size: 14px; }
.empty-sub { font-size: 12px; }
.empty-sub strong { color: #686c80; }

/* ── Notice ── */
.notice-body { display: grid; gap: 14px; }

.field-lbl {
  display: block;
  font-size: 10px;
  font-weight: 700;
  color: #404458;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.notice-ta {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  background: rgba(255,255,255,0.03);
  color: #e0e4f2;
  resize: vertical;
  outline: none;
  line-height: 1.6;
  transition: border-color 150ms;
}
.notice-ta:focus { border-color: rgba(232,168,48,0.35); }
.notice-ta::placeholder { color: #2e3040; }

.notice-preview {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border: 1px dashed rgba(255,255,255,0.07);
  border-radius: 10px;
  background: rgba(255,255,255,0.02);
  min-height: 50px;
  transition: border-color 250ms, background 250ms;
}
.notice-preview.is-on { border-color: rgba(232,168,48,0.24); background: rgba(232,168,48,0.05); }

.notice-dot {
  flex-shrink: 0;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #2e3040;
  transition: background 250ms, box-shadow 250ms;
}
.notice-preview.is-on .notice-dot { background: #e8a830; box-shadow: 0 0 6px rgba(232,168,48,0.6); }

.notice-text { color: #e8c878; font-size: 14px; font-weight: 600; }
.notice-ph { color: #2e3040; font-size: 13px; font-style: italic; }

/* ── Toggle ── */
.toggle { display: inline-block; cursor: pointer; }
.toggle input { position: absolute; opacity: 0; width: 0; height: 0; }
.toggle-track {
  display: flex;
  align-items: center;
  width: 44px;
  height: 24px;
  padding: 2px;
  border-radius: 999px;
  background: rgba(255,255,255,0.1);
  transition: background 200ms;
}
.toggle input:checked ~ .toggle-track { background: #c97f20; }
.toggle-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #e0e4f2;
  transition: transform 200ms cubic-bezier(0.23,1,0.32,1);
  box-shadow: 0 1px 4px rgba(0,0,0,0.3);
}
.toggle input:checked ~ .toggle-track .toggle-thumb { transform: translateX(20px); }

/* ── Daily chart ── */
.chart { display: grid; gap: 6px; }

.chart-bars {
  display: flex;
  gap: 3px;
  align-items: flex-end;
  height: 120px;
}

.bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  gap: 3px;
}

.bar-cnt {
  font-size: 9px;
  color: #e8a830;
  min-height: 13px;
  line-height: 13px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.bar-track {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.bar-fill {
  width: 100%;
  border-radius: 3px 3px 0 0;
  background: linear-gradient(180deg, rgba(232,168,48,0.6), rgba(180,100,20,0.8));
  min-height: 2px;
  transition: height 600ms cubic-bezier(0.23,1,0.32,1);
}
.bar-fill.today { background: linear-gradient(180deg, #f5d080, #e8a830); box-shadow: 0 0 8px rgba(232,168,48,0.35); }

.chart-labels {
  display: flex;
  gap: 3px;
}
.chart-labels span {
  flex: 1;
  font-size: 9px;
  color: #353848;
  text-align: center;
  overflow: hidden;
}
.chart-labels span.today { color: #e8a830; }

/* ── Device stats ── */
.device-body { display: grid; gap: 16px; }

.device-items { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

.device-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 10px;
  background: rgba(255,255,255,0.02);
}

.device-ico { font-size: 22px; }
.device-name { font-size: 10px; font-weight: 700; color: #4e5264; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 2px; }
.device-val { font-size: 17px; font-weight: 700; color: #c0c4d8; }
.device-pct { margin-left: auto; font-size: 18px; font-weight: 700; }
.device-pct-blue { color: #5aafff; }
.device-pct-gold { color: #e8a830; }
.device-empty { color: #404458; font-size: 13px; text-align: center; padding: 8px 0; }

.split-bar {
  display: flex;
  height: 8px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255,255,255,0.05);
}
.split-mobile { background: linear-gradient(90deg, #3a8fe0, #5aafff); transition: width 600ms ease; min-width: 2px; border-radius: 999px 0 0 999px; }
.split-desktop { background: linear-gradient(90deg, #c97f20, #f5d080); transition: width 600ms ease; min-width: 2px; border-radius: 0 999px 999px 0; }

.split-lbls { display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; }
.is-blue { color: #5aafff; }
.is-gold { color: #e8a830; }
</style>
