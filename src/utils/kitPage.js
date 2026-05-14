export const kitPage = {
  to(target) {
    const section = typeof target === "string" ? document.querySelector(target) : target;
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};
