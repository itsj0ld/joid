/**
 * Interações: cabeçalho, menu acessível, revelações, carrossel da biblioteca,
 * filtros das alternativas, prévia dos projetos e progresso de leitura.
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
  const progress = document.getElementById("scrollProgress");
  const backToTop = document.getElementById("backToTop");

  let ticking = false;

  const update = () => {
    ticking = false;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const ratio = clamp(scrollTop / max, 0, 1);

    document.documentElement.style.setProperty("--scroll-progress", ratio.toFixed(4));
    if (progress) progress.parentElement?.style.setProperty("--scroll-progress", ratio.toFixed(4));

    header?.classList.toggle("is-scrolled", scrollTop > 14);
    backToTop?.classList.toggle("is-visible", scrollTop > 560);
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
/* Nome central que alterna                                                    */
/* -------------------------------------------------------------------------- */
export function setupWordmark() {
  const wordmark = document.getElementById("wordmark");
  if (!wordmark) return;

  const names = Array.from(wordmark.querySelectorAll(".wordmark__name"));
  if (names.length < 2 || mqReduce.matches) return;

  let index = 0;
  const advance = () => {
    names[index].classList.remove("is-active");
    index = (index + 1) % names.length;
    names[index].classList.add("is-active");
  };

  // O intervalo continua discreto; em aba oculta, nada acontece.
  window.setInterval(() => {
    if (!document.hidden) advance();
  }, 3400);
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

  if (!toggle || !menu) return;

  const focusableSelector =
    'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

  let isOpen = false;
  let lastFocused = null;

  const setBackgroundInert = (inert) => {
    [main, footer, backToTop].forEach((element) => {
      if (element) element.inert = inert;
    });
  };

  const open = () => {
    if (isOpen) return;
    isOpen = true;
    lastFocused = document.activeElement;

    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Fechar menu");
    document.body.classList.add("menu-open");
    setBackgroundInert(true);

    const first = menu.querySelector(focusableSelector);
    window.setTimeout(() => first?.focus(), 160);
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

    if (target) {
      window.setTimeout(() => {
        target.scrollIntoView({
          behavior: mqReduce.matches ? "auto" : "smooth",
          block: "start",
        });
      }, 80);
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
}

/* -------------------------------------------------------------------------- */
/* Revelações com IntersectionObserver (reaproveitadas no replay)             */
/* -------------------------------------------------------------------------- */
export function setupReveals() {
  const elements = Array.from(document.querySelectorAll("[data-reveal]"));
  const noop = { replay: () => {} };
  if (elements.length === 0) return noop;

  if (mqReduce.matches || !("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-in"));
    return noop;
  }

  let observer = null;

  const observeAll = () => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer?.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" },
    );

    elements.forEach((element) => observer.observe(element));
  };

  // Esconde tudo e observa de novo: usado quando a experiência é reiniciada.
  const replay = () => {
    observer?.disconnect();
    elements.forEach((element) => element.classList.remove("is-in"));
    // Força o navegador a registrar o estado inicial antes de reanimar.
    void document.body.offsetWidth;
    observeAll();
  };

  observeAll();

  return { replay };
}

/* -------------------------------------------------------------------------- */
/* Copiar usuário de perfis sem link                                          */
/* -------------------------------------------------------------------------- */
export function setupCopy() {
  const buttons = Array.from(document.querySelectorAll("[data-copy]"));
  if (buttons.length === 0) return;

  const status = document.querySelector("[data-copy-status]");
  let resetTimer = 0;

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

  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      const text = button.dataset.copy || "";
      const label = button.dataset.copyLabel || "Copiar";
      const copied = await copyText(text);

      button.textContent = copied ? "Copiado" : "Não deu";
      button.classList.toggle("is-copied", copied);
      if (status) {
        status.textContent = copied
          ? `${text} copiado para a área de transferência.`
          : "Não foi possível copiar. Selecione e copie manualmente.";
      }

      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => {
        button.textContent = label;
        button.classList.remove("is-copied");
      }, 2200);
    });
  });
}

