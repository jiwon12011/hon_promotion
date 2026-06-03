<script setup>
import { computed, onMounted, ref } from "vue";
import {
  clearPreorderClicks,
  clearStats,
  getNotice,
  getPreorderClicks,
  getStats,
  saveNotice,
} from "@/utils/adminStorage";

const ADMIN_PIN = "1234";
const SESSION_KEY = "hon_admin_auth";

const isAuthed = ref(false);
const pin = ref("");
const pinError = ref(false);
const activeTab = ref("preorder");

// 사전예약
const clicks = ref([]);
const clicksReversed = computed(() => [...clicks.value].reverse());

// 공지사항
const noticeText = ref("");
const noticeEnabled = ref(false);
const noticeSaved = ref(false);
let noticeSaveTimer;

// 방문자 통계
const stats = ref(null);
const SECTION_LABELS = {
  hero: "메인",
  preorder: "사전예약",
  jobs: "직업소개",
  "monster-dex": "요괴도감",
  ost: "OST",
};

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

function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  isAuthed.value = false;
  pin.value = "";
}

function loadAll() {
  clicks.value = getPreorderClicks();
  const n = getNotice();
  noticeText.value = n.text;
  noticeEnabled.value = n.enabled;
  stats.value = getStats();
}

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
  const a = document.createElement("a");
  a.href = url;
  a.download = `preorder_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function handleSaveNotice() {
  saveNotice({ text: noticeText.value, enabled: noticeEnabled.value });
  noticeSaved.value = true;
  clearTimeout(noticeSaveTimer);
  noticeSaveTimer = setTimeout(() => {
    noticeSaved.value = false;
  }, 2200);
}

function handleClearStats() {
  if (!confirm("방문자 통계를 모두 초기화하시겠습니까?")) return;
  clearStats();
  stats.value = getStats();
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

function fmtDate(ts) {
  return new Date(ts).toLocaleDateString("ko-KR");
}

function fmtTime(ts) {
  return new Date(ts).toLocaleTimeString("ko-KR");
}

onMounted(() => {
  if (sessionStorage.getItem(SESSION_KEY)) {
    isAuthed.value = true;
    loadAll();
  }
});
</script>

<template>
  <!-- 로그인 화면 -->
  <div v-if="!isAuthed" class="auth-wrap">
    <div class="auth-card">
      <div class="auth-card__logo">귀혼M</div>
      <h1 class="auth-card__title">관리자</h1>
      <form class="auth-card__form" @submit.prevent="tryLogin">
        <input
          v-model="pin"
          class="auth-input"
          :class="{ 'is-error': pinError }"
          type="password"
          placeholder="PIN 입력"
          maxlength="20"
          autocomplete="current-password"
          autofocus
        />
        <p v-if="pinError" class="auth-error">PIN이 올바르지 않습니다.</p>
        <button class="auth-btn" type="submit">로그인</button>
      </form>
    </div>
  </div>

  <!-- 관리자 대시보드 -->
  <div v-else class="admin-layout">
    <header class="admin-header">
      <span class="admin-header__brand">귀혼M 관리자</span>
      <button class="admin-header__logout" type="button" @click="logout">로그아웃</button>
    </header>

    <nav class="admin-tabs">
      <button
        v-for="tab in [
          { id: 'preorder', label: '사전예약 현황' },
          { id: 'notice', label: '공지사항' },
          { id: 'stats', label: '방문자 통계' },
        ]"
        :key="tab.id"
        class="admin-tab"
        :class="{ 'is-active': activeTab === tab.id }"
        type="button"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </nav>

    <main class="admin-content">

      <!-- ── 사전예약 현황 ── -->
      <section v-show="activeTab === 'preorder'" class="tab-panel">
        <div class="summary-row">
          <div class="stat-card">
            <span class="stat-card__value">{{ clicks.length.toLocaleString() }}</span>
            <span class="stat-card__label">총 클릭 수</span>
          </div>
          <div class="stat-card">
            <span class="stat-card__value">
              {{ clicks.length ? fmtDate(clicks[clicks.length - 1].ts) : '-' }}
            </span>
            <span class="stat-card__label">마지막 클릭</span>
          </div>
        </div>

        <div class="panel-actions">
          <button class="btn btn--primary" :disabled="!clicks.length" @click="downloadCSV">
            CSV 다운로드
          </button>
          <button class="btn btn--danger" :disabled="!clicks.length" @click="handleClearClicks">
            데이터 초기화
          </button>
        </div>

        <div class="table-wrap">
          <table v-if="clicks.length" class="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>날짜</th>
                <th>시간</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(c, i) in clicksReversed" :key="c.ts">
                <td class="td-num">{{ clicks.length - i }}</td>
                <td>{{ fmtDate(c.ts) }}</td>
                <td>{{ fmtTime(c.ts) }}</td>
              </tr>
            </tbody>
          </table>
          <div v-else class="empty-state">
            <p>아직 클릭 데이터가 없습니다.</p>
            <p class="empty-state__sub">프로모션 페이지의 <strong>탑 도전하기</strong> 버튼 클릭이 여기에 기록됩니다.</p>
          </div>
        </div>
      </section>

      <!-- ── 공지사항 ── -->
      <section v-show="activeTab === 'notice'" class="tab-panel">
        <div class="notice-editor">
          <label class="toggle-row">
            <span class="toggle-row__label">공지 표시</span>
            <label class="toggle">
              <input v-model="noticeEnabled" type="checkbox" />
              <span class="toggle__track">
                <span class="toggle__thumb" />
              </span>
            </label>
          </label>

          <label class="field-group">
            <span class="field-group__label">공지 내용</span>
            <textarea
              v-model="noticeText"
              class="notice-textarea"
              placeholder="프로모션 페이지 상단에 표시될 공지사항을 입력하세요."
              rows="4"
            />
          </label>

          <div class="preview-wrap">
            <span class="preview-wrap__label">미리보기</span>
            <div class="notice-preview" :class="{ 'is-enabled': noticeEnabled }">
              <span v-if="noticeText" class="notice-preview__text">{{ noticeText }}</span>
              <span v-else class="notice-preview__placeholder">공지 내용이 여기에 표시됩니다.</span>
            </div>
          </div>

          <button class="btn btn--primary btn--wide" @click="handleSaveNotice">
            {{ noticeSaved ? '✓ 저장 완료' : '저장' }}
          </button>
        </div>
      </section>

      <!-- ── 방문자 통계 ── -->
      <section v-show="activeTab === 'stats'" class="tab-panel">
        <div v-if="stats" class="stats-content">
          <div class="summary-row">
            <div class="stat-card">
              <span class="stat-card__value">{{ (stats.visits || 0).toLocaleString() }}</span>
              <span class="stat-card__label">총 페이지 방문</span>
            </div>
            <div class="stat-card">
              <span class="stat-card__value">
                {{
                  stats.visits && clicks.length
                    ? ((clicks.length / stats.visits) * 100).toFixed(1) + '%'
                    : '-'
                }}
              </span>
              <span class="stat-card__label">예약 버튼 전환율</span>
            </div>
          </div>

          <h3 class="section-heading">섹션별 체류 현황</h3>
          <table class="data-table stats-table">
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
                <td class="td-num">{{ data.views }}</td>
                <td class="td-num">
                  {{ data.views ? fmtDuration(data.totalMs / data.views) : '-' }}
                </td>
                <td class="td-bar">
                  <div class="bar-track">
                    <div
                      class="bar-fill"
                      :style="{ width: (data.views / maxSectionViews() * 100) + '%' }"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <button class="btn btn--danger" @click="handleClearStats">통계 초기화</button>
        </div>
      </section>

    </main>
  </div>
</template>

<style>
*, *::before, *::after { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background: #0e0f11;
  color: #e2e4ea;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 15px;
  line-height: 1.5;
}

button { font: inherit; cursor: pointer; }
textarea, input { font: inherit; }

/* ── AUTH ── */
.auth-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: radial-gradient(ellipse at 50% 0%, rgba(255, 210, 120, 0.06), transparent 70%), #0e0f11;
}

.auth-card {
  width: 340px;
  padding: 40px 32px 36px;
  border: 1px solid rgba(255, 210, 120, 0.14);
  border-radius: 12px;
  background: #161820;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.4);
  text-align: center;
}

.auth-card__logo {
  display: inline-block;
  margin-bottom: 8px;
  padding: 6px 18px;
  border: 1px solid rgba(255, 200, 100, 0.32);
  border-radius: 999px;
  background: rgba(255, 190, 80, 0.08);
  color: #f5d08a;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.auth-card__title {
  margin: 0 0 28px;
  font-size: 26px;
  font-weight: 700;
  color: #e8eaf0;
}

.auth-card__form {
  display: grid;
  gap: 12px;
}

.auth-input {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  color: #e2e4ea;
  font-size: 16px;
  outline: none;
  transition: border-color 150ms;
}

.auth-input:focus { border-color: rgba(255, 200, 100, 0.5); }
.auth-input.is-error { border-color: rgba(255, 90, 90, 0.6); }

.auth-error {
  margin: -4px 0 0;
  color: #ff7575;
  font-size: 13px;
}

.auth-btn {
  height: 48px;
  border: 0;
  border-radius: 8px;
  background: linear-gradient(135deg, #c97f20, #a86018);
  color: #fff8e8;
  font-size: 16px;
  font-weight: 700;
  transition: filter 150ms;
}

.auth-btn:hover { filter: brightness(1.1); }

/* ── LAYOUT ── */
.admin-layout {
  display: grid;
  grid-template-rows: 56px 48px 1fr;
  min-height: 100vh;
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: #13141a;
}

.admin-header__brand {
  font-size: 16px;
  font-weight: 700;
  color: #f5d08a;
  letter-spacing: 0.02em;
}

.admin-header__logout {
  padding: 6px 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  background: transparent;
  color: #a0a4b0;
  font-size: 13px;
  transition: color 150ms, border-color 150ms;
}

.admin-header__logout:hover { color: #e2e4ea; border-color: rgba(255,255,255,0.24); }

.admin-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: #13141a;
  padding: 0 20px;
}

.admin-tab {
  padding: 0 20px;
  height: 48px;
  border: 0;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: #7a7e8a;
  font-size: 14px;
  font-weight: 600;
  transition: color 150ms, border-color 150ms;
}

.admin-tab:hover { color: #c0c4d0; }
.admin-tab.is-active { color: #f5d08a; border-bottom-color: #f5d08a; }

.admin-content {
  padding: 28px;
  overflow-y: auto;
  background: #0e0f11;
}

.tab-panel { max-width: 900px; }

/* ── STAT CARDS ── */
.summary-row {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 160px;
  padding: 20px 24px;
  border: 1px solid rgba(255, 210, 120, 0.14);
  border-radius: 10px;
  background: #161820;
}

.stat-card__value {
  font-size: 32px;
  font-weight: 700;
  color: #f5d08a;
  line-height: 1;
}

.stat-card__label {
  font-size: 12px;
  color: #7a7e8a;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* ── BUTTONS ── */
.panel-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.btn {
  padding: 9px 20px;
  border: 0;
  border-radius: 7px;
  font-size: 14px;
  font-weight: 600;
  transition: filter 150ms, opacity 150ms;
}

.btn:disabled { opacity: 0.38; cursor: not-allowed; }
.btn--primary { background: linear-gradient(135deg, #c97f20, #a86018); color: #fff8e8; }
.btn--primary:not(:disabled):hover { filter: brightness(1.1); }
.btn--danger { background: rgba(200, 60, 60, 0.18); border: 1px solid rgba(200, 60, 60, 0.36); color: #ff8888; }
.btn--danger:not(:disabled):hover { background: rgba(200, 60, 60, 0.28); }
.btn--wide { width: 100%; max-width: 280px; height: 44px; margin-top: 8px; }

/* ── TABLE ── */
.table-wrap {
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  padding: 12px 16px;
  background: #161820;
  color: #7a7e8a;
  font-size: 12px;
  font-weight: 700;
  text-align: left;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.data-table td {
  padding: 11px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  color: #c8ccd8;
  font-size: 14px;
}

.data-table tr:last-child td { border-bottom: 0; }
.data-table tr:hover td { background: rgba(255, 255, 255, 0.02); }

.td-num { color: #f5d08a; font-variant-numeric: tabular-nums; }

/* ── EMPTY STATE ── */
.empty-state {
  padding: 48px 24px;
  text-align: center;
  background: #161820;
  color: #5a5e6a;
}

.empty-state p { margin: 0; }
.empty-state__sub { margin-top: 6px !important; font-size: 13px; }
.empty-state__sub strong { color: #a0a4b0; }

/* ── NOTICE EDITOR ── */
.notice-editor {
  display: grid;
  gap: 20px;
  max-width: 600px;
}

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  background: #161820;
  cursor: pointer;
}

.toggle-row__label { font-size: 15px; font-weight: 600; color: #c8ccd8; }

.toggle { position: relative; display: inline-block; }
.toggle input { position: absolute; opacity: 0; width: 0; height: 0; }

.toggle__track {
  display: flex;
  align-items: center;
  width: 44px;
  height: 24px;
  padding: 2px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  transition: background 200ms;
}

.toggle input:checked ~ .toggle__track { background: #c97f20; }

.toggle__thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  transition: transform 200ms;
  box-shadow: 0 1px 4px rgba(0,0,0,0.3);
}

.toggle input:checked ~ .toggle__track .toggle__thumb { transform: translateX(20px); }

.field-group { display: grid; gap: 8px; }
.field-group__label { font-size: 13px; font-weight: 600; color: #7a7e8a; text-transform: uppercase; letter-spacing: 0.06em; }

.notice-textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  color: #e2e4ea;
  resize: vertical;
  outline: none;
  transition: border-color 150ms;
}

.notice-textarea:focus { border-color: rgba(255, 200, 100, 0.4); }

.preview-wrap { display: grid; gap: 8px; }
.preview-wrap__label { font-size: 13px; font-weight: 600; color: #7a7e8a; text-transform: uppercase; letter-spacing: 0.06em; }

.notice-preview {
  padding: 14px 18px;
  border: 1px dashed rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);
  font-size: 14px;
  min-height: 52px;
  display: flex;
  align-items: center;
}

.notice-preview.is-enabled {
  border-color: rgba(255, 200, 100, 0.3);
  background: rgba(255, 200, 100, 0.05);
}

.notice-preview__text { color: #f0d89a; }
.notice-preview__placeholder { color: #4a4e5a; font-style: italic; }

/* ── STATS TABLE ── */
.section-heading {
  margin: 0 0 16px;
  font-size: 14px;
  font-weight: 700;
  color: #7a7e8a;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.stats-content {
  display: grid;
  gap: 24px;
}

.stats-table { border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 10px; overflow: hidden; }

.th-bar { width: 180px; }

.td-bar { padding-right: 20px !important; }

.bar-track {
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #c97f20, #f5d08a);
  transition: width 500ms ease;
}

#admin-app { min-height: 100vh; }
</style>
