# Visual restoration — 27 September 2026

The user rejected the replacement aesthetic and animation style. The main page now restores the original presentation from `f2a1150` and uses the later chapter titles from `a045013` (merged in `c57f59c`). The previous implementation report describes an interim design, not the accepted direction.

## Main experience

- Restored the original particle-network hero, gradient title, typography, dark palette, pill controls, desktop split layout, phone chapter headings, and original chapter animation modules.
- The correct titles include **A Node Goes Dark**, **A Tiny Difference**, **More Minds**, **Closing the Distance**, **When Information Fails**, **The Network Splits**, **Moving Together**, **Touching Reality**, **Memory Beyond the Individual**, **Memory Outside the Brain**, **Against Noise**, **More Than the Sum**, **Same Pattern, Different Matter**, and **How Humanity Thrives**. Titles are shared by both presentations, navigation and generated editions.
- Hints, canvas, statistics, and controls have separate layout space. The original visual style remains; labels no longer overlay each other. Stage resizing follows actual content size, including statistics changes and rotation.
- Retained opt-in audio and added animation pause/resume in the existing sound/options menu. Reduced-motion preferences use static frames.
- Retained narrower scientific wording where the original text overreached. The animated capacity ceiling is explicitly illustrative, averaging can retain a residual, and structural importance does not measure human worth.
- The original animated coding experiment now freezes noise and repetition settings for each transmission. Changing settings mid-flight applies to the next message.
- Native switch focus stays within the visible label; chapter activation follows the section containing the viewport centre. Focus/deep-link scrolling settles immediately so a pending smooth scroll cannot carry a running experiment offscreen.

## Quantitative experiments

The rebuilt deterministic experiments remain available at `lab.html`, accessible from the footer and model notes. They are optional. They do not replace the original visual presentation. The subsequent [reader experience update](READER-EXPERIENCE.md) replaces the repeated technical disclosure with a small sources link and an opt-in measurements setting.

The mathematical notes describe that lab. They explicitly identify its scope and link to the correct experiment. The main illustrative animations have a different state model and should not be described as the same fixed-step seeded experiments. Reader-facing prose is generated from the main essay; quantitative parameters and notes come from the lab records.

## Ownership

See README for the full map. Main visual presentation: `js/app.js`, `js/visualizations/`, `css/style.css`, `css/experience.css`, `css/mobile.css`, and the narrow `css/restoration.css` layout fix. Main prose and original controls: `content/illustrations.js`. Shared titles and quantitative model definitions: `content/sections.js`. Optional lab: `lab.html`, `js/lab.js`, `css/lab.css`, `js/models/`, `js/runtime/`, `js/renderers/`.

## Verification

The restoration tests exercise all 17 visible canvases at 320, 390 and 1440 pixels, match every title against the shared source, check caption/canvas separation and horizontal overflow, test the original coding animation's frozen settings, check reduced motion and rotation, and confirm that the restored hero and network illustration actually animate. The numerical tests and lab browser checks remain separate. Saved screenshots are in `docs/style-restoration/`.

These are local browser and code checks. Physical-device performance and subjective animation/audio quality still require user observation. No publication, push or commit was performed.
