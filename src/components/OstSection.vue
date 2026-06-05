<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { gsap } from "gsap";
import bgUrl from "@/assets/images/section5-bg-ost.webp";
import cdUrl from "@/assets/images/section5-cd-centered.webp";
import tonearmUrl from "@/assets/images/section5-tonearm.webp";
import thumbOneUrl from "@/assets/images/section5-thumb-1.webp";
import thumbTwoUrl from "@/assets/images/section5-thumb-2.webp";
import thumbThreeUrl from "@/assets/images/section5-thumb-3.webp";
import peaceVillageThumbUrl from "@/assets/images/section5-thumb-peaceful-village.webp";
import thumbFiveUrl from "@/assets/images/section5-thumb-5.webp";

const publicBase = process.env.NODE_ENV === "production" ? "/hon_promotion" : "";
const ostAudioUrl = `${publicBase}/assets/videos/section5-ost-audio.m4a`;
const peaceVillageStartTime = 29 * 60 + 17;

const tracks = [
  {
    title: "귀혼의 전설", subtitle: "달빛 아래 깨어난 첫 여정", startTime: 0, thumbnail: thumbOneUrl, effect: "spark",
    vars: { "--ost-hue": "0deg", "--ost-sat": "1.08", "--ost-bright": "1.04", "--ost-tint": "rgba(255, 190, 86, 0.13)", "--ost-tint-strong": "rgba(255, 211, 119, 0.17)" }
  },
  {
    title: "선선의 길", subtitle: "푸른 밤을 건너는 발걸음", startTime: 92, thumbnail: thumbTwoUrl, effect: "leaf",
    vars: { "--ost-hue": "12deg", "--ost-sat": "1.1", "--ost-bright": "1.04", "--ost-tint": "rgba(91, 178, 155, 0.13)", "--ost-tint-strong": "rgba(111, 210, 181, 0.17)" }
  },
  {
    title: "전투의 서막", subtitle: "붉은 협곡에 울리는 결의", startTime: 184, thumbnail: thumbThreeUrl, effect: "ember",
    vars: { "--ost-hue": "-10deg", "--ost-sat": "1.14", "--ost-bright": "1.0", "--ost-tint": "rgba(255, 75, 52, 0.14)", "--ost-tint-strong": "rgba(255, 111, 44, 0.19)" }
  },
  {
    title: "평화로운 마을", subtitle: "등불 사이로 흐르는 기억", startTime: peaceVillageStartTime, thumbnail: peaceVillageThumbUrl, effect: "lantern",
    vars: { "--ost-hue": "6deg", "--ost-sat": "1.07", "--ost-bright": "1.06", "--ost-tint": "rgba(255, 154, 72, 0.13)", "--ost-tint-strong": "rgba(255, 200, 112, 0.17)" }
  },
  {
    title: "운명의 소용돌이", subtitle: "보랏빛 균열 너머의 선율", startTime: 368, thumbnail: thumbFiveUrl, effect: "rift",
    vars: { "--ost-hue": "-34deg", "--ost-sat": "1.12", "--ost-bright": "1.0", "--ost-tint": "rgba(150, 96, 255, 0.16)", "--ost-tint-strong": "rgba(190, 120, 255, 0.2)" }
  }
];

const sectionRef = ref(null);
const videoRef = ref(null);
const waveCanvasRef = ref(null);
const activeIndex = ref(0);
const isPlaying = ref(false);
const hasInteracted = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const particles = Array.from({ length: 24 }, (_, index) => index);
const effectParticles = Array.from({ length: 30 }, (_, index) => index);

const activeTrack = computed(() => tracks[activeIndex.value]);
const activeEffect = computed(() => activeTrack.value.effect ?? "spark");
// 색감은 이제 선택된 트랙이 직접 가진다 (무드 메뉴 제거 → 트랙 선택이 색감 전환도 담당)
const activeMoodVars = computed(() => activeTrack.value.vars ?? tracks[0].vars);

