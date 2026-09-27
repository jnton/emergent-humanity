# Implementation status — 27 September 2026

**Superseded presentation:** The user rejected the visual redesign described below. The main page now restores the original aesthetic and animations, uses the correct later titles, and links to the quantitative lab optionally. See [STYLE-RESTORATION.md](STYLE-RESTORATION.md) and README for current ownership. The deterministic runtime claims below apply to the lab, not the restored illustrative animation engine.

The 17-chapter application has been rebuilt locally. This is an implementation and verification record, not publication approval or independent scientific certification. The master plan and original audit describe the previous baseline (`f2a1150`). This document describes the replacement.

## Delivered

| Area | Status | Evidence |
|---|---|---|
| Canonical content and methods | Verified locally | All 17 records generate the readable essay, Markdown editions, methods page, and principal-claim registry. Byte-for-byte stale-output check. |
| Model/render separation | Verified locally | Pure state machines under `js/models/`; rendering reads snapshots; fixed logical steps independent of RAF timing. |
| Shared lifecycle | Verified locally | One RAF scheduler; explicit Run/Step/Reset; global pause; hidden/offscreen suspension; no catch-up; ResizeObserver; teardown API. |
| Phone layouts | Verified locally | Browser tests at 320×568, 390×844 and 844×390; normal-flow hints, controls and statistics; no horizontal overflow; rotation preserves state. |
| Evidence boundaries | Verified locally, review required | Assumptions and limitations beside every model; 15 scoped reference records state what was reviewed. External literature review is incomplete where marked. |
| Accessible reading and controls | Verified locally, review required | Semantic controls, labels, keyboard paths, text results, explicit-action announcements, reduced-motion handling, no-JS essay. Screen-reader/device sessions pending. |
| Sound | Verified locally, review required | Opt-in tonal soundtrack retained; serialized toggles, resume-error handling, post-processing floating-point RMS and zero-volume silence verified; no autoplay. Subjective quality on physical speakers is unverified. |
| Cross-engine compatibility | Verified locally | Chromium, Firefox, WebKit loaded and interacted with all 17 chapters without page errors; 390 px overflow and desktop 200% root-font check. This is a smoke check, not the full suite in each engine. |
| Real devices, readers and expert review | Review required | No physical iPhone/Android test, user comprehension study, or independent domain-specialist review has occurred. |

## Chapter implementation ledger

Every chapter below is **verified locally** at the model/smoke-test level. None is labelled independently scientifically validated.

| Chapter | Implemented experiment | Boundary made explicit |
|---|---|---|
| 01 Human node | Switch human illustration/node and analytical lenses | A representation omits properties; it does not exhaust a person. |
| 02 Limits | Finite work budget, demand, completed/deferred bars | Illustrative units; no biological capacity claim. |
| 03 Organism | Four-role dependency puzzle with missing-role intervention | Task-specific coordination; organism language is an analogy. |
| 04 Removal | Ordinary member, bridge, unique skill; connectivity and coverage | Structural redundancy and functional necessity are different. |
| 05 Small causes | Matched averaging and coupled-logistic twins | Averaging retains a common offset; finite-time growth is not a maximal Lyapunov exponent. |
| 06 Quantity | Same 24 jobs; vary workers and serial dependency | Scaling depends on task structure, not a universal population law. |
| 07 Connections | Unique long links, hop distance, finite processing budget | More links can shorten paths while exceeding a stipulated budget. |
| 08 Quality | Source/channel/interpretation/repetition stages | Perfect fidelity can transmit a false claim; adversarial repetition is a constructed case. |
| 09 Cohesion | Bounded-confidence pair updates and stipulated trusted contact | Mean preservation and opinion dispersion do not establish social welfare. |
| 10 Alignment | Independent coupling/noise, target and wrong-target presets | Coherence R is distinct from target projection Q. |
| 11 Learning | Noisy measurements, repeats, shared sensor bias | More displayed observations need not mean more independent evidence. |
| 12 Memory | Seed, copy, remove origin/carrier, mutate | Instantaneous copy events; extinction is possible; no hidden in-flight resurrection. |
| 13 Storage | Write/replicate/lose/alter records and lose access | Preservation, accessibility, fidelity and truth differ. |
| 14 Coding | Three-hop binary channel; frozen one/five-copy runs; shared errors | Repetition costs bandwidth; independent-error theory has declared assumptions. |
| 15 Productivity | Matched independent assignment/shared queue; wrong plan | Coordination changes duplicate work; agreement does not establish correctness. |
| 16 Comparison | Explicit trace recurrence, directional order, transport failure | Shared mathematics is not biological or institutional equivalence. |
| 17 Trade-offs | Nine measured network designs, cost/service frontier, excluded recipients | Nondominance is relative to sampled designs and chosen task; no universal optimum. |

