/**
 * Ponto de entrada do site.
 *
 * 1. Renderiza todo o conteúdo a partir de js/data.js.
 * 2. Prepara as interações que precisam existir antes do carregamento.
 * 3. Roda o loader com progresso real e libera a experiência.
 * 4. Liga os efeitos visuais e as revelações.
 */
import { renderSite } from "./render.js";
import { runLoader } from "./loader.js";
import {
  setupScrollUI,
  setupWordmark,
  setupMenu,
  setupReveals,
  setupLibrary,
  setupInputMode,
  setupProjectPreviews,
  setupFilters,
  setupCopy,
  setupReplay,
} from "./interactions.js";
import {
  setupParticles,
  setupSpotlight,
  setupTilt,
  setupMagnetic,
  setupHero,
} from "./effects.js";

const loader = document.getElementById("loader");

async function boot() {
  // Conteúdo primeiro: tudo abaixo depende dos elementos renderizados.
  renderSite();

  setupInputMode();
  setupScrollUI();
  setupMenu();
  setupWordmark();
  setupProjectPreviews();
  setupFilters();
  setupCopy();
  setupHero();

  try {
    await runLoader();
  } catch (error) {
    // Se o loader falhar, o site abre do mesmo jeito.
    console.warn("Loader falhou, liberando o site:", error);
  }

  document.body.classList.remove("is-loading");
  document.body.classList.add("is-ready");

  if (loader) {
    loader.classList.add("is-done");
    window.setTimeout(() => {
      loader.hidden = true;
      loader.setAttribute("aria-hidden", "true");
    }, 950);
  }

  // Ritmo de entrada: o hero aparece, depois o restante é observado.
  window.setTimeout(() => {
    const reveals = setupReveals();
    setupReplay(reveals);
    setupLibrary();
    setupParticles();
    setupSpotlight();
    setupTilt();
    setupMagnetic();

    // Link direto para uma seção (ex.: /#projetos) depois do loader.
    if (window.location.hash && window.location.hash.length > 1) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        window.setTimeout(() => {
          target.scrollIntoView({ behavior: "auto", block: "start" });
        }, 120);
      }
    }
  }, 220);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
