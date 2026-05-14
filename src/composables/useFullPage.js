import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

const currentIndex = ref(0);
const isMoving = ref(false);
let sections = [];
let touchStartY = 0;
let resizeTimer;

function clampIndex(index) {
  return Math.max(0, Math.min(index, sections.length - 1));
}

function moveTo(index) {
  if (!sections.length || isMoving.value) return;

  const nextIndex = clampIndex(index);
  if (nextIndex === currentIndex.value) return;

  isMoving.value = true;
  currentIndex.value = nextIndex;

  gsap.to(window, {
    duration: 0.7,
    scrollTo: { y: sections[nextIndex], autoKill: false },
    ease: "power3.inOut",
    onComplete: () => {
      window.setTimeout(() => {
        isMoving.value = false;
      }, 80);
    }
  });
}

function handleWheel(event) {
  if (Math.abs(event.deltaY) < 30 || isMoving.value) return;
  event.preventDefault();
  moveTo(currentIndex.value + (event.deltaY > 0 ? 1 : -1));
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
}

function handleTouchEnd(event) {
  const touchEndY = event.changedTouches[0]?.clientY ?? 0;
  const delta = touchStartY - touchEndY;

  if (Math.abs(delta) < 50) return;
  moveTo(currentIndex.value + (delta > 0 ? 1 : -1));
}

function refreshSections() {
  sections = Array.from(document.querySelectorAll(".section"));
}

function nearestSectionIndex() {
  if (!sections.length) return 0;
  const viewportHeight = window.innerHeight || sections[0].offsetHeight || 1;
  return clampIndex(Math.round(window.scrollY / viewportHeight));
}

function snapToCurrentSection() {
  if (!sections.length) return;
  const nextIndex = nearestSectionIndex();
  currentIndex.value = nextIndex;
  window.scrollTo({ top: sections[nextIndex].offsetTop, left: 0 });
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
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("resize", handleResize);
  });

  onBeforeUnmount(() => {
    window.clearTimeout(resizeTimer);
    window.removeEventListener("wheel", handleWheel);
    window.removeEventListener("keydown", handleKeydown);
    window.removeEventListener("touchstart", handleTouchStart);
    window.removeEventListener("touchend", handleTouchEnd);
    window.removeEventListener("resize", handleResize);
  });

  return {
    currentIndex,
    goTo: moveTo,
    refreshSections
  };
}
