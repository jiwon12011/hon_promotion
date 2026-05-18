<script setup>
import HeroSection from "@/components/HeroSection.vue";
import JobSection from "@/components/JobSection.vue";
import MonsterDexSection from "@/components/MonsterDexSection.vue";
import OstSection from "@/components/OstSection.vue";
import WorldSection from "@/components/WorldSection.vue";
import { useFullPage } from "@/composables/useFullPage";

const { currentIndex, goTo } = useFullPage();

const navItems = [
  { id: "hero", label: "메인" },
  { id: "preorder", label: "사전예약" },
  { id: "jobs", label: "직업소개" },
  { id: "monster-dex", label: "요괴도감" },
  { id: "ost", label: "OST" }
];
</script>

<template>
  <main class="promotion-page" aria-label="귀혼M 프로모션">
    <nav class="section-nav" aria-label="섹션 이동">
      <button
        v-for="(item, index) in navItems"
        :key="item.id"
        class="section-nav__button"
        :class="{ 'is-active': currentIndex === index }"
        type="button"
        @click="goTo(index)"
      >
        <span>{{ item.label }}</span>
      </button>
    </nav>

    <div class="fullpage" data-fullpage>
      <HeroSection id="hero" />
      <WorldSection id="preorder" />
      <JobSection id="jobs" />
      <MonsterDexSection id="monster-dex" />
      <OstSection id="ost" />
    </div>
  </main>
</template>
