# Emergent Humanity

An animated essay with the original network aesthetic and 17 optional quantitative experiments. The models explore coordination, information, learning, memory, and trade-offs. They do not establish that humanity is literally an organism or prove a universal social prescription.

## Local workflow

```sh
npm install
npm run generate
npm test
npm run preview
npm run test:browser
```

Preview: http://127.0.0.1:4173. `lab.html` opens the quantitative experiments; `lab.html?pilot` shows the three migration pilots. `essay.html` is the no-JavaScript reading edition; `methods.html` explains model rules and evidence boundaries.

## Source ownership

- `content/sections.js`: shared chapter titles (the later evocative titles), quantitative experiment prose, controls, assumptions and model descriptions.
- `content/illustrations.js`: prose, hints and controls matched to the main animated essay.
- `content/references.js`: source URLs, scope, and review status.
- `js/models/`: pure deterministic state machines and numerical functions.
- `js/runtime/experiment.js`: shared animation clock, visibility, transport, resize, cleanup.
- `js/renderers/scenes.js`: canvas rendering; never advances model state.
- `js/app.js`: main animated essay, original hero and chapter assembly.
- `js/visualizations/` and `js/lib/network-engine*.js`: original animation modules with focused correctness fixes.
- `css/style.css`, `css/experience.css`, `css/mobile.css`: original visual language; `css/restoration.css` reserves separate space for captions, animation and controls.
- `js/lab.js` and `css/lab.css`: optional quantitative lab.
- `scripts/generate-content.mjs`: generates `essay.html`, `methods.html`, `content/essay.md`, `content/model-notes.md`, and `content/claims.json`. Do not edit generated editions directly.

The main essay loads the original D3 animation engine and mobile layout. The quantitative lab has no D3 dependency. `js/main.js` remains unused. Do not replace the main visual language with the lab presentation.

In the lab, every model starts paused. Run advances a fixed logical step every 300 ms; Step advances once. Reset reproduces the default seeded experiment. Background and offscreen models stop advancing, and returning does not catch up missed time. A global motion control freezes animation; explicit controls remain usable. Reduced-motion mode removes interpolation and requires an explicit Run to advance continuously.

Lab numerical comparisons use the same seed and population across screen sizes. The source notes distinguish empirical evidence, model-specific statements, illustrative analogies, and philosophical interpretation. Source review is incomplete where explicitly marked.

See [implementation status](docs/IMPLEMENTATION-STATUS.md), [master plan](docs/MASTER-PLAN.md), and [original audit](docs/audit-2026-09-27/). Physical iOS/Android testing, assistive-technology sessions, comprehension studies, and independent expert review remain release gates.

See [visual restoration](docs/STYLE-RESTORATION.md) and the subsequent [reader experience update](docs/READER-EXPERIENCE.md) for the current presentation and checks.

For the reproducible lab cross-engine smoke check and refreshed visual evidence, start the preview, then run `node scripts/visual-smoke.mjs`. It requires the Playwright Chromium, Firefox and WebKit engines. It writes into `docs/implementation-evidence/`.