let introTimeline;
let cdRotation;
let observer;
let restoreOnEnter = false;
const toneArmRestRotation = -34;
const toneArmPlayRotation = -13;

// G. 웨이브폼 시각화 (AnalyserNode + Canvas)
let waveCtx;
let analyser;
let sourceNode;
let waveRaf = 0;
let freqData;
let reduceMotion = false;

function ensureAudioGraph() {
  const video = videoRef.value;
  if (!video || analyser) return;
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    waveCtx = waveCtx || new Ctx();
    sourceNode = waveCtx.createMediaElementSource(video);
    analyser = waveCtx.createAnalyser();
    analyser.fftSize = 128;
    analyser.smoothingTimeConstant = 0.82;
    // 그래프를 destination에 반드시 연결해야 소리가 유지된다
    sourceNode.connect(analyser);
    analyser.connect(waveCtx.destination);
    freqData = new Uint8Array(analyser.frequencyBinCount);
  } catch {
    analyser = null;
  }
}

function drawWave() {
  const canvas = waveCanvasRef.value;
  if (!canvas || !analyser || !freqData) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);

  analyser.getByteFrequencyData(freqData);
  const bins = freqData.length;
  const gap = 3;
  const barWidth = (w - gap * (bins - 1)) / bins;
  const grad = ctx.createLinearGradient(0, h, 0, 0);
  grad.addColorStop(0, "rgba(255, 196, 96, 0.18)");
  grad.addColorStop(1, "rgba(255, 226, 150, 0.85)");
  ctx.fillStyle = grad;

  for (let i = 0; i < bins; i += 1) {
    const value = freqData[i] / 255;
    const barHeight = Math.max(2, value * h * 0.92);
    const x = i * (barWidth + gap);
    const y = h - barHeight;
    const r = Math.min(barWidth / 2, 3);
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(x, y, barWidth, barHeight, r);
    } else {
      ctx.rect(x, y, barWidth, barHeight);
    }
    ctx.fill();
  }

  waveRaf = requestAnimationFrame(drawWave);
}

function startWave() {
  if (reduceMotion || !analyser) return;
  cancelAnimationFrame(waveRaf);
  waveRaf = requestAnimationFrame(drawWave);
}

