# Natan — um canto pessoal

Site pessoal de página única, com tema escuro azul-marinho e efeitos de vidro
líquido. Feito com HTML, CSS e JavaScript puro (módulos ES), sem build e sem
dependências.

## Estrutura

```
index.html
css/
  base.css          tokens, reset, fundo, tipografia e acessibilidade
  components.css    vidro, loader, cabeçalho, menu, botões e títulos
  sections.css      hero, perfis, biblioteca, desejos, projetos e alternativas
js/
  data.js           TODO o conteúdo do site (é o único arquivo que você edita)
  render.js         monta as seções a partir de data.js
  interactions.js   menu, carrossel, filtros, prévias e revelações
  effects.js        partículas, brilho do cursor, tilt, magnético e parallax
  loader.js         carregamento com progresso real
  icons.js          ícones de interface em SVG inline
  main.js           ponto de entrada
assets/
  icons/            ícones dos perfis (SVG)
  cards/biblioteca/ capas WebP 267 × 400
  cards/desejos/    capas WebP 267 × 400
  cards/alternativas/ ícones WebP dos apps
  videos/           hero.webm e hero-poster.jpg
  favicon.svg, apple-touch-icon.png, og-cover.jpg
vercel.json
.vercelignore        evita subir as pastas originais no deploy
robots.txt
```

## Rodar localmente

Módulos ES não funcionam abrindo o arquivo direto (`file://`). Use um servidor
local na pasta do site:

```bash
# Python 3
python -m http.server 8000
```

Depois abra <http://localhost:8000>.

## Editar o conteúdo

Quase tudo vive em **`js/data.js`**:

- `site`: nome, apelidos do cabeçalho, meta tags, hero, textos do loader e
  mensagem final.
- `secoes`: títulos, descrições e rótulos do menu. A ordem do array é a ordem
  das seções na página.
- `perfis`: nome, usuário, ícone, cor e URL. A `cor` tinge o vidro do card.
  Deixe `url: null` para um card sem clique; adicione `copiar: "usuário"` para
  mostrar o botão **Copiar** (caso da Epic Games). `fundoIcone` clareia o selo
  de ícones escuros, como o do TikTok.
- `biblioteca`: capas 267 × 400 e links, na ordem do `Cards/Biblioteca/Links.md`.
  `imagem: null` gera um card com as iniciais; `url: null` remove o clique.
- `desejos`: nome, imagem e link, na ordem do
  `Cards/Lista de desejos/Links wishes.md`. Usa o mesmo card clicável da
  Biblioteca, com um coração rosado no canto.
- `projetos`: `status` aceita `"pronto"` ou `"em-andamento"`. Há um exemplo
  comentado no próprio arquivo.
- `alternativas`: nome, app substituído, categoria, ícone opcional, descrição
  opcional e URL. As categorias geram os filtros automaticamente.

Para adicionar imagens, copie o arquivo para `assets/cards/biblioteca/`,
`assets/cards/desejos/` ou `assets/cards/alternativas/` e referencie o caminho
em `data.js`.

## Publicar na Vercel

1. Envie o projeto para um repositório no GitHub.
2. Na Vercel, importe o repositório.
3. Em **Framework Preset**, escolha **Other**.
4. Deixe **Build Command** e **Output Directory** vazios (é um site estático).
5. Faça o deploy. O `vercel.json` cuida do cache dos assets e de cabeçalhos
   básicos de segurança.

Também funciona em GitHub Pages, Netlify ou qualquer hospedagem estática.

## Observações

- O vídeo do hero tem cerca de **8,1 MB** (WebM/VP9, sem áudio), dentro do
  limite de 100 MB por arquivo do GitHub. O poster é exibido enquanto ele
  carrega e também serve de fallback.
- WebM é suportado no Safari/iOS a partir da versão **17.4**. Em versões
  anteriores, o fundo animado em gradiente assume o lugar.
- O único perfil sem link é o **Epic Games**; o botão **Copiar** coloca
  `j0ld.me` na área de transferência para adicionar depois.
- A Biblioteca aceita roda do mouse, arraste, setas do teclado e os botões de
  navegação. A Lista de Desejos usa a mesma interface clicável, em grade.
- O link **voltar ao topo ↑** do rodapé reinicia a entrada do site (cabeçalho,
  hero e revelações). O botão flutuante e a rolagem normal não reiniciam nada.
- Alguns links (NameMC, Fortnite, Bloons TD 6) podem responder 403 para
  verificadores automáticos por proteção contra bots, mas abrem normalmente no
  navegador.
- As meta tags Open Graph usam caminho relativo (`assets/og-cover.jpg`). Para
  melhor prévia em redes sociais, troque por uma URL absoluta depois do deploy.
- As pastas originais `Icons/`, `Cards/` e `Videos/` estão no `.gitignore` e no
  `.vercelignore`; o site publicado usa apenas `assets/`.
