<script setup>
import bgSkyUrl from "@/assets/images/section2-bg-sky.png";
import towerUrl from "@/assets/images/section2-tower-cut.png";
import islandOneUrl from "@/assets/images/section2-island-1.png";
import islandTwoUrl from "@/assets/images/section2-island-2.png";
import islandThreeUrl from "@/assets/images/section2-island-3.png";
import characterGreenUrl from "@/assets/images/section2-character-green-cut.png";
import characterPinkUrl from "@/assets/images/section2-character-pink-cut.png";
import characterPurpleUrl from "@/assets/images/section2-character-purple-cut.png";
import rewardCoinsUrl from "@/assets/images/section2-reward-coins.png";
import rewardChestUrl from "@/assets/images/section2-reward-chest-red.png";
import rewardCrystalUrl from "@/assets/images/section2-reward-crystal.png";
import rewardKeyUrl from "@/assets/images/section2-reward-key.png";
import rewardOrbUrl from "@/assets/images/section2-reward-chest-gold.png";

const rewards = [
  { image: rewardCoinsUrl, label: "금전" },
  { image: rewardChestUrl, label: "화신의 상자" },
  { image: rewardCrystalUrl, label: "승급석" },
  { image: rewardOrbUrl, label: "화신의 기운" },
  { image: rewardKeyUrl, label: "탑의 열쇠" }
];

const features = [
  { icon: "⚔", title: "50층까지 도전!", text: "점점 더 강력한 요괴가 당신을 기다립니다." },
  { icon: "🏆", title: "풍성한 보상!", text: "층을 올라서 보상과 최고 기록 보상을 획득하세요." },
  { icon: "👥", title: "팀을 구성하라!", text: "계정 내 다양한 캐릭터로 최강의 팀을 만드세요." }
];
</script>

<template>
  <section class="section world-section" data-section="preorder" aria-labelledby="world-title">
    <img class="world-section__bg" :src="bgSkyUrl" alt="" aria-hidden="true" loading="lazy" />
    <div class="world-section__shade" aria-hidden="true" />

    <img class="world-section__tower" :src="towerUrl" alt="" aria-hidden="true" loading="lazy" />
    <img class="world-section__island world-section__island--one" :src="islandOneUrl" alt="" aria-hidden="true" loading="lazy" />
    <img class="world-section__island world-section__island--two" :src="islandTwoUrl" alt="" aria-hidden="true" loading="lazy" />
    <img class="world-section__island world-section__island--three" :src="islandThreeUrl" alt="" aria-hidden="true" loading="lazy" />

    <div class="world-section__index" aria-hidden="true">
      <strong>02</strong>
      <span>콘텐츠 소개</span>
    </div>

    <div class="world-section__content">
      <div class="world-section__heading">
        <h2 id="world-title">화신의 탑</h2>
        <span aria-hidden="true">귀혼</span>
      </div>
      <p class="world-section__description">끝없이 솟아오르는 화신의 탑을 정복하라!</p>

      <div class="world-section__divider" aria-hidden="true" />

      <div class="world-section__panel">
        <article v-for="feature in features" :key="feature.title" class="feature-row">
          <span class="feature-row__icon" aria-hidden="true">{{ feature.icon }}</span>
          <span>
            <strong>{{ feature.title }}</strong>
            <em>{{ feature.text }}</em>
          </span>
        </article>
      </div>

      <button class="world-section__cta" type="button">탑 도전하기 <span aria-hidden="true">→</span></button>
    </div>

    <div class="world-section__reward-strip">
      <p>주요 보상</p>
      <div class="world-section__rewards" aria-label="주요 보상">
        <article v-for="reward in rewards" :key="reward.label" class="reward-card">
          <img :src="reward.image" :alt="reward.label" loading="lazy" />
          <span>{{ reward.label }}</span>
        </article>
      </div>
    </div>

    <img class="world-section__character world-section__character--green" :src="characterGreenUrl" alt="" aria-hidden="true" loading="lazy" />
    <img class="world-section__character world-section__character--pink" :src="characterPinkUrl" alt="" aria-hidden="true" loading="lazy" />
    <img class="world-section__character world-section__character--purple" :src="characterPurpleUrl" alt="" aria-hidden="true" loading="lazy" />
  </section>
</template>
