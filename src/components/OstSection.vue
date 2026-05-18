<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { gsap } from "gsap";
import bgUrl from "@/assets/images/section5-bg-ost.png";
import cdUrl from "@/assets/images/section5-cd-balanced.png";
import tonearmUrl from "@/assets/images/section5-tonearm.png";
import thumbOneUrl from "@/assets/images/section5-thumb-1.png";
import thumbTwoUrl from "@/assets/images/section5-thumb-2.png";
import thumbThreeUrl from "@/assets/images/section5-thumb-3.png";
import thumbFourUrl from "@/assets/images/section5-thumb-4.png";
import thumbFiveUrl from "@/assets/images/section5-thumb-5.png";

const publicBase = process.env.NODE_ENV === "production" ? "/hon_promotion" : "";
const ostAudioUrl = `${publicBase}/assets/videos/section5-ost-audio.m4a`;

const tracks = [
  { title: "귀혼의 전설", subtitle: "달빛 아래 깨어난 첫 여정", startTime: 0, thumbnail: thumbOneUrl },
  { title: "선선의 길", subtitle: "푸른 밤을 건너는 발걸음", startTime: 92, thumbnail: thumbTwoUrl },
  { title: "전투의 서막", subtitle: "붉은 협곡에 울리는 결의", startTime: 184, thumbnail: thumbThreeUrl },
  { title: "평화로운 마을", subtitle: "등불 사이로 흐르는 기억", startTime: 276, thumbnail: thumbFourUrl },
  { title: "운명의 소용돌이", subtitle: "보랏빛 균열 너머의 선율", startTime: 368, thumbnail: thumbFiveUrl }
];

const moods = [
  {
    label: "테마",
    icon: "♪",
    trackIndex: 0,
    vars: {
      "--ost-hue": "0deg",
      "--ost-sat": "1.16",
      "--ost-bright": "1.08",
      "--ost-tint": "rgba(255, 190, 86, 0.18)",
      "--ost-tint-strong": "rgba(255, 211, 119, 0.24)"
    }
  },
  {
    label: "전투",
    icon: "♬",
    trackIndex: 2,
    vars: {
      "--ost-hue": "-18deg",
      "--ost-sat": "1.34",
      "--ost-bright": "0.98",
      "--ost-tint": "rgba(255, 75, 52, 0.2)",
      "--ost-tint-strong": "rgba(255, 111, 44, 0.28)"
    }
  },
  {
    label: "필드",
    icon: "⌁",
    trackIndex: 1,
    vars: {
      "--ost-hue": "22deg",
      "--ost-sat": "1.2",
      "--ost-bright": "1.08",
      "--ost-tint": "rgba(91, 178, 155, 0.18)",
      "--ost-tint-strong": "rgba(111, 210, 181, 0.24)"
    }
  },
  {
    label: "마을",
    icon: "⌂",
    trackIndex: 3,
    vars: {
      "--ost-hue": "8deg",
      "--ost-sat": "1.12",
      "--ost-bright": "1.14",
      "--ost-tint": "rgba(255, 154, 72, 0.18)",
      "--ost-tint-strong": "rgba(255, 200, 112, 0.25)"
    }
  }
];

const sectionRef = ref(null);
const videoRef = ref(null);
const activeIndex = ref(0);
const activeMoodIndex = ref(0);
const isPlaying = ref(false);
const hasInteracted = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const particles = Array.from({ length: 24 }, (_, index) => index);

const activeTrack = computed(() => tracks[activeIndex.value]);
const activeMoodVars = computed(() => moods[activeMoodIndex.value]?.vars ?? moods[0].vars);

let introTimeline;
let cdRotation;
let observer;
let restoreOnEnter = false;
const toneArmRestRotation = -34;
const toneArmPlayRotation = -13;

function moveToneArm(index, playing = isPlaying.value) {
  const root = sectionRef.value;
  const target = root?.querySelector(".ost-section__tonearm");
  if (!target) return;

  gsap.to(target, {
    x: playing ? -50 : -12,
    y: playing ? 18 : 0,
    rotate: playing ? toneArmPlayRotation + index * 4.5 : toneArmRestRotation,
    duration: 0.78,
    ease: "power2.inOut"
  });
}

