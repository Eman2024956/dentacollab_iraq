# Reference and validation notes

Inspected: https://www.dentacollab.org/ on 1 October 2026.

## Reference evidence

- Public homepage and course listing were opened in a browser and visually inspected.
- Public HTML and browser-delivered JavaScript were inspected to enumerate route declarations, labels, colors, asset references and page structures.
- Other routes were reconstructed from their public component structure; they were not all visually inspected in the live browser.
- Public backend-driven lists appeared empty or unavailable during inspection. No authenticated access or private records were used.
- The downloaded original JavaScript bundle is **not** included; `src/` is independently authored readable React code.

## Asset provenance

All files below were downloaded from `https://www.dentacollab.org/` with the matching filename:

`logo.png`, `dentacollab-hero.png`, `dr-ammar.png`, `exoplan.jpg`, `printer.jpg`, `smale.jpg`, `step-1.jpg`, `step-2.jpg`, `step-3.jpg`, `step-4.jpg`, `steps.jpg`, `denta-bot.png`.

They are stored in `public/assets/`. Image ownership and third-party rights remain with their respective holders. The trainer photo is the public reference asset; the demonstration name and biography are explicitly sample data, not an attribution to the pictured person.

The body fonts are IBM Plex Sans Arabic and Inter, requested from Google Fonts with system fallbacks.

The teeth and implant viewer embeds reproduce public references from the site:

- Teeth: https://sketchfab.com/3d-models/upper-jaw-teeth-anatomy-35b057aa657d4e48989c0c6af657f41d — elmagnifico. The original labels the license only as “Sketchfab”; no blanket download/reuse permission is asserted.
- Implant: https://sketchfab.com/3d-models/implante-dental-ede1a07475db4236b43a6cd168d1225d — drandrescordova. Public site attribution: CC BY.

The guide preview uses original CSS geometry and is explicitly non-medical. No third-party model was downloaded or represented as clinically accurate.

## Validation

- Production bundle compiled successfully with Vite.
- `npm run check` renders the route cases in both Arabic and English, checks local image paths, missing-detail states and payment preview boundaries.
- Build output is included in `dist/`.
- Browser visual/interaction QA of the reconstruction was attempted, but the environment blocked the internal preview URL with `ERR_BLOCKED_BY_CLIENT`. Therefore browser rendering, touch behavior and external embeds were **not visually verified** for this reconstruction.
- Responsive CSS includes desktop/tablet/mobile layouts; these rules passed source checks, not device screenshot comparison.

## Before production use

Replace sample content, confirm rights to reused assets/branding, connect your backend, verify payments server-side, and test forms, accessibility, mobile layouts and supported browsers with your own deployment.
