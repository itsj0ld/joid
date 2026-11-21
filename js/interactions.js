/**
 * Interações: cabeçalho, menu acessível, cópia, estante arrastável,
 * filtros das alternativas e prévia dos projetos.
 */

const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
const mqFine = window.matchMedia("(hover: hover) and (pointer: fine)");

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const pad = (number) => String(number).padStart(2, "0");

/* -------------------------------------------------------------------------- */
/* Cabeçalho, progresso de scroll e voltar ao topo                            */
/* -------------------------------------------------------------------------- */
export function setupScrollUI() {
  const header = document.querySelector("[data-header]");
  const timelineSupported = window.CSS?.supports?.("animation-timeline: scroll()");
  const backToTop = document.getElementById("backToTop");

  let ticking = false;

  const update = () => {
    ticking = false;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const ratio = clamp(scrollTop / max, 0, 1);

    if (!timelineSupported) {
      document.documentElement.style.setProperty("--scroll-progress", ratio.toFixed(4));
    }

    header?.classList.toggle("is-scrolled", scrollTop > 8);
    backToTop?.classList.toggle("is-visible", scrollTop > 600);
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  backToTop?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: mqReduce.matches ? "auto" : "smooth",
    });
  });

  update();
}

/* -------------------------------------------------------------------------- */
/* Menu acessível (armadilha de foco, Escape, inert)                          */
/* -------------------------------------------------------------------------- */
export function setupMenu() {
  const toggle = document.getElementById("menuToggle");
  const menu = document.getElementById("siteMenu");
  const main = document.getElementById("conteudo");
  const footer = document.getElementById("final");
  const backToTop = document.getElementById("backToTop");
  const wordmark = document.querySelector(".wordmark");
  const headerLink = document.querySelector(".header-link");

  if (!toggle || !menu) return;

  const focusableSelector =
    'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

  let isOpen = false;
  let lastFocused = null;

  const setBackgroundInert = (inert) => {
    [main, footer, backToTop, wordmark, headerLink].forEach((element) => {
      if (element) element.inert = inert;
    });
  };

  const positionMenu = () => {
    const rect = toggle.getBoundingClientRect();
    menu.style.setProperty("--menu-x", `${rect.left + rect.width / 2}px`);
    menu.style.setProperty("--menu-y", `${rect.top + rect.height / 2}px`);
  };

  const open = () => {
    if (isOpen) return;
    isOpen = true;
    lastFocused = document.activeElement;

    positionMenu();
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Fechar menu");
    document.body.classList.add("menu-open");
    setBackgroundInert(true);

    const first = menu.querySelector(focusableSelector);
    window.setTimeout(() => first?.focus(), 70);
  };

  const close = ({ restoreFocus = true } = {}) => {
    if (!isOpen) return;
    isOpen = false;

    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
    document.body.classList.remove("menu-open");
    setBackgroundInert(false);

    if (restoreFocus) {
      if (lastFocused instanceof HTMLElement && lastFocused !== document.body) {
        lastFocused.focus();
      } else {
        toggle.focus();
      }
    }
  };

  toggle.addEventListener("click", () => {
    if (isOpen) close();
    else open();
  });

  menu.addEventListener("click", (event) => {
    const link = event.target.closest("a[href^='#']");
    if (!link) return;

    event.preventDefault();
    const hash = link.getAttribute("href");
    const target = hash && hash.length > 1 ? document.querySelector(hash) : null;

    close();

    if (hash === "#inicio") {
      window.setTimeout(() => {
        window.scrollTo({ top: 0, behavior: mqReduce.matches ? "auto" : "smooth" });
      }, 70);
      return;
    }

    if (target) {
      window.setTimeout(() => {
        target.scrollIntoView({
          behavior: mqReduce.matches ? "auto" : "smooth",
          block: "start",
        });
      }, 70);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!isOpen) return;

    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = [toggle, ...menu.querySelectorAll(focusableSelector)].filter(
      (element) => element.getClientRects().length > 0,
    );

    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (isOpen) positionMenu();
  }, { passive: true });
}

