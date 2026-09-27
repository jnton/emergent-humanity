# Audit evidence — 27 September 2026

Baseline: `f2a1150`. Screenshots are local Chromium captures, not a production or physical-device certification. No application code was changed during this audit.

## Visual inspection

| Evidence | Contents |
|---|---|
| `contact-390-0.jpg` | Phone chapters 01–09, initial sampled states. |
| `contact-390-9.jpg` | Phone chapters 10–17, initial sampled states. |
| `contact-1440-0.jpg` | Desktop chapters 01–09, initial sampled states. |
| `contact-1440-9.jpg` | Desktop chapters 10–17, initial sampled states. |
| `contact-interacted-0.jpg` | Phone chapters 01–09 after scripted controls/waiting. |
| `contact-interacted-9.jpg` | Phone chapters 10–17 after scripted controls/waiting. |
| `390-<chapter-id>.png` | Full-resolution phone visualization pane. |
| `1440-<chapter-id>.png` | Full-resolution desktop visualization pane. |
| `interacted-<chapter-id>.png` | Full-resolution later phone state. |
| `rotation-chaos.png` | Whole chaos section after changing viewport from 390×844 to 844×390. |
| `browser-observations.json` | Canvas sizes, statistics text, and stats/hint rectangle intersection results for all 34 baseline captures. |
| `runtime-probes.json` | Exact results of rotation, reduced motion, and in-flight control probes. |
| `mathematical-checks.json` | Independent numerical verification of the nonzero consensus perturbation residual. |
| `capture-baseline.mjs` | Reproducible all-chapter screenshot and geometry utility. |
| `probe-runtime.mjs` | Reproducible targeted defect probes and later-state phone captures. |

Contact sheets are convenience thumbnails; inspect the original PNG before judging small text. Default screenshots were sampled after scrolling and about 450 ms waiting, plus capture overhead. Later screenshots were sampled after actions and about 800 ms waiting (intro waited 4.8 seconds). These are not synchronized animations or proof of settled state. Production randomness was not seeded. The first capture can legitimately show the start of a reveal.

The custom later-state sweep programmatically invoked buttons and changed sliders. It is a visual/state probe, **not evidence that every action is physically tappable**. It did not traverse every epoch and every mode. The existing browser suite separately exercised controls and captured additional states; its canvas tests remain limited.

## Observed overlaps

At 390×844, the statistics and hint rectangles intersected in:

`emergent-organism`, `illusion-of-significance`, `node-quantity`, `connection-quantity`, `connection-quality`, `cohesion`, `alignment`, `collective-memory`, `entropy`, `productivity`, `comparative-emergence`.

At 1440×900:

`node-quantity`, `connection-quantity`, `connection-quality`, `cohesion`, `alignment`, `collective-memory`, `productivity`, `comparative-emergence`.

The measurement tests intersection of nonempty rectangles, not exact glyph collision. Screenshot inspection confirmed obscured content. The test does not include text painted directly on canvas; External Memory and Comparative Emergence have additional conflicts there.

## Targeted reproductions

**In-flight repetition mode:** navigate to Noise and Error Correction; send a single-copy message; immediately turn on five-copy decoding; remain on the scene. After 5.5 seconds the probe read:

```text
p 4%/hop · 3 hops · 5× majority decode · Transmitting
```

Source confirms the completion check uses the newly selected copy count although only one packet was launched. Fix the experiment state, not merely the label.

**Rotation:** enter Small Causes, Large Futures at 390×844; change viewport to 844×390. Before: canvas width 390, CSS width 390. After: parent width 844, canvas width 390, CSS width 390. The chapter does not return a resize method.

**Reduced motion:** enable `prefers-reduced-motion: reduce`; enter Better Connections; compare stats after 1.2 seconds. Reached nodes changed from 2 to 10 and transmissions from 1 to 10. This confirms model evolution continues; it does not imply every browser's accessibility behavior was tested.

## Test results

`npm run test:static`: passed; 17 chapters, 28 controls.

`npm run test:browser`: 13 passed, 1 failed in 35.3 seconds. Failure: `audio-output.spec.mjs`, expected analyser level >2, received 2 within its 7-second window. All other existing tests passed, including mobile canvas containment and interaction smoke tests.

`npm run test:browser -- tests/browser/audio-output.spec.mjs`: one passed in 7.5 seconds. The discrepancy is intermittent; its cause was not established. No human listening assessment was performed.

The first sandboxed attempt could not bind the preview server. The browser runs above succeeded with approved execution permissions. This was an environment restriction, not a website defect.

No Lighthouse run, physical-device profiling, Safari/Firefox run, user study, full screen-reader audit, or formal mathematical proof assistant verification was performed.

## Reproducing the browser probes

From the repository root, start a loopback preview in a separate terminal:

```sh
python3 -m http.server 4174 --bind 127.0.0.1
```

Then run either utility with the existing local Playwright dependency:

```sh
node docs/audit-2026-09-27/capture-baseline.mjs
node docs/audit-2026-09-27/probe-runtime.mjs
```

These utilities overwrite their corresponding captures and JSON. Preserve the baseline evidence before running against a changed implementation. They use an emulated viewport/touch capability, not physical-device hardware or a mobile Safari engine. Their output records observations; it does not itself assert all correctness requirements.
