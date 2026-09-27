# Reader experience — 27 September 2026

The accepted dark particle/network visual language and later chapter titles remain. This update simplifies the visible interface and makes the opening sequence explicit.

## Reading and interaction

The opening order is now **The Human Node → The Great Organism → The Limits of a Node**. The original particle animation cycles between a node, an expanding circle and a human form. In the next chapter, the animation connects that node to others and then shows the same network as one whole. The original person remains as an ordinary, off-centre member of the network; their label and visual prominence disappear before the final whole. The prose explicitly distinguishes a connected system from a single mind or will. These are illustrative changes of scale, not evidence that humanity is a biological organism.

## Correction — 28 September 2026

The user rejected the replacement Human Node animation and the opening's manual step controls. `js/visualizations/04-node-capacity.js` is restored byte-for-byte from `f2a1150`: its original multicolour particles, circle expansion and human morph must be preserved. There are no controls in either opening chapter. The Great Organism automatically cycles from a node to a network to a whole, with longer holds to allow reading. Its clock stops offscreen and under global pause. Reduced motion shows the complete network as a still image. Implementation: `js/visualizations/opening-story.js` (Great Organism only).

Buttons should be reserved for meaningful experimental choices, not required to advance a visual explanation.

The main essay now shows short explanations instead of raw numerical diagnostics. The settings menu exposes **Show measurements** for interested readers; the comparative animation also hides its formula overlays until requested. Sources remain accessible through a small **Sources & further reading** link per chapter. The optional quantitative lab is accessible from the footer and model notes. `js/reader-feedback.js` owns the plain-language explanations; underlying diagnostic values remain available.

The capacity control now works with one tap or keyboard activation. Memory has a visible **Remove the origin** button and reset. External storage uses descriptive action labels, supports reset, and stops its main progression while offscreen. Adding distant connections makes one bounded change per click and terminates at saturation; each initial local group is connected. Alignment changes coupling without secretly lowering noise. Population growth is labelled **Grow and reorganize**, with its multiple simultaneous changes explained.

## Validation and limits

The reader-flow tests cover automatic progression without opening controls, the original Human Node animating, offscreen suspension, membership preservation, reduced motion, rotation, optional measurements, source access, keyboard actions, memory removal, storage reset, and bounded connection changes. Existing browser checks cover all 17 chapters at desktop and phone sizes. Saved visual checks for the opening are in `reader-experience/`.

This verifies implementation and browser layout. It does not establish educational effectiveness, physical-device performance, or comprehensive scientific correctness. The source registry continues to identify incomplete review; the toy models retain their stated assumptions and limitations. No publication, commit, or push was performed.

## Organism refinement — 28 September 2026

The Great Organism uses an irregular connected layout instead of a radial arrangement. It starts with the original person centred in the camera, makes that node the same size and colour as all others, fades the “You” label, then pulls the camera back. The original node remains at its actual, off-centre position. No people are removed and no individual remains visually privileged. Structural links contain no moving signals.

The final whole is a softly rounded envelope derived from the actual network geometry, with subtle shared expansion and contraction. This breathing is expressive animation, not a measured biological process. The visual originally carried a word label; that label was later removed in the whole-view refinement below. The prose explicitly retains the organism metaphor's limits. The Human Node source remains unchanged from `f2a1150`.

Current captures have the `organism-` prefix. Earlier opening screenshots record superseded designs. Browser checks inspect the rendered node count, equal radii, off-centre original node, and absent “You” label, alongside autoplay, reduced motion, rotation and offscreen suspension.

## Whole-view refinement — 28 September 2026

The chapter holds on “You” before anything else appears, and restarts at that point when re-entered. As the irregular network becomes a whole, the individual dots and links fade almost entirely while the continuous envelope and its shared breathing become stronger. No word label overlays the final form. The explanatory caption is now short and neutral. Human Node is still unchanged.
