<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { gsap } from "gsap";
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

const sectionRef = ref(null);
let timeline;
let observer;

function playIntro() {
  if (!timeline) return;
  timeline.restart();
}

onMounted(() => {
  const section = sectionRef.value;

  timeline = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
  timeline
    .fromTo(section.querySelector(".world-section__bg"), { scale: 1.08, filter: "saturate(0.85) brightness(0.72)" }, { scale: 1, filter: "saturate(1.08) brightness(1)", duration: 1.65, ease: "power2.out" })
    .fromTo(section.querySelector(".world-section__tower"), { y: "28vh", scale: 0.78, opacity: 0, filter: "brightness(1.45) blur(5px)" }, { y: 0, scale: 1, opacity: 1, filter: "brightness(1) blur(0px)", duration: 1.2, ease: "back.out(1.25)" }, 0.12)
    .fromTo(section.querySelector(".world-section__tower-aura"), { scale: 0.55, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: "sine.out" }, 0.22)
    .fromTo(section.querySelectorAll(".world-section__island"), { y: -28, scale: 0.86, opacity: 0 }, { y: 0, scale: 1, opacity: 0.78, duration: 0.82, stagger: 0.13, ease: "back.out(1.6)" }, 0.34)
    .fromTo(section.querySelector(".world-section__index"), { x: -28, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55 }, 0.42)
    .fromTo(section.querySelector(".world-section__heading"), { x: -52, opacity: 0, clipPath: "inset(0 100% 0 0)" }, { x: 0, opacity: 1, clipPath: "inset(0 0% 0 0)", duration: 0.7, ease: "expo.out" }, 0.58)
    .fromTo(section.querySelector(".world-section__description"), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48 }, 0.88)
    .fromTo(section.querySelector(".world-section__divider"), { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.45, transformOrigin: "center" }, 0.98)
    .fromTo(section.querySelector(".world-section__panel"), { x: -32, y: 22, opacity: 0, rotateX: -9 }, { x: 0, y: 0, opacity: 1, rotateX: 0, duration: 0.7, ease: "back.out(1.35)" }, 1.08)
    .fromTo(section.querySelectorAll(".feature-row"), { x: -18, opacity: 0 }, { x: 0, opacity: 1, duration: 0.42, stagger: 0.12 }, 1.22)
    .fromTo(section.querySelector(".world-section__cta"), { y: 22, scale: 0.94, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.52, ease: "back.out(1.8)" }, 1.54)
    .fromTo(section.querySelector(".world-section__reward-strip"), { y: 42, opacity: 0 }, { y: 0, opacity: 1, duration: 0.62 }, 1.48)
    .fromTo(section.querySelectorAll(".reward-card"), { y: 22, scale: 0.62, opacity: 0, rotate: -8 }, { y: 0, scale: 1, opacity: 1, rotate: 0, duration: 0.52, stagger: 0.08, ease: "back.out(2.1)" }, 1.62)
    .fromTo(section.querySelectorAll(".world-section__character"), { y: 70, x: 34, scale: 0.88, opacity: 0 }, { y: 0, x: 0, scale: 1, opacity: 1, duration: 0.78, stagger: 0.1, ease: "back.out(1.55)" }, 1.72)
    .fromTo(section.querySelectorAll(".world-section__spark"), { y: 18, scale: 0, opacity: 0 }, { y: -10, scale: 1, opacity: 1, duration: 0.56, stagger: 0.06, ease: "back.out(2)" }, 1.9);

  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) playIntro();
  }, { threshold: 0.55 });

  observer.observe(section);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  timeline?.kill();
});
</script>

<template>
  <section ref="sectionRef" class="section world-section" data-section="preorder" aria-labelledby="world-title">
    <img class="world-section__bg" :src="bgSkyUrl" alt="" aria-hidden="true" loading="lazy" />
    <div class="world-section__shade" aria-hidden="true" />
    <div class="world-section__tower-aura" aria-hidden="true" />
    <span class="world-section__spark world-section__spark--one" aria-hidden="true" />
    <span class="world-section__spark world-section__spark--two" aria-hidden="true" />
    <span class="world-section__spark world-section__spark--three" aria-hidden="true" />
    <span class="world-section__spark world-section__spark--four" aria-hidden="true" />

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
