export function createKitVideo(videoElement) {
  return {
    play() {
      videoElement?.play?.().catch(() => {});
    },
    pause() {
      videoElement?.pause?.();
    },
    reset() {
      if (!videoElement) return;
      videoElement.pause();
      videoElement.currentTime = 0;
    }
  };
}
