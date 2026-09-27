# Emergent Humanity — Implemented model notes

These notes describe the quantitative experiments at lab.html. The main animated essay uses separate illustrative visualizations. Generated from the canonical chapter records. Model version 2.0.0. Mathematical results are conditional on assumptions. Independent specialist review remains pending.

## 01 — The Human Node

Type: Illustration

Assumptions: A question selects a subset of properties. No claim of a full human state.

Parameters: Choose a lens; toggle person/node.

x = φ(person; question)

Limits: No biological or psychological quantities are estimated.

Emergent Properties — Stanford Encyclopedia of Philosophy: https://plato.stanford.edu/entries/properties-emergent/

## 02 — The Great Organism

Type: Dependency model + analogy

Assumptions: Four distinct roles and their coordination are all necessary.

Parameters: Toggle connectivity and the verification role.

success = connected AND all four roles available

Limits: Not a realistic engineering design, biological organism, or evidence of consciousness.

Queller & Strassmann (2009), Beyond society: the evolution of organismality: https://pmc.ncbi.nlm.nih.gov/articles/PMC2781869/
Collective Intentionality — Stanford Encyclopedia of Philosophy: https://plato.stanford.edu/entries/collective-intentionality/

## 03 — The Limits of a Node

Type: Toy resource model

Assumptions: One job consumes one unit; work occurs within a fixed interval.

Parameters: Capacity b ∈ [1,24]; demand d ∈ [1,24].

completed = min(b,d); deferred = max(0,d−b)

Limits: A bounded work budget does not imply a finite cardinality of human states.



## 04 — A Node Goes Dark

Type: Graph intervention

Assumptions: Two six-person cliques joined by node 12; node 2 alone supplies one of three required skills.

Parameters: Remove member 1, bridge 12, or specialist 2. Every intervention starts from the intact graph.

reach = reachable ordered pairs / (13 × 12)

Limits: Chosen metrics do not measure moral worth. Denominators use the original 13 people.

Broido & Clauset (2019), Scale-free networks are rare: https://www.nature.com/articles/s41467-019-08746-5

## 05 — A Tiny Difference

Type: Discrete dynamical model

Assumptions: Twenty-four nodes on a ring; two identical initial states; one perturbation of 10⁻⁷.

Parameters: Averaging weights .62/.38; nonlinear logistic parameter 3.9, coupling .08.

averaging: xᵢ′=.62xᵢ+.38 mean(neighbors)
sensitive: f(x)=3.9x(1−x); xᵢ′=.92f(xᵢ)+.08 mean(f(neighbors))
gₜ=log(maxᵢ|aᵢ−bᵢ|/10⁻⁷)/t

Limits: The averaging consensus mode preserves an offset; finite-time separation is not a maximal Lyapunov exponent.

Eckmann & Ruelle (1985), Ergodic theory of chaos and strange attractors: https://doi.org/10.1103/RevModPhys.57.617

## 06 — More Minds

Type: Task simulation

Assumptions: Twenty-four identical unit jobs. Each worker completes at most one per round; assignments do not overlap.

Parameters: One to twelve workers; serial mode limits progress to one job per round.

parallel progress per round = min(workers, remaining jobs)
serial progress per round = min(1, remaining jobs)

Limits: No claim about population, demographic policy, or real production functions.



## 07 — Closing the Distance

Type: Graph + budget model

Assumptions: Twelve-node undirected ring; unique chords added in a fixed long-range-first order; one demand unit at each incident endpoint.

Parameters: Per-node processing budget b from 1 to 12.

mean path = sum of finite distances / reachable ordered pairs
serviced fraction = Σ min(kᵢ,b) / Σ kᵢ

Limits: Demand is stipulated. Path length and usable communication are different observables.

Watts & Strogatz (1998), Collective dynamics of small-world networks: https://doi.org/10.1038/30918

## 08 — When Information Fails

Type: Layered toy experiment

Assumptions: Binary world state is fixed at 1. Source truth, channel fidelity and interpretation are separate.

Parameters: Bernoulli channel fidelity; optional inversion; adversarial selection repeats only errors.

source → channel flip with probability 1−q → optional interpretation inversion → selection

Limits: Real semantics, trust, and incentives are not binary switches; trial totals mix settings if controls change.

Shannon (1948), A Mathematical Theory of Communication: https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf

## 09 — The Network Splits

Type: Bounded-confidence toy model

Assumptions: Forty seeded opinions, uniform over [−1,1]. Random pair encounters use simultaneous symmetric updates.

Parameters: μ=.12; ε=1.85−1.7×selectivity. Trusted mode waives ε for three agents.

if |oᵢ−oⱼ|≤ε: oᵢ′=oᵢ+.12(oⱼ−oᵢ); oⱼ′=oⱼ−.12(oⱼ−oᵢ)

Limits: The histogram concerns opinions, not hostility or all mechanisms of political polarization.

Deffuant et al. (2000), Mixing beliefs among interacting agents: https://doi.org/10.1142/S0219525900000078
Bail et al. (2018), Exposure to opposing views on social media can increase political polarization: https://doi.org/10.1073/pnas.1804840115

