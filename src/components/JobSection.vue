<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { gsap } from "gsap";
import bgUrl from "@/assets/images/section3-bg.png";
import symbolUrl from "@/assets/images/section3-job-symbol.png";
import dosaMainUrl from "@/assets/images/section3-dosa-main.png";
import dosaCardUrl from "@/assets/images/section3-dosa-card.png";
import geomgaekMainUrl from "@/assets/images/section3-geomgaek-main.png";
import geomgaekCardUrl from "@/assets/images/section3-geomgaek-card.png";
import musaMainUrl from "@/assets/images/section3-musa-main.png";
import musaCardUrl from "@/assets/images/section3-musa-card.png";
import yeoksaMainUrl from "@/assets/images/section3-yeoksa-main.png";
import yeoksaCardUrl from "@/assets/images/section3-yeoksa-card-normalized.png";
import sasuMainUrl from "@/assets/images/section3-sasu-main.png";
import sasuCardUrl from "@/assets/images/section3-sasu-card-normalized.png";
import dosaSkillOneUrl from "@/assets/images/section3-skill-dosa-1.png";
import dosaSkillTwoUrl from "@/assets/images/section3-skill-dosa-2.png";
import dosaSkillThreeUrl from "@/assets/images/section3-skill-dosa-3.png";
import dosaSkillFourUrl from "@/assets/images/section3-skill-dosa-4.png";
import dosaSkillFiveUrl from "@/assets/images/section3-skill-dosa-5.png";
import geomgaekSkillOneUrl from "@/assets/images/section3-skill-geomgaek-1.png";
import geomgaekSkillTwoUrl from "@/assets/images/section3-skill-geomgaek-2.png";
import geomgaekSkillThreeUrl from "@/assets/images/section3-skill-geomgaek-3.png";
import geomgaekSkillFourUrl from "@/assets/images/section3-skill-geomgaek-4.png";
import geomgaekSkillFiveUrl from "@/assets/images/section3-skill-geomgaek-5.png";
import musaSkillOneUrl from "@/assets/images/section3-skill-musa-1.png";
import musaSkillTwoUrl from "@/assets/images/section3-skill-musa-2.png";
import musaSkillThreeUrl from "@/assets/images/section3-skill-musa-3.png";
import musaSkillFourUrl from "@/assets/images/section3-skill-musa-4.png";
import musaSkillFiveUrl from "@/assets/images/section3-skill-musa-5.png";
import yeoksaSkillOneUrl from "@/assets/images/section3-skill-yeoksa-1.png";
import yeoksaSkillTwoUrl from "@/assets/images/section3-skill-yeoksa-2.png";
import yeoksaSkillThreeUrl from "@/assets/images/section3-skill-yeoksa-3.png";
import yeoksaSkillFourUrl from "@/assets/images/section3-skill-yeoksa-4.png";
import yeoksaSkillFiveUrl from "@/assets/images/section3-skill-yeoksa-5.png";
import sasuSkillOneUrl from "@/assets/images/section3-skill-sasu-1.png";
import sasuSkillTwoUrl from "@/assets/images/section3-skill-sasu-2.png";
import sasuSkillThreeUrl from "@/assets/images/section3-skill-sasu-3.png";
import sasuSkillFourUrl from "@/assets/images/section3-skill-sasu-4.png";
import sasuSkillFiveUrl from "@/assets/images/section3-skill-sasu-5.png";

