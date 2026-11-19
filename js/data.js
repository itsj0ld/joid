/**
 * ============================================================================
 *  DADOS DO SITE — Natan / j0ld
 * ============================================================================
 *  Este é o único arquivo que você precisa editar para atualizar o conteúdo.
 *  Todos os cards, títulos, descrições, links e textos são renderizados aqui.
 *
 *  Regras rápidas:
 *  - Use caminhos relativos começando em "assets/".
 *  - Imagens de jogos: de preferência WebP 267 × 400 (proporção 2:3).
 *  - Links externos abrem em nova aba automaticamente.
 *  - Deixe `url: null` quando ainda não houver um link (o card fica sem clique).
 *  - Vírgulas e aspas: mantenha o padrão de objeto JavaScript.
 * ============================================================================
 */

/* ==========================================================================
   1. IDENTIDADE, TEXTOS GERAIS E MENSAGEM FINAL
   ========================================================================== */
export const site = {
  nome: "Natan",

  // Apelidos que alternam no título central do cabeçalho (loop infinito).
  apelidos: ["Natan", "j0ld", "dyleenim", "schxzm"],

  // Usado nas meta tags. Se um dia tiver domínio próprio, troque também no HTML.
  meta: {
    titulo: "Natan — um canto pessoal",
    descricao:
      "Perfis, jogos, projetos e pequenas descobertas de Natan (j0ld), reunidos em um só lugar.",
    tema: "#060b18",
  },

  hero: {
    eyebrow: "um canto pessoal",
    // O trecho em `destaque` ganha o itálico elegante automaticamente.
    titulo: "Oi, me chamo Natan.",
    destaque: "Natan",
    apoio:
      "Perfis, jogos, projetos e pequenas descobertas — tudo em um só lugar, sem pressa.",
    rotuloScroll: "role para explorar",
    video: "assets/videos/hero.webm",
    // O poster é gerado a partir do próprio vídeo. Pode trocar por outra imagem.
    poster: "assets/videos/hero-poster.jpg",
  },

  carregamento: {
    titulo: "um canto pessoal",
    etapas: {
      video: "Carregando vídeo...",
      icones: "Carregando ícones...",
      cards: "Carregando cards...",
      fontes: "Ajustando a tipografia...",
      final: "Quase lá...",
    },
  },

  final: {
    mensagem: "Isso é tudo, por enquanto...",
    rodape: "feito com calma",
  },
};

/* ==========================================================================
   2. SEÇÕES — títulos, descrições e itens do menu
   ==========================================================================
   A ordem deste array é a ordem em que as seções aparecem na página.
   `nav` é o texto curto exibido dentro do menu.
   ========================================================================== */
export const secoes = [
  {
    id: "perfis",
    nav: "Perfis",
    titulo: "Meus Perfis",
    descricao: "Os cantos onde eu apareço. Escolha um e me encontre por lá.",
  },
  {
    id: "biblioteca",
    nav: "Biblioteca",
    titulo: "Biblioteca de Jogos",
    descricao: "Jogos que ficam instalados e sempre voltam. Arraste para o lado.",
  },
  {
    id: "desejos",
    nav: "Desejos",
    titulo: "Lista de Desejos",
    descricao: "Uma lista sem pressa do que ainda quero jogar — toque para abrir a página.",
  },
  {
    id: "projetos",
    nav: "Projetos",
    titulo: "Projetos",
    descricao: "Coisas que fiz, coisas que estou fazendo e espaço para o que vem.",
  },
  {
    id: "alternativas",
    nav: "Alternativas",
    titulo: "Alternativas",
    descricao: "Apps que ganharam meu espaço no lugar dos de sempre.",
  },
];

/* ==========================================================================
   3. PERFIS
   ==========================================================================
   - `icone`: arquivo dentro de assets/icons/
   - `usuario`: texto pequeno abaixo do nome
   - `url`: link do perfil. `null` = card sem link (o botão Copiar aparece
     quando `copiar` existe).
   - `cor`: cor principal do ícone. Ela tinge o vidro do card e o brilho no hover.
   - `copiar`: texto que o botão "Copiar" coloca na área de transferência.
   - `fundoIcone`: fundo opcional do selo do ícone (útil para logos escuros).
   ========================================================================== */
