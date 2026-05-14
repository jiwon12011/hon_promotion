export const kitPreorder = {
  open() {
    document.dispatchEvent(new CustomEvent("kit:preorder-open"));
  },
  complete(payload = {}) {
    document.dispatchEvent(new CustomEvent("kit:preorder-complete", { detail: payload }));
  }
};