## 10 — Moving Together

Type: Circular-order model

Assumptions: Twenty-four headings; global mean-direction coupling. The externally stipulated target is rightward.

Parameters: Coupling and noise vary independently. Presets set all headings toward/away or randomize them.

R = |Σ exp(iθᵢ)|/N
Q = Σ cos(θᵢ−0)/N

Limits: No externally given compass resolves moral disagreement; global alignment is not original local-neighbor flocking.

Vicsek et al. (1995), Novel type of phase transition in a system of self-driven particles: https://doi.org/10.1103/PhysRevLett.75.1226
Lorenz et al. (2011), How social influence can undermine the wisdom of crowd effect: https://pmc.ncbi.nlm.nih.gov/articles/PMC3107299/
Becker et al. (2017), Network dynamics of social influence in the wisdom of crowds: https://pmc.ncbi.nlm.nih.gov/articles/PMC5495222/

## 11 — Touching Reality

Type: Estimation model

Assumptions: Target 50; independent uniform measurement noise over [−15,15]; optional +15 bias.

Parameters: Take a new measurement or repeat the previous value.

estimate = arithmetic mean of displayed observations
absolute error = |estimate−50|

Limits: Repeated samples reweight the arithmetic mean; no confidence interval falsely treats them as independent.

Shannon (1948), A Mathematical Theory of Communication: https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf

## 12 — Memory Beyond the Individual

Type: Replication model

Assumptions: Twelve-node ring. Each carrier copies to at most one available neighboring recipient per step.

Parameters: Mutation off by default; if on, 8% chance of incrementing a variant at each copy (illustrative).

lineage survives if live copy count > 0
exact fidelity counts variant 0 only

Limits: Copying is instantaneous at logical steps; no forgetting or in-flight storage is modeled. Exact copying does not establish truth.



## 13 — Memory Outside the Brain

Type: Carrier failure model

Assumptions: One person and two records; original variant 0, altered variant 1.

Parameters: Copy, loss, alteration, shared failure, and access toggles are explicit interventions.

usable originals = original person copy + accessible original records

Limits: Records are not permanent or self-interpreting; loss events are not calibrated failure rates.



## 14 — Against Noise

Type: Binary symmetric channel

Assumptions: Three identical independent hops; twelve bits; one or five copies; per-run settings frozen.

Parameters: Bit-flip p in [0,.15]. Shared-error mode uses the same flip mask across all copies per hop.

pₕ = [1−(1−2p)ʰ]/2
P₅ = 10pₕ³(1−pₕ)² + 5pₕ⁴(1−pₕ) + pₕ⁵

Limits: Majority benefit assumes independent copies. Expected bit error is not whole-message error or semantic correctness.

Shannon (1948), A Mathematical Theory of Communication: https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf

## 15 — More Than the Sum

Type: Task simulation

Assumptions: Six equal workers, 24 unit jobs, fixed seed. Independent selection is with replacement; shared queue avoids duplicates.

Parameters: One coordination message per assigned shared-queue job; optional wrong-plan condition.

correct output = number of distinct correctly completed jobs
duplicates = attempts at jobs already completed

Limits: These observables do not define a general intelligence score or establish a universally optimal institution.

Woolley et al. (2010), Evidence for a collective intelligence factor in the performance of human groups: https://pubmed.ncbi.nlm.nih.gov/20929725/
Ostrom (2010), Beyond Markets and States: Polycentric Governance of Complex Economic Systems: https://www.aeaweb.org/articles?id=10.1257%2Faer.100.3.641

## 16 — Same Pattern, Different Matter

Type: Structural analogy

Assumptions: Separate generic recurrence, global heading consensus, and ring-graph failure example.

Parameters: Trace traffic fixed at 3 and 2; transport damage removes incident edges of node 0.

T′ = .93T + .055F
R = |Σ exp(iθᵢ)|/N
efficiency = Σᵢ≠ⱼ 1/d(i,j) / [N(N−1)] (unreachable terms 0)

Limits: No inference of shared physiology, incentives, consciousness, or biological optimization.

Vicsek et al. (1995), Novel type of phase transition in a system of self-driven particles: https://doi.org/10.1103/PhysRevLett.75.1226
Tero et al. (2010), Rules for biologically inspired adaptive network design: https://pubmed.ncbi.nlm.nih.gov/20093467/

## 17 — How Humanity Thrives

Type: Constrained graph comparison + normative reflection

Assumptions: Twelve-node ring, eight candidate chords, budget 20 links. Eleven requests from node 0; deadline three hops.

Parameters: Choose zero to eight extra links; optionally remove node 5 and incident edges.

cost = installed links; service = delivered requests / 11
A dominates B if costA≤costB and serviceA≥serviceB, with at least one strict inequality

Limits: Frontier is among nine sampled designs for these two objectives. It does not establish fairness or the full Pareto frontier.

Ostrom (2010), Beyond Markets and States: Polycentric Governance of Complex Economic Systems: https://www.aeaweb.org/articles?id=10.1257%2Faer.100.3.641
