# Emergent Humanity: audit and implementation master plan

**Implementation update:** The local rebuild is recorded in [IMPLEMENTATION-STATUS.md](IMPLEMENTATION-STATUS.md). Statements below about the old runtime and pending work describe the audited baseline; use the status record and README for current ownership.

Prepared 27 September 2026. Audited baseline: `f2a1150`. Working directory: `/Users/tungsten/emergent-humanity`.

This is an implementation specification, not a claim that the implementation is finished. The audit added documentation and evidence only. Read this document before changing the product; use `IMPLEMENTER-BRIEF.md` as the execution checklist.

## 1. The decision

Rebuild the experience around **inspectable experiments that challenge intuitions**. Retain the network perspective, the concise prose, and the explicit distinction between models and reality. Repair the shared animation architecture before polishing individual graphs. Replace demonstrations that merely decorate an assertion with experiments that expose a mechanism, a counterexample, or a trade-off.

The current project is a promising explanatory essay, but it is not yet a sufficiently reliable scientific or mobile experience. Its largest weaknesses are:

1. The formal notes repeatedly describe features absent from the running simulations.
2. Readability defects affect most phone chapters, despite passing canvas tests.
3. Some experiments confound multiple variables or use labels stronger than their mathematics supports.
4. Repeated force graphs obscure the differences between information, learning, memory, coordination, and welfare.
5. The conclusion discusses multi-objective reasoning but offers only a draggable colored network.

The intended reader transformation should be: **“I can see how a result depends on relationships, incentives, memory, institutions, and assumptions—and I know what this model cannot tell me.”** Agreement with a worldview is not a success metric. A well-founded objection is a successful outcome too.

Suggested opening:

> You are one person. Almost everything you can do depends on people you will never meet.
>
> That dependence gives us extraordinary capabilities. It also lets mistakes travel, power concentrate, and failures spread.
>
> Change the rules. Watch what happens. Then ask what the model left out.

Suggested page title: **Emergent Humanity — How People Become Systems**. “A Network Theory of Human Civilization” currently implies a more comprehensive explanatory theory than the project establishes.

## 2. Audit coverage and limits

Inspected the 17 chapter definitions and text edition, formal notes, all active visualization modules, shared engine and viewport wrapper, application lifecycle, mobile layout, audio implementation, and browser/static test logic. Followed the live import map: the app uses `js/app.js`, and engine imports resolve through `js/lib/network-engine-guarded.js` to the core engine. `js/main.js` is legacy; `03-node-quality.js` is imported but not mapped to a chapter.

Executed static tests: **passed, 17 chapters and 28 controls**. Executed the full existing Chromium browser suite: **13 passed, 1 failed**. The failure was the audio test's sampled signal threshold: measured 2 where the assertion required greater than 2. A targeted rerun of that test alone **passed** (7.5 seconds total). Treat this as an intermittent test result requiring diagnosis, not evidence that audio is absent, unpleasant, or too quiet on every device. Concurrent load is a hypothesis, not a proven cause.

Captured all 17 visualization panes at 390×844 and 1440×900, plus phone states after button/slider actions. Inspected the resulting contact sheets. Captured browser geometry and targeted runtime probes. No page JavaScript exceptions occurred during the two baseline screenshot sweeps. These snapshots use unseeded production randomness and specific timings; they are evidence of observed states, not exhaustive coverage of every seed or control sequence.

The measured statistics/hint rectangles intersected in **11 phone chapters** and **8 desktop chapters**. The screenshots confirm that important text is obscured. This count excludes canvas-painted text, which has additional collisions in External Memory and Comparative Emergence.

Primary research, author copies, official abstracts, and philosophical reference material were consulted selectively. This is an interdisciplinary critical review, **not a systematic review of all relevant scholarship or independent expert certification**. Some references were only available at abstract level; Deffuant and Watts–Strogatz publisher pages could not be retrieved in this session. The source register below preserves these limits. Physical iPhone/Android performance, Safari, Firefox, screen-reader experience, listening quality, battery use, user comprehension, and production deployment remain unverified.

Evidence directory: `docs/audit-2026-09-27/`. See its README for screenshot names and probe results.

## 3. Evidence-backed defect register

Severity here is project priority: P0 blocks a trustworthy release, P1 materially damages understanding or usability, P2 improves polish/maintainability. This is not a security classification.

| ID | Priority / evidence | Finding | Required resolution |
|---|---|---|---|
| A01 | P0 / source | Formal notes claim implemented features absent in chapters 04, 05, 06, 07, 08, 10, 12, 13, 14, 15, 17. | Make documentation describe actual runtime immediately; track future work explicitly. Implement only the mechanisms specified below, then update documentation in the same change. |
| A02 | P0 / source + mathematics | Chapter 05 calls a row-stochastic averaging process “contracting consensus.” It retains the consensus mode and need not erase a perturbation. | Relabel honestly or implement the explicitly anchored contraction in §7. |
| A03 | P0 / source + browser | Chapter 14 reads current redundancy/noise settings during an in-flight run. Sending one copy then turning on five-copy decoding leaves “Transmitting” after 5.5 seconds; no other copies exist to finish it. | Snapshot run parameters. Label changes as applying to next run, or explicitly cancel/restart. |
| A04 | P1 / browser + screenshots | Statistics and instructions overlap: phone chapters 04–10, 12, 14–16; desktop 06–10, 12, 15–16. | Move both into normal document flow; never fix by shrinking labels or hiding metrics. |
| A05 | P1 / browser | Chapter 05 canvas remains 390 CSS/backing pixels wide after its parent becomes 844 pixels wide. | Implement resize lifecycle and redraw from normalized coordinates, preserving the experiment. |
| A06 | P1 / browser + source | Reduced-motion mode does not stop chapter 08 evolution; observed reach rose from 2 to 10 in 1.2 seconds. The shared engine has no reduced-motion policy. | Static meaningful states plus user-controlled Step/Run. Apply to every chapter and hero. |
| A07 | P1 / source | Most model updates happen per render frame; timers and D3 physics use other clocks. Results and timing vary with refresh rate. | Fixed model step, separate rendering, seeded RNG; elapsed-time presentation effects. |
| A08 | P1 / source | Intro spawning, connection deployment, external-memory timers can outlive visibility. Guard `applyGuard()` restarts physics and schedules six fits. Custom chapters 05/16 schedule RAF even inactive and lack destroy. | Explicit activation, suspension, disposal ownership; no work for inactive models, no orphan timers. |
| A09 | P1 / screenshots + source | Hard containment produces rows of nodes at the border; repeated fits visibly reshape the object under study. Guard treats any canvas ≤900 px as mobile, including typical desktop panes. | Separate camera/layout from model; use component dimensions, semantic bounds, and one deliberate fit. |
| A10 | P1 / source | Chapter 15 changes N from 30 to 105/180, q from .4 to 1, and topology simultaneously. | Matched comparisons at fixed N, capacities, task, seed, and resource budget; show actual task outcome. |
| A11 | P1 / source | Chapter 04 generalizes from a selected graph statistic to “most of us are probably not special to humanity.” No population-level evidence or defined humanity-wide outcome supports this. | Replace with a conditional statement about redundancy, scale, function, and time horizon. |
| A12 | P1 / source | Chapter 02 has mouse/touch hold handlers but no equivalent keyboard activation. Its auto-start timer competes with Reset. | Ordinary toggle/slider control or fully supported pointer/keyboard state machine; remove competing timer. |
| A13 | P1 / source | Chapter 10 “Increase Coupling” increases coupling AND decreases noise. | Separate controls or explicitly name the composite intervention. |
| A14 | P1 / source | Canvas-only removal in chapter 12 has no equivalent keyboard control; tiny moving carriers are difficult touch targets. | Selectable carrier list and “Remove origin / selected carrier / reset” buttons. |
| A15 | P1 / source | Formal notes contain missing TeX escapes and control characters: 3 backspaces, 1 vertical tab, 8 form feeds, 15 tabs. Footer links raw Markdown without a math renderer. | Recover equations carefully, render a readable accessible methods page, and check every equation. |
| A16 | P1 / source | Chapter 17 only returns a 100-node force graph. The notes' objective functions, controls, and frontier do not exist. | Replace with a modest measured trade-off lab; do not invent a civilization simulator. |
| A17 | P1 / source | Current mobile reading order puts the diagram and controls ahead of explanatory body text; labels are often ~10–11 px. | Put question and essential explanation first, experiment next, interpretation after. |
| A18 | P1 / source | Stats use `aria-live` and several modules rewrite them every frame. Canvas name describes a visualization rather than its result. | Stable textual summaries; announce completed intentional actions, not continuous counters. |
| A19 | P2 / browser test | Audio amplitude assertion failed. An 8-bit analyser sample is not a perceptual loudness/noise assessment. | Diagnose with floating-point RMS/peak over a time window; separately conduct device listening. |
| A20 | P2 / source | Preferential-attachment default is reused for many unrelated mechanisms; population/productivity can create duplicate edges. | Chapter-specific declared topology; canonical undirected edge keys, explicit multigraph policy. |
| A21 | P2 / source | Connection deployment waits for 120 newly added links but cannot finish once fewer eligible edges remain. | Bound remaining candidates; stop when exhausted; disable or change saturated control. |
| A22 | P2 / source | Polarization slider reseeds opinions but retains added bridge edges. | Explicit “restart with same topology” versus “reset entire experiment”; comparable trials must restore both. |

