/* ============================================================
   SPACEX69420 // script.js
   ------------------------------------------------------------
   01. Loader sequence (text + progress + pulse explosion)
   02. Loader particle canvas
   03. Ambient ember canvas (full-page)
   04. Hero parallax (scroll + mouse)
   05. Reveal-on-scroll (IntersectionObserver)
   06. Contract copy button
   07. Nav scroll state
   ============================================================ */

(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* 01. Loader sequence ----------------------------------------- */
  const loader = $("#loader");
  const loaderText = $("#loaderText");
  const loaderFill = $("#loaderFill");
  const loaderCode = $("#loaderCode");
  const loaderPulse = $("#loaderPulse");

  const loaderSteps = [
    { p: 8, text: "STARMAN", code: "" },
    { p: 22, text: "SPACEX", code: "" },
    { p: 38, text: "ROADSTER", code: "" },
    { p: 55, text: "STARMAN", code: "" },
    { p: 72, text: "ORBIT THE EARTH", code: "" },
    { p: 88, text: "TO THE MARS", code: "" },
    { p: 100, text: "FALCON HEAVY", code: "" },
  ];

  let stepIdx = 0;
  const stepDelay = prefersReducedMotion ? 90 : 380;

  const runLoaderStep = () => {
    if (stepIdx >= loaderSteps.length) {
      // Finish: pulse + remove
      setTimeout(() => {
        loaderPulse.classList.add("is-flash");
        setTimeout(() => {
          loader.classList.add("is-done");
          // Free up the body
          document.body.style.overflow = "";
        }, 480);
      }, 300);
      return;
    }
    const s = loaderSteps[stepIdx];
    loaderText.textContent = s.text;
    loaderCode.textContent = s.code;
    loaderFill.style.width = s.p + "%";
    stepIdx++;
    setTimeout(runLoaderStep, stepDelay);
  };

  document.body.style.overflow = "hidden";
  setTimeout(runLoaderStep, 300);

  /* 02. Loader particle canvas --------------------------------- */
  const lc = $("#loaderParticles");
  if (lc) {
    const ctx = lc.getContext("2d");
    let lw = 0,
      lh = 0;
    const particles = [];
    const PCOUNT = prefersReducedMotion ? 30 : 90;

    const resizeLC = () => {
      lw = lc.width = window.innerWidth * window.devicePixelRatio;
      lh = lc.height = window.innerHeight * window.devicePixelRatio;
      lc.style.width = window.innerWidth + "px";
      lc.style.height = window.innerHeight + "px";
    };
    resizeLC();
    window.addEventListener("resize", resizeLC);

    for (let i = 0; i < PCOUNT; i++) {
      particles.push({
        x: Math.random() * lw,
        y: Math.random() * lh,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.2 - Math.random() * 0.6,
        r: 0.6 + Math.random() * 1.4,
        a: 0.3 + Math.random() * 0.6,
        hue: 18 + Math.random() * 18, // 18-36 (orange band)
      });
    }

    const drawLoader = () => {
      if (loader.classList.contains("is-done")) return;
      ctx.clearRect(0, 0, lw, lh);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) {
          p.y = lh + 10;
          p.x = Math.random() * lw;
        }
        if (p.x < -10) p.x = lw + 10;
        if (p.x > lw + 10) p.x = -10;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 8);
        grad.addColorStop(0, `hsla(${p.hue}, 100%, 60%, ${p.a})`);
        grad.addColorStop(1, `hsla(${p.hue}, 100%, 50%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 8, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(drawLoader);
    };
    drawLoader();
  }

  /* 03. Ambient ember canvas (full page) ----------------------- */
  const ec = $("#embersCanvas");
  if (ec && !prefersReducedMotion) {
    const ctx = ec.getContext("2d");
    let ew = 0,
      eh = 0;
    const embers = [];
    const ECOUNT = Math.min(70, Math.floor(window.innerWidth / 18));

    const resizeEC = () => {
      ew = ec.width = window.innerWidth * window.devicePixelRatio;
      eh = ec.height = window.innerHeight * window.devicePixelRatio;
      ec.style.width = window.innerWidth + "px";
      ec.style.height = window.innerHeight + "px";
    };
    resizeEC();
    window.addEventListener("resize", resizeEC);

    for (let i = 0; i < ECOUNT; i++) {
      embers.push({
        x: Math.random() * ew,
        y: Math.random() * eh,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -0.15 - Math.random() * 0.5,
        r: 0.4 + Math.random() * 1.2,
        a: 0.15 + Math.random() * 0.5,
        hue: 18 + Math.random() * 22,
        twinkle: Math.random() * Math.PI * 2,
      });
    }

    const drawEmbers = () => {
      ctx.clearRect(0, 0, ew, eh);
      for (const p of embers) {
        p.x += p.vx;
        p.y += p.vy;
        p.twinkle += 0.04;
        if (p.y < -10) {
          p.y = eh + 10;
          p.x = Math.random() * ew;
        }
        if (p.x < -10) p.x = ew + 10;
        if (p.x > ew + 10) p.x = -10;
        const alpha = p.a * (0.6 + 0.4 * Math.sin(p.twinkle));
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 10);
        grad.addColorStop(0, `hsla(${p.hue}, 100%, 60%, ${alpha})`);
        grad.addColorStop(1, `hsla(${p.hue}, 100%, 50%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 10, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(drawEmbers);
    };
    drawEmbers();
  }

  /* 04. Hero parallax (scroll + mouse) — layered ---------------- */
  const hero = $("#hero");
  const layers = $$(".layer[data-depth]", hero || document);
  if (hero && layers.length && !prefersReducedMotion) {
    let mx = 0,
      my = 0;
    let scrollY = 0;
    let raf = null;

    const onMove = (e) => {
      const rect = hero.getBoundingClientRect();
      mx = (e.clientX - rect.left) / rect.width - 0.5;
      my = (e.clientY - rect.top) / rect.height - 0.5;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onScroll = () => {
      scrollY = window.scrollY;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const apply = () => {
      raf = null;
      for (const layer of layers) {
        const d = parseFloat(layer.dataset.depth) || 0;
        const tx = mx * d * 60;
        const ty = my * d * 40 + scrollY * d * 0.6;
        layer.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      }
    };

    hero.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    // Reset on mouse leave so layers settle
    hero.addEventListener("mouseleave", () => {
      mx = 0;
      my = 0;
      if (!raf) raf = requestAnimationFrame(apply);
    });
    apply();
  }

  /* 05. Reveal-on-scroll --------------------------------------- */
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  /* 06. Contract copy button ----------------------------------- */
  const copyBtn = $("#copyBtn");
  const ca = $("#ca");
  const copyLabel = $("#copyLabel");
  if (copyBtn && ca) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(ca.textContent.trim());
        copyLabel.textContent = "COPIED ✓";
        copyBtn.style.borderColor = "var(--mars)";
        copyBtn.style.color = "var(--ember)";
        setTimeout(() => {
          copyLabel.textContent = "COPY";
          copyBtn.style.borderColor = "";
          copyBtn.style.color = "";
        }, 1600);
      } catch (err) {
        copyLabel.textContent = "ERR";
        setTimeout(() => (copyLabel.textContent = "COPY"), 1200);
      }
    });
  }

  /* 07. Nav scroll state --------------------------------------- */
  const nav = $(".nav");
  if (nav) {
    let last = 0;
    window.addEventListener(
      "scroll",
      () => {
        const y = window.scrollY;
        if (y > 24)
          nav.style.background =
            "linear-gradient(180deg, rgba(5,5,5,.95), rgba(5,5,5,.65))";
        else nav.style.background = "";
        last = y;
      },
      { passive: true }
    );
  }
})();