function stopWave() {
  cancelAnimationFrame(waveRaf);
  waveRaf = 0;
  const canvas = waveCanvasRef.value;
  const ctx = canvas?.getContext("2d");
  if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function moveToneArm(index, playing = isPlaying.value) {
  const root = sectionRef.value;
  const target = root?.querySelector(".ost-section__tonearm");
  if (!target) return;

  const targetRotation = playing ? toneArmPlayRotation + index * 4.2 : toneArmRestRotation;
  const targetX = playing ? -56 : -18;
  const settleY = playing ? 18 : 0;

  // 실제 턴테이블처럼: ① 바늘 들어올림 → ② 새 위치로 스윙 → ③ 천천히 내려놓음
  const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
  tl.to(target, { y: -12, rotate: targetRotation - 6, duration: 0.26, ease: "power2.out" }, 0);
  tl.to(target, { x: targetX, rotate: targetRotation, duration: 0.5 }, 0.22);
  tl.to(target, { y: settleY, duration: 0.36, ease: "sine.inOut" }, 0.64);
  if (playing) {
    tl.to(target, { rotate: targetRotation + 0.8, duration: 0.12, yoyo: true, repeat: 1, ease: "sine.inOut" }, 0.98);
  }
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
    ensureAudioGraph();
    if (waveCtx?.state === "suspended") waveCtx.resume();
    startWave();
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
  stopWave();

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
  const maxSeekTime = Number.isFinite(video.duration) && video.duration > 0 ? Math.max(video.duration - 1, 0) : nextTrack.startTime;
  video.currentTime = Math.min(nextTrack.startTime, maxSeekTime);
  currentTime.value = video.currentTime;
  moveToneArm(index, autoplay);

  const center = root?.querySelector(".ost-section__cd-label");
  const playButton = root?.querySelector(".ost-section__cd-center");
  if (center) {
    gsap.fromTo(center,
      { opacity: 0.45, scale: 0.88 },
      { opacity: 1, scale: 1, duration: 0.42, ease: "back.out(1.5)" }
    );
  }
  if (playButton) {
    gsap.fromTo(playButton,
      { scale: 0.92 },
      { scale: 1, duration: 0.32, ease: "back.out(1.45)" }
    );
  }

  if (autoplay) startPlayback();
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
  reduceMotion = prefersReducedMotion;
  if (!root || !video) return;

  video.volume = 0;
  cdRotation = gsap.to(root.querySelector(".ost-section__disc-spin"), {
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
    .fromTo(root.querySelector(".ost-section__turntable"), { x: -90, y: 56, opacity: 0 }, { x: 0, y: 30, opacity: 1, duration: 0.92 }, 0.72)
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
  stopWave();
  waveCtx?.close?.();
  waveCtx = undefined;
  analyser = null;
});
</script>

<template>
  <section
    ref="sectionRef"
    class="section ost-section"
    :class="`ost-section--${activeEffect}`"
    data-section="ost"
    aria-labelledby="ost-title"
    :style="activeMoodVars"
  >
    <audio
      ref="videoRef"
      class="ost-section__video"
      :src="ostAudioUrl"
      preload="metadata"
      @loadedmetadata="handleLoadedMetadata"
      @timeupdate="updateProgress"
      @ended="nextTrack"
    />

    <img class="ost-section__bg" :src="bgUrl" alt="" aria-hidden="true" loading="lazy" decoding="async" fetchpriority="low" />
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
    <div :key="activeEffect" class="ost-section__track-effects" aria-hidden="true">
      <span
        v-for="particle in effectParticles"
        :key="particle"
        class="ost-section__effect-particle"
        :style="{
          '--effect-left': `${10 + ((particle * 29) % 84)}%`,
          '--effect-top': `${8 + ((particle * 17) % 76)}%`,
          '--effect-size': `${7 + (particle % 6) * 2}px`,
          '--effect-delay': `${(particle % 10) * -0.42}s`,
          '--effect-duration': `${5.6 + (particle % 7) * 0.54}s`,
          '--effect-drift': `${particle % 2 === 0 ? 92 + (particle % 5) * 18 : -78 - (particle % 4) * 18}px`,
          '--effect-rotate': `${particle % 2 === 0 ? 1 : -1}`
        }"
      />
    </div>

    <div class="ost-section__title">
      <div class="ost-section__index" aria-hidden="true">
        <strong>05</strong>
        <span>OST / 분위기</span>
      </div>
      <h2 id="ost-title">귀혼의 선율,<br />영혼을 깨우다</h2>
      <p>전설의 여정을 더욱 깊게 만드는 귀혼의 음악을 감상하세요.</p>
    </div>

    <canvas ref="waveCanvasRef" class="ost-section__wave" aria-hidden="true"></canvas>

    <div class="ost-section__turntable">
      <div class="ost-section__disc" :class="{ 'is-playing': isPlaying }">
        <div class="ost-section__disc-spin">
          <img class="ost-section__cd" :src="cdUrl" alt="" aria-hidden="true" loading="lazy" decoding="async" fetchpriority="low" />
          <div
            class="ost-section__cd-label"
            :style="{ backgroundImage: `url(${activeTrack.thumbnail})` }"
            aria-hidden="true"
          ></div>
        </div>
        <div class="ost-section__disc-sheen" aria-hidden="true"></div>
        <button
          class="ost-section__cd-center"
          type="button"
          :aria-label="isPlaying ? 'OST 일시정지' : 'OST 재생'"
          @click="togglePlay"
        >
          <span>{{ isPlaying ? "Ⅱ" : "▶" }}</span>
        </button>
      </div>
      <img class="ost-section__tonearm" :src="tonearmUrl" alt="" aria-hidden="true" loading="lazy" decoding="async" fetchpriority="low" />
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
