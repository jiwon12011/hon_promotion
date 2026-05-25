<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { gsap } from "gsap";
import bgUrl from "@/assets/images/section4-bg-forest.png";
import talismanCardUrl from "@/assets/images/section4-talisman-card.png";
import iconScrollUrl from "@/assets/images/section4-icon-scroll.png";
import iconFlameUrl from "@/assets/images/section4-icon-flame.png";
import iconBookUrl from "@/assets/images/section4-icon-book.png";
import iconUpgradeUrl from "@/assets/images/section4-icon-upgrade.png";
import bookGoButtonUrl from "@/assets/images/book_gobtn.png";
import monsterOneUrl from "@/assets/images/section4-monster-1.png";
import monsterTwoUrl from "@/assets/images/section4-monster-2.png";
import monsterThreeUrl from "@/assets/images/section4-monster-3.png";
import monsterFourUrl from "@/assets/images/section4-monster-4.png";
import monsterFiveUrl from "@/assets/images/section4-monster-5.png";
import monsterSixUrl from "@/assets/images/section4-monster-6.png";
import monsterSevenUrl from "@/assets/images/section4-monster-7.png";
import monsterEightUrl from "@/assets/images/section4-monster-8.png";

const features = [
  { label: "봉인된 귀 수집", icon: iconScrollUrl },
  { label: "요괴 봉인 해제", icon: iconFlameUrl },
  { label: "도감 완성", icon: iconBookUrl },
  { label: "능력 강화", icon: iconUpgradeUrl }
];

const monsters = [
  { id: 1, name: "네코", message: "뀨우! 나랑 같이 놀래?", image: monsterOneUrl, x: 19, y: 39, size: 188, spriteScale: 1.05, aura: "rgba(181, 255, 96, 0.4)" },
  { id: 2, name: "깨부리", message: "키히힛, 불꽃 조심해!", image: monsterTwoUrl, x: 39, y: 29, size: 190, spriteScale: 1.08, aura: "rgba(255, 104, 42, 0.48)", fire: true },
  { id: 3, name: "어린숭숭", message: "메에... 나 무섭지 않지?", image: monsterThreeUrl, x: 59, y: 39, size: 184, spriteScale: 1.08, aura: "rgba(255, 170, 210, 0.42)" },
  { id: 4, name: "산고", message: "보글보글... 푸른 불씨야.", image: monsterFourUrl, x: 79, y: 29, size: 190, spriteScale: 1.08, aura: "rgba(85, 210, 255, 0.4)" },
  { id: 5, name: "도깨비", message: "크왕! 한 판 붙어볼까?", image: monsterFiveUrl, x: 19, y: 67, size: 194, spriteScale: 1.06, aura: "rgba(255, 181, 69, 0.4)" },
  { id: 6, name: "전갈신", message: "크륵, 독침은 조심해.", image: monsterSixUrl, x: 39, y: 57, size: 190, spriteScale: 1.08, aura: "rgba(170, 108, 255, 0.4)" },
  { id: 7, name: "구미호", message: "후후, 홀리면 안 돼.", image: monsterSevenUrl, x: 59, y: 67, size: 194, spriteScale: 1.04, aura: "rgba(255, 225, 160, 0.44)" },
  { id: 8, name: "강시", message: "덜그럭... 밤길을 따라간다.", image: monsterEightUrl, x: 79, y: 57, size: 184, spriteScale: 1.05, aura: "rgba(96, 184, 255, 0.34)" }
];

const floatingMonsters = monsters;
const sectionRef = ref(null);
const selectedId = ref(1);
const selectedMonster = computed(() => monsters.find((monster) => monster.id === selectedId.value) ?? monsters[0]);

let introTimeline;
let observer;
let idleTweens = [];
let dustTimer;
let fireTimer;
let handleMouseMove;