/* -------------------------------------------------------------------------- */
/* Replay da experiência de entrada (apenas no link do rodapé)                */
/* -------------------------------------------------------------------------- */
export function setupReplay(reveals) {
  const link = document.querySelector(".final__top");
  if (!link) return;

  let busy = false;

  // `behavior: "auto"` respeita o scroll-behavior suave do CSS; para o replay
  // precisamos sumir daqui na hora e só então reanimar a entrada.
  const jumpToTop = () => {
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    // Força o navegador a aplicar o estilo antes do salto; sem isso o scroll
    // suave do CSS pode capturar a chamada e animar a página inteira.
    void root.offsetHeight;
    window.scrollTo(0, 0);
    window.requestAnimationFrame(() => {
      root.style.scrollBehavior = previous;
    });
  };

  link.addEventListener("click", (event) => {
    // O botão fixo (#backToTop) e a rolagem normal não reiniciam nada.
    if (busy) {
      event.preventDefault();
      jumpToTop();
      return;
    }

    event.preventDefault();

    if (mqReduce.matches) {
      jumpToTop();
      return;
    }

    busy = true;
    jumpToTop();

    // Mantém o foco no topo, como um link âncora faria com o teclado.
    document.getElementById("hero-title")?.focus({ preventScroll: true });

    // Some com a entrada, volta ao estado inicial e reanima em seguida.
    document.body.classList.remove("is-ready");
    reveals?.replay();

    void document.body.offsetWidth;

    window.setTimeout(() => {
      document.body.classList.add("is-ready");
    }, 90);

    window.setTimeout(() => {
      busy = false;
    }, 1000);
  });
}

/* -------------------------------------------------------------------------- */
/* Biblioteca: carrossel, contador e progresso                                */
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

  // Permite rolar com o teclado quando o carrossel estiver focado.
  if (shelf.scrollWidth > shelf.clientWidth + 4) {
    shelf.setAttribute("tabindex", "0");
    shelf.setAttribute("role", "region");
    shelf.setAttribute("aria-label", "Carrossel de jogos — use as setas do teclado");
  }

  const step = () => {
    const card = cards[0];
    if (!card) return 240;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap || "13") || 13;
    return card.getBoundingClientRect().width + gap;
  };

  const visibleIndex = () => {
    if (!cards.length) return 0;
    const left = shelf.scrollLeft;
    let best = 0;
    let bestDistance = Infinity;

    cards.forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft - left);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = index;
      }
    });

    return best;
  };

  const update = () => {
    const max = shelf.scrollWidth - shelf.clientWidth;
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

  // Roda do mouse rola a estante na horizontal. Nas pontas, soltamos o evento
  // para a página continuar rolando normalmente.
  shelf.addEventListener(
    "wheel",
    (event) => {
      if (Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;

      const max = shelf.scrollWidth - shelf.clientWidth;
      if (max <= 1) return;

      const multiplier =
        event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? shelf.clientWidth : 1;
      const delta = event.deltaY * multiplier;
      if (delta === 0) return;

      const atStart = shelf.scrollLeft <= 0 && delta < 0;
      const atEnd = shelf.scrollLeft >= max - 1 && delta > 0;
      if (atStart || atEnd) return;

      event.preventDefault();
      shelf.scrollLeft = clamp(shelf.scrollLeft + delta, 0, max);
    },
    { passive: false },
  );

  shelf.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update, { passive: true });

  shelf.addEventListener("keydown", (event) => {
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

  update();
}

/* -------------------------------------------------------------------------- */
/* Detecção de ponteiro: espelha exatamente o que o CSS faz                   */
/* -------------------------------------------------------------------------- */
export function setupInputMode() {
  const apply = () => {
    const mode = mqFine.matches ? "fine" : "coarse";
    document.documentElement.dataset.input = mode;
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
        image.addEventListener("error", () => preview.classList.add("is-failed"), { once: true });
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

    const timer = window.setTimeout(fail, 9000);

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
    { threshold: 0.18, rootMargin: "180px 0px" },
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
        // Pequena entrada em cascata, sem exageros.
        window.requestAnimationFrame(() => {
          card.style.animationDelay = `${Math.min(visible, 8) * 28}ms`;
          card.classList.add("is-filtering-in");
        });
      }
    });

    if (counter) {
      counter.textContent =
        visible === 1 ? "1 recomendação" : `${visible} recomendações`;
    }
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((other) => other.setAttribute("aria-pressed", String(other === button)));
      apply(button.dataset.filter || "todos");
    });
  });
}
