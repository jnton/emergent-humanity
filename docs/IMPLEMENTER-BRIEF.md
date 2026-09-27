# Implementation handoff

**Implementation update:** The local rebuild is recorded in [IMPLEMENTATION-STATUS.md](IMPLEMENTATION-STATUS.md). Statements below about the old runtime and pending work describe the audited baseline; use the status record and README for current ownership.

Read `/Users/tungsten/emergent-humanity/docs/MASTER-PLAN.md` first. It contains the scientific boundaries, specific chapter designs, equations, defect register, sources, and acceptance criteria. This brief gives you the execution order. Baseline inspected: `f2a1150`, 27 September 2026. These documents propose work; they do not imply deployment authorization.

## Your assignment

Make Emergent Humanity a rigorous, compelling interactive essay that works on small phones. A reader should be able to test an intuition, see a result, and understand both its explanation and its limits. Beautiful animation serves that understanding.

Preserve working tree changes from other contributors. Inspect current Git state and applicable repository instructions before editing. The audited checkout was clean before this documentation/evidence was added. Reproduce findings against your actual baseline; line numbers and behavior may have changed.

Do not try to implement every chapter in one change. Do not replace the stack or introduce a new animation framework without a concrete need. No additional decorative particles, global score of humanity, automatic sound, or claims that a toy model proves a social philosophy.

## First delivery: correctness and a reliable phone shell

1. Inventory all chapter IDs and current controls against formal notes. Immediately remove or mark as proposed the claims that absent features already exist (master-plan finding A01).
2. Fix the in-flight coding bug in chapter 14. Snapshot noise, copy count, code mode, path, original bits, and seed in a run object. Result calculation reads that object. Changes apply to the next run. Add the exact regression: Send with repetition off → turn repetition on immediately → current run still completes as a single-copy run.
3. Correct the stable-consensus wording in chapter 05. Averaging is not strict contraction of all perturbations; preserve the residual explanation. Do not silently add anchoring to make the old wording true.
4. Repair broken mathematical notation and control characters. Check equations, not just Markdown formatting. Keep planned model descriptions separate from actual behavior.
5. Replace the unsupported inference about most people being unimportant with the conditional task/scale-dependent claim in the master plan.
6. Implement the common lifecycle/clock contract on a pilot chapter. Include resize, pause, reduced motion, visibility, deterministic reset, and cleanup. Fix chapter 05 rotation and protect state across resize.
7. Move hints, statistics, and formula headings into normal flow. Test at 320 px and 390 px before desktop. Solve the layout itself; shrinking or hiding information is not an acceptable repair.

Deliver a narrow reviewable diff, regression results, and screenshots. Do not claim the site is scientifically validated because its JavaScript tests pass.

## Second delivery: three exemplary experiments

Implement chapters 04, 10, and 14 according to §8 of the master plan. These establish three reusable presentation types: graph intervention, coherence versus task accuracy, and explicit error correction.

For each, provide this completed card:

```text
Chapter / stable ID:
Question the reader can answer:
Claim type (math / simulation / empirical / analogy / normative):
Exact claim:
Model state and update rule:
Assumptions and omitted mechanisms:
Parameters changed by the control:
Variables held fixed:
Observable, units, and denominator:
Initial / action / result / reset states:
Counterexample or failure condition:
Evidence source and precise supported scope:
Phone behavior:
Keyboard and reduced-motion equivalent:
Mathematical fixtures:
Browser regression evidence:
Remaining uncertainty:
```

Do not migrate the remaining chapters until these examples are readable, usable, and scientifically faithful. A visually successful result requires a clear causal comparison; a moving graph by itself is insufficient.

## Later deliveries

Follow W5–W9 in the master plan: evidence registry and rendered methods; remaining chapters; the measured trade-off ending; optional sound; final real-device and interdisciplinary review. Update prose, model notes, text edition, agent metadata, and tests together whenever a chapter changes.

Maintain the existing chapter IDs initially. Current source mapping:

| Chapter | ID | Module under `js/visualizations/` |
|---|---|---|
| 01 | node-capacity | 04-node-capacity.js |
| 02 | node-limits | 02-node-limits.js |
| 03 | intro | 00-intro.js |
| 04 | emergent-organism | 01-emergent-organism.js |
| 05 | illusion-of-significance | 04b-illusion.js |
| 06 | node-quantity | 02-node-quantity.js |
| 07 | connection-quantity | 04-connection-quantity.js |
| 08 | connection-quality | 05-connection-quality.js |
| 09 | cohesion | 07-cohesion.js |
| 10 | alignment | 08-alignment.js |
| 11 | environment | 08b-environment.js |
| 12 | collective-memory | 09-collective-memory.js |
| 13 | external-storage | 09b-external-storage.js |
| 14 | entropy | 10-entropy.js |
| 15 | productivity | 10-productivity.js |
| 16 | comparative-emergence | 10b-comparative-emergence.js |
| 17 | whats-next | 11-whats-next.js |

The app entry is `js/app.js`, not legacy `js/main.js`. The import map currently routes engine imports through `network-engine-guarded.js`. Do not fix a file that the runtime bypasses. The CSS cascade contains several layers; inspect computed rules before adding another override.

## Non-negotiable review gates

- Mathematics agrees with implementation, including normalization, time steps, and random assumptions.
- Empirical claims have scoped evidence; metaphors remain identifiable as metaphors.
- Every numerical comparison changes only its declared inputs. Phone rendering does not silently change the experiment.
- Controls work with ordinary clicks/taps/keyboard input; forced test clicks do not count as user-path evidence.
- All meaningful initial, running, completed, extreme, and reset states are readable at phone width.
- Reduced motion, pause, background suspension, rotation, and return navigation work across all chapters.
- No canvas-only information or actions without a text/control equivalent.
- Same seed and logical steps produce the same scientific result independently of display refresh rate.
- No unbounded timers, animations, or model progress for inactive chapters.
- The source registry states which papers were actually read and which still require review.
- Final report distinguishes automated checks, manual browser inspection, real-device checks, user sessions, and expert review.

When stuck on a scientific choice, retain the narrower defensible claim and record the unresolved question. Do not invent a plausible-looking formula to satisfy the narrative.

## Report format for every delivery

State the reader-visible improvement first. Then list changed files, evidence/assumptions, checks run with actual outcomes, screenshots, open findings, and the next work package. Update an implementation ledger with statuses `not started`, `in progress`, `verified locally`, `review required`, or `complete`. Never mark a chapter complete based only on a screenshot or a passing smoke test.

Current verified starting point: static tests pass; full browser suite had 13 passes and one audio-threshold failure; isolated audio rerun passed. Screenshot audit found stats/hint overlap in 11 phone and 8 desktop chapters. Rotation, reduced-motion, and mid-transmission parameter defects were reproduced. Actual iOS/Android performance, sound quality, and independent subject-matter review remain to be done.
