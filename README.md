# Part A.The World Of Praze
© 2026 ZpycuA.   
This work is licensed under CC BY-NC 4.0.     
See the [LICENSE](./LICENSE) file for details.    

The function of build.py is to convert Markdown into HTML in the style of this site's web version.
# Part B.Asaka Straight Project 2D(Web)
A 2D extraction shooter running in the browser, built as a companion title
to the *Praze* setting. Physics-based damage, multi-layer armor penetration,
Prazer coupling energy, four playable characters, three maps, full AI
teammates and enemies, and a dedicated training range — all in a single
self-contained HTML/Canvas build.

## Features
- **Physics-first combat.** Bullets carry real kinetic energy (½mv²),
  decay over distance, and resolve through hit zones, multi-layer armor
  (shell / visor / ear / fiber / plate) and per-piece durability.
- **Prazer coupling system.** Cat and fox characters spend "coupling
  energy" for protection tiers L1–L3 and skills, following the exact
  formula from the setting (ψ ≈ 0.00335791, T_eff = 0.5).
- **4 characters** — Kate (sniper cat), Lingna (assault fox), Captain
  (human commander), Buwen (human heavy). Each with distinct weapons,
  skills and playstyle.
- **3 maps** — Nipersil Factory, Border Town, Continental Bank Vault.
  Each with a unique boss (Leader / Krona Chi / Nirien Yukino).
- **Full inventory & drag-and-drop gear system**, four containers
  (chest rig / pocket / backpack / safe box) and four equip slots
  (primary / secondary / helmet / vest) with sub-slots.
- **Dynamic AI** — vision cones, cover-seeking, downed-ally rescue,
  grenade usage, better-weapon pickup, faction hostility.
- **Rich throwables** — flash, smoke, stun, frag, incendiary, EMP,
  plus 43mm HE / thermobaric launcher rounds.
- **Event system** — supply drops, P-space fluctuations, sandstorms.
- **Assist toggles** — minimap, enemy HP, damage numbers, hit markers,
  gunline, extraction hints, hurt FX, damage direction, boss bar,
  sound ripples, kill feed, and more.
- **Dual platform** — touch (mobile) and mouse+keyboard (PC).

## Play

- **Game:** https://zpycua.github.io/Praze_Site/asp2d/
- **Manual / help:** https://zpycua.github.io/Praze_Site/asp2d/help.html
- **Source:** https://github.com/ZpycuA/Praze_Site

> Serving note: `data.js` and `index.html` must be hosted over HTTP(S)
> (e.g. GitHub Pages). Opening `index.html` directly from disk will not
> load the data layer.

## Version
v0.39 — 39 iterations in, officially live.