export const perfis = [
  {
    id: "roblox",
    nome: "Roblox",
    usuario: "@Itsj0ld",
    icone: "assets/icons/roblox.svg",
    cor: "#5b8cff",
    url: "https://www.roblox.com/users/4224285320/profile",
  },
  {
    id: "instagram",
    nome: "Instagram",
    usuario: "@nat.csta",
    icone: "assets/icons/instagram.svg",
    cor: "#e6688a",
    url: "https://www.instagram.com/nat.csta",
  },
  {
    id: "steam",
    nome: "Steam",
    usuario: "j0ld",
    icone: "assets/icons/steam.svg",
    cor: "#66c0f4",
    url: "https://steamcommunity.com/id/j0ld",
  },
  {
    id: "xbox",
    nome: "Xbox",
    usuario: "@Dyleenium",
    icone: "assets/icons/xbox.svg",
    cor: "#5ed67a",
    url: "https://www.xbox.com/pt-BR/play/user/Dyleenium",
  },
  {
    id: "discord",
    nome: "Discord",
    usuario: "j0ld.gg",
    icone: "assets/icons/discord.svg",
    cor: "#5865f2",
    url: "https://discord.gg/aw49G4U9FV",
  },
  {
    id: "namemc",
    nome: "NameMC",
    usuario: "j0ld",
    icone: "assets/icons/namemc.svg",
    cor: "#dfe9f7",
    url: "https://namemc.com/profile/j0ld",
  },
  {
    id: "riot",
    nome: "Riot",
    usuario: "j0ld#0000",
    icone: "assets/icons/riot.svg",
    cor: "#ff4655",
    url: "https://qrlogin.riotgames.com/riotmobile/?friendCode=j0ld%20%230000",
  },
  {
    id: "youtube",
    nome: "YouTube",
    usuario: "@j0ldd",
    icone: "assets/icons/youtube.svg",
    cor: "#ff4444",
    url: "https://www.youtube.com/@j0ldd",
  },
  {
    id: "twitter",
    nome: "Twitter",
    usuario: "@dyleenium",
    icone: "assets/icons/twitter.svg",
    cor: "#4aa8f0",
    url: "https://x.com/dyleenium",
  },
  {
    id: "pinterest",
    nome: "Pinterest",
    usuario: "j0ld",
    icone: "assets/icons/pinterest.svg",
    cor: "#ef3b52",
    url: "https://pinterest.com/j0ld/",
  },
  {
    id: "tiktok",
    nome: "TikTok",
    usuario: "@j0ldd",
    icone: "assets/icons/tiktok.svg",
    cor: "#25f4ee",
    fundoIcone: "#f4fbff",
    url: "https://www.tiktok.com/@j0ldd",
  },
  {
    id: "epic-games",
    nome: "Epic Games",
    usuario: "j0ld.me",
    icone: "assets/icons/epic-games.svg",
    cor: "#c7d4e6",
    // Sem URL por enquanto; o botão copia o usuário para adicionar depois.
    copiar: "j0ld.me",
    url: null,
  },
];

/* ==========================================================================
   4. BIBLIOTECA DE JOGOS
   ==========================================================================
   - A ordem abaixo segue o Cards/Biblioteca/Links.md.
   - `imagem`: capa WebP (267 × 400). `null` gera um card de fallback elegante.
   - `url`: página oficial/loja. `null` = card sem clique e sem botão.
   ========================================================================== */