const jobs = [
  {
    key: "dosa",
    name: "도사",
    summary: "자연의 힘을 다루는 현자의 대통사",
    description: "부적과 자연의 기운으로 전장을 감싸는 균형형 직업",
    color: "#65d35f",
    mainImage: dosaMainUrl,
    cardImage: dosaCardUrl,
    skills: [
      { name: "자연의 기운", image: dosaSkillOneUrl },
      { name: "치유의 바람", image: dosaSkillTwoUrl },
      { name: "창룡의 가호", image: dosaSkillThreeUrl },
      { name: "대지의 보호", image: dosaSkillFourUrl },
      { name: "대자연의 힘", image: dosaSkillFiveUrl }
    ]
  },
  {
    key: "geomgaek",
    name: "검객",
    summary: "빠른 속도와 치명적인 검술로 제압하는 근접형",
    description: "그림자처럼 파고들어 한순간에 승부를 가르는 쾌검",
    color: "#a46cff",
    mainImage: geomgaekMainUrl,
    cardImage: geomgaekCardUrl,
    skills: [
      { name: "그림자 베기", image: geomgaekSkillOneUrl },
      { name: "월광 참격", image: geomgaekSkillTwoUrl },
      { name: "암영 돌파", image: geomgaekSkillThreeUrl },
      { name: "귀검 난무", image: geomgaekSkillFourUrl },
      { name: "칠흑 일섬", image: geomgaekSkillFiveUrl }
    ]
  },
  {
    key: "musa",
    name: "무사",
    summary: "강인한 체력과 강력한 공격력을 가진 전사",
    description: "불꽃처럼 밀어붙이는 호쾌한 정면 돌파형 직업",
    color: "#f2782d",
    mainImage: musaMainUrl,
    cardImage: musaCardUrl,
    skills: [
      { name: "화염참", image: musaSkillOneUrl },
      { name: "용격파", image: musaSkillTwoUrl },
      { name: "파천격", image: musaSkillThreeUrl },
      { name: "철벽의 혼", image: musaSkillFourUrl },
      { name: "멸화난무", image: musaSkillFiveUrl }
    ]
  },
  {
    key: "yeoksa",
    name: "역사",
    summary: "다양한 법문과 지력으로 아군을 돕는 서포터",
    description: "차가운 기운과 법술로 전장의 흐름을 조율하는 조력자",
    color: "#4aa6ff",
    mainImage: yeoksaMainUrl,
    cardImage: yeoksaCardUrl,
    skills: [
      { name: "빙결진", image: yeoksaSkillOneUrl },
      { name: "수호 법문", image: yeoksaSkillTwoUrl },
      { name: "청류 폭발", image: yeoksaSkillThreeUrl },
      { name: "혼의 장막", image: yeoksaSkillFourUrl },
      { name: "서리 결계", image: yeoksaSkillFiveUrl }
    ]
  },
  {
    key: "sasu",
    name: "사수",
    summary: "원거리에서 적을 제압하는 정확한 활의 명수",
    description: "바람을 읽고 빈틈을 꿰뚫는 날카로운 원거리 딜러",
    color: "#e9b83d",
    mainImage: sasuMainUrl,
    cardImage: sasuCardUrl,
    skills: [
      { name: "광휘 사격", image: sasuSkillOneUrl },
      { name: "연속 화살", image: sasuSkillTwoUrl },
      { name: "집중의 표식", image: sasuSkillThreeUrl },
      { name: "천궁의 눈", image: sasuSkillFourUrl },
      { name: "태양 관통", image: sasuSkillFiveUrl }
    ]
  }
];

const sectionRef = ref(null);
const activeJobKey = ref("dosa");
const isSwitching = ref(false);
const activeJob = computed(() => jobs.find((job) => job.key === activeJobKey.value) ?? jobs[0]);

let introTimeline;
let idleTween;
let skillPulseTween;
let observer;
let preloadHandle;
let preloadHandleType;
let hasPreloadedJobImages = false;

function preloadJobImages() {
  jobs.forEach((job) => {
    [job.mainImage, job.cardImage, ...job.skills.map((skill) => skill.image)].forEach((src) => {
      const image = new Image();
      image.decoding = "async";
      image.src = src;
    });
  });
}

function scheduleJobImagePreload() {
  if (hasPreloadedJobImages) return;
  hasPreloadedJobImages = true;

  const run = () => {
    preloadHandle = undefined;
    preloadJobImages();
  };

  if ("requestIdleCallback" in window) {
    preloadHandleType = "idle";
    preloadHandle = window.requestIdleCallback(run, { timeout: 1600 });
  } else {
    preloadHandleType = "timer";
    preloadHandle = window.setTimeout(run, 800);
  }
}

