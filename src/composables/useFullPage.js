import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const currentIndex = ref(0);
const isMoving = ref(false);
let sections = [];
let navButtons = [];
let sectionTriggers = [];
let touchStartY = 0;
let touchDeltaY = 0;
let resizeTimer;
let wheelAccumulatedDelta = 0;
let wheelResetTimer;

function clampIndex(index) {
  return Math.max(0, Math.min(index, sections.length - 1));
}

function moveTo(index) {
  if (!sections.length || isMoving.value) return;

  const nextIndex = clampIndex(index);
  if (nextIndex === currentIndex.value) {
    return;
  }

  isMoving.value = true;
  currentIndex.value = nextIndex;

  gsap.to(window, {
    duration: 0.72,
    scrollTo: { y: sections[nextIndex], autoKill: false },
    ease: "power2.inOut",
    onComplete: () => {
      window.scrollTo({ top: sections[nextIndex].offsetTop, left: 0, behavior: "auto" });
      window.setTimeout(() => {
        isMoving.value = false;
      }, 48);
    }
  });
}

function handleWheel(event) {
  event.preventDefault();
  if (isMoving.value) return;

  wheelAccumulatedDelta += event.deltaY;
  window.clearTimeout(wheelResetTimer);
  wheelResetTimer = window.setTimeout(() => {
    wheelAccumulatedDelta = 0;
  }, 90);

  if (Math.abs(wheelAccumulatedDelta) < 54) return;
  const direction = wheelAccumulatedDelta > 0 ? 1 : -1;
  wheelAccumulatedDelta = 0;
  moveTo(currentIndex.value + direction);
}

function handleKeydown(event) {
  const nextKeys = ["ArrowDown", "PageDown", " "];
  const prevKeys = ["ArrowUp", "PageUp"];

  if (nextKeys.includes(event.key)) {
    event.preventDefault();
    moveTo(currentIndex.value + 1);
  }

  if (prevKeys.includes(event.key)) {
    event.preventDefault();
    moveTo(currentIndex.value - 1);
  }
}

function handleTouchStart(event) {
  touchStartY = event.touches[0]?.clientY ?? 0;
  touchDeltaY = 0;
}

function handleTouchMove(event) {
  const currentY = event.touches[0]?.clientY ?? touchStartY;
  touchDeltaY = touchStartY - currentY;

  if (Math.abs(touchDeltaY) > 12) {
    event.preventDefault();
  }
}

function handleTouchEnd(event) {
  const touchEndY = event.changedTouches[0]?.clientY ?? 0;
  const delta = touchDeltaY || touchStartY - touchEndY;

  if (Math.abs(delta) < 50) return;
  moveTo(currentIndex.value + (delta > 0 ? 1 : -1));
}

function refreshSections() {
  sections = Array.from(document.querySelectorAll(".section"));
  navButtons = Array.from(document.querySelectorAll(".section-nav__button"));
  setupSectionTriggers();
}

function setupSectionTriggers() {
  sectionTriggers.forEach((trigger) => trigger.kill());
  sectionTriggers = [];
  navButtons.forEach((button) => button.style.setProperty("--section-progress", "0"));

  sections.forEach((section, index) => {
    sectionTriggers.push(
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onEnter: () => {
          currentIndex.value = index;
        },
        onEnterBack: () => {
          currentIndex.value = index;
        },
        onUpdate: (self) => {
          const button = navButtons[index];
          if (!button) return;
          button.style.setProperty("--section-progress", self.progress.toFixed(3));
        }
      })
    );
  });

  ScrollTrigger.refresh();
}

function nearestSectionIndex() {
  if (!sections.length) return 0;
  const scrollY = window.scrollY;
  let nearestIndex = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;

  sections.forEach((section, index) => {
    const distance = Math.abs(section.offsetTop - scrollY);
    if (distance < nearestDistance) {
      nearestIndex = index;
      nearestDistance = distance;
    }
  });

  return clampIndex(nearestIndex);
}

function snapToCurrentSection(animated = false) {
  if (!sections.length) return;
  const nextIndex = nearestSectionIndex();
  currentIndex.value = nextIndex;
  navButtons.forEach((button, index) => {
    button.style.setProperty("--section-progress", index === nextIndex ? "1" : "0");
  });

  if (animated) {
    gsap.to(window, {
      duration: 0.48,
      scrollTo: { y: sections[nextIndex], autoKill: false },
      ease: "power2.out"
    });
    return;
  }

  window.scrollTo({ top: sections[nextIndex].offsetTop, left: 0, behavior: "auto" });
}

function handleResize() {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => {
    refreshSections();
    snapToCurrentSection();
  }, 120);
}

export function useFullPage() {
  onMounted(async () => {
    await nextTick();
    refreshSections();
    requestAnimationFrame(snapToCurrentSection);
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("resize", handleResize);
  });

  onBeforeUnmount(() => {
    window.clearTimeout(resizeTimer);
    window.clearTimeout(wheelResetTimer);
    sectionTriggers.forEach((trigger) => trigger.kill());
    sectionTriggers = [];
    window.removeEventListener("wheel", handleWheel);
    window.removeEventListener("keydown", handleKeydown);
    window.removeEventListener("touchstart", handleTouchStart);
    window.removeEventListener("touchmove", handleTouchMove);
    window.removeEventListener("touchend", handleTouchEnd);
    window.removeEventListener("resize", handleResize);
  });

  return {
    currentIndex,
    goTo: moveTo,
    refreshSections
  };
}