export const biblioteca = [
  {
    id: "warzone",
    nome: "Warzone",
    imagem: "assets/cards/biblioteca/warzone.webp",
    url: "https://store.steampowered.com/app/1962663/Call_of_Duty_Warzone/",
  },
  {
    id: "cs2",
    nome: "Counter-Strike 2",
    imagem: "assets/cards/biblioteca/counter-strike-2.webp",
    url: "https://store.steampowered.com/app/730/CounterStrike_2/",
  },
  {
    id: "call-of-duty-mobile",
    nome: "Call of Duty Mobile",
    imagem: "assets/cards/biblioteca/call-of-duty-mobile.webp",
    url: "https://www.callofduty.com/mobile",
  },
  {
    id: "batman-arkham-knight",
    nome: "Batman: Arkham Knight",
    imagem: "assets/cards/biblioteca/batman-arkham-knight.webp",
    url: "https://store.steampowered.com/app/208650/Batman_Arkham_Knight/",
  },
  {
    id: "elden-ring",
    nome: "Elden Ring",
    imagem: "assets/cards/biblioteca/elden-ring.webp",
    url: "https://store.steampowered.com/app/1245620/ELDEN_RING/",
  },
  {
    id: "delta-force",
    nome: "Delta Force",
    imagem: "assets/cards/biblioteca/delta-force.webp",
    url: "https://store.steampowered.com/app/2507950/Delta_Force/",
  },
  {
    id: "valorant",
    nome: "Valorant",
    imagem: "assets/cards/biblioteca/valorant.webp",
    url: "https://playvalorant.com/",
  },
  {
    id: "minecraft",
    nome: "Minecraft",
    imagem: "assets/cards/biblioteca/minecraft.webp",
    url: "https://www.minecraft.net/about-minecraft",
  },
  {
    id: "roblox",
    nome: "Roblox",
    imagem: "assets/cards/biblioteca/roblox.webp",
    url: "https://about.roblox.com/",
  },
  {
    id: "krunker",
    nome: "Krunker.io",
    imagem: "assets/cards/biblioteca/krunker.webp",
    url: "https://krunker.io/",
  },
  {
    id: "rainbow-six-siege",
    nome: "Rainbow Six Siege",
    imagem: "assets/cards/biblioteca/rainbow-six-siege.webp",
    url: "https://store.steampowered.com/app/359550/Tom_Clancys_Rainbow_Six_Siege/",
  },
  {
    id: "arena-breakout-infinite",
    nome: "Arena Breakout: Infinite",
    imagem: "assets/cards/biblioteca/arena-breakout-infinite.webp",
    url: "https://store.steampowered.com/app/2073620/Arena_Breakout_Infinite/",
  },
  {
    id: "pubg-mobile",
    nome: "PUBG Mobile",
    imagem: "assets/cards/biblioteca/pubg-mobile.webp",
    url: "https://www.pubgmobile.com/",
  },
  {
    id: "fortnite",
    nome: "Fortnite",
    imagem: "assets/cards/biblioteca/fortnite.webp",
    url: "https://www.fortnite.com/",
  },
  {
    id: "split-second",
    nome: "Split/Second",
    imagem: "assets/cards/biblioteca/split-second.webp",
    url: "https://store.steampowered.com/app/297860/SplitSecond/",
  },
  {
    id: "bloons-td-6",
    nome: "Bloons TD 6",
    imagem: "assets/cards/biblioteca/bloons-td-6.webp",
    url: "https://store.epicgames.com/p/bloons-td-6-bf95a0",
  },
  {
    id: "oblivity",
    nome: "Oblivity",
    imagem: "assets/cards/biblioteca/oblivity.webp",
    url: "https://store.steampowered.com/app/1389990/Oblivity_Find_your_perfect_Sensitivity/",
  },
  {
    id: "castle-crashers",
    nome: "Castle Crashers",
    imagem: "assets/cards/biblioteca/castle-crashers.webp",
    url: "https://store.steampowered.com/app/204360/Castle_Crashers/",
  },
];

/* ==========================================================================
   5. LISTA DE DESEJOS
   ==========================================================================
   A ordem segue o Cards/Lista de desejos/Links wishes.md.
   Cada item tem link e usa o mesmo card clicável da biblioteca; o coração
   rosado é o único detalhe que diferencia a seção.
   ========================================================================== */