async function startPlayback() {
  const video = videoRef.value;
  if (!video) return;

  hasInteracted.value = true;
  video.muted = false;
  video.volume = Math.max(video.volume, 0.05);

  try {
    await video.play();
    isPlaying.value = true;
    cdRotation?.play();
    moveToneArm(activeIndex.value, true);
    gsap.to(video, { volume: 0.86, duration: 0.8, ease: "power2.out" });
  } catch {
    isPlaying.value = false;
    cdRotation?.pause();
    moveToneArm(activeIndex.value, false);
  }
}

function pausePlayback(fade = true) {
  const video = videoRef.value;
  if (!video) return;

  isPlaying.value = false;
  cdRotation?.pause();
  moveToneArm(activeIndex.value, false);

  if (!fade) {
    video.pause();
    return;
  }

  gsap.to(video, {
    volume: 0,
    duration: 0.45,
    ease: "power2.out",
    onComplete: () => {
      video.pause();
      video.muted = true;
    }
  });
}

function selectTrack(index, autoplay = true) {
  const video = videoRef.value;
  const root = sectionRef.value;
  const nextTrack = tracks[index];
  if (!video || !nextTrack) return;

  activeIndex.value = index;
  video.currentTime = Math.min(nextTrack.startTime, Math.max(video.duration - 1, 0) || nextTrack.startTime);
  currentTime.value = video.currentTime;
  moveToneArm(index, autoplay);

  const center = root?.querySelector(".ost-section__cd-center");
  if (center) {
    gsap.fromTo(center,
      { opacity: 0.45, scale: 0.88 },
      { opacity: 1, scale: 1, duration: 0.42, ease: "back.out(1.5)" }
    );
  }

  if (autoplay) startPlayback();
}

function selectMood(index) {
  const mood = moods[index];
  if (!mood) return;

  activeMoodIndex.value = index;
  selectTrack(mood.trackIndex, true);

  const root = sectionRef.value;
  if (!root) return;

  gsap.fromTo(root.querySelector(".ost-section__shade"),
    { opacity: 0.72 },
    { opacity: 1, duration: 0.42, ease: "power2.out" }
  );
  gsap.fromTo(root.querySelectorAll(".ost-section__light"),
    { scale: 0.7, opacity: 0.18 },
    { scale: 1, opacity: 0.62, stagger: 0.012, duration: 0.38, ease: "power2.out" }
  );
}

function togglePlay() {
  if (isPlaying.value) {
    pausePlayback();
  } else {
    startPlayback();
  }
}

function nextTrack() {
  selectTrack((activeIndex.value + 1) % tracks.length);
}

function updateProgress() {
  const video = videoRef.value;
  if (!video) return;
  currentTime.value = video.currentTime;
}

function handleLoadedMetadata() {
  const video = videoRef.value;
  if (!video) return;
  duration.value = Number.isFinite(video.duration) ? video.duration : 0;
}

