// Runs only inside the isolated prototype iframe.
(() => {
  const id = location.pathname.split("/").pop().replace(".html", "");
  const params = new URLSearchParams(location.search);
  const applySettings = (settings) => {
    const root = document.documentElement;
    root.dataset.theme = "light";
    root.dataset.accent = ["blue", "purple", "black"].includes(settings.accent) ? settings.accent : "blue";
    root.dataset.locale = settings.lang === "en" ? "en" : "zh";
    root.dataset.motion = settings.motion === "none" ? "none" : "auto";
    window.forgeSetLocale?.(root.dataset.locale);
    if (root.dataset.motion === "none") document.getAnimations().forEach(animation => {
      try { animation.finish(); } catch { animation.cancel(); }
    });
  };
  applySettings(Object.fromEntries(params));
  window.addEventListener("message", event => {
    if (event.source === parent && event.data?.type === "forge-settings") applySettings(event.data);
  });
  window.addEventListener("DOMContentLoaded", () => {
    applySettings(Object.fromEntries(params));
    let lastHeight = 0;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const root = document.querySelector(".ux, .feature");
      if (!root) return;
      const rect = root.getBoundingClientRect();
      const height = Math.max(240, Math.ceil(Math.max(rect.height, root.scrollHeight) + 48));
      if (height !== lastHeight) {
        lastHeight = height;
        parent.postMessage({ type: "forge-embed-size", id, height }, "*");
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    new ResizeObserver(schedule).observe(document.body);
    new MutationObserver(schedule).observe(document.body, { subtree: true, childList: true });
    window.addEventListener("resize", schedule);
    document.fonts.ready.then(schedule);
    schedule();
    parent.postMessage({ type: "forge-ready", id }, "*");
  });
})();