function getCharacterEntrance(job) {
  const filter = `blur(18px) brightness(1.45) drop-shadow(0 0 48px ${job.color})`;
  const presets = {
    dosa: {
      from: { scale: 0.9, opacity: 0, x: -20, y: 20, rotate: -3, filter },
      to: { scale: 1, opacity: 1, x: 0, y: 0, rotate: 0, filter: "blur(0px)", duration: 0.66, ease: "back.out(1.18)" }
    },
    geomgaek: {
      from: { scale: 1.08, opacity: 0, x: -68, y: 10, rotate: -7, filter },
      to: { scale: 1, opacity: 1, x: 0, y: 0, rotate: 0, filter: "blur(0px)", duration: 0.54, ease: "power3.out" }
    },
    musa: {
      from: { scale: 0.88, opacity: 0, x: 10, y: 46, rotate: 5, filter: `blur(20px) brightness(1.9) drop-shadow(0 0 58px ${job.color})` },
      to: { scale: 1, opacity: 1, x: 0, y: 0, rotate: 0, filter: "blur(0px)", duration: 0.7, ease: "back.out(1.38)" }
    },
    yeoksa: {
      from: { scale: 1.05, opacity: 0, x: 26, y: -34, rotate: 3, filter: `blur(16px) brightness(1.7) drop-shadow(0 0 54px ${job.color})` },
      to: { scale: 1, opacity: 1, x: 0, y: 0, rotate: 0, filter: "blur(0px)", duration: 0.64, ease: "power2.out" }
    },
    sasu: {
      from: { scale: 0.94, opacity: 0, x: 74, y: 14, rotate: 4, filter },
      to: { scale: 1, opacity: 1, x: 0, y: 0, rotate: 0, filter: "blur(0px)", duration: 0.56, ease: "power3.out" }
    }
  };

  return presets[job.key] ?? presets.dosa;
}

function createBurst(job) {
  const container = sectionRef.value?.querySelector(".job-section__effects");
  const character = sectionRef.value?.querySelector(".job-section__main-character");
  if (!container || !character) return;

  const rect = character.getBoundingClientRect();
  const parentRect = sectionRef.value.getBoundingClientRect();
  const x = rect.left - parentRect.left + rect.width * 0.5;
  const y = rect.top - parentRect.top + rect.height * 0.55;

  for (let i = 0; i < 3; i += 1) {
    const ring = document.createElement("span");
    ring.className = "job-section__shockwave";
    ring.style.left = `${x}px`;
    ring.style.top = `${y}px`;
    ring.style.borderColor = job.color;
    container.appendChild(ring);
    gsap.to(ring, {
      width: 680,
      height: 680,
      opacity: 0,
      duration: 0.78,
      delay: i * 0.12,
      ease: "power2.out",
      onComplete: () => ring.remove()
    });
  }

  for (let i = 0; i < 34; i += 1) {
    const particle = document.createElement("span");
    particle.className = "job-section__burst-particle";
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.background = job.color;
    container.appendChild(particle);

    const angle = Math.random() * Math.PI * 2;
    const distance = 90 + Math.random() * 210;
    gsap.to(particle, {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance - 40,
      rotate: 360 + Math.random() * 360,
      opacity: 0,
      scale: 0.2 + Math.random() * 0.7,
      duration: 0.7 + Math.random() * 0.35,
      ease: "power2.out",
      onComplete: () => particle.remove()
    });
  }
}

function playSkillEffect(event, skill, index) {
  const root = sectionRef.value;
  const container = root?.querySelector(".job-section__effects");
  const target = event.currentTarget;
  if (!root || !container || !target) return;

  const color = activeJob.value.color;
  const rect = target.getBoundingClientRect();
  const parentRect = root.getBoundingClientRect();
  const x = rect.left - parentRect.left + rect.width * 0.5;
  const y = rect.top - parentRect.top + rect.height * 0.38;

  gsap.fromTo(target,
    { scale: 0.94, rotate: index % 2 === 0 ? -3 : 3 },
    { scale: 1, rotate: 0, duration: 0.5, ease: "elastic.out(1, 0.45)" }
  );

  const ring = document.createElement("span");
  ring.className = `job-section__skill-flash job-section__skill-flash--${index % 5}`;
  ring.style.left = `${x}px`;
  ring.style.top = `${y}px`;
  ring.style.borderColor = color;
  ring.style.setProperty("--job-color", color);
  container.appendChild(ring);

  gsap.fromTo(ring,
    { width: 18, height: 18, opacity: 0.92, rotate: 0 },
    {
      width: 120 + index * 10,
      height: 120 + index * 10,
      opacity: 0,
      rotate: index % 2 === 0 ? 90 : -90,
      duration: 0.72,
      ease: "power2.out",
      onComplete: () => ring.remove()
    }
  );

  const particleCount = 8 + index * 2;
  for (let i = 0; i < particleCount; i += 1) {
    const particle = document.createElement("span");
    particle.className = `job-section__skill-particle job-section__skill-particle--${index % 5}`;
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.background = color;
    particle.style.setProperty("--job-color", color);
    container.appendChild(particle);

    const angle = (Math.PI * 2 * i) / particleCount + index * 0.25;
    const distance = 42 + Math.random() * (42 + index * 9);
    gsap.to(particle, {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance - 20 - index * 4,
      rotate: (index % 2 === 0 ? 1 : -1) * (180 + Math.random() * 280),
      opacity: 0,
      scale: 0.25 + Math.random() * 0.45,
      duration: 0.55 + Math.random() * 0.35,
      ease: "power2.out",
      onComplete: () => particle.remove()
    });
  }
}

