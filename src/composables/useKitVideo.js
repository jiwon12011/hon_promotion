import { onBeforeUnmount, ref } from "vue";

export function useKitVideo() {
  const videoRef = ref(null);

  function play() {
    videoRef.value?.play?.().catch(() => {});
  }

  function pause() {
    videoRef.value?.pause?.();
  }

  onBeforeUnmount(() => {
    pause();
  });

  return {
    videoRef,
    play,
    pause
  };
}
