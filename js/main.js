/**
 * Ponto de entrada do site.
 * Renderiza o conteúdo e liga as interações imediatamente — sem tela de espera.
 */
import { renderSite } from "./render.js";
import {
  setupScrollUI,
  setupMenu,
  setupCopy,
  setupLibrary,
  setupInputMode,
  setupProjectPreviews,
  setupFilters,
} from "./interactions.js";
import { setupHero } from "./effects.js";

function scrollToHash() {
  const hash = window.location.hash;
  if (!hash || hash.length < 2) return;

  const target = document.getElementById(hash.slice(1));
  if (!target) return;

  window.requestAnimationFrame(() => {
    target.scrollIntoView({ behavior: "auto", block: "start" });
  });
}

function boot() {
  renderSite();

  setupInputMode();
  setupScrollUI();
  setupMenu();
  setupCopy();
  setupLibrary();
  setupProjectPreviews();
  setupFilters();
  setupHero();

  document.body.classList.add("is-ready");
  scrollToHash();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
