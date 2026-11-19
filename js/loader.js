/**
 * Tela de carregamento com progresso real.
 * O vídeo não entra mais no caminho crítico: ele carrega em segundo plano.
 * Um limite de 2,5 s libera o site mesmo que algum asset demore.
 */
import { site, perfis, biblioteca, desejos } from "./data.js";

const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

function preloadImage(source, timeout = 2500) {
  return new Promise((resolve) => {
    if (!source) {
      resolve();
      return;
    }

    const image = new Image();
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      resolve();
    };
    const timer = window.setTimeout(finish, timeout);

    image.onload = finish;
    image.onerror = finish;
    image.decoding = "async";
    image.src = source;
  });
}

function waitForFonts(timeout = 1500) {
  if (!document.fonts?.ready) return Promise.resolve();

  return Promise.race([document.fonts.ready, wait(timeout)]);
}

export async function runLoader() {
  const loader = document.getElementById("loader");
  const bar = document.getElementById("loaderBar");
  const track = document.getElementById("loaderTrack");
  const percentLabel = document.getElementById("loaderPercent");
  const status = document.getElementById("loaderStatus");
  const title = document.getElementById("loaderTitle");

  if (!loader || !bar || !track) return;

  if (title) title.textContent = site.carregamento.titulo;

  const messages = site.carregamento.etapas;
  const icons = perfis.map((perfil) => perfil.icone).filter(Boolean);

  // Apenas uma amostra das capas entra no loader; o restante é lazy.
  const cards = [
    ...biblioteca.slice(0, 4).map((game) => game.imagem).filter(Boolean),
    ...desejos.slice(0, 2).map((game) => game.imagem).filter(Boolean),
  ];

  const weights = { poster: 2, icons: icons.length, cards: cards.length, fonts: 2 };
  const totalWeight = weights.poster + weights.icons + weights.cards + weights.fonts || 1;

  let completedWeight = 0;
  let finished = false;

  const setProgress = (value) => {
    const safe = Math.max(0, Math.min(100, Math.round(value)));
    bar.style.width = `${safe}%`;
    track.setAttribute("aria-valuenow", String(safe));
    if (percentLabel) percentLabel.textContent = `${safe}%`;
  };

  const setStatus = (message) => {
    if (status && message) status.textContent = message;
  };

  const add = (weight) => {
    if (finished) return;
    completedWeight += weight;
    setProgress((completedWeight / totalWeight) * 100);
  };

  setProgress(2);

  const posterTask = preloadImage(site.hero.poster).then(() => add(weights.poster));

  const work = (async () => {
    setStatus(messages.icones);
    await Promise.all(icons.map((source) => preloadImage(source).then(() => add(1))));

    setStatus(messages.cards);
    await Promise.all(cards.map((source) => preloadImage(source).then(() => add(1))));

    setStatus(messages.fontes);
    await waitForFonts().then(() => add(weights.fonts));

    await posterTask;
    setStatus(messages.final);
    await wait(180);
  })();

  await Promise.race([work, wait(2500)]);
  finished = true;

  setStatus(messages.final);
  setProgress(100);
  await wait(360);
}