function createBurst(target, count = 18) {
  const root = sectionRef.value;
  const container = root?.querySelector(".monster-dex__effects");
  if (!target || !root || !container) return;

  const rect = target.getBoundingClientRect();
  const parent = root.getBoundingClientRect();
  const x = rect.left - parent.left + rect.width / 2;
  const y = rect.top - parent.top + rect.height / 2;

  for (let index = 0; index < count; index += 1) {
    const particle = document.createElement("span");
    particle.className = index % 5 === 0 ? "monster-dex__spark-star" : "monster-dex__particle";
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    if (particle.className === "monster-dex__spark-star") particle.textContent = "✦";
    container.appendChild(particle);

    const angle = (Math.PI * 2 * index) / count;
    const distance = 72 + Math.random() * 90;
    gsap.to(particle, {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance - 28,
      scale: 0,
      opacity: 0,
      rotate: 360 + Math.random() * 260,
      duration: 0.9 + Math.random() * 0.45,
      ease: "power3.out",
      onComplete: () => particle.remove()
    });
  }
}

function createSpiritTrail(target, monster) {
  const root = sectionRef.value;
  const container = root?.querySelector(".monster-dex__effects");
  const destination = root?.querySelector(".monster-dex__character");
  if (!target || !root || !container || !destination) return;

  const sourceRect = target.getBoundingClientRect();
  const destRect = destination.getBoundingClientRect();
  const parent = root.getBoundingClientRect();
  const startX = sourceRect.left - parent.left + sourceRect.width / 2;
  const startY = sourceRect.top - parent.top + sourceRect.height / 2;
  const endX = destRect.left - parent.left + destRect.width / 2;
  const endY = destRect.top - parent.top + destRect.height * 0.62;

  for (let index = 0; index < 14; index += 1) {
    const particle = document.createElement("span");
    particle.className = "monster-dex__particle";
    particle.style.left = `${startX + (Math.random() - 0.5) * 34}px`;
    particle.style.top = `${startY + (Math.random() - 0.5) * 34}px`;
    particle.style.background = monster.aura;
    particle.style.boxShadow = `0 0 18px ${monster.aura}`;
    container.appendChild(particle);

    gsap.to(particle, {
      x: endX - startX + (Math.random() - 0.5) * 64,
      y: endY - startY + (Math.random() - 0.5) * 52,
      scale: 0.2,
      opacity: 0,
      duration: 0.72 + index * 0.018,
      delay: index * 0.018,
      ease: "power2.inOut",
      onComplete: () => particle.remove()
    });
  }
}

async function selectMonster(monster, event) {
  const root = sectionRef.value;

  if (selectedId.value === monster.id) {
    const currentTarget = event?.currentTarget;
    const speech = root?.querySelector(".monster-dex__speech");
    createBurst(currentTarget, 12);
    gsap.fromTo(currentTarget?.querySelector("span"),
      { scale: 1.2, opacity: 0.95, filter: "blur(5px)" },
      { scale: 1, opacity: 0.5, filter: "blur(4px)", duration: 0.55, ease: "power2.out" }
    );
    if (speech) {
      gsap.fromTo(speech, { y: 8, opacity: 0, scale: 0.94 }, { y: 0, opacity: 1, scale: 1, duration: 0.36, ease: "back.out(1.5)" });
    }
    return;
  }

  selectedId.value = monster.id;
  await nextTick();
  const character = root?.querySelector(".monster-dex__character-img");
  const glow = root?.querySelector(".monster-dex__character-glow");
  const speech = root?.querySelector(".monster-dex__speech");
  if (!root || !character || !glow) return;

  glow.style.setProperty("--monster-aura", monster.aura);
  gsap.fromTo(character,
    { scale: 0.62, y: -34, opacity: 0, filter: "blur(12px) brightness(1.7)" },
    { scale: 1, y: 0, opacity: 1, filter: "blur(0px)", duration: 0.72, ease: "elastic.out(1, 0.55)" }
  );
  gsap.fromTo(glow,
    { scale: 1.35, opacity: 1 },
    { scale: 1, opacity: 0.68, duration: 0.9, ease: "power2.out" }
  );
  gsap.fromTo(root.querySelector(".monster-dex__energy-rise"),
    { scale: 1.12, opacity: 1, filter: "drop-shadow(0 0 28px rgba(255, 220, 118, 0.92))" },
    { scale: 1, opacity: 0.9, filter: "drop-shadow(0 0 16px rgba(255, 206, 83, 0.58))", duration: 0.9, ease: "power2.out" }
  );
  gsap.fromTo(event?.currentTarget?.querySelector("span"),
    { scale: 1.45, opacity: 0.95, filter: "blur(5px) brightness(1.35)" },
    { scale: 1, opacity: 0.5, filter: "blur(4px)", duration: 0.9, ease: "elastic.out(1, 0.5)" }
  );
  createBurst(event?.currentTarget, 24);
  createSpiritTrail(event?.currentTarget, monster);
  if (speech) {
    gsap.fromTo(speech,
      { y: 12, opacity: 0, scale: 0.9, filter: "blur(5px)" },
      { y: 0, opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.48, ease: "back.out(1.55)" }
    );
  }
}

