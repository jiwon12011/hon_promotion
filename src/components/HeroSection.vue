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
let animationContext;
let removePointerMove;

const copyLines = [
  ["혼", "이", " ", "깨", "어", "나", "는", " ", "순", "간", ","],
  ["전", "설", "이", " ", "시", "작", "된", "다", "!"]
];

const particles = Array.from({ length: 18 }, (_, index) => ({
  className: index % 3 === 0 ? "leaf" : "spark",
  style: {
    "--x": `${8 + ((index * 17) % 88)}vw`,
    "--delay": `${index * -0.72}s`,
    "--duration": `${7 + (index % 6) * 1.25}s`,
    "--drift": `${index % 2 === 0 ? 42 : -36}px`,
    "--size": `${index % 3 === 0 ? 12 + (index % 4) * 2 : 4 + (index % 4)}px`
  }
}));

onMounted(() => {
  const section = sectionRef.value;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  animationContext = gsap.context(() => {
    timeline = gsap.timeline({ paused: true, defaults: { ease: "power3.out", force3D: true } });
    timeline
      .fromTo(section.querySelector(".hero-section__video"), { scale: 1.055, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.35, ease: "power2.out" })
      .fromTo(section.querySelector(".hero-section__particle-layer"), { opacity: 0 }, { opacity: 1, duration: 0.75 }, 0.18)
      .fromTo(section.querySelector(".hero-section__character-depth"), { y: 56, scale: 0.92, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 1, ease: "back.out(1.2)" }, 0.3)
      .fromTo(section.querySelector(".hero-section__sunlight"), { scale: 0.82, opacity: 0, rotate: -3 }, { scale: 1, opacity: 1, rotate: 0, duration: 1.45, ease: "sine.out" }, 0.08)
      .fromTo(section.querySelector(".hero-section__logo"), { y: 22, scale: 0.58, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.88, ease: "elastic.out(1, 0.58)" }, 0.72)
      .fromTo(section.querySelectorAll(".copy-char"), { y: 24, opacity: 0, rotateX: -22 }, { y: 0, opacity: 1, rotateX: 0, duration: 0.54, stagger: 0.025, ease: "power3.out" }, 0.98)
      .fromTo(section.querySelector(".hero-section__subcopy"), { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.58 }, 1.46)
      .fromTo(section.querySelectorAll(".store-link"), { y: 34, scale: 0.86, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.62, stagger: 0.1, ease: "back.out(1.45)" }, 1.68)
      .fromTo(section.querySelector(".trailer-button"), { y: 28, scale: 0.88, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.58, ease: "back.out(1.6)" }, 1.86)
      .fromTo(section.querySelector(".hero-section__glint"), { xPercent: -140, opacity: 0 }, { xPercent: 140, opacity: 0.54, duration: 1.05, ease: "power2.inOut" }, 1.08);

    if (!prefersReducedMotion) {
      gsap.to(".hero-section__character-depth", { y: -7, duration: 2.6, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".hero-section__aura--pink", { opacity: 0.72, scale: 1.08, duration: 1.7, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".hero-section__aura--purple", { opacity: 0.8, scale: 1.12, duration: 1.95, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".hero-section__aura--blade", { opacity: 0.64, x: 14, duration: 1.35, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".trailer-button", { scale: 1.025, duration: 1.45, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }
  }, section);

  if (!prefersReducedMotion) {
    const moveVideoX = gsap.quickTo(section.querySelector(".hero-section__video"), "x", { duration: 1.1, ease: "power2.out" });
    const moveVideoY = gsap.quickTo(section.querySelector(".hero-section__video"), "y", { duration: 1.1, ease: "power2.out" });
    const moveDepthX = gsap.quickTo(section.querySelector(".hero-section__character-depth"), "x", { duration: 0.8, ease: "power2.out" });
    const rotateDepthY = gsap.quickTo(section.querySelector(".hero-section__character-depth"), "rotationY", { duration: 0.8, ease: "power2.out" });
    const rotateDepthX = gsap.quickTo(section.querySelector(".hero-section__character-depth"), "rotationX", { duration: 0.8, ease: "power2.out" });

    const handlePointerMove = (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;

      moveVideoX(-x * 12);
      moveVideoY(-y * 6);
      moveDepthX(x * 10);
      rotateDepthY(x * 3.5);
      rotateDepthX(-y * 2);
    };

    window.addEventListener("pointermove", handlePointerMove);
    removePointerMove = () => window.removeEventListener("pointermove", handlePointerMove);
  }

  timeline.play(0);
  videoRef.value?.load?.();
  videoRef.value?.play?.().catch(() => {});
});

onBeforeUnmount(() => {
  removePointerMove?.();
  animationContext?.revert();
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
      preload="auto"
    />
    <div class="hero-section__shade" aria-hidden="true" />
    <div class="hero-section__particle-layer" aria-hidden="true">
      <span
        v-for="(particle, index) in particles"
        :key="index"
        class="hero-section__particle"
        :class="`hero-section__particle--${particle.className}`"
        :style="particle.style"
      />
    </div>
    <div class="hero-section__sunlight" aria-hidden="true">
      <span class="hero-section__sun-core" />
      <span class="hero-section__sun-rays" />
      <span class="hero-section__glint" />
    </div>
    <div class="hero-section__character-depth" aria-hidden="true">
      <span class="hero-section__aura hero-section__aura--pink" />
      <span class="hero-section__aura hero-section__aura--blade" />
      <span class="hero-section__aura hero-section__aura--purple" />
    </div>

    <div class="hero-section__content">
      <h1 id="hero-title" class="hero-section__title">
        <img class="hero-section__logo" :src="logoUrl" alt="귀혼M" />
      </h1>

      <p class="hero-section__copy" aria-label="혼이 깨어나는 순간, 전설이 시작된다!">
        <span v-for="(line, lineIndex) in copyLines" :key="lineIndex" class="hero-section__copy-line">
          <span
            v-for="(char, charIndex) in line"
            :key="`${lineIndex}-${charIndex}`"
            class="copy-char"
          >{{ char === " " ? "\u00A0" : char }}</span>
        </span>
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