/* -------------------------------------------------------------------------- */
/* Copiar usuário de perfis sem link                                          */
/* -------------------------------------------------------------------------- */
export function setupCopy() {
  const buttons = Array.from(document.querySelectorAll("[data-copy]"));
  if (buttons.length === 0) return;

  const status = document.querySelector("[data-copy-status]");
  const toast = document.querySelector("[data-copy-toast]");
  const toastText = document.querySelector("[data-copy-toast-text]");
  let resetTimer = 0;
  let toastTimer = 0;

  const fallbackCopy = (text) => {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.top = "-200px";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    field.setSelectionRange(0, text.length);

    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch {
      copied = false;
    }

    field.remove();
    return copied;
  };

  const copyText = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        // Sem permissão da área de transferência: cai no fallback abaixo.
      }
    }
    return fallbackCopy(text);
  };

  const resetButton = (button) => {
    button.classList.remove("is-copied");
    const label = button.querySelector(".profile-card__copy-label");
    if (label) label.textContent = button.dataset.copyLabel || "Copiar";
  };

  const showToast = (message) => {
    if (!toast) return;
    if (toastText) toastText.textContent = message;
    toast.hidden = false;
    window.requestAnimationFrame(() => toast.classList.add("is-visible"));

    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
      window.setTimeout(() => {
        if (!toast.classList.contains("is-visible")) toast.hidden = true;
      }, 220);
    }, 2200);
  };

  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      const text = button.dataset.copy || "";
      const copied = await copyText(text);

      buttons.forEach((other) => {
        if (other !== button) resetButton(other);
      });

      const label = button.querySelector(".profile-card__copy-label");
      if (label) label.textContent = copied ? "Copiado" : button.dataset.copyLabel || "Copiar";
      button.classList.toggle("is-copied", copied);

      if (status) {
        status.textContent = copied
          ? `${text} copiado para a área de transferência.`
          : "Não foi possível copiar. Selecione e copie manualmente.";
      }

      showToast(copied ? `${text} copiado` : "Não foi possível copiar");

      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => resetButton(button), 2200);
    });
  });
}