## Verification and evidence

- Static check: JavaScript syntax, 17 chapter IDs, 57 unique chapter controls, source references, generated editions, and mathematical control-character checks.
- 18 model tests: exact graph fixtures, coherence/accuracy separation, frozen coding runs, deterministic resets and replay, averaging residual, mean-preserving opinions, matched work comparisons, independent observations versus copies, memory extinction, storage failures/access, Monte Carlo error correction, false-source fidelity, unique-edge saturation, and sampled Pareto dominance.
- 17 browser tests: ordinary control operation, keyboard memory path, offscreen suspension, narrow layouts, rotation, reduced motion, slider/default agreement, no-JS pages, agent API, opt-in audio, history/navigation, and pilot coding regression.
- Visual inspection: phone home, alignment and coding panels, contact sheet of all 17 panels. Captures include an intervention where a chapter has a button. They do not exhaust every possible parameter combination or establish aesthetic preference.
- `implementation-evidence/browser-matrix.json` contains the cross-engine smoke results; PNGs and contact sheet are visual evidence. Original pre-change audit artifacts remain separate.

Three issues were caught during final visual verification and repaired: slider step rounding made 0.12 appear as 0.10, and a header style change overflowed the 320 px viewport. A queued scroll handler could also close a newly opened chapter menu; menus now close on outside interaction, Escape, or chapter selection. The final tests include the default-value regression and all three viewport sizes.

## Deliberate scope choices and remaining plan items

The implementation follows the plan's scientific priorities, but does not claim every proposed enhancement is delivered:

- Chapters retain their stable IDs and order. The proposed five-act navigation and short introductory route are not implemented.
- The opening uses a restrained static background. Motion is initiated by the reader; bar and heading changes interpolate without altering mathematical state.
- Chapter 05 uses 24 equal-sized nodes in both twins. The norm and growth are textual; a time-history/log-scale plot and seed gallery remain possible improvements.
- Comparisons in chapter 16 are explicitly limited recurrences, alignment, and transport examples. No ant-foraging, Physarum or institutional mechanism is claimed to have been faithfully simulated.
- The claim registry covers principal chapter claims, not a sentence-by-sentence systematic literature review. Source statuses must remain visible; restricted papers and identified-only records need specialist follow-up.
- Sound remains an optional ambient layer. Data sonification and event-based musical mappings are not implemented.
- The tests verify deterministic logical-step behavior, not a measured 60/120/144 Hz hardware matrix. No physical-device frame-time, battery, thermal, or assistive-technology certification is implied.
- Human comprehension and independent specialist review cannot be replaced with passing software tests. Use the review protocol in the master plan before asserting demonstrated educational impact.

## Maintainer handoff

Start with `README.md`. Edit canonical content, then run `npm run generate`. Keep methods, controls and models in agreement. Run `npm test` and `npm run test:browser` after changes. Use screenshots and real inputs; do not weaken a failing layout assertion or force clicks to hide defects. Old visualization modules are retained as inactive historical implementation, not alternate canonical models.

All changes are local. No commit, push, pull request, or deployment was made.