function clickBookButton(event) {
  const target = event?.currentTarget;
  if (!target) return;

  createBurst(target, 22);
  gsap.fromTo(target,
    { scale: 0.96, filter: "brightness(1.28) drop-shadow(0 0 34px rgba(255, 213, 103, 0.65))" },
    { scale: 1, filter: "brightness(1) drop-shadow(0 16px 28px rgba(0, 0, 0, 0.42))", duration: 0.45, ease: "elastic.out(1, 0.45)" }
  );
  gsap.fromTo(target.querySelector(".monster-dex__go-shine"),
    { x: "-120%", opacity: 0.1 },
    { x: "120%", opacity: 0, duration: 0.72, ease: "power2.out",
      onComplete: () => window.open("https://hon.hangame.com/info/game_guide/", "_blank", "noopener,noreferrer") }
  );
}

function startIdleMotion() {
  const root = sectionRef.value;
  if (!root) return;

  idleTweens.push(
    gsap.to(root.querySelector(".monster-dex__character"), {
      y: -8,
      rotate: 1.4,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    }),
    gsap.to(root.querySelector(".monster-dex__talisman--front"), {
      rotate: -9,
      y: -8,
      duration: 3.6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    }),
    gsap.to(root.querySelector(".monster-dex__bg"), {
      scale: 1.025,
      x: -10,
      duration: 18,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    })
  );

  root.querySelectorAll(".monster-dex__spirit").forEach((spirit, index) => {
    const float = 8;
    const duration = 3.2;
    const delay = (index / floatingMonsters.length) * duration;
    idleTweens.push(
      gsap.to(spirit, {
        y: -float,
        rotate: index % 2 === 0 ? 1.5 : -1.5,
        duration,
        delay,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })
    );
  });
}

function startAmbientDust() {
  const root = sectionRef.value;
  const container = root?.querySelector(".monster-dex__effects");
  if (!root || !container || dustTimer) return;

  dustTimer = window.setInterval(() => {
    const dust = document.createElement("span");
    dust.className = "monster-dex__dust";
    dust.style.left = `${38 + Math.random() * 58}%`;
    dust.style.top = `${70 + Math.random() * 28}%`;
    container.appendChild(dust);

    gsap.to(dust, {
      x: (Math.random() - 0.5) * 170,
      y: -220 - Math.random() * 260,
      opacity: 0,
      scale: 0.2,
      duration: 6 + Math.random() * 5,
      ease: "none",
      onComplete: () => dust.remove()
    });
  }, 360);
}