export const desejos = [
  {
    id: "forza-horizon-6",
    nome: "Forza Horizon 6",
    imagem: "assets/cards/desejos/forza-horizon-6.webp",
    url: "https://store.steampowered.com/app/2483190/Forza_Horizon_6/",
  },
  {
    id: "battlefield-bad-company-2",
    nome: "Battlefield: Bad Company 2",
    imagem: "assets/cards/desejos/battlefield-bad-company-2.webp",
    url: "https://store.steampowered.com/app/24960/Battlefield_Bad_Company_2/",
  },
  {
    id: "rayman-legends",
    nome: "Rayman Legends",
    imagem: "assets/cards/desejos/rayman-legends.webp",
    url: "https://store.steampowered.com/app/242550/Rayman_Legends/",
  },
  {
    id: "cod-black-ops-2",
    nome: "Call of Duty: Black Ops II",
    imagem: "assets/cards/desejos/call-of-duty-black-ops-ii.webp",
    url: "https://store.steampowered.com/app/202970/Call_of_Duty_Black_Ops_II/",
  },
  {
    id: "cod-ghosts",
    nome: "Call of Duty: Ghosts",
    imagem: "assets/cards/desejos/call-of-duty-ghosts.webp",
    url: "https://store.steampowered.com/app/209160/Call_of_Duty_Ghosts/",
  },
  {
    id: "cod-mw2",
    nome: "Call of Duty: Modern Warfare II",
    imagem: "assets/cards/desejos/call-of-duty-modern-warfare-2.webp",
    url: "https://store.steampowered.com/app/3595230/Call_of_Duty_Modern_Warfare_II/",
  },
  {
    id: "cod-wwii",
    nome: "Call of Duty: WWII",
    imagem: "assets/cards/desejos/call-of-duty-wwii.webp",
    url: "https://store.steampowered.com/app/476600/Call_of_Duty_WWII/",
  },
  {
    id: "forza-horizon-5",
    nome: "Forza Horizon 5",
    imagem: "assets/cards/desejos/forza-horizon-5.webp",
    url: "https://store.steampowered.com/app/1551360/Forza_Horizon_5/",
  },
  {
    id: "halo-infinite",
    nome: "Halo Infinite",
    imagem: "assets/cards/desejos/halo-infinite.webp",
    url: "https://www.xbox.com/pt-BR/games/store/halo-infinite/9np1p1wfs0lb",
  },
  {
    id: "arc-raiders",
    nome: "Arc Raiders",
    imagem: "assets/cards/desejos/arc-raiders.webp",
    url: "https://store.steampowered.com/app/1808500/ARC_Raiders/",
  },
];

/* ==========================================================================
   6. PROJETOS
   ==========================================================================
   COMO ADICIONAR UM PROJETO PRONTO:
   copie o objeto da calculadora, troque os campos e mantenha status "pronto".

   COMO PREENCHER UMA CAIXA VAZIA ("Projeto em andamento"):
   1. Encontre um item com status: "em-andamento".
   2. Troque `titulo`, `descricao`, `link`, `preview`, `previewTipo` e `tags`.
   3. Mude `status` para "pronto".
   Pronto: a caixa vazia vira um card normal automaticamente.

   Campos:
   - previewTipo: "iframe" (site embutido) | "imagem" (caminho de imagem) | null.
   - preview: URL do iframe ou caminho da imagem. Se falhar, o site mostra um
     fallback elegante com o botão "Abrir projeto" funcionando normalmente.
   - tags: array de textos curtos. Pode deixar [].
   - status: "pronto" | "em-andamento".

   EXEMPLO COMENTADO (descomente e ajuste para adicionar um novo projeto):
   {
     id: "meu-novo-projeto",
     titulo: "Meu novo projeto",
     descricao: "Uma frase curta explicando o que é e por que ele existe.",
     link: "https://exemplo.com",
     preview: "https://exemplo.com",
     previewTipo: "iframe",
     tags: ["Web", "Experimento"],
     status: "pronto",
   },
   ========================================================================== */
export const projetos = [
  {
    id: "calculadora-liquid-glass",
    titulo: "Calculadora Liquid Glass",
    descricao:
      "Uma calculadora de vidro líquido com histórico, atalhos de teclado e teclas que dão gosto de apertar.",
    link: "https://calc-liquidglass.vercel.app/",
    preview: "https://calc-liquidglass.vercel.app/",
    previewTipo: "iframe",
    tags: ["Web", "CSS", "Interação"],
    status: "pronto",
  },
  {
    id: "projeto-em-andamento-1",
    titulo: "Projeto em andamento",
    descricao: "Ainda estou escolhendo o que vem depois. Este espaço guarda a próxima ideia.",
    link: null,
    preview: null,
    previewTipo: null,
    tags: [],
    status: "em-andamento",
  },
  {
    id: "projeto-em-andamento-2",
    titulo: "Projeto em andamento",
    descricao: "Outra ideia tomando forma. Em breve, algo novo mora aqui.",
    link: null,
    preview: null,
    previewTipo: null,
    tags: [],
    status: "em-andamento",
  },
];

