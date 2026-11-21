/**
 * Hero: vídeo de fundo com pausa fora da tela e respeito ao movimento reduzido.
 * O resto da página não tem efeitos decorativos.
 */

const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");

export function setupHero() {
  const hero = document.getElementById("inicio");
  const video = document.getElementById("heroVideo");
  if (!hero || !video) return;

  const tryPlay = () => {
    if (mqReduce.matches) {
      video.pause();
      return;
    }

    const promise = video.play();
    if (promise?.catch) promise.catch(() => {});
  };

  const pause = () => video.pause();

  const applyPreference = () => {
    if (mqReduce.matches) {
      video.pause();
      video.removeAttribute("autoplay");
    } else {
      tryPlay();
    }
  };

  video.addEventListener("canplay", tryPlay);

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) tryPlay();
        else pause();
      },
      { threshold: 0.05 },
    );
    observer.observe(hero);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pause();
    else if (hero.getBoundingClientRect().bottom > 0) tryPlay();
  });

  if (mqReduce.addEventListener) mqReduce.addEventListener("change", applyPreference);
  else mqReduce.addListener(applyPreference);

  applyPreference();
}
