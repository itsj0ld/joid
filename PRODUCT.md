# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Friends and the gaming community who know Natan online and arrive through a single shared link. They come to find his profiles, see what he plays and wants to play, and pick up recommendations worth trying.

## Product Purpose

A personal one-page corner that gathers Natan's profiles, game library, wishlist, projects, and app alternatives in one place. It succeeds when a visitor finds the profile they came for and leaves with at least one recommendation they act on.

## Positioning

Not a plain link-in-bio: a slow, curated personal corner where taste is the product — the games kept installed, the ones still wanted, and the everyday apps replaced by better alternatives. *(Inferred from the current site and the confirmed goal of sharing recommendations.)*

## Operating Context

Shared as one link in chats and bios, and opened on phones and desktops by people already in gaming and online communities. Natan is the only author; content is written in Portuguese. *(Inferred from the current implementation.)*

## Capabilities and Constraints

- Six sections in fixed order, driven by `js/data.js`: Destaques, Perfis, Biblioteca, Desejos, Projetos, Alternativas.
- Profiles link out, or copy a handle when no URL exists (Epic Games copies `j0ld.me`).
- Biblioteca is a draggable, keyboard-navigable carousel; Desejos reuses the same card in a grid; Projetos supports iframe or image previews with a graceful fallback; Alternativas filter by category.
- The current implementation is static HTML/CSS/ES modules with no build step, deployed on Vercel, with all content centralized in `js/data.js`. This describes what exists; it was not confirmed as a constraint future work must preserve.
- Portuguese (pt-BR) only; no English version is planned.
- Calculadora Liquid Glass is Natan's own project.

## Brand Commitments

Name: Natan. Aliases: j0ld, dyleenim, schxzm. The voice is quiet, personal, and unhurried ("sem pressa", "feito com calma"). No logo or external brand guideline exists beyond the site's own mark. The site's own dark navy, glass and serif identity is the brand: no external product sets the visual bar. Refinement preserves that world and raises its craft; a replacement world needs an explicit new decision from Natan.

## Evidence on Hand

- Real profile URLs and handles in `js/data.js`.
- 18 library covers, 10 wishlist covers, and 12 app icons in `assets/`; hero video and poster in `assets/videos/`.
- One shipped project with a live URL: Calculadora Liquid Glass (`https://calc-liquidglass.vercel.app/`).
- No testimonials, customer counts, benchmarks, press, or pricing exist. Future work must not fabricate them.

## Product Principles

1. One link, many doors: every profile and recommendation is a couple of taps away.
2. Taste over inventory: a short, deliberate list beats a long catalog.
3. Calm by default: the site should feel unhurried even where it is dense.
4. A recommendation earns its place by replacing something familiar.
5. Natan's own work is presented as work, not as decoration.