function createCharacterHoverEffect(job) {
  const root = sectionRef.value;
  const container = root?.querySelector(".job-section__effects");
  const character = root?.querySelector(".job-section__main-character");
  if (!root || !container || !character) return;

  const rect = character.getBoundingClientRect();
  const parentRect = root.getBoundingClientRect();
  const x = rect.left - parentRect.left + rect.width * 0.55;
  const y = rect.top - parentRect.top + rect.height * 0.52;

  const ring = document.createElement("span");
  ring.className = "job-section__hover-ring";
  ring.style.left = `${x}px`;
  ring.style.top = `${y}px`;
  ring.style.borderColor = job.color;
  ring.style.setProperty("--job-color", job.color);
  container.appendChild(ring);

  gsap.fromTo(ring,
    { width: 40, height: 40, opacity: 0.86, rotate: -20 },
    {
      width: 460,
      height: 460,
      opacity: 0,
      rotate: 42,
      duration: 0.82,
      ease: "power2.out",
      onComplete: () => ring.remove()
    }
  );

  for (let i = 0; i < 16; i += 1) {
    const particle = document.createElement("span");
    particle.className = "job-section__hover-particle";
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.background = job.color;
    particle.style.setProperty("--job-color", job.color);
    container.appendChild(particle);

    const angle = Math.random() * Math.PI * 2;
    const distance = 56 + Math.random() * 130;
    gsap.to(particle, {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance - 26,
      scale: 0.15 + Math.random() * 0.65,
      opacity: 0,
      rotate: 180 + Math.random() * 280,
      duration: 0.58 + Math.random() * 0.28,
      ease: "power2.out",
      onComplete: () => particle.remove()
    });
  }
}

function hoverMainCharacter() {
  if (isSwitching.value) return;

  const root = sectionRef.value;
  const character = root?.querySelector(".job-section__main-character");
  const weaponGlow = root?.querySelector(".job-section__weapon-glow");
  const platform = root?.querySelector(".job-section__platform");
  if (!root || !character || !weaponGlow || !platform) return;

  idleTween?.pause();

  gsap.to(character, {
    scale: 1.018,
    filter: `drop-shadow(0 30px 32px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 30px ${activeJob.value.color}) brightness(1.08) saturate(1.08)`,
    duration: 0.24,
    ease: "power2.out",
    overwrite: "auto"
  });
  gsap.to(weaponGlow, {
    opacity: 0.9,
    scale: 1.1,
    filter: "blur(20px)",
    duration: 0.24,
    ease: "power2.out",
    overwrite: "auto"
  });
  gsap.to(platform, {
    opacity: 1,
    scale: 1.08,
    filter: `blur(1px) drop-shadow(0 0 24px ${activeJob.value.color})`,
    duration: 0.24,
    ease: "power2.out",
    overwrite: "auto"
  });
}

function clickMainCharacter() {
  if (isSwitching.value) return;

  const root = sectionRef.value;
  const character = root?.querySelector(".job-section__main-character");
  if (!character) return;

  createCharacterHoverEffect(activeJob.value);
  gsap.timeline()
    .to(character, {
      scale: 1.065,
      filter: `drop-shadow(0 34px 36px rgba(0, 0, 0, 0.55)) drop-shadow(0 0 44px ${activeJob.value.color}) brightness(1.14)`,
      duration: 0.16,
      ease: "power2.out",
      overwrite: "auto"
    })
    .to(character, {
      scale: 1.024,
      duration: 0.34,
      ease: "elastic.out(1, 0.55)",
      overwrite: "auto"
    });
}

function leaveMainCharacter() {
  const root = sectionRef.value;
  const character = root?.querySelector(".job-section__main-character");
  const weaponGlow = root?.querySelector(".job-section__weapon-glow");
  const platform = root?.querySelector(".job-section__platform");
  if (!character || !weaponGlow || !platform) return;

  gsap.to(character, {
    y: 0,
    scale: 1,
    rotate: 0,
    duration: 0.3,
    ease: "power2.out",
    clearProps: "filter,scale,rotate,x,y",
    overwrite: "auto",
    onComplete: () => idleTween?.restart(true)
  });
  gsap.to(weaponGlow, {
    x: 0,
    y: 0,
    opacity: 0.58,
    scale: 1,
    filter: "blur(15px)",
    duration: 0.3,
    ease: "power2.out",
    overwrite: "auto"
  });
  gsap.to(platform, {
    opacity: 1,
    scale: 1,
    filter: "blur(2px) drop-shadow(0 20px 22px rgba(0, 0, 0, 0.35))",
    duration: 0.3,
    ease: "power2.out",
    overwrite: "auto"
  });
}