function startFireSparks() {
  const root = sectionRef.value;
  const fire = root?.querySelector("[data-fire='true']");
  const container = root?.querySelector(".monster-dex__effects");
  if (!root || !fire || !container || fireTimer) return;

  fireTimer = window.setInterval(() => {
    const rect = fire.getBoundingClientRect();
    const parent = root.getBoundingClientRect();
    const spark = document.createElement("span");
    spark.className = "monster-dex__fire-spark";
    spark.style.left = `${rect.left - parent.left + rect.width * (0.35 + Math.random() * 0.3)}px`;
    spark.style.top = `${rect.top - parent.top + rect.height * (0.45 + Math.random() * 0.28)}px`;
    container.appendChild(spark);

    gsap.to(spark, {
      x: (Math.random() - 0.5) * 44,
      y: -42 - Math.random() * 46,
      opacity: 0,
      scale: 0,
      duration: 0.8 + Math.random() * 0.45,
      ease: "power2.out",
      onComplete: () => spark.remove()
    });
  }, 220);
}

function startParallax() {
  const root = sectionRef.value;
  if (!root || handleMouseMove) return;

  handleMouseMove = (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 2;
    const y = (event.clientY / window.innerHeight - 0.5) * 2;
    gsap.to(root.querySelector(".monster-dex__bg"), {
      x: -x * 10,
      y: -y * 5,
      duration: 1.2,
      ease: "power2.out",
      overwrite: "auto"
    });
    gsap.to(root.querySelector(".monster-dex__spirits"), {
      x: x * 3,
      y: y * 2,
      duration: 1,
      ease: "power2.out",
      overwrite: "auto"
    });
    gsap.to(root.querySelector(".monster-dex__mist"), {
      x: x * 16,
      y: y * 10,
      duration: 1.4,
      ease: "power2.out",
      overwrite: "auto"
    });
  };

  window.addEventListener("mousemove", handleMouseMove);
}

function playIntro() {
  if (!introTimeline) return;
  introTimeline.restart();
}

onMounted(() => {
  const root = sectionRef.value;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!root) return;

  root.querySelector(".monster-dex__character-glow")?.style.setProperty("--monster-aura", selectedMonster.value.aura);

  introTimeline = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
  introTimeline
    .fromTo(root.querySelector(".monster-dex__bg"), { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: 1.5 })
    .add(() => createBurst(root.querySelector(".monster-dex__spirits"), 34), 0.32)
    .fromTo(root.querySelector(".monster-dex__left"), { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.75 }, 0.45)
    .fromTo(root.querySelector(".monster-dex__left h2"), { y: 38, opacity: 0 }, { y: 0, opacity: 1, duration: 0.72 }, 0.52)
    .fromTo(root.querySelectorAll(".monster-dex__feature"), { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.09, duration: 0.45, ease: "back.out(1.55)" }, 0.75)
    .fromTo(root.querySelector(".monster-dex__character"), { scale: 0.64, y: 54, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 0.88, ease: "elastic.out(1, 0.52)" }, 0.95)
    .fromTo(root.querySelector(".monster-dex__talisman--front"), { y: 36, opacity: 0, rotate: -18 }, { y: 0, opacity: 1, rotate: -8, duration: 0.7 }, 1.05)
    .fromTo(root.querySelectorAll(".monster-dex__spirit"), { y: 64, scale: 0.72, opacity: 0 }, { y: 0, scale: 1, opacity: 1, stagger: { each: 0.12, from: "random" }, duration: 0.78, ease: "back.out(1.2)" }, 1.3)
    .fromTo(root.querySelector(".monster-dex__bottom"), { y: 82, opacity: 0 }, { y: 0, opacity: 1, duration: 0.58 }, 2)
    .add(() => {
      if (!prefersReducedMotion && idleTweens.length === 0) {
        startIdleMotion();
        startAmbientDust();
        startFireSparks();
        startParallax();
      }
    }, 2.25);

  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) playIntro();
  }, { threshold: 0.48 });
  observer.observe(root);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  introTimeline?.kill();
  idleTweens.forEach((tween) => tween.kill());
  idleTweens = [];
  if (dustTimer) window.clearInterval(dustTimer);
  if (fireTimer) window.clearInterval(fireTimer);
  if (handleMouseMove) window.removeEventListener("mousemove", handleMouseMove);
});
</script>

