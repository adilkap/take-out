(function () {
  const noBtn = document.getElementById("no");
  const yesBtn = document.getElementById("yes");
  const result = document.getElementById("result");

  let scale = 1;
  const SHRINK = 0.8; // 20% smaller each click
  const MIN_SCALE = 0.28; // below this -> poof

  // Move the No button to a random spot fully inside the viewport.
  function dodge() {
    // Detach from layout the first time so it can roam freely.
    if (!noBtn.classList.contains("loose")) {
      const rect = noBtn.getBoundingClientRect();
      noBtn.classList.add("loose");
      noBtn.style.top = rect.top + "px";
      noBtn.style.left = rect.left + "px";
      // force reflow so the transition applies on the next move
      void noBtn.offsetWidth;
    }

    const rect = noBtn.getBoundingClientRect();
    const pad = 8;
    const maxLeft = Math.max(pad, window.innerWidth - rect.width - pad);
    const maxTop = Math.max(pad, window.innerHeight - rect.height - pad);
    const left = pad + Math.random() * (maxLeft - pad);
    const top = pad + Math.random() * (maxTop - pad);

    noBtn.style.left = left + "px";
    noBtn.style.top = top + "px";
  }

  function poof() {
    noBtn.classList.add("poof");
    noBtn.addEventListener(
      "animationend",
      () => noBtn.remove(),
      { once: true }
    );
  }

  function onNo(e) {
    e.preventDefault();
    scale *= SHRINK;
    noBtn.style.transform = "scale(" + scale + ")";

    if (scale <= MIN_SCALE) {
      poof();
      return;
    }
    dodge();
  }

  // Pointer + touch so it dodges reliably on iPhone Safari.
  noBtn.addEventListener("click", onNo);
  noBtn.addEventListener("touchstart", onNo, { passive: false });

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