async function changeJob(jobKey) {
  if (jobKey === activeJobKey.value || isSwitching.value) return;

  isSwitching.value = true;
  const root = sectionRef.value;
  const nextJob = jobs.find((job) => job.key === jobKey);
  if (!root || !nextJob) {
    isSwitching.value = false;
    return;
  }

  skillPulseTween?.pause();
  idleTween?.pause();

  await new Promise((resolve) => {
    gsap.timeline({ onComplete: resolve })
      .to(root.querySelector(".job-section__main-character"), {
        scale: 0.82,
        opacity: 0,
        y: 18,
        filter: "blur(16px) brightness(1.8)",
        duration: 0.3,
        ease: "power2.in"
      })
      .to(root.querySelector(".job-section__info"), { y: -24, opacity: 0, duration: 0.22 }, 0)
      .to(root.querySelectorAll(".job-section__skill"), {
        y: 12,
        scale: 0.82,
        opacity: 0,
        stagger: 0.03,
        duration: 0.18,
        ease: "power2.in"
      }, 0.03);
  });

  activeJobKey.value = jobKey;
  await nextTick();
  createBurst(nextJob);

  const characterEntrance = getCharacterEntrance(nextJob);
  gsap.fromTo(root.querySelector(".job-section__main-character"),
    characterEntrance.from,
    {
      ...characterEntrance.to,
      onComplete: () => {
        idleTween?.restart(true);
      }
    }
  );
  gsap.fromTo(root.querySelector(".job-section__info"), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, delay: 0.16 });
  gsap.fromTo(root.querySelectorAll(".job-section__skill"),
    { scale: 0.82, opacity: 0, x: 0, y: 10 },
    { scale: 1, opacity: 1, y: 0, duration: 0.32, stagger: { each: 0.05, from: "center" }, ease: "power2.out", delay: 0.12 }
  );

  skillPulseTween?.restart(true).pause();
  window.setTimeout(() => {
    isSwitching.value = false;
  }, 520);
}

function hoverCard(event, job) {
  if (job.key === activeJobKey.value) return;
  const card = event.currentTarget;
  gsap.to(card, { x: 0, scale: 1.012, filter: "brightness(1.08)", duration: 0.24, ease: "power2.out", overwrite: "auto" });
}

function leaveCard(event, job) {
  if (job.key === activeJobKey.value) return;
  const card = event.currentTarget;
  gsap.to(card, { x: 0, scale: 1, filter: "brightness(1)", duration: 0.24, ease: "power2.out", overwrite: "auto" });
}

function playIntro() {
  if (!introTimeline) return;
  introTimeline.restart();
}

onMounted(() => {
  const root = sectionRef.value;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!root) return;

  introTimeline = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
  introTimeline
    .fromTo(root.querySelector(".job-section__bg"), { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 1.1 })
    .fromTo(root.querySelector(".job-section__index"), { y: -34, opacity: 0 }, { y: 0, opacity: 1, duration: 0.48 }, 0.2)
    .fromTo(root.querySelector(".job-section__title"), { clipPath: "inset(0 100% 0 0)", opacity: 0 }, { clipPath: "inset(0 0% 0 0)", opacity: 1, duration: 0.76, ease: "expo.out" }, 0.38)
    .fromTo(root.querySelectorAll(".job-section__copy, .job-section__subcopy"), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.46, stagger: 0.08 }, 0.72)
    .fromTo(root.querySelector(".job-section__main-character"), { y: 42, scale: 0.86, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.86, ease: "back.out(1.18)" }, 0.58)
    .fromTo(root.querySelector(".job-section__info"), { x: -34, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52 }, 0.88)
    .fromTo(root.querySelectorAll(".job-card"), { x: 90, opacity: 0 }, { x: 0, opacity: 1, duration: 0.62, stagger: 0.1 }, 0.78)
    .fromTo(root.querySelectorAll(".job-section__skill"), { scale: 0.82, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.34, stagger: 0.06, ease: "power2.out" }, 1.16)
    .fromTo(root.querySelectorAll(".job-section__leaf"), { y: -40, opacity: 0 }, { y: "110vh", opacity: 0.7, duration: 5.8, stagger: 0.12, ease: "none" }, 0.1);

  if (!prefersReducedMotion) {
    idleTween = gsap.to(root.querySelector(".job-section__main-character"), {
      y: -0.25,
      duration: 4.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    skillPulseTween = gsap.to(root.querySelectorAll(".job-section__skill"), { scale: 1, duration: 0.01, paused: true });
  }

  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      scheduleJobImagePreload();
      playIntro();
    }
  }, { threshold: 0.52 });
  observer.observe(root);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  introTimeline?.kill();
  idleTween?.kill();
  skillPulseTween?.kill();
  if (preloadHandle) {
    if (preloadHandleType === "idle" && "cancelIdleCallback" in window) {
      window.cancelIdleCallback(preloadHandle);
    } else {
      window.clearTimeout(preloadHandle);
    }
  }
});
</script>

