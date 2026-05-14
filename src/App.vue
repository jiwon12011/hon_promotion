<script setup>
import HeroSection from "@/components/HeroSection.vue";
import JobSection from "@/components/JobSection.vue";
import PlaceholderSection from "@/components/PlaceholderSection.vue";
import WorldSection from "@/components/WorldSection.vue";
import { useFullPage } from "@/composables/useFullPage";

const { currentIndex, goTo } = useFullPage();

const navItems = [
  { id: "hero", label: "메인" },
  { id: "preorder", label: "사전예약" },
  { id: "jobs", label: "직업소개" },
  { id: "coupon", label: "쿠폰" },
  { id: "notice", label: "공지" }
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
      <PlaceholderSection id="coupon" title="쿠폰 이벤트" />
      <PlaceholderSection id="notice" title="공지사항" />
    </div>
  </main>
</template>
