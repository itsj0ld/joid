/**
 * Tela de carregamento com progresso REAL.
 *
 * Cada asset concluído — ou que falhou — soma peso na barra. O vídeo tem peso
 * maior porque é o asset mais pesado. Se algo demorar demais, um limite de
 * 6,5s libera o site mesmo assim: o carregamento nunca trava a experiência.
 */
import { site, perfis, biblioteca, desejos } from "./data.js";

const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

function preloadImage(source, timeout = 4500) {
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

function preloadVideo(video, timeout = 7000) {
  return new Promise((resolve) => {
    if (!video) {
      resolve();
      return;
    }

    if (video.readyState >= 2) {
      resolve();
      return;
    }

    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      video.removeEventListener("canplay", finish);
      video.removeEventListener("loadeddata", finish);
      video.removeEventListener("error", finish);
      window.clearTimeout(timer);
      resolve();
    };
    const timer = window.setTimeout(finish, timeout);

    video.addEventListener("canplay", finish, { once: true });
    video.addEventListener("loadeddata", finish, { once: true });
    video.addEventListener("error", finish, { once: true });
  });
}

function waitForFonts(timeout = 2500) {
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

  // Apenas uma amostra das capas entra no loader. O restante continua com
  // loading="lazy" e só é baixado quando o visitante rola até a seção.
  const cards = [
    ...biblioteca.slice(0, 4).map((game) => game.imagem).filter(Boolean),
    ...desejos.slice(0, 2).map((game) => game.imagem).filter(Boolean),
  ];

  const weights = {
    video: 8,
    poster: 1,
    icons: icons.length,
    cards: cards.length,
    fonts: 2,
  };

  const totalWeight =
    weights.video + weights.poster + weights.icons + weights.cards + weights.fonts || 1;

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

  const video = document.getElementById("heroVideo");
  const poster = site.hero.poster;

  // O vídeo e o poster começam já; os grupos menores terminam na frente.
  const videoTask = preloadVideo(video).then(() => add(weights.video));
  const posterTask = preloadImage(poster).then(() => add(weights.poster));

  const work = (async () => {
    setStatus(messages.icones);
    await Promise.all(icons.map((source) => preloadImage(source).then(() => add(1))));

    setStatus(messages.cards);
    await Promise.all(cards.map((source) => preloadImage(source).then(() => add(1))));

    setStatus(messages.fontes);
    await waitForFonts().then(() => add(weights.fonts));

    // Se o vídeo ainda estiver baixando, a barra fica visivelmente nele.
    const videoDone = await Promise.race([
      videoTask.then(() => true),
      wait(7000).then(() => false),
    ]);
    await posterTask;

    if (!videoDone) setStatus(messages.video);
    setStatus(videoDone ? messages.final : messages.final);
    await wait(220);
  })();

  // Limite absoluto: nunca segura o site por mais de 6,5 segundos.
  await Promise.race([work, wait(6500)]);
  finished = true;

  setStatus(messages.final);
  setProgress(100);
  await wait(420);
}
