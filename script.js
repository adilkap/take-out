(function () {
  const noBtn = document.getElementById("no");
  const yesBtn = document.getElementById("yes");
  const result = document.getElementById("result");
  const question = document.getElementById("question");

  // Names come from config.js (falls back to defaults if missing).
  const cfg = typeof CONFIG === "object" && CONFIG ? CONFIG : {};
  const recipientName = cfg.recipientName || "Amna";
  const askerName = cfg.askerName || "Adil";

  question.textContent = recipientName + ", can I take you out tonight?";
  result.textContent = askerName + " is a very lucky guy ;)";

  let scale = 1;
  const SHRINK = 0.8; // 20% smaller each click
  const MIN_SCALE = 0.30; // below this -> poof (takes ~6 taps)
  let lastHit = 0; // de-dupe touchstart + the click it also fires

  // Move the No button to a random spot fully inside the viewport.
  function dodge() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const pad = 12;

    // Detach from layout the first time so it can roam freely.
    if (!noBtn.classList.contains("loose")) {
      const rect = noBtn.getBoundingClientRect();
      noBtn.classList.add("loose");
      noBtn.style.top = rect.top + "px";
      noBtn.style.left = rect.left + "px";
      void noBtn.offsetWidth; // reflow so the next move animates
    }

    // getBoundingClientRect reflects the current (scaled) size, so the
    // clamp below keeps the whole button inside the visible viewport.
    const rect = noBtn.getBoundingClientRect();
    const maxLeft = Math.max(pad, vw - rect.width - pad);
    const maxTop = Math.max(pad, vh - rect.height - pad);
    const left = pad + Math.random() * (maxLeft - pad);
    const top = pad + Math.random() * (maxTop - pad);

    noBtn.style.left = left + "px";
    noBtn.style.top = top + "px";
  }

  function poof() {
    noBtn.classList.add("poof");
    noBtn.addEventListener("animationend", () => noBtn.remove(), { once: true });
  }

  function onNo(e) {
    e.preventDefault();
    // Ignore the click that iOS fires right after a touchstart.
    const now = Date.now();
    if (now - lastHit < 400) return;
    lastHit = now;

    scale *= SHRINK;
    noBtn.style.transform = "scale(" + scale + ")";

    if (scale <= MIN_SCALE) {
      poof();
      return;
    }
    dodge();
  }

  noBtn.addEventListener("click", onNo);
  noBtn.addEventListener("touchstart", onNo, { passive: false });
  // On desktop, also dart away when the cursor gets close — extra cheeky.
  noBtn.addEventListener("mouseenter", () => {
    if (noBtn.classList.contains("loose") && scale > MIN_SCALE) dodge();
  });

  function celebrate() {
    result.hidden = false;
    // next frame so the transition runs
    requestAnimationFrame(() => result.classList.add("show"));

    if (typeof confetti !== "function") return;

    const colors = ["#ffb6d1", "#e6dcff", "#c9f5e0", "#ff9aa8", "#fff7fb"];
    const burst = () =>
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors,
        scalar: 1.1,
      });
    burst();
    setTimeout(burst, 250);
    setTimeout(burst, 550);

    // gentle ongoing rain for a couple seconds
    const end = Date.now() + 2200;
    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }

  yesBtn.addEventListener("click", celebrate);
})();