<template>
  <section ref="sectionRef" class="section monster-dex" data-section="monster-dex" aria-labelledby="monster-dex-title">
    <img class="monster-dex__bg" :src="bgUrl" alt="" aria-hidden="true" loading="lazy" decoding="async" fetchpriority="low" />
    <div class="monster-dex__shade" aria-hidden="true" />
    <div class="monster-dex__mist" aria-hidden="true" />
    <div class="monster-dex__leaf-layer" aria-hidden="true">
      <span
        v-for="index in 12"
        :key="index"
        :style="{
          '--leaf-x': `${52 + ((index * 11) % 43)}%`,
          '--leaf-y': `${-10 - (index % 5) * 7}%`,
          '--leaf-size': `${10 + (index % 4) * 3}px`,
          '--leaf-delay': `${index * -0.72}s`,
          '--leaf-duration': `${12 + (index % 5) * 1.4}s`,
          '--leaf-drift': `${index % 2 === 0 ? 80 : -64}px`
        }"
      />
    </div>
    <div class="monster-dex__effects" aria-hidden="true" />

    <div class="monster-dex__left">
      <div class="monster-dex__index" aria-hidden="true">
        <strong>04</strong>
        <span>콘텐츠 소개</span>
      </div>
      <h2 id="monster-dex-title">요괴 도감</h2>
      <p class="monster-dex__subtitle">봉인된 요괴를 수집하라!</p>
      <p class="monster-dex__copy">다양한 귀와 혼을 모아 나만의 도감을 완성하세요.</p>

      <div class="monster-dex__features" aria-label="요괴 도감 주요 기능">
        <div v-for="feature in features" :key="feature.label" class="monster-dex__feature">
          <span>
            <img :src="feature.icon" alt="" aria-hidden="true" loading="lazy" />
          </span>
          <strong>{{ feature.label }}</strong>
        </div>
      </div>

      <div class="monster-dex__character">
        <div class="monster-dex__character-glow" aria-hidden="true" />
        <div class="monster-dex__energy-rise" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <span class="monster-dex__talisman-glow" aria-hidden="true" />
        <img class="monster-dex__talisman monster-dex__talisman--front" :src="talismanCardUrl" alt="" aria-hidden="true" loading="lazy" decoding="async" fetchpriority="low" />
        <img class="monster-dex__character-img" :src="selectedMonster.image" :alt="selectedMonster.name" loading="lazy" decoding="async" fetchpriority="low" />
        <div :key="selectedMonster.id" class="monster-dex__speech" :style="{ '--monster-aura': selectedMonster.aura }" aria-live="polite">
          <strong>{{ selectedMonster.name }}</strong>
          <span>{{ selectedMonster.message }}</span>
        </div>
        <div class="monster-dex__energy-front" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>

    <div class="monster-dex__spirits" aria-label="요괴 선택">
      <button
        v-for="monster in floatingMonsters"
        :key="monster.id"
        class="monster-dex__spirit"
        :class="{ 'is-selected': selectedId === monster.id }"
        type="button"
        :style="{
          '--spirit-x': `${monster.x}%`,
          '--spirit-y': `${monster.y}%`,
          '--spirit-size': `${monster.size}px`,
          '--spirit-aura': monster.aura,
          '--sprite-scale': monster.spriteScale
        }"
        :data-fire="monster.fire ? 'true' : 'false'"
        @click="selectMonster(monster, $event)"
      >
        <span aria-hidden="true" />
        <img :src="monster.image" :alt="monster.name" loading="lazy" />
      </button>
    </div>

    <div class="monster-dex__bottom">
      <div class="monster-dex__actions">
        <button
          type="button"
          class="monster-dex__go-button"
          aria-label="도감 정보 바로가기"
          @click="clickBookButton"
        >
          <span class="monster-dex__go-crop">
            <img :src="bookGoButtonUrl" alt="도감 정보 바로가기" loading="lazy" decoding="async" fetchpriority="low" />
            <span class="monster-dex__go-shine" aria-hidden="true" />
          </span>
        </button>
      </div>
    </div>
  </section>
</template>