onMounted(() => {
  const root = sectionRef.value;
  const video = videoRef.value;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!root || !video) return;

  video.volume = 0;
  cdRotation = gsap.to(root.querySelector(".ost-section__cd"), {
    rotate: 360,
    duration: 4.2,
    repeat: -1,
    ease: "none",
    paused: true
  });

  introTimeline = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
  introTimeline
    .fromTo(root.querySelector(".ost-section__bg"), { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 1.45 })
    .fromTo(root.querySelector(".ost-section__title"), { x: -70, opacity: 0 }, { x: 0, opacity: 1, duration: 0.82 }, 0.35)
    .fromTo(root.querySelectorAll(".ost-section__menu-button"), { x: -28, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.08, duration: 0.42 }, 0.65)
    .fromTo(root.querySelector(".ost-section__turntable"), { x: -90, y: 26, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.92 }, 0.72)
    .fromTo(root.querySelector(".ost-section__tonearm"), { x: 18, rotate: -52, opacity: 0 }, { x: -12, rotate: toneArmRestRotation, opacity: 1, duration: 0.78, ease: "back.out(1.6)" }, 1)
    .fromTo(root.querySelectorAll(".ost-section__track"), { y: 45, opacity: 0, scale: 0.92 }, { y: 0, opacity: 1, scale: 1, stagger: 0.1, duration: 0.55 }, 1.05)
    .fromTo(root.querySelectorAll(".ost-section__light"), { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, stagger: 0.02, duration: 0.45 }, 1.2);

  if (!prefersReducedMotion) {
    root.querySelectorAll(".ost-section__light").forEach((light, index) => {
      gsap.to(light, {
        y: -34 - (index % 5) * 8,
        x: (index % 2 === 0 ? 1 : -1) * (12 + (index % 4) * 5),
        opacity: 0.24,
        duration: 3.2 + (index % 6) * 0.35,
        delay: (index % 8) * 0.16,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
    gsap.to(root.querySelector(".ost-section__bg"), {
      scale: 1.025,
      duration: 22,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }

  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      introTimeline?.restart();
      if (restoreOnEnter && hasInteracted.value) {
        restoreOnEnter = false;
        startPlayback();
      }
      return;
    }

    restoreOnEnter = isPlaying.value;
    pausePlayback();
  }, { threshold: 0.48 });
  observer.observe(root);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  introTimeline?.kill();
  cdRotation?.kill();
  pausePlayback(false);
});
</script>

<template>
  <section ref="sectionRef" class="section ost-section" data-section="ost" aria-labelledby="ost-title" :style="activeMoodVars">
    <audio
      ref="videoRef"
      class="ost-section__video"
      :src="ostAudioUrl"
      preload="metadata"
      @loadedmetadata="handleLoadedMetadata"
      @timeupdate="updateProgress"
      @ended="nextTrack"
    />

    <img class="ost-section__bg" :src="bgUrl" alt="" aria-hidden="true" loading="lazy" />
    <div class="ost-section__shade" aria-hidden="true" />
    <div class="ost-section__particles" aria-hidden="true">
      <span
        v-for="particle in particles"
        :key="particle"
        class="ost-section__light"
        :style="{
          '--light-left': `${8 + ((particle * 37) % 84)}%`,
          '--light-top': `${10 + ((particle * 19) % 76)}%`,
          '--light-size': `${3 + (particle % 5)}px`
        }"
      />
    </div>

    <aside class="ost-section__menu" aria-label="OST 메뉴">
      <button
        v-for="(mood, index) in moods"
        :key="mood.label"
        class="ost-section__menu-button"
        :class="{ 'is-active': activeMoodIndex === index }"
        type="button"
        @click="selectMood(index)"
      >
        <i aria-hidden="true">{{ mood.icon }}</i>
        <span>{{ mood.label }}</span>
      </button>
    </aside>

    <div class="ost-section__title">
      <div class="ost-section__index" aria-hidden="true">
        <strong>05</strong>
        <span>OST / 분위기</span>
      </div>
      <h2 id="ost-title">귀혼의 선율,<br />영혼을 깨우다</h2>
      <p>전설의 여정을 더욱 깊게 만드는 귀혼의 음악을 감상하세요.</p>
    </div>

    <div class="ost-section__turntable">
      <div class="ost-section__disc">
        <img class="ost-section__cd" :src="cdUrl" alt="" aria-hidden="true" loading="lazy" />
        <button
          class="ost-section__cd-center"
          type="button"
          :style="{ backgroundImage: `url(${activeTrack.thumbnail})` }"
          :aria-label="isPlaying ? 'OST 일시정지' : 'OST 재생'"
          @click="togglePlay"
        >
          <span>{{ isPlaying ? "Ⅱ" : "▶" }}</span>
        </button>
      </div>
      <img class="ost-section__tonearm" :src="tonearmUrl" alt="" aria-hidden="true" loading="lazy" />
    </div>

    <div class="ost-section__playlist" aria-label="추천 테마">
      <p>추천 테마</p>
      <div class="ost-section__tracks">
        <button
          v-for="(track, index) in tracks"
          :key="track.title"
          class="ost-section__track"
          :class="{ 'is-active': activeIndex === index }"
          type="button"
          @click="selectTrack(index)"
        >
          <img :src="track.thumbnail" :alt="track.title" loading="lazy" />
          <span class="ost-section__track-play">▶</span>
          <strong>{{ track.title }}</strong>
        </button>
      </div>
    </div>
  </section>
</template>
