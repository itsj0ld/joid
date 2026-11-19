/**
 * Renderização do site.
 * Todo o conteúdo vem de js/data.js — nenhum texto de seção fica preso no HTML.
 */
import { site, secoes, perfis, biblioteca, desejos, projetos, alternativas } from "./data.js";
import { icons } from "./icons.js";

/* -------------------------------------------------------------------------- */
/* Utilidades                                                                  */
/* -------------------------------------------------------------------------- */
const escapeMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export const escapeHTML = (value = "") =>
  String(value).replace(/[&<>"']/g, (character) => escapeMap[character]);

const attrs = (url) => (url ? `target="_blank" rel="noopener noreferrer"` : "");
const pad = (number) => String(number).padStart(2, "0");

const getSection = (id) => secoes.find((section) => section.id === id);

const hueFor = (index, start = 196, step = 17) => start + ((index * step) % 66);

const hostnameOf = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

const initialsOf = (name) =>
  String(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

/* -------------------------------------------------------------------------- */
/* Cabeçalho de seção — componente único para manter tudo idêntico             */
/* -------------------------------------------------------------------------- */
export function renderSectionHeader(titulo, descricao, numero, id) {
  return `
    <header class="section-head">
      <p class="section-head__index" data-reveal style="--reveal-delay: 0ms" aria-hidden="true">${pad(numero)}</p>
      <h2 class="section-head__title" id="${escapeHTML(id)}-title" data-reveal="blur" style="--reveal-delay: 70ms">${escapeHTML(titulo)}</h2>
      <p class="section-head__desc" data-reveal="blur" style="--reveal-delay: 150ms">${escapeHTML(descricao)}</p>
    </header>
  `;
}

/* -------------------------------------------------------------------------- */
/* Cabeçalho + menu                                                            */
/* -------------------------------------------------------------------------- */
export function renderChrome() {
  const wordmark = document.getElementById("wordmark");
  if (wordmark) {
    wordmark.innerHTML = site.apelidos
      .map(
        (name, index) =>
          `<span class="wordmark__name${index === 0 ? " is-active" : ""}" aria-hidden="true">${escapeHTML(name)}</span>`,
      )
      .join("");
  }

  const menuList = document.getElementById("menuList");
  if (menuList) {
    const items = [{ id: "inicio", nav: "Início" }, ...secoes];
    menuList.innerHTML = items
      .map(
        (item, index) => `
          <li>
            <a class="menu__link" href="#${escapeHTML(item.id)}" style="--i: ${index}">
              <span class="menu__num" aria-hidden="true">${pad(index)}</span>
              <span class="menu__label">${escapeHTML(item.nav)}</span>
              <span class="menu__arrow" aria-hidden="true">${icons.arrowUpRight}</span>
            </a>
          </li>
        `,
      )
      .join("");
  }

  const menuYear = document.getElementById("menuYear");
  if (menuYear) menuYear.textContent = String(new Date().getFullYear());
}

/* -------------------------------------------------------------------------- */
/* Hero                                                                        */
/* -------------------------------------------------------------------------- */
export function renderHero() {
  const hero = site.hero;
  const safeTitle = escapeHTML(hero.titulo);
  const safeHighlight = escapeHTML(hero.destaque);
  const title = safeHighlight && safeTitle.includes(safeHighlight)
    ? safeTitle.replace(safeHighlight, `<em>${safeHighlight}</em>`)
    : safeTitle;

  return `
    <section class="hero" id="inicio" aria-labelledby="hero-title">
      <div class="hero__bg" aria-hidden="true"></div>
      <div class="hero__media" data-hero-media>
        <video
          class="hero__video"
          id="heroVideo"
          autoplay
          muted
          loop
          playsinline
          webkit-playsinline
          preload="metadata"
          poster="${escapeHTML(hero.poster)}"
          aria-hidden="true"
          tabindex="-1"
        >
          <source src="${escapeHTML(hero.video)}" type="video/webm" />
          <source src="${escapeHTML(hero.videoMp4)}" type="video/mp4" />
        </video>
      </div>
      <div class="hero__overlay" aria-hidden="true"></div>
      <div class="hero__noise" aria-hidden="true"></div>

      <div class="hero__content">
        <p class="hero__eyebrow eyebrow">${escapeHTML(hero.eyebrow)}</p>
        <h1 class="hero__title" id="hero-title" tabindex="-1">${title}</h1>
        <p class="hero__support">${escapeHTML(hero.apoio)}</p>
        <nav class="hero__quick-nav" aria-label="Atalhos para seções">
          <a href="#destaques">Destaques</a>
          <a href="#perfis">Perfis</a>
          <a href="#biblioteca">Jogos</a>
          <a href="#projetos">Projetos</a>
          <a href="#alternativas">Alternativas</a>
        </nav>
      </div>

      <a class="hero__scroll" href="#perfis">
        <span>${escapeHTML(hero.rotuloScroll)}</span>
        <span class="hero__scroll-line" aria-hidden="true"></span>
      </a>
    </section>
  `;
}

/* -------------------------------------------------------------------------- */
/* Destaques                                                                   */
/* -------------------------------------------------------------------------- */
function renderHighlights() {
  const section = getSection("destaques");
  if (!section) return "";

  const collections = { biblioteca, desejos, alternativas };
  const highlights = (site.destaques || [])
    .map((highlight, index) => {
      const item = collections[highlight.colecao]?.find((entry) => entry.id === highlight.id);
      if (!item?.url) return "";

      return `
        <a
          class="highlight-card glass"
          href="${escapeHTML(item.url)}"
          ${attrs(item.url)}
          data-reveal
          style="--reveal-delay: ${index * 80}ms"
          aria-label="Abrir ${escapeHTML(item.nome)} em nova aba"
        >
          <img
            class="highlight-card__image"
            src="${escapeHTML(item.imagem)}"
            alt=""
            width="267"
            height="400"
            loading="lazy"
            decoding="async"
          />
          <span class="highlight-card__shade" aria-hidden="true"></span>
          <span class="highlight-card__meta">${escapeHTML(highlight.rotulo)}</span>
          <span class="highlight-card__body">
            <span class="highlight-card__name">${escapeHTML(item.nome)}</span>
            <span class="highlight-card__action">abrir ${icons.arrowUpRight}</span>
          </span>
        </a>
      `;
    })
    .join("");

  if (!highlights) return "";
  const numero = secoes.indexOf(section) + 1;

  return `
    <section class="section section--highlights" id="destaques" aria-labelledby="destaques-title">
      <div class="container">
        <div class="highlights-head">
          ${renderSectionHeader(section.titulo, section.descricao, numero, section.id)}
          <span class="highlights-head__note" aria-hidden="true">seleção atual</span>
        </div>
        <div class="highlights-grid">${highlights}</div>
      </div>
    </section>
  `;
}

/* -------------------------------------------------------------------------- */
/* Perfis                                                                      */
/* -------------------------------------------------------------------------- */
function renderProfiles() {
  const section = getSection("perfis");
  if (!section) return "";
  const numero = secoes.indexOf(section) + 1;

  const cards = perfis
    .map((perfil, index) => {
      const hasLink = Boolean(perfil.url);
      const canCopy = Boolean(perfil.copiar);
      const extraStyle = [
        `--profile-color: ${escapeHTML(perfil.cor || "#8ab4ff")}`,
        `--reveal-delay: ${Math.min(index, 10) * 45}ms`,
        perfil.fundoIcone ? `--profile-icon-bg: ${escapeHTML(perfil.fundoIcone)}` : "",
      ]
        .filter(Boolean)
        .join("; ");

      const content = `
        <span class="profile-card__icon">
          <img
            src="${escapeHTML(perfil.icone)}"
            alt=""
            width="32"
            height="32"
            loading="lazy"
            decoding="async"
          />
        </span>
        <span class="profile-card__body">
          <span class="profile-card__name">${escapeHTML(perfil.nome)}</span>
          <span class="profile-card__handle">${escapeHTML(perfil.usuario)}</span>
        </span>
        ${
          hasLink
            ? `<span class="profile-card__arrow" aria-hidden="true">${icons.arrowUpRight}</span>`
            : canCopy
              ? `<button
                  class="profile-card__copy"
                  type="button"
                  data-copy="${escapeHTML(perfil.copiar)}"
                  data-copy-label="Copiar"
                  aria-label="Copiar o usuário ${escapeHTML(perfil.copiar)}"
                >Copiar</button>`
              : `<span class="profile-card__soon">sem link</span>`
        }
      `;

      return `
        <li
          class="profile-card glass spotlight${hasLink || canCopy ? "" : " profile-card--static"}${canCopy ? " profile-card--copy" : ""}"
          data-reveal
          style="${extraStyle}"
        >
          ${
            hasLink
              ? `<a class="profile-card__link" href="${escapeHTML(perfil.url)}" ${attrs(perfil.url)} aria-label="Abrir ${escapeHTML(perfil.nome)} (${escapeHTML(perfil.usuario)}) em nova aba">${content}</a>`
              : `<div class="profile-card__link">${content}</div>`
          }
        </li>
      `;
    })
    .join("");

  return `
    <section class="section section--profiles" id="perfis" aria-labelledby="perfis-title">
      <div class="container">
        ${renderSectionHeader(section.titulo, section.descricao, numero, section.id)}
        <ul class="profiles-grid">${cards}</ul>
        <span class="visually-hidden" role="status" data-copy-status></span>
        <div class="copy-toast" data-copy-toast role="status" aria-live="polite" hidden></div>
      </div>
    </section>
  `;
}

/* -------------------------------------------------------------------------- */
/* Biblioteca                                                                  */
/* -------------------------------------------------------------------------- */
function renderGameCard(game, index, options = {}) {
  const hasLink = Boolean(game.url);
  const hasImage = Boolean(game.imagem);
  const isWish = Boolean(options.wishlist);
  const hue = hueFor(index);
  const fallback = `
    <span class="game-card__fallback" style="--hue: ${hue}" aria-hidden="true">
      <span>${escapeHTML(initialsOf(game.nome))}</span>
    </span>
  `;
  const poster = hasImage
    ? `<img
        class="game-card__poster"
        src="${escapeHTML(game.imagem)}"
        alt="Capa de ${escapeHTML(game.nome)}"
        width="267"
        height="400"
        loading="lazy"
        decoding="async"
      />`
    : fallback;

  const badge = isWish
    ? `<span class="wish-card__heart" aria-hidden="true">${icons.heart}</span>`
    : hasLink
      ? ""
      : `<span class="game-card__flag">sem link</span>`;

  return `
    <li class="game-card${hasLink ? "" : " game-card--static"}${isWish ? " game-card--wish" : ""}" data-game-card>
      <div class="game-card__inner">
        ${poster}
        <span class="game-card__shade" aria-hidden="true"></span>
        <span class="game-card__index" aria-hidden="true">${pad(index + 1)}</span>
        ${badge}
        <div class="game-card__body">
          <h3 class="game-card__title">${escapeHTML(game.nome)}</h3>
          ${
            hasLink
              ? `<span class="game-card__hint" aria-hidden="true">abrir página ${icons.arrowUpRight}</span>`
              : ""
          }
          ${hasLink ? `<a class="game-card__cta" href="${escapeHTML(game.url)}" ${attrs(game.url)} aria-label="Ver mais sobre ${escapeHTML(game.nome)} — abre em nova aba">Ver mais ${icons.arrowUpRight}</a>` : ""}
        </div>
        ${hasLink ? `<a class="game-card__cover" href="${escapeHTML(game.url)}" ${attrs(game.url)} aria-label="Abrir ${escapeHTML(game.nome)} em nova aba"></a>` : ""}
      </div>
    </li>
  `;
}

function renderLibrary() {
  const section = getSection("biblioteca");
  if (!section) return "";
  const numero = secoes.indexOf(section) + 1;
  const cards = biblioteca.map((game, index) => renderGameCard(game, index)).join("");

  return `
    <section class="section section--library" id="biblioteca" aria-labelledby="biblioteca-title">
      <div class="container">
        <div class="section-head-row">
          ${renderSectionHeader(section.titulo, section.descricao, numero, section.id)}
          <div class="library-controls" aria-label="Controles do carrossel">
            <span class="shelf-count" id="shelfCount">01 / ${pad(biblioteca.length)}</span>
            <button class="shelf-btn" id="shelfPrev" type="button" aria-label="Jogos anteriores" aria-controls="shelfTrack" aria-disabled="true">
              ${icons.arrowLeft}
            </button>
            <button class="shelf-btn" id="shelfNext" type="button" aria-label="Próximos jogos" aria-controls="shelfTrack" aria-disabled="false">
              ${icons.arrowRight}
            </button>
          </div>
        </div>

        <div class="shelf-shell" data-reveal>
          <div class="shelf" id="shelf" data-shelf>
            <ul class="shelf__track" id="shelfTrack" data-shelf-track>${cards}</ul>
          </div>
        </div>

        <div class="shelf-foot">
          <span class="shelf-hint">${biblioteca.length} jogos · arraste para o lado</span>
          <div class="shelf-progress" aria-hidden="true"><span id="shelfProgress"></span></div>
        </div>
      </div>
    </section>
  `;
}

/* -------------------------------------------------------------------------- */
/* Lista de desejos                                                            */
/* -------------------------------------------------------------------------- */
function renderWishlist() {
  const section = getSection("desejos");
  if (!section) return "";
  const numero = secoes.indexOf(section) + 1;

  // Mesmo card da biblioteca, com link e clique; o coração rosado é o único
  // detalhe que diferencia a lista da biblioteca.
  const cards = desejos
    .map((game, index) => renderGameCard(game, index, { wishlist: true }))
    .join("");

  return `
    <section class="section section--wishlist" id="desejos" aria-labelledby="desejos-title">
      <div class="container">
        ${renderSectionHeader(section.titulo, section.descricao, numero, section.id)}
        <div class="wishlist" data-reveal>
          <div class="wishlist__top">
            <span class="wishlist__label">${icons.heart} guardados para depois</span>
            <span class="wishlist__count">${pad(desejos.length)} títulos</span>
          </div>
          <ul class="wishlist__grid">${cards}</ul>
        </div>
      </div>
    </section>
  `;
}

/* -------------------------------------------------------------------------- */
/* Projetos                                                                    */
/* -------------------------------------------------------------------------- */
function renderProjectPreview(project) {
  const hasIframe = project.status === "pronto" && project.previewTipo === "iframe" && project.preview;
  const hasImage = project.status === "pronto" && project.previewTipo === "imagem" && project.preview;
  const hasPreview = Boolean(hasIframe || hasImage);
  const host = hostnameOf(project.link || project.preview || "");
  const initial = escapeHTML(initialsOf(project.titulo).slice(0, 1));

  return `
    <div class="project-preview${hasPreview ? "" : " is-failed"}${hasIframe ? " is-live" : ""}" data-project-preview data-has-preview="${hasPreview ? "true" : "false"}">
      <div class="project-preview__bar">
        <span class="window-dots" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="window-url">${escapeHTML(host || "prévia do projeto")}</span>
        ${hasIframe ? `<span class="project-live"><i></i>ao vivo</span>` : ""}
      </div>
      <div class="project-preview__body">
        <div class="project-preview__fallback" aria-hidden="true"><span>${initial}</span></div>
        ${hasPreview ? `<div class="project-skeleton" aria-hidden="true"></div>` : ""}
        ${
          hasIframe
            ? `<iframe
                title="Prévia ao vivo do projeto ${escapeHTML(project.titulo)}"
                width="960"
                height="600"
                data-preview-frame
                data-src="${escapeHTML(project.preview)}"
                loading="lazy"
                referrerpolicy="no-referrer"
              ></iframe>`
            : ""
        }
        ${
          hasImage
            ? `<img
                class="project-preview__image"
                data-preview-image
                src="${escapeHTML(project.preview)}"
                alt="Prévia do projeto ${escapeHTML(project.titulo)}"
                width="1200"
                height="800"
                loading="lazy"
                decoding="async"
              />`
            : ""
        }
      </div>
    </div>
  `;
}

function renderReadyProject(project, index) {
  const tags = project.tags?.length
    ? `<ul class="project-tags" aria-label="Tags do projeto">${project.tags
        .map((tag) => `<li>${escapeHTML(tag)}</li>`)
        .join("")}</ul>`
    : "";

  const action = project.link
    ? `<div class="project-card__action">
        <span class="project-card__hint">abre em nova aba</span>
        <a class="btn btn--primary magnetic" href="${escapeHTML(project.link)}" ${attrs(project.link)} data-magnetic>
          Abrir projeto ${icons.arrowUpRight}
        </a>
      </div>`
    : "";

  return `
    <article class="project-card project-card--ready glass" data-reveal style="--reveal-delay: ${index * 90}ms">
      ${renderProjectPreview(project)}
      <div class="project-card__body">
        <div class="project-card__meta">
          <span class="status status--ready"><i></i>pronto</span>
          <span class="project-card__num" aria-hidden="true">${pad(index + 1)}</span>
        </div>
        <h3 class="project-card__title">${escapeHTML(project.titulo)}</h3>
        <p class="project-card__desc">${escapeHTML(project.descricao)}</p>
        ${tags}
        ${action}
      </div>
    </article>
  `;
}

function renderOngoingProject(project, index) {
  return `
    <article class="project-card project-card--empty" data-reveal style="--reveal-delay: ${index * 90}ms">
      <div class="project-empty-preview" aria-hidden="true">
        <span class="project-empty-preview__icon">${icons.sparkle}</span>
        <span class="project-empty-preview__label">espaço reservado</span>
      </div>
      <div class="project-card__body">
        <div class="project-card__meta">
          <span class="status status--progress"><i></i>em andamento</span>
          <span class="project-card__num" aria-hidden="true">${pad(index + 1)}</span>
        </div>
        <h3 class="project-card__title">${escapeHTML(project.titulo)}</h3>
        <p class="project-card__desc">${escapeHTML(project.descricao)}</p>
        <p class="project-empty-note">em construção, com calma</p>
      </div>
    </article>
  `;
}

function renderProjects() {
  const section = getSection("projetos");
  if (!section) return "";
  const numero = secoes.indexOf(section) + 1;

  const cards = projetos
    .map((project, index) =>
      project.status === "pronto"
        ? renderReadyProject(project, index)
        : renderOngoingProject(project, index),
    )
    .join("");

  return `
    <section class="section section--projects" id="projetos" aria-labelledby="projetos-title">
      <div class="container">
        ${renderSectionHeader(section.titulo, section.descricao, numero, section.id)}
        <div class="projects-grid">${cards}</div>
      </div>
    </section>
  `;
}

/* -------------------------------------------------------------------------- */
/* Alternativas                                                                */
/* -------------------------------------------------------------------------- */
function renderAlternatives() {
  const section = getSection("alternativas");
  if (!section) return "";
  const numero = secoes.indexOf(section) + 1;
  const categories = [...new Set(alternativas.map((item) => item.categoria).filter(Boolean))];

  const chips = [
    `<button class="chip" type="button" data-filter="todos" aria-pressed="true">Tudo</button>`,
    ...categories.map(
      (category) =>
        `<button class="chip" type="button" data-filter="${escapeHTML(category)}" aria-pressed="false">${escapeHTML(category)}</button>`,
    ),
  ].join("");

  const cards = alternativas
    .map((item, index) => {
      const host = hostnameOf(item.url);
      return `
        <article
          class="alt-card glass spotlight"
          data-alt-card
          data-category="${escapeHTML(item.categoria || "")}"
          style="--hue: ${hueFor(index, 198, 15)}"
          data-reveal
        >
          <div class="alt-card__top">
            <span class="alt-card__icon" aria-hidden="true">
              ${
                item.imagem
                  ? `<img src="${escapeHTML(item.imagem)}" alt="" width="30" height="30" loading="lazy" decoding="async" />`
                  : escapeHTML(initialsOf(item.nome).slice(0, 1))
              }
            </span>
            ${item.categoria ? `<span class="alt-card__category">${escapeHTML(item.categoria)}</span>` : ""}
          </div>
          <p class="alt-card__old">em vez de <span>${escapeHTML(item.substitui || "app comum")}</span></p>
          <h3 class="alt-card__name">${escapeHTML(item.nome)}</h3>
          ${item.descricao ? `<p class="alt-card__desc">${escapeHTML(item.descricao)}</p>` : ""}
          <div class="alt-card__foot">
            <span class="alt-card__domain">${escapeHTML(host)}</span>
            <a class="alt-card__visit" href="${escapeHTML(item.url)}" ${attrs(item.url)} aria-label="Visitar ${escapeHTML(item.nome)} em nova aba">
              Visitar ${icons.arrowUpRight}
            </a>
          </div>
        </article>
      `;
    })
    .join("");

  return `
    <section class="section section--alternatives" id="alternativas" aria-labelledby="alternativas-title">
      <div class="container">
        ${renderSectionHeader(section.titulo, section.descricao, numero, section.id)}
        <div class="alts-toolbar">
          <div class="chips" role="group" aria-label="Filtrar alternativas por categoria">${chips}</div>
          <p class="alts-count" id="altsCount" aria-live="polite">${alternativas.length} recomendações</p>
        </div>
        <div class="alts-grid" id="altsGrid">${cards}</div>
      </div>
    </section>
  `;
}

/* -------------------------------------------------------------------------- */
/* Montagem geral                                                              */
/* -------------------------------------------------------------------------- */
export function renderSite() {
  renderChrome();

  const main = document.getElementById("conteudo");
  if (main) {
    main.innerHTML = [
      renderHero(),
      renderHighlights(),
      renderProfiles(),
      renderLibrary(),
      renderWishlist(),
      renderProjects(),
      renderAlternatives(),
    ].join("");
  }

  // Textos do rodapé/final também vêm dos dados.
  const finalMessage = document.getElementById("finalMessage");
  if (finalMessage) finalMessage.textContent = site.final.mensagem;

  const finalNote = document.getElementById("finalNote");
  if (finalNote) finalNote.textContent = site.final.rodape;

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Meta tags sincronizadas com o arquivo de dados.
  document.title = site.meta.titulo;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute("content", site.meta.descricao);
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.setAttribute("content", site.meta.tema);
}