/* ==========================================================================
   7. ALTERNATIVAS A APPS COMUNS
   ==========================================================================
   - `substitui`: o app (ou apps) que a recomendação substitui.
   - `categoria`: usada para gerar os filtros. Crie categorias livremente.
   - `descricao`: opcional; se ficar vazia, o card não mostra a linha.
   - `imagem`: opcional; caminho de um ícone/logo. Sem imagem, o site mostra
     a inicial do app em um selo de vidro.
   - `url`: link oficial.
   ========================================================================== */
export const alternativas = [
  {
    id: "filen",
    nome: "Filen",
    substitui: "Dropbox",
    categoria: "Arquivos",
    descricao: "",
    imagem: "assets/cards/alternativas/filen.webp",
    url: "https://filen.io/",
  },
  {
    id: "stremio",
    nome: "Stremio",
    substitui: "Netflix / Disney+",
    categoria: "Mídia",
    descricao: "",
    imagem: "assets/cards/alternativas/stremio.webp",
    url: "https://www.stremio.com/translation/br",
  },
  {
    id: "aurora-store",
    nome: "Aurora Store",
    substitui: "Play Store",
    categoria: "Android",
    descricao: "",
    imagem: "assets/cards/alternativas/aurora-store.webp",
    url: "https://auroraoss.com/aurora-store",
  },
  {
    id: "material-files",
    nome: "Material Files",
    substitui: "Gerenciador de arquivos",
    categoria: "Arquivos",
    descricao: "",
    imagem: "assets/cards/alternativas/material-files.webp",
    url: "https://github.com/zhanghai/MaterialFiles",
  },
  {
    id: "echo-music",
    nome: "Echo Music",
    substitui: "Spotify / YouTube Music",
    categoria: "Mídia",
    descricao: "",
    imagem: "assets/cards/alternativas/echo-music.webp",
    url: "https://echomusic.fun/",
  },
  {
    id: "thunderbird",
    nome: "Thunderbird",
    substitui: "Gmail / Apple Mail / Outlook",
    categoria: "Produtividade",
    descricao: "",
    imagem: "assets/cards/alternativas/thunderbird.webp",
    url: "https://www.thunderbird.net/pt-BR/",
  },
  {
    id: "circleranks",
    nome: "CircleRanks",
    substitui: "Letterboxd",
    categoria: "Mídia",
    descricao: "",
    imagem: "assets/cards/alternativas/circle-ranks.webp",
    url: "https://circleranks.com/",
  },
  {
    id: "ente-auth",
    nome: "Ente Auth",
    substitui: "Google Authenticator / Microsoft Authenticator",
    categoria: "Privacidade",
    descricao: "",
    imagem: "assets/cards/alternativas/ente-auth.webp",
    url: "https://ente.com/auth/",
  },
  {
    id: "artcraft",
    nome: "ArtCraft",
    substitui: "Adobe / Microsoft Office",
    categoria: "Produtividade",
    descricao: "",
    imagem: "assets/cards/alternativas/artcraft.webp",
    url: "https://getartcraft.com/",
  },
  {
    id: "zapfast",
    nome: "ZapFast",
    substitui: "WhatsApp Web",
    categoria: "Conversas",
    descricao: "",
    imagem: "assets/cards/alternativas/zapfast.webp",
    url: "https://zapfast.rocks/",
  },
  {
    id: "spotifast",
    nome: "SpotiFast",
    substitui: "Spotify App / Web",
    categoria: "Mídia",
    descricao: "",
    imagem: "assets/cards/alternativas/spotifast.webp",
    url: "https://spotifast.rocks/",
  },
  {
    id: "ecogpt",
    nome: "EcoGPT",
    substitui: "ChatGPT",
    categoria: "Produtividade",
    descricao: "",
    imagem: "assets/cards/alternativas/ecogpt.webp",
    url: "https://ecogpt.com/about",
  },
];
