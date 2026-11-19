/**
 * Efeitos visuais: partículas de fundo, brilho que segue o cursor, inclinação
 * sutil dos cards, botões magnéticos e parallax do hero.
 *
 * Tudo aqui é opcional por natureza: se algo não existir na página, a função
 * simplesmente não faz nada. Movimento reduzido é respeitado em todos os casos.
 */

const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
const mqFine = window.matchMedia("(hover: hover) and (pointer: fine)");

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/* -------------------------------------------------------------------------- */
/* Partículas                                                                  */
/* -------------------------------------------------------------------------- */
export function setupParticles() {
  const canvas = document.getElementById("particles");
  if (!canvas) return () => {};

  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return () => {};

  const reduced = mqReduce.matches;
  if (reduced) {
    canvas.hidden = true;
    return () => {};
  }

  const mobile = window.matchMedia("(max-width: 760px)").matches;
  // Mais partículas: fundo vivo, ainda leve o bastante para 60 fps no celular.
  const count = mobile ? 26 : 58;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let width = 0;
  let height = 0;
  let particles = [];
  let frame = 0;
  let running = false;
  let lastTime = performance.now();

  // Reação leve ao cursor (somente ponteiro fino).
  const pointer = { x: 0, y: 0, active: false };

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 0.6 + Math.random() * 1.5,
      vx: (Math.random() - 0.5) * 0.08,
      vy: -0.03 - Math.random() * 0.1,
      alpha: 0.1 + Math.random() * 0.3,
      hue: Math.random() > 0.76 ? "cyan" : "blue",
    }));
  };

  const draw = (time) => {
    if (!running) return;

    const delta = clamp((time - lastTime) / 16.67, 0.4, 2.4);
    lastTime = time;
    context.clearRect(0, 0, width, height);

    for (const particle of particles) {
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;

      if (pointer.active && mqFine.matches) {
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 130 && distance > 0.001) {
          const force = (1 - distance / 130) * 0.24;
          particle.x += (dx / distance) * force;
          particle.y += (dy / distance) * force;
        }
      }

      if (particle.y < -8) {
        particle.y = height + 8;
        particle.x = Math.random() * width;
      }
      if (particle.x < -8) particle.x = width + 8;
      if (particle.x > width + 8) particle.x = -8;

      // Linha discreta entre partículas próximas.
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle =
        particle.hue === "cyan"
          ? `rgba(130, 230, 245, ${particle.alpha})`
          : `rgba(150, 186, 255, ${particle.alpha})`;
      context.fill();
    }

    frame = window.requestAnimationFrame(draw);
  };

  const start = () => {
    if (running || document.hidden) return;
    running = true;
    lastTime = performance.now();
    frame = window.requestAnimationFrame(draw);
  };

  const stop = () => {
    running = false;
    window.cancelAnimationFrame(frame);
  };

  const onVisibility = () => {
    if (document.hidden) stop();
    else start();
  };

  const onPointerMove = (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
  };

  const onPointerLeave = () => {
    pointer.active = false;
  };

  resize();
  start();

  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);

  if (mqFine.matches) {
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onPointerLeave);
  }

  return () => {
    stop();
    window.removeEventListener("resize", resize);
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("pointermove", onPointerMove);
    document.documentElement.removeEventListener("mouseleave", onPointerLeave);
  };
}

/* -------------------------------------------------------------------------- */
/* Brilho que segue o cursor nos cards de vidro                                */
/* -------------------------------------------------------------------------- */
export function setupSpotlight() {
  if (!mqFine.matches) return;

  const selector = ".spotlight";

  const onMove = (event) => {
    const card = event.target.closest(selector);
    if (!card) return;

    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    card.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  document.addEventListener("pointermove", onMove, { passive: true });
}

/* -------------------------------------------------------------------------- */
/* Inclinação 3D sutil nos cards da biblioteca                                */
/* -------------------------------------------------------------------------- */
export function setupTilt() {
  if (!mqFine.matches || mqReduce.matches) return;

  const onMove = (event) => {
    const card = event.target.closest("[data-game-card]");
    if (!card) return;

    const inner = card.querySelector(".game-card__inner");
    if (!inner) return;

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    inner.style.setProperty("--tilt-y", `${(x * 6).toFixed(2)}deg`);
    inner.style.setProperty("--tilt-x", `${(-y * 6).toFixed(2)}deg`);
    inner.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    inner.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  const onLeave = (event) => {
    const card = event.target.closest("[data-game-card]");
    if (!card) return;
    const inner = card.querySelector(".game-card__inner");
    if (!inner) return;
    inner.style.removeProperty("--tilt-x");
    inner.style.removeProperty("--tilt-y");
  };

  document.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerout", onLeave, { passive: true });
}

/* -------------------------------------------------------------------------- */
/* Botões magnéticos (somente desktop)                                         */
/* -------------------------------------------------------------------------- */
export function setupMagnetic() {
  if (!mqFine.matches || mqReduce.matches) return;

  document.querySelectorAll("[data-magnetic]").forEach((element) => {
    const strength = 0.22;

    const onMove = (event) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * strength;
      const y = (event.clientY - rect.top - rect.height / 2) * strength;
      element.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
    };

    const reset = () => {
      element.style.transform = "";
    };

    element.addEventListener("pointermove", onMove);
    element.addEventListener("pointerleave", reset);
    element.addEventListener("blur", reset);
  });
}

/* -------------------------------------------------------------------------- */
/* Hero: vídeo, fallback e parallax                                            */
/* -------------------------------------------------------------------------- */
export function setupHero() {
  const hero = document.getElementById("inicio");
  if (!hero) return;

  const video = document.getElementById("heroVideo");
  const media = hero.querySelector("[data-hero-media]");

  if (video) {
    if (mqReduce.matches) {
      video.pause();
      video.removeAttribute("autoplay");
    }

    const markReady = () => {
      if (video.videoWidth > 0) hero.classList.add("is-video-ready");
    };

    const markFailed = () => {
      hero.classList.remove("is-video-ready");
      if (media) media.style.display = "none";
      video.remove?.();
    };

    video.addEventListener("canplay", markReady, { once: true });
    video.addEventListener("loadeddata", markReady, { once: true });
    video.addEventListener("error", markFailed, { once: true });

    if (video.readyState >= 2) markReady();

    // Alguns navegadores só tocam depois de um gesto. tries silenciosos.
    const tryPlay = () => {
      if (mqReduce.matches) {
        video.pause();
        return;
      }
      const promise = video.play();
      if (promise?.catch) promise.catch(() => {});
    };

    video.addEventListener("canplay", tryPlay);

    // Pausa fora da tela e volta ao reaparecer.
    if ("IntersectionObserver" in window) {
      const videoObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) tryPlay();
          else video.pause();
        },
        { threshold: 0.05 },
      );
      videoObserver.observe(hero);
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) video.pause();
      else if (hero.getBoundingClientRect().bottom > 0) tryPlay();
    });
  }

  // Parallax controlado por requestAnimationFrame (sem listener pesado de scroll).
  if (mqReduce.matches) return;

  let ticking = false;

  const update = () => {
    ticking = false;
    const rect = hero.getBoundingClientRect();
    const height = hero.offsetHeight || window.innerHeight;
    const progress = clamp(-rect.top / height, 0, 1);

    hero.style.setProperty("--hero-progress", progress.toFixed(4));
    hero.classList.toggle("is-scrolled", progress > 0.06);
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();
}