/* -------------------------------------------------------------------------- */
/* Biblioteca: estante arrastável, teclado, contador e progresso              */
/* -------------------------------------------------------------------------- */
export function setupLibrary() {
  const shelf = document.querySelector("[data-shelf]");
  const track = document.querySelector("[data-shelf-track]");
  const prev = document.getElementById("shelfPrev");
  const next = document.getElementById("shelfNext");
  const counter = document.getElementById("shelfCount");
  const progress = document.getElementById("shelfProgress");

  if (!shelf || !track) return;

  const cards = Array.from(track.children);
  const total = cards.length;

  const maxScroll = () => Math.max(0, shelf.scrollWidth - shelf.clientWidth);
  const isScrollable = () => maxScroll() > 2;

  if (isScrollable()) {
    shelf.setAttribute("tabindex", "0");
    shelf.setAttribute("role", "region");
    shelf.setAttribute("aria-roledescription", "carrossel");
    shelf.setAttribute("aria-label", "Jogos da biblioteca — arraste ou use as setas do teclado");
  }

  const step = () => {
    const card = cards[0];
    if (!card) return 240;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap || "14") || 14;
    return card.getBoundingClientRect().width + gap;
  };

  const visibleIndex = () => {
    if (!cards.length) return 0;
    const shelfLeft = shelf.getBoundingClientRect().left;
    let best = 0;
    let bestDistance = Infinity;

    cards.forEach((card, index) => {
      const distance = Math.abs(card.getBoundingClientRect().left - shelfLeft);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = index;
      }
    });

    return best;
  };

  const update = () => {
    const max = maxScroll();
    const ratio = max > 2 ? shelf.scrollLeft / max : 0;

    if (progress) progress.style.setProperty("--shelf-progress", clamp(ratio, 0, 1).toFixed(4));

    const index = clamp(visibleIndex(), 0, Math.max(0, total - 1));
    if (counter) counter.textContent = `${pad(index + 1)} / ${pad(total)}`;

    const atStart = shelf.scrollLeft <= 4;
    const atEnd = shelf.scrollLeft >= max - 4;

    prev?.setAttribute("aria-disabled", String(atStart));
    next?.setAttribute("aria-disabled", String(atEnd));
  };

  const scrollByCards = (direction) => {
    const amount = step() * (mqFine.matches ? 3 : 1.15) * direction;
    shelf.scrollBy({
      left: amount,
      behavior: mqReduce.matches ? "auto" : "smooth",
    });
  };

  prev?.addEventListener("click", () => scrollByCards(-1));
  next?.addEventListener("click", () => scrollByCards(1));

  shelf.addEventListener("scroll", update, { passive: true });

  shelf.addEventListener("keydown", (event) => {
    if (event.target !== shelf) return;

    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollByCards(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollByCards(-1);
    } else if (event.key === "Home") {
      event.preventDefault();
      shelf.scrollTo({ left: 0, behavior: mqReduce.matches ? "auto" : "smooth" });
    } else if (event.key === "End") {
      event.preventDefault();
      shelf.scrollTo({
        left: shelf.scrollWidth,
        behavior: mqReduce.matches ? "auto" : "smooth",
      });
    }
  });

  /* Arraste com o mouse: a rolagem nativa continua valendo no toque.
     Nas pontas, a trilha cede um pouco e volta ao soltar. */
  let drag = null;
  let suppressClick = false;
  let settleTimer = 0;

  const clearSettle = () => {
    window.clearTimeout(settleTimer);
    track.classList.remove("is-settling");
  };

  const onPointerDown = (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    if (!isScrollable()) return;

    clearSettle();
    drag = {
      id: event.pointerId,
      startX: event.clientX,
      startScroll: shelf.scrollLeft,
      moved: false,
    };
    suppressClick = false;
    track.style.transform = "";
    shelf.classList.add("is-dragging");

    if (shelf.setPointerCapture) {
      try {
        shelf.setPointerCapture(event.pointerId);
      } catch {
        // Alguns navegadores recusam a captura; o arraste ainda funciona.
      }
    }
  };

  const onPointerMove = (event) => {
    if (!drag || event.pointerId !== drag.id) return;

    const delta = event.clientX - drag.startX;

    if (!drag.moved && Math.abs(delta) > 4) {
      drag.moved = true;
      suppressClick = true;
    }

    if (!drag.moved) return;

    event.preventDefault();

    const max = maxScroll();
    const raw = drag.startScroll - delta;
    const clamped = clamp(raw, 0, max);
    shelf.scrollLeft = clamped;

    const overshoot = raw < 0 ? raw : raw > max ? raw - max : 0;
    if (overshoot !== 0) {
      const give = Math.sign(overshoot) * Math.min(Math.abs(overshoot) * 0.32, 72);
      track.style.transform = `translate3d(${give.toFixed(2)}px, 0, 0)`;
    } else {
      track.style.transform = "";
    }
  };

  const endDrag = (event) => {
    if (!drag) return;
    if (event?.pointerId !== undefined && event.pointerId !== drag.id) return;

    const pointerId = drag.id;
    const hadOvershoot = Boolean(track.style.transform);

    drag = null;
    shelf.classList.remove("is-dragging");

    if (hadOvershoot) {
      track.classList.add("is-settling");
      track.style.transform = "";
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => track.classList.remove("is-settling"), 360);
    }

    if (shelf.hasPointerCapture?.(pointerId)) {
      try {
        shelf.releasePointerCapture(pointerId);
      } catch {
        // A captura já pode ter sido liberada pelo navegador.
      }
    }
  };

  shelf.addEventListener("pointerdown", onPointerDown);
  shelf.addEventListener("pointermove", onPointerMove, { passive: false });
  shelf.addEventListener("pointerup", endDrag);
  shelf.addEventListener("pointercancel", endDrag);
  shelf.addEventListener("lostpointercapture", endDrag);

  shelf.addEventListener("dragstart", (event) => event.preventDefault());

  shelf.addEventListener(
    "click",
    (event) => {
      if (!suppressClick) return;
      suppressClick = false;
      event.preventDefault();
      event.stopPropagation();
    },
    true,
  );

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(update);
    observer.observe(shelf);
    observer.observe(track);
  }

  window.addEventListener("resize", update, { passive: true });
  window.addEventListener("load", update, { passive: true });

  update();
}