For A01 specifically: chapter 04 does not implement global efficiency/task coverage/acquired specialist role; 05 has no finite-time log growth output; 06 lacks specialty/observation descriptors; 07 has no finite processing budget; 08 has only channel reliability; 10 has no target accuracy; 12 has no variant mutation; 13 has no record loss/alteration controls; 14 has no interpretation stage; 15 lacks the listed role/memory/duplication/incentive descriptors; 17 lacks its entire documented trade-off model. These are substantial documentation errors, not optional explanatory elaborations.

## 4. Truth-seeking editorial constitution

Every reader-facing claim must be one of these, with the type visible in its expandable explanation:

| Type | Required support | Example |
|---|---|---|
| Mathematical result | Definitions, assumptions, derivation or precise theorem source | N(N−1)/2 edges in a simple undirected complete graph. |
| Simulation result | Version, seed, parameters, update rule, measured output | This simulated graph retained a connected component after this removal. |
| Empirical finding | Study population, method, outcome, uncertainty, limits of transfer | An experiment on a particular platform found an intervention increased polarization in one subgroup. |
| Interpretive analogy | Explicit mapping and explicit point where mapping stops | External records play a memory-like role. |
| Normative judgment | Stated value and whose interests it represents | We choose to protect vulnerable participants even at some efficiency cost. |
| Open question | Alternatives and what evidence would distinguish them | Which communication structure works best for this task? |

Mathematical certainty is conditional on assumptions. “Toy model” is not a license to put the desired answer into arbitrary coefficients and then celebrate the output. An honest toy experiment can be powerful precisely because the reader can alter its assumptions.

Add a compact **“Why believe this?”** disclosure to every chapter: exact claim, model assumptions, relevant evidence, strongest limitation/counterexample, and what the animation does not establish. Put material limitations immediately beside the result; do not hide them all in methods.

Required philosophical distinctions:

- Operational emergence here means a capability or pattern arising through interactions. It does not establish strong metaphysical emergence, irreducibility in every sense, or new consciousness. Philosophical accounts differ; see [Emergent Properties](https://plato.stanford.edu/entries/properties-emergent/).
- Organismality is a substantive biological idea involving integration/cooperation/conflict, not a synonym for “many connected parts.” [Queller and Strassmann](https://pmc.ncbi.nlm.nih.gov/articles/PMC2781869/) provide a useful framework; applying it to all humanity requires further argument.
- Collective intention, group agency, group task performance, and phenomenal consciousness are separate questions. See [Collective Intentionality](https://plato.stanford.edu/entries/collective-intentionality/). This project need not settle those debates to explain coordination.
- Structural centrality is not moral worth. Nor is low measured marginal effect proof of replaceability across other functions, relationships, institutions, or future histories.
- “Humanity” is not one decision-maker with one goal. Ask who sets the objective, who can refuse, who bears costs, and who benefits. Include agency, unequal power, exclusion, rights, and distribution alongside aggregate performance.
- Information flow does not exhaust social life. Bodies, care, energy, material production, ecology, coercion, law, and historical conditions constrain what networks can do.
- Emergent outcomes can be harmful. Coordination can support care or coercion; memory can preserve knowledge or error; dense connections can spread help or contagion. No automatic evolutionary or technological progress story.

Keep the prose forceful by naming concrete dependencies and consequences. Replace “most of us are not special” with **“A system can depend on people without depending equally on every person, for every task, at every moment.”** Then let the reader discover a low-degree bridge and a unique specialist. The surprise is in the changed measurement, not in an unsupported verdict about lives.

## 5. Information architecture and visual direction

Keep stable chapter IDs for links and automation. Group the 17 chapters into five acts without initially renaming source modules:

1. **You are a model, too** — 01–02: abstraction and limits.
2. **Relationships create capabilities** — 03–07: emergence, removal, sensitivity, scale, connectivity.
3. **Connection is not knowledge** — 08–11: reliability, polarization, coordination, evidence.
4. **Civilization survives by copying** — 12–14: carriers, archives, correction.
5. **Better for whom, under what conditions?** — 15–17: collective work, analogy, trade-offs.

Provide an optional short route through 01, 03, 04, 08, 10, 14, 17. Do not promise a reading duration before observing readers. The full route remains available without quiz gates or compulsory interactions.

One chapter should contain, in this order on phones:

1. A concrete question and short claim (under roughly 45 words for this introductory layer).
2. A legible diagram with legend and meaningful initial state.
3. One prominent action; advanced controls in an optional disclosure.
4. A small result panel with one principal outcome and, where necessary, a countermetric.
5. Interpretation, limitation, and evidence disclosure.

Use “Predict → intervene → compare → explain → challenge the model” as the design pattern. Predictions are optional and ungraded. Do not label disagreement with the project's thesis as a wrong answer.

Visual grammar: people are circles, external records are squares, task targets are distinct labeled markers, directed messages have arrowheads. Give each chapter a local legend. Color identifies categories, never human value. Accuracy/error requires an explicit ground truth in a task; gray means unobserved, not wrong. Pair color with shape, labels, line style, or pattern.

Keep the dark visual identity if desired, but raise diagram contrast. Use whitespace to separate meaning, not to leave a 400 px empty stage containing a 10 px dot. Single-node chapters need a visibly substantial person/abstraction graphic, capacity bars, and labels. Use a node-link graph only when links matter; use bit strips, timelines, distributions, task queues, and small multiples elsewhere.

Presentation targets (design targets, not empirical facts): body 16–18 px; essential chart labels ≥14 px when possible; controls ≥44×44 CSS px; visible focus; 8 px minimum target separation where practical. Do not claim 44 px is the WCAG 2.2 AA minimum: [SC 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) uses 24 px with conditions/exceptions. Our target is deliberately more comfortable.

## 6. Animation and mobile engineering contract

### 6.1 Separate model, layout, rendering, and prose

Introduce plain JavaScript model modules (no framework migration required). Recommended structure:

```text
js/models/                 # pure state updates and observable definitions
js/runtime/                # seeded RNG, clock, lifecycle, visibility
js/renderers/              # canvas/SVG presentation and camera
js/visualizations/         # chapter adapters and interactions
content/claims.js          # claim records and evidence IDs
content/references.js      # bibliographic records and review status
```

These are proposed new paths, not existing files. Migrate one chapter first; do not rewrite all modules at once.

Model API: `createModel({seed, parameters})`, `step(state, dt)`, `measure(state)`, `applyAction(state, action)`. Prefer immutable snapshots at experiment boundaries; in-place updates inside a performance-sensitive step are acceptable if deterministic and isolated. Simultaneous update rules must compute from the previous state, not depend accidentally on array iteration order.

Visualization contract: `activate`, `deactivate`, `resize`, `reset`, `destroy`, `getSnapshot`, and `renderStatic`. `deactivate` suspends both model progress and layout physics. `destroy` cancels RAF/timers, disconnects observers, releases capture, and removes listeners. Initialization draws one meaningful state but does not start a story offscreen.

Use one scheduler for active visualizations. Run model steps at a documented fixed interval (initial candidate: 1/30 s); render independently, normally up to 60 fps and adaptively 30 fps on constrained devices. Do not tie scientific steps to display refresh rate. Set a bounded accumulator; after a background interruption resume from paused state rather than simulating minutes of catch-up. Treat probabilities consistently: a Poisson event rate r uses `1 - exp(-r*dt)` per step; diffusion-style noise scales with `sqrt(dt)`. Discrete models can use one explicitly defined logical step instead.

Use separate seeded RNG streams for scientific dynamics and cosmetic effects. Changing particle decoration must not change model outcomes. Preserve seed and parameters across A/B comparisons; a new trial should explicitly change the seed. A small illustrative seed gallery is fine if labeled curated, with “Try another seed” available.

### 6.2 Stop patching the graph by moving its data

The current guard clamps node positions, injects a boundary force, recenters/rescales nodes repeatedly, and restarts D3. This can fight chapter-specific forces and give geometric patterns causal significance they do not deserve.

For graphs whose coordinates are only presentation: solve layout in logical space; transform the camera into measured bounds. Fit once after settling, with a short optional transition; never six timed refits. Keep hit-testing consistent with inverse transforms. If positions are scientific variables (spatial encounters, flocking), maintain model domain and boundary conditions independently; resizing changes only the projection.

Deduplicate graph edges and recompute degree after topology changes. Cache adjacency per topology version. D3's layout must not silently determine scientific interactions unless the model explicitly makes distance causal. Stop cooled layout physics. Continue rendering only when model state or presentation changes.

Remove the global ResizeObserver replacement only after local dimension guards are working and regression tests reproduce the original reason for that workaround. Remove the import-map wrapper through a deliberate migration, not by bypassing it in some chapters. Replace the forced bfcache reload with supported suspension/resumption when lifecycle correctness is proven.

### 6.3 Responsive geometry

Build a component-local layout based on actual available width, not `canvasWidth <= 900` as a synonym for phone. Draw comparison panels side by side only when each has enough width; otherwise stack them with the same scale and distinct DOM labels. Never compress only one panel vertically, as the chaos chapter currently does.

Put captions, formula headings, legends, hints, and statistics outside the canvas in flow layout. The drawing rectangle must exclude any persistent control rail. Avoid the current widths where a 62% statistics box and a 58% hint compete in the same row. Use a single stacked information region on narrow screens.

Use container ResizeObserver and cap DPR initially at 2, with a measured quality policy for lower-end phones. A resize must preserve seed, state, selected carrier, parameters, and completed comparison. Recompute layout for rotation and text zoom without resetting the experiment.

A phone stage can start near `clamp(260px, 42svh, 420px)` as a prototype, but short landscape screens should use a compact static diagram or an explicit expanded view. Do not enforce one universal height. The essential action and principal result should be adjacent; no sticky region should consume the entire usable screen.

Prefer CSS ordering/grid over moving live controls in and out of different parents. Keep DOM reading order logical. Text must wrap; do not ellipsize the only visible chapter title. Allow vertical page scrolling across diagrams. Enable dragging only in a clearly entered edit mode where needed. Treat `pointercancel` as cancellation, never as a click. Add keyboard equivalents for any meaningful node action.

### 6.4 Motion as explanation

Every motion must answer “what changed, because of what?” Use stable coordinates during comparisons. Animate a removed bridge by fading its incident edges, then updating reachable components; do not randomly rebuild the whole network. Reveal a packet's actual bits rather than a meaningless glow.

Initial timing targets: acknowledgement within 100 ms; simple visual transition 180–300 ms; main explanatory sequence 2–5 seconds followed by a stable result. Longer simulations need explicit Run/Pause/Step/Reset and visible progress. Endless pulsing is not a substitute for an outcome.

Provide a global motion pause and per-experiment controls. Respect reduced motion at initial load and on preference changes. In reduced mode: immediate state changes, no camera movement, no flicker, and a static before/after view. Step advances the model once; it must not merely unfreeze decorative movement. [WCAG pause guidance](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) applies to relevant automatically moving content alongside reading; [animation-from-interaction guidance](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) is an additional design reference, not an assertion of full conformance.

Do not continuously announce changing statistics. Render textual results at most a few times per second during a run, and announce a short final result after an intentional action. A screen reader must be able to obtain the same conceptual comparison without inspecting pixels.

## 7. Mathematical corrections and invariants

### 7.1 Finite capacity versus finite state space

Finite time/energy/attention do not establish the cardinality of a human state space. A bounded subset of real-valued vectors can contain infinitely many points. Replace “the attainable state space is finite” with a task-specific bounded-resource assumption. A fixed scalar ceiling in chapter 02 is an illustrative capacity bound, not a measured genetic destiny or a universal biological maximum.

### 7.2 Removal effects

Define the outcome before assigning importance: `Δ_v M = M(G) - M(G-v)`. This is an intervention within a graph model, not an estimate of a person's total historical contribution. A largest-component *fraction* can increase after deleting an isolated node simply because its denominator shrank. Show both absolute surviving nodes and fraction; specify whether the denominator is original or remaining population.

For global efficiency, declare `E(G)=Σ(i≠j)1/d(i,j) / [N(N-1)]`, disconnected terms zero, and handle N<2 explicitly. Comparing different N changes normalization. For controlled removal comparisons, also provide a fixed-original-denominator version or explain the difference. Test empty graph, isolate, path, star, clique, and two cliques connected by one low-degree bridge. Degree is not a substitute for task coverage or articulation status.

### 7.3 Stability and chaos

Current stable update is `x(t+1)=P x(t)` with `P=.62 I + .38 D^-1 A`. P is row stochastic and `P 1 = 1`; its consensus direction does not contract. On the connected undirected graph, the stationary distribution is degree-weighted. A positive perturbation at node v tends toward the shared offset `π_v δ`, rather than zero. Disagreement can shrink while the difference between the two final consensuses survives.

An independent numerical recurrence using the actual 54-node topology confirmed this: a 10⁻⁷ perturbation at node 0 converged after 5,000 steps to approximately 2.13675213675×10⁻⁹ at every node, matching the degree-weighted prediction. See `mathematical-checks.json` in the evidence directory. This check supports the analytical finding; it does not validate the separate sensitive model as chaotic.

Recommended minimal correction: retain this model as **“Averaging: difference disperses, small residual remains.”** If the intended lesson requires a difference to vanish, use an anchored model `x'=aPx+(1-a)c1`, with 0<a<1 and fixed c. Then `||δ'||∞ ≤ a||δ||∞`. Make anchoring an explicit assumption; otherwise this improvement silently changes the mechanism.

The sensitive model is a coupled logistic map. Show absolute separation and elapsed steps since the perturbation. For finite-time diagnostics use `g_t=log(||δ_t||/||δ_0||)/t`, explicitly for this perturbation and before saturation. At t=0 show “not yet defined.” Label underflow/saturation. This is not a maximal Lyapunov exponent estimate. A rigorous exponent uses infinitesimal/tangent dynamics and an appropriate long-time limit, often numerical renormalization; taking a fixed finite separation to infinite time in a bounded system is misleading. Do not promise mathematical chaos based solely on colorful divergence. [Eckmann and Ruelle](https://doi.org/10.1103/RevModPhys.57.617) is a specialist reference, not a substitute for checking the implemented map.

### 7.4 Connectivity

`N(N-1)/2` counts possible edges only for a simple undirected graph. Directed simple graphs have N(N−1). Actual communication cost is not forced to be quadratic. `E/N` is half the mean degree for the undirected model and is only an edge-density proxy, not productivity or an empirically calibrated coordination cost.

Report mean path length over reachable pairs as such. Adding edges cannot increase distance for already connected pairs, but newly reachable long-distance pairs can change the conditional average in unintuitive ways. Pair reachability with fixed-denominator efficiency. A finite processing budget `Σmin(k_i,b)/Σk_i` is dimensionless demand coverage under a specified one-unit-per-edge demand assumption; define the zero-demand case explicitly, preferably “no demand.”

### 7.5 Polarization and order

The bounded-confidence pair update preserves the pair sum when both updates use the same old-state difference. Verify opinion bounds and conserved mean for the symmetric closed model. Opinion standard deviation is dispersion, not a complete polarization measure: a broad continuum and two antagonistic clusters can have similar SD. Show the distribution. The present rule models selective interaction, not all mechanisms of affective polarization, identity, or strategic persuasion.

The circular order parameter `R=|Σ exp(iθ)/N|` lies in [0,1] for N>0. A small finite random population generally has R>0. At near-zero resultant magnitude, mean direction is undefined/unstable; do not show confident target agreement derived from it. Use mean per-agent projection `Q=Σcos(θ_i-θ*)/N` alongside R, or a clearly defined target-near fraction. These are task-relative observables, not universal correctness or welfare.

### 7.6 Binary channels

The existing formulas are correct **under their independence and constant-noise assumptions**:

`p_h = [1-(1-2p)^h]/2`

`P_majority = 10 p_h^3(1-p_h)^2 + 5 p_h^4(1-p_h) + p_h^5`.

If p varies by hop, use `p_eff=[1-Π_j(1-2p_j)]/2`. Simpler: freeze p for each run. Five-copy majority assumes independent copy errors. Correlated failures can remove its advantage. For p_h<.5, majority reduces expected per-bit error; it does not guarantee every sampled 15-bit message improves. Distinguish bit error rate from probability the whole message is wrong. Channel capacity `1-H₂(p)` for a binary symmetric channel is a rate result with coding assumptions; fivefold repetition is not a capacity-achieving construction. The physical/semantic distinction is central to [Shannon's theory](https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf).

### 7.7 Comparative models and Pareto reasoning

The comparative trace code uses elapsed-time decay, arrival events, and a cap of 1.6; the displayed discrete equation omits that cap and timing. Either implement the displayed discrete recurrence exactly or document an event-based approximation with clipping. The flock panel uses a global mean, unlike the neighborhood rule in the original [Vicsek model](https://doi.org/10.1103/PhysRevLett.75.1226). Call it a generic alignment model.

The adaptive network's current B is largest-component fraction after thresholding weights, not robustness under failure. Rename it connectivity, or measure actual post-removal outcomes. Its score J is a project-defined weighted sum; arbitrary weights do not establish biological optimization. The code updates weights, not a demonstrated search for a globally optimal topology.

For Pareto dominance, state maximize/minimize directions. A is dominant over B only if no worse on every objective and strictly better on at least one. A sampled two-axis sweep is at most a frontier among sampled settings or a restricted slice, not proof of the full feasible frontier. A nondominated state can still be unacceptable, unjust, fragile to model error, or outside ethical constraints.

## 8. Chapter-by-chapter implementation specifications

Every chapter below needs: named assumptions, deterministic replay, a visible limitation, text alternative, phone layout, reset, and tests of its specific claim. “Done” means the model, visible result, prose, formal notes, and evidence agree.

### 01 — The Human Node (`04-node-capacity.js`)

**Keep:** the person-to-node transition and the statement that a model discards information. **Change:** the automatic 12-second cycle can be missed or mistaken for an unresponsive dot. It also labels a decorative particle silhouette as “high-dimensional” without exposing any variables.

**Build:** a person silhouette with selectable model lenses: communication, skill/task, and memory. Each lens retains a few named properties and visibly sets others aside. One “Simplify the person” action transforms it to a node; “What disappeared?” reveals omitted experience, relationships, goals, and context. The animation demonstrates abstraction, not the computation of a complete human representation. Avoid random “quality” differences.

**Copy:** “The dot is not a person. It is what this model chooses to remember about one.”

**Acceptance:** changing lens changes the displayed variables and explanation; no biological claim is encoded by particle count. Reduced motion shows side-by-side states. The meaningful result is accessible without playing a loop.

### 02 — Node Limits (`02-node-limits.js`)

**Keep:** finite resources. **Replace:** the vibrating red biological cage and hold-only optimization.

**Build:** a task queue with a fixed time/attention budget. Change task demand, tools, or available time separately. Show completed tasks and deferred tasks. An optional advanced view illustrates a saturating performance curve whose parameters are labeled hypothetical. Tools can change effective task capability; no bar is labeled someone's intrinsic worth or lifetime potential.

**Copy:** “You cannot attend to everything. Changing the task, tools, or environment changes what your limits mean.”

**Acceptance:** increasing demand alone cannot create extra processing capacity; resetting cancels scheduled changes; keyboard and touch actions have equivalent semantics. Distinguish capacity per interval from cumulative output.

### 03 — The Great Organism (`00-intro.js`)

**Keep:** the revealing move from one person to connected interdependence. **Change:** growth and fading “You” currently show scale, not an emergent capability.

**Build:** a small concrete task requiring complementary roles—an illustrative water-treatment or communication system, carefully labeled as an abstract dependency puzzle rather than a realistic engineering design. One node has only one prerequisite; connected roles complete the task. Show the same people without coordination as a comparison. The focal person remains identifiable; do not erase agency to suggest it is irrelevant.

**Copy:** “No one person contains the system. The capability exists in what people can do together.”

**Acceptance:** task success is computed from explicit requirements, not triggered by a flourish. Include a failure state when a required role/link is missing. “Organism” remains a metaphor with a visible boundary note.

### 04 — Losing a Node (`01-emergent-organism.js`)

**Replace the unsupported population verdict.** Use three small matched examples: redundant mesh, low-degree bridge between modules, unique skill carrier. Ask the reader which removal hurts most before revealing the selected outcome.

Offer “Remove random node,” “Remove bridge,” and “Remove unique skill carrier” on appropriate fixed examples. Display absolute reachability and task coverage, with baseline ghosts. Keep degree as a selectable statistic, not a ranking of human importance. Show that removing a low-degree specialist can change task capability without fragmenting the graph.

**Copy:** “Importance is a relationship between a person, a function, and a moment.”

**Acceptance:** same seed and graph for comparisons; exact known fixture outcomes; normalization is labeled; local losses remain visible even when the global metric barely moves. Include restoration/reset. No copy implies that moral value is computed by a network metric.

### 05 — Small Causes, Large Futures (`04b-illusion.js`)

**Keep:** paired identical initial states. **Repair:** stability terminology, missing resize/disposal, asymmetrical phone scaling, and timer reference.

Show two equal-size panels with one highlighted perturbed node and a log-separation plot. Offer the averaging and sensitive regimes; optional anchored contraction in advanced details. Freeze both before perturbation; advance equal logical steps. Let the reader replay at the same seed. State “tiny difference” rather than imply a small physical cause has a known historical effect.

**Copy:** “A small difference can fade, persist, or grow. The rules decide which.”

**Acceptance:** unperturbed twins stay identical; averaging residual matches its invariant; anchored variant contracts if included; g_t counts from perturbation; phone rotation preserves states and fills its new drawing bounds. No maximal-Lyapunov claim from a single finite separation.

### 06 — More Nodes (`02-node-quantity.js`)

**Keep:** capacity and coordination as separate ideas. **Change:** N and E alone cannot demonstrate useful parallel work or specialization.

Build a fixed batch of jobs with explicit dependencies and worker capacities. Vary worker count while holding job set fixed; offer one well-described coordination architecture at first. Plot completed jobs versus resource/communication cost. In advanced mode compare parallelizable and serial tasks. Extra workers can be idle; they must not automatically manufacture tasks or expertise.

**Copy:** “More people can do more work—when the work and its organization allow it.”

**Acceptance:** a fully parallel synthetic fixture speeds up until its declared bound; a serial fixture exposes its bottleneck. Numerical N and parameters must match across device sizes. Render fewer marks on a phone if needed, but do not silently change the experiment's population.

### 07 — More Connections (`04-connection-quantity.js`)

**Keep:** local structure plus long-range links and measured paths. **Add:** finite service budget and a connection cost, clearly hypothetical. Guarantee the desired initial connectivity rather than assuming random local edges connect each community.

Animate one representative route before/after a single new edge. Offer a gradual links control, not a burst of 120 edges that hides the cause. Display reachable pairs, reachable-pair path length, and serviced-demand fraction. In an optional challenge, hold maintenance budget fixed so the reader must choose which edge to add.

**Copy:** “A shorter path helps a message travel. It does not create time to understand it.”

**Acceptance:** no duplicate edges; adding a specific edge gives the exact expected shortest path; budget overload is computed; no infinite deployment at saturation. Stable coordinates make the changed route obvious.

### 08 — Better Connections (`05-connection-quality.js`)

**Keep:** channel/source/interpretation/selection distinctions in prose. **Replace:** the sprawling graph as the primary explanation; its only implemented mechanism is bit-flip reliability.

Build a short chain: world state → source claim → channel → interpretation → acceptance → repetition. Expose one layer at a time. First deliver a false source claim over a perfect channel. Then corrupt a true claim. Then show a correctly transmitted message understood differently. Selection changes which messages are repeated; it is not another channel-error probability. Use separate denominators for source accuracy, transmission fidelity, and accepted-claim accuracy.

**Copy:** “Perfect transmission can spread a perfectly preserved mistake.”

**Acceptance:** 100% channel fidelity preserves input whether true or false; perfect assessment is explicitly an oracle toy assumption if included; no claim that incentives always reward falsehood. Limit main controls to two; advanced layered model remains inspectable.

### 09 — Polarization (`07-cohesion.js`)

**Keep:** a bounded-confidence mechanism and caution about contact. **Change:** tangled graph and SD-only display hide the actual opinion distribution.

Make a histogram/one-dimensional opinion strip the primary diagram, with a smaller interaction graph if useful. Mark when a proposed encounter is rejected under the rule. Compare ordinary contact with explicitly trusted interaction. Preserve identical starting opinions for trials. Describe “trusted” as a changed model rule, not a button known to repair politics.

**Copy:** “Contact makes disagreement possible to hear. It does not determine what people do with it.”

**Acceptance:** slider changes do not silently retain earlier bridges; mean preservation and bounds verified for symmetric updates; distribution distinguishes continuum from clusters. Include context-limited counterevidence: [Bail et al.](https://doi.org/10.1073/pnas.1804840115) found increased polarization for Republican participants in their Twitter intervention; the Democratic result was not significant. This is not a universal contact effect.

### 10 — Alignment (`08-alignment.js`)

**Keep:** circular coherence R. **Separate:** coupling and noise. **Add:** an externally specified task target and a “shared bad signal” preset.

Show three curated, explicitly illustrative states: disagreement; coordination toward the target; coordination away from it. R can be high in both coordinated states. Add mean task projection Q or task error. An optional independent-observation versus shared-source comparison can show correlated mistakes; do not claim diversity always improves performance.

**Copy:** “We can agree completely and still be wrong.”

**Acceptance:** R=1 for identical directions; near cancellation yields no stable mean-direction claim; task accuracy changes independently of R. Distinguish empirical truth-estimation tasks from ethical disagreement where no given compass exists. [Lorenz et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC3107299/) and [Becker et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC5495222/) motivate showing conditions under which social influence helps or harms.

### 11 — Learning from Reality (`08b-environment.js`)

**Replace:** colored particles absorbed by nodes as the principal demonstration. It shows acquisition, not learning, testing, or inference.

Build a tiny hidden-world task: estimate a fixed target from noisy observations. Show prediction, measurement, error, and update. Let the reader compare independent measurements with many copies of one measurement; duplication does not increase independent evidence. A sensor-bias preset shows confident error. Keep the mathematical estimator simple and disclosed—for example a sample mean under an unbiased independent-noise assumption.

**Copy:** “Repeating a claim is not the same as checking it.”

**Acceptance:** identical copied observations do not artificially shrink an independence-based interval; biased sensors expose estimator limitations. Separate observations from inference, and estimation from causal identification. Teach one mechanism well rather than purport to simulate the whole scientific method.

### 12 — Collective Memory (`09-collective-memory.js`)

**Keep:** explicit copies, origin loss, and transmission packets. **Change:** removal must be accessible; forgetting currently protects the origin and does not forget a sole remaining copy. Either disclose this rule or replace it with an explicit, symmetric model.

Track an item ID and optional content variant per carrier. Show a small lineage/timeline so survival of a lineage is distinguishable from exact fidelity. Make mutation optional; the proposed .08 probability in notes has no empirical grounding and must be labeled illustrative if adopted. Provide buttons for removing origin, another carrier, and resetting.

**Copy:** “An idea can outlive its author. That does not mean it survives unchanged—or stays true.”

**Acceptance:** replication retains source copy; no resurrected items from removed carriers; in-flight packets have a declared storage/survival policy; extinction state is correct; every meaningful mouse action has a keyboard equivalent.

### 13 — External Memory (`09b-external-storage.js`)

**Keep:** heterogeneous carriers. **Replace:** a one-way technological triumph sequence with comparable storage arrangements and visible failure.

Use people, records, and readers as distinct roles. Compare one record, independent replicas, and replicas with a shared failure source. Add deliberate loss, alteration, and loss of readability/access. Writing preserves encoded marks, not automatically the meaning or ability to interpret them. Knowledge/practice can precede writing; this is not a universal historical ladder.

**Copy:** “A record can outlive you. Someone still has to preserve, access, and understand it.”

**Acceptance:** copy counts measure current copies, not only cumulative arrivals; losing one medium does not remove independent copies; correlated archive failure is possible; pause freezes both generation and deaths; Reset returns from the final epoch. Chapter labels and epoch names are DOM text, without canvas overlap.

### 14 — Noise and Error Correction (`10-entropy.js`)

**Keep:** the mathematically grounded binary channel and five-copy majority formula. **Repair:** the parameter race immediately.

Replace the primary network with five aligned bit strips: original, received copies, majority, marked mismatches. Animate one hop at a time and make correction visible. Provide a batch mode with observed error fraction alongside theoretical expected per-bit error. State the fivefold bandwidth cost. Show independent versus shared-error cases as an optional challenge. Treat meaning separately through a concrete ambiguous sentence/example; a random “semantic error” coin flip adds little explanatory value.

**Copy:** “Noise does not make corruption inevitable. Reliability has a cost—and assumptions.”

**Acceptance:** p=0 gives zero errors; p=.5 gives expected error .5; formulas match seeded Monte Carlo within declared statistical tolerance; in-flight settings cannot leave a run hanging or invalidate its theoretical label; single messages can be unlucky without being a test failure.

### 15 — Collective Intelligence (`10-productivity.js`)

**Replace:** the all-at-once “scalable” makeover. Keep graph metrics in methods, but make an actual defined task the principal outcome.

Use the job model from chapter 06. Hold people, abilities, jobs, and total budget fixed; compare duplicated search, shared memory, and complementary assignment. Track completed correct jobs, duplicates, communications, and unserved tasks. Add a bad-information or incentive-conflict case in advanced mode: efficient coordination can implement the wrong plan. Do not present modular organization as universally superior.

**Copy:** “Collective intelligence is something a group achieves on a task. A crowd is not automatically intelligent.”

**Acceptance:** improvements have an identifiable causal intervention; all changed parameters listed; across-seed outcomes reported when making probabilistic comparisons. [Woolley et al.](https://pubmed.ncbi.nlm.nih.gov/20929725/) studied small groups of two to five, not a planetary mind; do not extrapolate their factor to humanity as a whole.

### 16 — Different Systems, Same Pattern (`10b-comparative-emergence.js`)

**Keep:** explicit comparison limits and the three distinct examples. **Repair:** formula/code agreement, phone panels, expensive per-frame metrics, and “robustness” terminology.

Give each example a mapping card: physical variable, human abstraction, shared equation/observable, and missing mechanism. Stack panels on phones. For adaptive transport show efficiency, material proxy, and measured damage response separately; put J behind a weights disclosure or remove it. Do not call the heuristic a faithful implementation of Physarum physiology.

**Copy:** “The same mathematics can describe different things. It does not make them the same thing.”

**Acceptance:** declared recurrence matches update rule; metrics recalculated only when necessary; known damage fixtures validate resilience; all comparison labels legible. [Tero et al.](https://pubmed.ncbi.nlm.nih.gov/20093467/) motivates a transport-network analogy, not equivalence between biological adaptation and human institutions.

### 17 — What Helps Humanity Thrive? (`11-whats-next.js`)

**Replace:** the currently decorative ending and the unimplemented eight-slider civilization model in notes.

Build a limited **trade-off lab** reusing verified mechanisms. A small network must route a fixed set of messages under a link-maintenance budget. Reader adds/removes a few links, chooses redundancy, and applies a node/link failure. Measure delivery/latency, resource cost, and surviving service. Show who loses service, not just the total. Display nondominated *sampled designs* across cost and service; separate failure resilience as a third observable.

No invented “learning,” “adaptability,” or “human flourishing” score. An optional ethical reflection asks whose service should be protected first and states that the mathematical model does not settle that choice. Avoid requiring a moral answer to finish.

**Copy:** “A better total can hide a worse life. Ask what improved, for whom, and at what cost.”

**Acceptance:** trade-offs arise from resources/tasks/failures, not coefficients selected to force a message; dominated-design logic verified; fairness constraints identified as normative; a complete static alternative explains two designs. End with three portable questions: **What is being measured? What is missing? What would change your mind?**

## 9. Sound direction

Sound already exists in `js/audio.js`; do not add a second ambient engine. The older `setupAudio()` in `app.js` targets a missing `toggle-audio` control and is currently effectively dormant. Consolidate ownership after verifying no external dependency on the legacy global.

Keep sound off by default and immediately mutable. Separate optional ambience from explanatory sonification. Begin by keeping the existing restrained tonal ambience; do not increase volume based only on the failed analyser threshold. Offer a simple volume control and an understandable “Sound off” action.

Use sound only where it carries a declared mapping: one short event for packet arrival, an audible sequence for received versus corrected bits, or a small cue for a completed comparison. Do not use a triumphant chord to imply that alignment or centralization is morally good. Do not make disagreement sound inherently broken. No continuous noise layer, per-frame beeps, compulsory narration, or essential audio-only evidence.

Engineering acceptance: no AudioContext before opt-in; catch resume failures; handle rapid toggles and background/foreground changes without overlapping voices; cancel stale scheduled work; test mute and zero volume; inspect post-processing peak and windowed floating-point RMS. Listening acceptance: quiet phone speaker, laptop, and headphones at user-chosen levels; no startling transients or interference with reading. This remains a human listening check, not a claim this audit has performed.

## 10. Evidence system and source register

Create a claim record with fields: `id`, `chapter`, `exactText`, `kind`, `modelVersion`, `assumptions`, `observable`, `sourceIds`, `sourcePassage`, `studyScope`, `limitations`, `counterevidence`, `reviewStatus`, `reviewedAt`. Sources need author/year/title/DOI or stable URL and access status. A bibliography at the end is insufficient: attach the relevant support to the claim it actually supports.

Reader-facing evidence notes should be short. Detailed assumptions and derivations belong in a rendered methods page, accessible from every chapter and navigation. Use accessible math rendering (including MathML output where supported) and plain-language equation descriptions. Generate the text edition from the same content records rather than independently maintaining matching titles in two files. Add validation for unsupported claim IDs, missing references, malformed control characters, and documentation/runtime capability drift.

Starting sources, with deliberately bounded uses:

| Source | What it supports here | Limits / audit access |
|---|---|---|
| [Broido & Clauset 2019](https://www.nature.com/articles/s41467-019-08746-5) | Do not assume a universal scale-free social topology. | Evidence criteria and definitions matter; not proof that heavy tails never occur. Publisher results consulted. |
| [Watts & Strogatz 1998](https://doi.org/10.1038/30918) | Candidate foundation for small-world connectivity comparison. | Publisher fetch blocked; read the paper before claiming an exact model match. Current code is not Watts–Strogatz rewiring. |
| [Deffuant et al. 2000](https://doi.org/10.1142/S0219525900000078) | Candidate source for bounded-confidence dynamics. | Publisher fetch blocked; implementation invariants independently inspected; verify original before publication attribution. |
| [Eckmann & Ruelle 1985](https://doi.org/10.1103/RevModPhys.57.617) | Specialist background for chaos terminology. | Bibliographic/publisher access, not full technical review of all hypotheses. |
| [Shannon 1948](https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf) | Physical communication, entropy and channel/coding distinctions. | Does not define semantic truth or social welfare. Primary paper available. |
| [Queller & Strassmann 2009](https://pmc.ncbi.nlm.nih.gov/articles/PMC2781869/) | Cooperation/conflict perspective on organismality. | Biological framework; application to humanity remains interpretation. |
| [Woolley et al. 2010](https://pubmed.ncbi.nlm.nih.gov/20929725/) | Task performance in small groups. | Abstract consulted; no inference to a global intelligence factor or consciousness. |
| [Muthukrishna & Henrich 2016](https://henrich.fas.harvard.edu/resource/pdf-112) | Collective/cultural processes in innovation. | Author-hosted source located; requires passage-level review before new detailed historical claims. |
| [Bail et al. 2018](https://doi.org/10.1073/pnas.1804840115) | Contact interventions can have context-dependent effects. | Specific US Twitter intervention and asymmetric subgroup results. |
| [Lorenz et al. 2011](https://pmc.ncbi.nlm.nih.gov/articles/PMC3107299/) | Social influence can impair crowd estimation in a particular experiment. | Do not generalize to every task or influence structure. |
| [Becker et al. 2017](https://pmc.ncbi.nlm.nih.gov/articles/PMC5495222/) | Network structure can affect when social influence improves accuracy. | Useful counterweight to a universal “independence good, influence bad” lesson. |
| [Hong & Page 2004](https://pmc.ncbi.nlm.nih.gov/articles/PMC528939/) | Functional diversity can help under explicit problem-solving assumptions. | Mathematical/model result, not a blanket empirical theorem about every form of diversity. |
| [Vicsek et al. 1995](https://doi.org/10.1103/PhysRevLett.75.1226) | Local heading alignment with noise as an example model. | Abstract consulted; current generic global/local hybrids are not exact reproductions. |
| [Tero et al. 2010](https://pubmed.ncbi.nlm.nih.gov/20093467/) | Biological transport networks motivate efficiency/cost/failure comparisons. | Abstract consulted; the project's J is not a biological law. |
| [Ostrom 2010](https://www.aeaweb.org/articles?id=10.1257%2Faer.100.3.641) | Governance/institutions deserve explicit treatment beyond topology. | Source identified for implementation research; do not treat polycentricity as a universal optimum. |
| [SEP: Emergent Properties](https://plato.stanford.edu/entries/properties-emergent/) and [Collective Intentionality](https://plato.stanford.edu/entries/collective-intentionality/) | Vocabulary and competing philosophical interpretations. | Scholarly philosophical overviews, not experimental validation. |

Before release, seek focused review rather than one person's supposed expertise in everything: network/dynamical-systems reviewer for 04–07/10/16; communication theorist for 08/14; social scientist for 09/15 and transfer claims; philosopher for emergence, agency, and normativity; accessibility/motion practitioner for mobile and alternative representations. These are review roles to arrange, not people already consulted. Record unresolved disagreement explicitly. No implementation worker should invent a “scientific consensus” to close a ticket.

## 11. Ordered implementation work packages

Do these sequentially with narrow reviewable changes. The estimates are rough focused-work ranges for an experienced implementer, excluding external reviews; revise after the first pilot. Expect multiple weeks, not one cosmetic pass.

| Package | Scope and dependencies | Deliverable | Exit gate |
|---|---|---|---|
| W0 — freeze evidence (0.5–1 day) | Baseline before changes. | Preserve audit; current behavior inventory; claim/model mismatch list. | All 17 chapters mapped by stable ID; original tests and failures recorded. |
| W1 — immediate correctness (1–3 days) | W0. | Repair run-parameter race, misleading stable label, malformed notes, unsupported chapter 04 inference; remove claims of absent functionality. | Regression reproductions now pass; notes match actual controls and outputs. |
| W2 — shared lifecycle (3–5 days) | W1. | Seeded clock/model contract, complete suspend/resize/dispose, semantic actions, frozen initial frames. | No hidden model progress or uncancelled chapter timers; same logical outcomes at 30/60/120 Hz. |
| W3 — phone chapter shell (2–4 days) | W2 pilot. | Normal-flow labels/stats; responsive panels; keyboard paths; reduced-motion and pause. | 320 px and landscape fixtures readable; overlap count zero; text zoom and touch scrolling verified. |
| W4 — prove three examples (4–7 days) | W2/W3. | Rebuild 04, 10, 14 as representative graph, order, and bit-strip experiments. | Reader can predict, intervene, compare, explain limitation; equations and fixtures pass. |
| W5 — evidence/content infrastructure (2–4 days) | W1; integrate with W4. | Claim/source registry, rendered methods, generated text edition, editorial changes. | Every principal claim classified; blocked sources/unsupported claims clearly flagged. |
| W6 — migrate remaining chapters (6–12 days) | W4 design accepted; W5. | 01–03, 05–09, 11–13, 15–16 implemented to §8. | Each chapter independently satisfies its acceptance contract; no giant all-chapter patch. |
| W7 — ending and distribution (2–4 days) | Validated task and network models. | Chapter 17 trade-off lab and ethical reflection. | Measured outcomes and sampled nondominance; no civilization score or fabricated optimum. |
| W8 — sound and polish (1–3 days) | Stable interaction timing. | One opt-in audio engine; restrained event mappings; visual cleanup. | Audio automation plus actual listening; no meaning depends on sound. |
| W9 — adversarial release review (3–5 days + reviewers) | All above. | Cross-browser/device QA, comprehension sessions, evidence corrections, release report. | No open P0/P1; remaining limits published; explicit release authorization handled separately. |

Gate W4 is crucial: prove the shared design on three strong chapters before multiplying it by 17. If the pattern does not work on a small phone, revise it there first. Do not buy short-term speed by adding another independent mobile patch layer.

At each package, the implementer supplies: exact changed files; before/after evidence; model/prose assumptions; test results with failures; screenshots at required sizes; remaining limitations. Work that changes an empirical or philosophical conclusion requires a specific source or an explicit interpretation label, not just a code review.

## 12. Test and review matrix

### Mathematical and behavioral tests

Use pure-model tests with known small fixtures. Test graph connectivity/efficiency, duplicate-edge prevention, conservation in symmetric opinion updates, circular order bounds, deterministic replay, memory accounting, binary-channel formulas, and Pareto dominance. Cover all relevant degenerate cases rather than checking only that outputs are finite.

For stochastic claims use a fixed batch of seeds, a declared estimator, and statistically justified tolerance; do not require an individual noisy run to beat a baseline. Record parameter ranges where a proposed lesson fails. Equalize inputs across comparisons. Use seeded render snapshots separately from scientific invariants.

### Browser matrix

| Dimension | Required coverage |
|---|---|
| Width / height | 320×568, 360×640, 390×844, 430×932, 768×1024, 1024×768, 1440×900; phone landscape such as 844×390. |
| Engines | Chromium, WebKit, Firefox in automation; real iOS Safari and Android Chrome before release. |
| Input | Mouse, keyboard-only, touch scrolling, sliders, node selection, pointer cancellation, zoom. |
| Preferences | Reduced motion on at load and toggled later; sound off/on; text at 200%; narrow reflow. |
| Lifecycle | Enter, leave, return, resize, rotate, background, restore from history, rapid Reset, repeat action, reload deep link. |
| Experiment state | Initial, paused, running, finished, reset, extreme parameters, invalid action, parameter changes during a run. |
| Failure | D3/library unavailable, blocked external fonts, no JavaScript, failed audio resume; readable essay remains available. |

No `force: true` clicks in the main user-path acceptance tests. Such clicks can remain in isolated programmatic smoke tests but cannot certify usability. A pixel hash change cannot certify a successful drag when the graph animates anyway; assert the selected model/node state changed because of the action.

Keep canvas-paint checks as smoke tests. Add geometric assertions for overlapping labels, legend/control bounds, viewport overflow, and correct canvas backing dimensions. Capture whole sections and viewport views, not only cropped panes. For comparison chapters test that both experiments are visible or explicitly navigable and use the same scale.

Check VoiceOver and at least one desktop screen reader manually. Test readable text summaries, announcement frequency, control naming, focus retention through responsive changes, and a complete no-drag route. Automated accessibility checks are necessary but insufficient.

### Performance gates

Set provisional budgets, then measure on a named reference phone: interaction acknowledgement p95 under 100 ms; maintain roughly 30 fps or better during the most demanding active demo; no accumulating timers or canvases after navigation; no inactive model progression; bounded memory across repeated full traversals. Capture frame-time distribution and long tasks; do not infer mobile performance from a desktop headless run.

At most one explanatory scene should normally run on a phone. Avoid recomputing all-pairs paths every render frame; chapter 16 should cache metrics by state/version or update at a modest sampling rate. Decimate decorative edges/particles before changing the numerical experiment. Self-host/pin D3 or provide a clear unavailable state; make font failure harmless. Keep textual reading available before optional visualization modules load.

### Comprehension and aesthetic acceptance

Recruit 6–10 varied readers for formative sessions (not a representative validation study): different ages, technical familiarity, and accessibility needs where feasible. Use a phone first. Ask them to explain what changed, why, and what does not follow. Observe whether they can locate controls and recover from a failed prediction without instruction.

Specific probes: “Does low degree mean someone is unimportant?” “Can a perfectly reliable channel carry a false statement?” “Does agreement imply accuracy?” “Does repeated information count as independent evidence?” “Does this diagram prove humanity is conscious?” “Can the most efficient network still be unfair?”

Ship only when no recurring dangerous misconception is produced by the design. If readers remember the punchline but not its crucial condition, rewrite the interaction. Aesthetic targets: immediate visual hierarchy, no unexplained shimmer, stable geometry during measurement, readable contrast, useful motion, and a result worth pausing on.

## 13. Definition of completion

The project is ready for a release decision when all 17 chapters have a coherent question, defensible copy, a faithful demonstration or honestly labeled illustration, meaningful initial/static states, accessible controls, visible assumptions, and traceable evidence. Runtime and notes must agree. The defect register has no unresolved P0/P1 findings; cross-browser/device and comprehension evidence is recorded, not assumed.

The user should leave with better questions and a more accurate model of dependence and collective action. A dramatic experience that creates false certainty has failed, even if it looks beautiful. A beautiful experiment that makes the reader revise an intuition—and recognize exactly where that revision stops—is the target.
