(function () {
  const noBtn = document.getElementById("no");
  const yesBtn = document.getElementById("yes");
  const result = document.getElementById("result");
  const question = document.getElementById("question");
  const card = document.querySelector(".card");

  // Names come from config.js (falls back to defaults if missing).
  const cfg = typeof CONFIG === "object" && CONFIG ? CONFIG : {};
  const recipientName = cfg.recipientName || "Amna";
  const askerName = cfg.askerName || "Adil";

  const askerMessage = askerName + " is a very lucky guy ;)";
  question.textContent = recipientName + ", can I take you out tonight?";

  let scale = 1;
  const SHRINK = 0.8; // 20% smaller each click
  const MIN_SCALE = 0.30; // below this -> poof (takes ~6 taps)
  let lastHit = 0; // de-dupe touchstart + the click it also fires

  // Move the No button to a random spot, kept fully inside the white card.
  // The button is absolutely positioned within .card, so coordinates are
  // card-local (0,0 = card's inner top-left). transform-origin:top-left
  // means left/top match the visible box, so we clamp with the scaled size.
  function dodge() {
    const pad = 10;

    if (!noBtn.classList.contains("loose")) {
      // Pin it at its current spot (relative to the card) before it roams.
      const startLeft = noBtn.offsetLeft;
      const startTop = noBtn.offsetTop;
      noBtn.classList.add("loose");
      noBtn.style.left = startLeft + "px";
      noBtn.style.top = startTop + "px";
      void noBtn.offsetWidth; // reflow so the next move animates
    }

    const w = noBtn.offsetWidth * scale;
    const h = noBtn.offsetHeight * scale;
    const maxLeft = Math.max(pad, card.clientWidth - w - pad);
    const maxTop = Math.max(pad, card.clientHeight - h - pad);
    const left = pad + Math.random() * (maxLeft - pad);
    const top = pad + Math.random() * (maxTop - pad);

    noBtn.style.left = left + "px";
    noBtn.style.top = top + "px";
  }

  function showResult(text) {
    result.textContent = text;
    result.hidden = false;
    result.classList.add("show");
  }

  function poof() {
    noBtn.classList.add("poof");
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      noBtn.remove();
      // Cheeky placeholder until she says yes.
      if (!result.classList.contains("show")) showResult("hehe");
    };
    // animationend normally fires; the timeout guarantees it even if not.
    noBtn.addEventListener("animationend", finish, { once: true });
    setTimeout(finish, 600);
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
    showResult(askerMessage);

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