/* -------------------------------------------------------------------------- */
/* Detecção de ponteiro: espelha exatamente o que o CSS faz                   */
/* -------------------------------------------------------------------------- */
export function setupInputMode() {
  const syncCardLinks = (fine) => {
    document.querySelectorAll(".game-card").forEach((card) => {
      const cover = card.querySelector(".game-card__cover");
      const cta = card.querySelector(".game-card__cta");

      if (cover) {
        cover.tabIndex = fine ? 0 : -1;
        cover.setAttribute("aria-hidden", fine ? "false" : "true");
      }

      if (cta) {
        cta.tabIndex = fine ? -1 : 0;
        cta.setAttribute("aria-hidden", fine ? "true" : "false");
      }
    });
  };

  const apply = () => {
    const fine = mqFine.matches;
    document.documentElement.dataset.input = fine ? "fine" : "coarse";
    syncCardLinks(fine);
  };

  apply();

  if (mqFine.addEventListener) mqFine.addEventListener("change", apply);
  else mqFine.addListener(apply);
}

/* -------------------------------------------------------------------------- */
/* Prévia dos projetos em iframe (lazy + fallback)                            */
/* -------------------------------------------------------------------------- */
export function setupProjectPreviews() {
  const previews = Array.from(
    document.querySelectorAll("[data-project-preview][data-has-preview='true']"),
  );
  if (previews.length === 0) return;

  const load = (preview) => {
    if (preview.dataset.started === "true") return;
    preview.dataset.started = "true";

    const frame = preview.querySelector("[data-preview-frame]");
    const image = preview.querySelector("[data-preview-image]");

    if (image) {
      const done = () => preview.classList.add("is-loaded");
      if (image.complete && image.naturalWidth > 0) done();
      else {
        image.addEventListener("load", done, { once: true });
        image.addEventListener(
          "error",
          () => {
            preview.classList.add("is-failed");
            preview.classList.remove("is-loaded");
          },
          { once: true },
        );
      }
      return;
    }

    if (!frame) return;

    const source = frame.dataset.src;
    if (!source) {
      preview.classList.add("is-failed");
      return;
    }

    let settled = false;
    const succeed = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      preview.classList.add("is-loaded");
      preview.classList.remove("is-failed");
    };
    const fail = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      preview.classList.add("is-failed");
      preview.classList.remove("is-loaded");
    };

    const timer = window.setTimeout(fail, 10000);

    frame.addEventListener("load", succeed, { once: true });
    frame.addEventListener("error", fail, { once: true });
    frame.src = source;
  };

  if (!("IntersectionObserver" in window)) {
    previews.forEach(load);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        load(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "200px 0px" },
  );

  previews.forEach((preview) => observer.observe(preview));
}

/* -------------------------------------------------------------------------- */
/* Alternativas: filtros por categoria                                        */
/* -------------------------------------------------------------------------- */
export function setupFilters() {
  const buttons = Array.from(document.querySelectorAll("[data-filter]"));
  const cards = Array.from(document.querySelectorAll("[data-alt-card]"));
  const counter = document.getElementById("altsCount");

  if (buttons.length === 0 || cards.length === 0) return;

  const apply = (filter) => {
    let visible = 0;

    cards.forEach((card) => {
      const show = filter === "todos" || card.dataset.category === filter;
      card.classList.toggle("is-filtered-out", !show);
      card.classList.remove("is-filtering-in");

      if (show) {
        visible += 1;
        card.style.setProperty("--filter-delay", `${Math.min(visible, 5) * 24}ms`);
        window.requestAnimationFrame(() => card.classList.add("is-filtering-in"));
      }
    });

    if (counter) {
      counter.textContent = visible === 1 ? "1 recomendação" : `${visible} recomendações`;
    }
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((other) => other.setAttribute("aria-pressed", String(other === button)));
      apply(button.dataset.filter || "todos");
    });
  });
}
