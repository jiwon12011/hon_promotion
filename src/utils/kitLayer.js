export function kitLayer({ onClose } = {}) {
  let closeHandler = onClose;

  function open() {
    document.documentElement.classList.add("is-layer-open");
  }

  function close() {
    document.documentElement.classList.remove("is-layer-open");
    closeHandler?.();
  }

  return {
    open,
    close
  };
}
