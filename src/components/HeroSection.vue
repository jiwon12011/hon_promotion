<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { gsap } from "gsap";
import logoUrl from "@/assets/images/logo-cut.png";
import appleLogoUrl from "@/assets/images/apple-logo.png";
import playstoreIconUrl from "@/assets/images/playstore-icon.png";
import heroVideoUrl from "@/assets/videos/hero.mp4";

const sectionRef = ref(null);
const videoRef = ref(null);
let timeline;

onMounted(() => {
  const section = sectionRef.value;

  timeline = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
  timeline
    .fromTo(section.querySelector(".hero-section__video"), { scale: 1.08, filter: "saturate(0.78) brightness(0.8)" }, { scale: 1, filter: "saturate(1.08) brightness(1)", duration: 2.8, ease: "power2.out" })
    .fromTo(section.querySelector(".hero-section__sunlight"), { scale: 0.82, opacity: 0, rotate: -3 }, { scale: 1, opacity: 1, rotate: 0, duration: 1.45, ease: "sine.out" }, 0.08)
    .fromTo(section.querySelector(".hero-section__logo"), { y: 24, scale: 0.94, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.78 }, 0.28)
    .fromTo(section.querySelector(".hero-section__copy"), { x: -18, y: 14, scale: 1.03, opacity: 0, clipPath: "inset(0 100% 0 0)" }, { x: 0, y: 0, scale: 1, opacity: 1, clipPath: "inset(0 0% 0 0)", duration: 0.72, ease: "expo.out" }, 0.74)
    .fromTo(section.querySelector(".hero-section__subcopy"), { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.42 }, 1.16)
    .fromTo(section.querySelectorAll(".store-link"), { y: 16, scale: 0.96, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.48, stagger: 0.08, ease: "back.out(1.45)" }, 1.34)
    .fromTo(section.querySelector(".trailer-button"), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, 1.56)
    .fromTo(section.querySelector(".hero-section__glint"), { xPercent: -120, opacity: 0 }, { xPercent: 120, opacity: 0.54, duration: 1.05, ease: "power2.inOut" }, 0.96);

  timeline.play(0);
  videoRef.value?.play?.().catch(() => {});
});

onBeforeUnmount(() => {
  timeline?.kill();
});
</script>

<template>
  <section ref="sectionRef" class="section hero-section" data-section="hero" aria-labelledby="hero-title">
    <video
      ref="videoRef"
      class="hero-section__video"
      :src="heroVideoUrl"
      autoplay
      muted
      loop
      playsinline
      preload="metadata"
    />
    <div class="hero-section__shade" aria-hidden="true" />
    <div class="hero-section__sunlight" aria-hidden="true">
      <span class="hero-section__sun-core" />
      <span class="hero-section__sun-rays" />
      <span class="hero-section__glint" />
    </div>

    <div class="hero-section__content">
      <h1 id="hero-title" class="hero-section__title">
        <img class="hero-section__logo" :src="logoUrl" alt="귀혼M" />
      </h1>

      <p class="hero-section__copy" aria-label="혼이 깨어나는 순간, 전설이 시작된다!">
        <span>혼이 깨어나는 순간,</span>
        <strong>전설이 시작된다!</strong>
      </p>

      <p class="hero-section__subcopy">무협의 세계에서 펼쳐지는 귀혼M의 새로운 이야기</p>

      <div class="hero-section__actions" aria-label="스토어와 영상 보기">
        <a class="store-link" href="#" aria-label="Google Play에서 귀혼M 보기">
          <img :src="playstoreIconUrl" alt="" />
          <span><small>GET IT ON</small>Google Play</span>
        </a>
        <a class="store-link" href="#" aria-label="App Store에서 귀혼M 보기">
          <img :src="appleLogoUrl" alt="" />
          <span><small>Download on the</small>App Store</span>
        </a>
      </div>

      <button class="trailer-button" type="button">
        <span class="trailer-button__icon" aria-hidden="true" />
        트레일러 보기
      </button>
    </div>
  </section>
</template>