<template>
  <section ref="sectionRef" class="section job-section" data-section="jobs" aria-labelledby="job-title">
    <img class="job-section__bg" :src="bgUrl" alt="" aria-hidden="true" loading="lazy" decoding="async" fetchpriority="low" />
    <div class="job-section__shade" aria-hidden="true" />
    <div class="job-section__effects" aria-hidden="true" />
    <div class="job-section__ambient" aria-hidden="true">
      <span
        v-for="index in 20"
        :key="index"
        class="job-section__leaf"
        :style="{
          '--x': `${(index * 13) % 100}%`,
          '--delay': `${(index % 7) * -0.42}s`,
          '--size': `${8 + (index % 5) * 3}px`
        }"
      />
    </div>

    <div class="job-section__index" aria-hidden="true">
      <strong>03</strong>
      <span>콘텐츠 소개</span>
    </div>

    <div class="job-section__left">
      <div class="job-section__title-group">
        <h2 id="job-title" class="job-section__title">직업 소개</h2>
        <p class="job-section__copy">당신의 혼을 깨울 직업을 선택하세요.</p>
        <p class="job-section__subcopy">다섯 가지 전투 스타일과 주요 스킬을 확인하고,<br />나에게 맞는 영혼의 길을 찾아보세요.</p>
      </div>

      <div class="job-section__info" :style="{ '--job-color': activeJob.color }">
        <img :src="symbolUrl" alt="" aria-hidden="true" />
        <div>
          <h3>{{ activeJob.name }}</h3>
          <p>{{ activeJob.summary }}</p>
        </div>
      </div>
    </div>

    <div class="job-section__skills" :style="{ '--job-color': activeJob.color }">
      <p>주요 스킬 미리보기</p>
      <div class="job-section__skill-list">
        <button
          v-for="(skill, index) in activeJob.skills"
          :key="skill.name"
          class="job-section__skill"
          type="button"
          @click="playSkillEffect($event, skill, index)"
        >
          <img :src="skill.image" :alt="skill.name" loading="lazy" />
        </button>
      </div>
    </div>

    <div
      class="job-section__showcase"
      :style="{ '--job-color': activeJob.color }"
    >
      <div class="job-section__platform" aria-hidden="true" />
      <img
        class="job-section__main-character"
        :src="activeJob.mainImage"
        :alt="`${activeJob.name} 대표 캐릭터`"
        loading="lazy"
        decoding="async"
        fetchpriority="low"
        @mouseenter="hoverMainCharacter"
        @mouseleave="leaveMainCharacter"
        @click="clickMainCharacter"
      />
      <div class="job-section__weapon-glow" aria-hidden="true" />
    </div>

    <aside class="job-section__cards" aria-label="직업 선택">
      <button
        v-for="job in jobs"
        :key="job.key"
        class="job-card"
        :class="[`job-card--${job.key}`, { 'is-active': job.key === activeJobKey }]"
        :style="{ '--job-color': job.color }"
        type="button"
        @click="changeJob(job.key)"
        @mouseenter="hoverCard($event, job)"
        @mouseleave="leaveCard($event, job)"
      >
        <img class="job-card__image" :src="job.cardImage" alt="" aria-hidden="true" loading="lazy" />
        <div class="job-card__text">
          <strong>{{ job.name }}</strong>
          <span>{{ job.summary }}</span>
        </div>
      </button>
    </aside>
  </section>
</template>
