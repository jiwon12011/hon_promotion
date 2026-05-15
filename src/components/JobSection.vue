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
import yeoksaCardUrl from "@/assets/images/section3-yeoksa-card.png";
import sasuMainUrl from "@/assets/images/section3-sasu-main.png";
import sasuCardUrl from "@/assets/images/section3-sasu-card.png";
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

  await new Promise((resolve) => {
    gsap.timeline({ onComplete: resolve })
      .to(root.querySelector(".job-section__main-character"), {
        scale: 0.82,
        opacity: 0,
        y: 42,
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

  gsap.fromTo(root.querySelector(".job-section__main-character"),
    { scale: 1.18, opacity: 0, y: 60, filter: `blur(18px) drop-shadow(0 0 48px ${nextJob.color})` },
    { scale: 1, opacity: 1, y: 0, filter: "blur(0px)", duration: 0.62, ease: "back.out(1.25)" }
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
  gsap.to(card, { x: -16, scale: 1.035, duration: 0.28, ease: "power2.out" });
  gsap.to(card.querySelector(".job-card__image"), { scale: 1.035, duration: 0.28 });
}

function leaveCard(event, job) {
  if (job.key === activeJobKey.value) return;
  const card = event.currentTarget;
  gsap.to(card, { x: 0, scale: 1, duration: 0.28, ease: "power2.out" });
  gsap.to(card.querySelector(".job-card__image"), { scale: 1, duration: 0.28 });
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
    .fromTo(root.querySelector(".job-section__copy"), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.46 }, 0.72)
    .fromTo(root.querySelector(".job-section__main-character"), { y: 92, scale: 0.82, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.92, ease: "back.out(1.25)" }, 0.58)
    .fromTo(root.querySelector(".job-section__info"), { x: -34, opacity: 0 }, { x: 0, opacity: 1, duration: 0.52 }, 0.88)
    .fromTo(root.querySelectorAll(".job-card"), { x: 90, opacity: 0 }, { x: 0, opacity: 1, duration: 0.62, stagger: 0.1 }, 0.78)
    .fromTo(root.querySelectorAll(".job-section__skill"), { scale: 0.82, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.34, stagger: 0.06, ease: "power2.out" }, 1.16)
    .fromTo(root.querySelectorAll(".job-section__leaf"), { y: -40, opacity: 0 }, { y: "110vh", opacity: 0.7, duration: 5.8, stagger: 0.12, ease: "none" }, 0.1);

  if (!prefersReducedMotion) {
    idleTween = gsap.to(root.querySelector(".job-section__main-character"), {
      y: -0.7,
      duration: 3.6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    skillPulseTween = gsap.to(root.querySelectorAll(".job-section__skill"), { scale: 1, duration: 0.01, paused: true });
  }

  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) playIntro();
  }, { threshold: 0.52 });
  observer.observe(root);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  introTimeline?.kill();
  idleTween?.kill();
  skillPulseTween?.kill();
});
</script>

<template>
  <section ref="sectionRef" class="section job-section" data-section="jobs" aria-labelledby="job-title">
    <img class="job-section__bg" :src="bgUrl" alt="" aria-hidden="true" loading="lazy" />
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
        <p class="job-section__copy">당신의 혼을 깨울<br />직업을 선택하세요.</p>
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
        <article v-for="skill in activeJob.skills" :key="skill.name" class="job-section__skill">
          <img :src="skill.image" :alt="skill.name" loading="lazy" />
          <span>{{ skill.name }}</span>
        </article>
      </div>
    </div>

    <div class="job-section__showcase" :style="{ '--job-color': activeJob.color }">
      <div class="job-section__platform" aria-hidden="true" />
      <img class="job-section__main-character" :src="activeJob.mainImage" :alt="`${activeJob.name} 대표 캐릭터`" loading="lazy" />
      <div class="job-section__weapon-glow" aria-hidden="true" />
    </div>

    <aside class="job-section__cards" aria-label="직업 선택">
      <button
        v-for="job in jobs"
        :key="job.key"
        class="job-card"
        :class="{ 'is-active': job.key === activeJobKey }"
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
