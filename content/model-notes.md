# Emergent Humanity — Formal Model Notes

This note documents the mathematical ideas behind the interactive essay. It is deliberately separate from the main narrative so the interface can stay readable.

The visualizations are **toy models**. They are intended to make assumptions inspectable, not to reproduce empirical human society or prove the philosophical interpretation.

## 1. Core representation

At time (t), represent the system as a temporal network

[
mathcal G_t=(V,E_t).
]

A useful extension is a heterogeneous node set

[
V = H cup S,
]

where (H) contains humans and (S) contains external storage or institutional artifacts.

A human node (i) has an internal state

[
x_i(t)inmathbb R^d
]

and an activity variable

[
a_i(t)in{0,1}.
]

The binary variable is only an availability state. It does **not** imply that a human is intrinsically one bit.

The node itself is a **coarse-graining** of a much richer person. Write

\[
x_i = \phi(h_i;Q),
\]

where \(h_i\) is the high-dimensional human state and \(Q\) is the question the model is trying to answer. The map \(\phi\) keeps some variables and discards others. A different question can require a different node state. No fixed vector \(x_i\) is claimed to be a complete representation of a person.

Edges can carry multiple attributes:

[
e_{ij}(t)=
igl(
w_{ij},
q_{ij},
b_{ij},
	au_{ij},
ell_{ij},
dots
igr),
]

for influence or trust (w), transmission reliability (q), bandwidth (b), latency (	au), and relationship layer (ell).

Human society is therefore better understood as a temporal, heterogeneous, multilayer network than as one static graph.

## 2. Node limits

For a trait or task (k), performance can be represented schematically as

[
P_{ik}
=
F_k(G_i,E_i,D_i,T_i),
]

where (G_i) represents inherited biological variation, (E_i) environment and development, (D_i) current physiological state, and (T_i) tools or augmentation.

The framework's claim is not that there is one scalar genetic maximum. It is that, for a fixed biological organism and current technology, the attainable state space is finite. Removing environmental constraints can move performance toward the biological envelope without making that envelope unbounded.

Genotype and environment can interact, so the boundary itself may depend on the environment.

## 3. Node loss and structural importance

For any network-level observable (M), define the consequence of removing node (v) as

[
Delta_v M
=
M(G)-M(G-v).
]

There is no universal node importance. The result depends on the chosen observable.

Examples include:

- giant-component size;
- average path length;
- global efficiency;
- information throughput;
- task coverage;
- access to unique knowledge.

Degree, betweenness, PageRank, articulation status, and functional specialization can be useful predictors of impact, but none is a universal definition of human importance.

Chapter 04 makes the marginal-effect idea explicit with more than one observable. Its structural efficiency proxy is

\[
E_G
=
\frac{1}{N(N-1)}
\sum_{i\ne j}
\frac{1}{d(i,j)},
\]

with disconnected pairs contributing zero. It also displays largest-component size and a toy task-coverage variable. Ordinary low-degree removals are compared with a node that is deliberately allowed to acquire bridge links and one unique task. This demonstrates two separate points: most removals can have tiny marginal effects in a redundant network, and structural importance can change as a node's role changes.

That is a statement about a selected **system observable**, not a statement about moral worth, subjective value, or a universal ranking of people.

The runtime network uses a stylized heterogeneous topology, not a claim that human society is exactly scale-free. Strongly scale-free structure is not empirically universal across real networks.

## 4. Perturbations, stability, and chaos

Complexity does not imply chaos.

For a dynamical system

[
x_{t+1}=F(x_t),
]

a perturbation (delta x_0) may shrink, remain bounded, or grow.

A positive maximal Lyapunov exponent is commonly used as evidence of exponential sensitivity to initial conditions:

[
lambda_{max}
=
limsup_{t	oinfty}
rac{1}{t}
log
rac{|delta x_t|}{|delta x_0|}.
]

The Chapter 05 visualization therefore compares two deliberately different regimes:

1. a contracting consensus process where perturbations decay;
2. a sensitive nonlinear process where nearby trajectories tend to diverge.

For the one injected perturbation, the interface reports the finite-time growth rate

\[
\hat\lambda_t
=
\frac{1}{t}
\log
\frac{\lVert\delta x_t\rVert}
     {\lVert\delta x_0\rVert}.
\]

This is a transparent finite-time divergence diagnostic for the toy trajectories, **not** a rigorous computation of the system's maximal Lyapunov exponent. A positive maximal Lyapunov exponent is a standard signature of exponential instability, but chaos requires more than merely observing one unstable point or one transient positive estimate.

The chapter does not claim that all emergent systems are chaotic.

## 5. Node quantity and coordination cost

More nodes can increase potential parallel capacity:

[
C_{mathrm{potential}}
propto
sum_i c_i,
]

where (c_i) is a task-relevant capacity.

But realized performance need not rise monotonically with (N). Coordination cost depends on architecture and task structure.

A fully connected communication pattern has

[
|E|=rac{N(N-1)}{2},
]

but real scalable systems usually avoid all-to-all communication through modularity, hierarchy, specialization, routing, institutions, and external memory.

The project therefore treats node count as **potential capacity**, not guaranteed output.

## 6. Connection quantity

Useful structural observables include:

[
langle kangle=rac{2|E|}{|V|}
]

for mean degree and shortest-path distance (d(i,j)).

Long-range links can sharply improve reachability and reduce mean path length without making the network complete.

The revised visualization adds a deliberately generic finite per-node processing budget \(b\). If node \(i\) has degree \(k_i\), the fraction of directed connection demand that can be serviced in one toy time window is

\[
U
=
\frac{\sum_i \min(k_i,b)}
     {\sum_i k_i}.
\]

As degree rises beyond \(b\), potential reachability can continue improving while this usable fraction falls. The budget is not an empirical estimate of human attention; it represents the more general fact that nodes can have finite communication or processing capacity.

## 7. Connection quality

"Quality" is multidimensional. It may include:

- physical transmission fidelity;
- semantic or interpretive fidelity;
- relevance;
- trust calibration;
- source reliability;
- timeliness;
- incentive compatibility;
- usefulness for the receiver's task.

These must not be collapsed into Shannon noise.

Chapter 08 now separates several layers in one toy cascade. Let \(z\in\{0,1\}\) denote the underlying truth value of a claim.

- The source emits the correct value with probability \(s\).
- The channel flips the transmitted value with probability \(1-q\).
- Interpretation flips the received value with probability \(1-r\).
- A receiver's accept/reject assessment is correct with probability \(t\).
- A separate selection parameter changes the probability that accepted messages are repeated.

The fifth layer is intentionally not called a transmission failure. Selection pressure changes **which messages propagate** rather than whether a physical connection works.

The implementation's "amplification bias" slider is a deliberately adversarial toy case in which inaccurate accepted messages become increasingly likely to be repeated. It does **not** claim that real incentives universally favor false information.

## 8. Polarization

Separate node state from graph structure.

Let opinion be

[
o_i(t)in[-1,1].
]

One standard toy rule is bounded-confidence interaction. For an interacting pair (i,j), if

[
|o_i-o_j|learepsilon,
]

then

[
o_i' = o_i+mu(o_j-o_i),
]

[
o_j' = o_j+mu(o_i-o_j),
]

with (0<mule 1/2).

When confidence bounds are narrow, multiple persistent opinion clusters can form.

The visualization uses this family of dynamics plus a structural display of cross-group ties. "Bridge" nodes are modeled as trusted cross-group interactions with a wider confidence bound.

That is a **specific mechanism**, not a theorem that exposure to disagreement always depolarizes people.

## 9. Alignment

Give each node a direction

[
	heta_iin[0,2pi).
]

Directional coherence is measured by the circular order parameter

[
R
=
left|
rac{1}{N}
sum_{i=1}^{N} e^{i	heta_i}
ight|,
]

with

[
0le Rle1.
]

(R=1) means perfect directional alignment.

(Rapprox0) means the directions largely cancel, but exact zero requires exact cancellation.

The visualization uses local angular consensus on a graph. It is inspired by consensus, Vicsek, and Kuramoto-style models but is not presented as an exact implementation of any one of them.

High (R) is coordination, not correctness or welfare.

## 10. Environmental information

Information can enter through observations and measurements, but inference can create new propositions without a fresh observation at every step.

A fuller epistemic model would distinguish:

[
	ext{measurement}
ightarrow
	ext{representation}
ightarrow
	ext{inference}
ightarrow
	ext{communication}
ightarrow
	ext{verification}.
]

The current visualization models only the first acquisition step.

## 11. Collective memory

For one information item (m), let

[
c_i^{(m)}(t)in{0,1}
]

indicate whether carrier (i) currently contains a usable copy.

The number of live copies is

[
C_m(t)=sum_i a_i(t)c_i^{(m)}(t).
]

An item survives while

[
C_m(t)>0.
]

Transmission increases copy count; forgetting, mutation, corruption, or node loss can change or decrease the surviving information.

Chapter 12 implements replication rather than teleportation. Each copied item carries a discrete variant label, and each transmission mutates that label with a fixed toy probability

\[
p_{\mathrm{mut}}=0.08.
\]

The value is illustrative, not an empirical estimate of cultural mutation. It exists so the animation makes a basic point visible: persistence of an information lineage does not imply exact preservation of its content. If every live carrier disappears, the lineage disappears from the toy system.

## 12. External memory

External media add carrier classes with different failure rates, capacities, access costs, and fidelities.

For storage medium (s), useful variables include

[
(	au_s,f_s,r_s,c_s,b_s),
]

for expected lifetime, fidelity, replication, retrieval cost, and bandwidth.

External storage can greatly increase persistence without making information permanent or perfectly objective.

Chapter 13 therefore allows an external record to fail in two distinct ways: **loss** removes a stored item, while **alteration** replaces it with a visibly marked variant. Redundant copies may preserve the original elsewhere. These are explicit toy failure events rather than calibrated physical decay rates.

## 13. Noisy transmission and error correction

Chapter 14 uses a binary symmetric channel as a deliberately simple communication model.

At each hop, each bit flips independently with probability (p).

For (h) identical independent hops, the effective probability that a bit has flipped an odd number of times is

[
p_h
=
rac{1-(1-2p)^h}{2}.
]

This is a real mathematical channel model, unlike an arbitrary "distortion += constant" rule.

With five independently transmitted copies and bitwise majority decoding, the probability that the majority is wrong is

[
P_{mathrm{maj}}
=
sum_{k=3}^{5}
{5choose k}
p_h^k(1-p_h)^{5-k}.
]

The repetition code spends more bandwidth to gain reliability.

This illustrates a central information-theoretic point: noisy transmission does not imply unavoidable accumulating corruption. Appropriate coding can make error probabilities very small when operating within channel constraints.

Shannon entropy, semantic drift, and thermodynamic entropy remain distinct concepts.

## 14. Collective intelligence and productivity

The project does not define a universal scalar "humanity score."

Instead, the Chapter 15 display reports transparent proxies such as:

[
C=sum_i q_i
]

for aggregate node-capacity proxy,

[
R_G=rac{|G_{max}|}{|V|}
]

for the fraction of active nodes in the largest connected component, and

[
L=rac{|E|}{|V|}
]

for a simple coordination-load proxy.

These are descriptors, not an empirical production function.

The Chapter 15 visualization also exposes several categorical/proportional toy descriptors rather than hiding them inside one output score: role coverage as a specialization proxy, the fraction of nodes carrying shared memory, duplicate-work flags, inaccurate-information flags, and incentive-mismatch flags. The "Build Scalable Network" interaction improves modular structure, role coverage, memory replication, and duplicated work in the toy network; it deliberately leaves bad-information and incentive-mismatch rates present so topology is not presented as a universal cure.

Real collective performance also depends on task decomposition, incentives, resource distribution, institutions, diversity, conflict, verification, and the external environment.

Collective intelligence does not imply collective phenomenal consciousness.

## 15. Comparative emergence across substrates

Chapter 16 asks whether the same **abstract mathematical structure** can recur in systems with very different physical implementations.

This is a comparison of models, not an assertion that ants, flocks, slime molds, and human civilization are the same kind of entity.

### 15.1 Reinforcing environmental traces

A generic reinforcement-with-decay rule is

[
T_e(t+1)
=
(1-\rho)T_e(t)+\alpha F_e(t),
]

where \(T_e\) is a persistent trace associated with option or path \(e\), \(F_e\) is recent traffic or deposition, \(\rho\) is decay, and \(\alpha\) is reinforcement.

Ant pheromone trails provide a biological example of local environmental traces participating in self-organized path formation. In the human panel, the same equation is used only as a **toy abstraction** for an external signal strengthened by repeated use and weakened by decay. It is not a claim that human institutions, media, or culture literally operate through pheromone dynamics.

### 15.2 Directional order

For agents carrying directions \(\theta_i\), the chapter reuses the circular order parameter

[
R
=
\left|
\frac{1}{N}
\sum_{i=1}^{N} e^{i\theta_i}
\right|.
]

In a flocking model, \(\theta_i\) can represent physical heading. In the human toy model, it represents an abstract direction of effort or goal. The same observable can therefore quantify coherence while the meaning of the state variable changes.

### 15.3 Adaptive transport networks

Transport systems can be compared using common graph observables such as efficiency, material or maintenance cost, and robustness.

The visualization combines them into a deliberately project-defined toy score

[
J(G)=E(G)-\lambda C(G)+\mu B(G),
]

where \(E\) is an efficiency proxy, \(C\) is normalized network cost, and \(B\) is a connectivity-based robustness proxy.

This equation is **not** a biological law of *Physarum* and is not an empirical production function for human infrastructure. It is a shared measuring frame for comparing two adaptive-network pictures. Experimental work on *Physarum polycephalum* motivates the broader idea that decentralized growth can produce networks balancing transport efficiency, construction cost, and fault tolerance.

### 15.4 Transfer rule

The comparative chapter follows a strict inference rule:

[
\boxed{
\text{same equation or observable}
\not\Rightarrow
\text{same mechanism, meaning, or ontology}
}
]

A repeated mathematical form is evidence of a useful structural analogy. Establishing a shared causal mechanism requires additional empirical evidence.

## 16. Multi-objective thriving

Chapter 17 does not define a scalar objective called "human flourishing" or "humanity score."

Instead let the controllable toy state be

\[
u =
(c,k,q,m,r,a,d,f),
\]

for node capability \(c\), connectivity \(k\), information fidelity \(q\), memory \(m\), redundancy \(r\), alignment \(a\), diversity \(d\), and feedback from the external environment \(f\).

The visualization maps that state to several **separate** project-defined objective proxies,

\[
Y(u)
=
(L,C,R,A,-K,-Z),
\]

where \(L\) is learning, \(C\) coordination, \(R\) resilience, \(A\) adaptability, \(K\) resource cost, and \(Z\) error lock-in risk.

The formulas are deliberately transparent toy functions chosen to encode the chapter's stated trade-offs:

- high connectivity improves reach but can create overload under finite node capacity;
- alignment improves immediate directional coordination but can reduce the exploration component of adaptability;
- redundancy and memory improve persistence while consuming resources;
- memory combined with poor fidelity and weak external correction can preserve error;
- diversity can support exploration and resilience while imposing a toy short-run coordination cost.

No empirical claim is made that these functional forms or weights describe real civilization.

This is naturally a **multi-objective optimization** problem. For objective vector \(Y\), a feasible state \(u_1\) dominates \(u_2\) only if it is at least as good on every objective and strictly better on at least one. Non-dominated states form a Pareto set/front rather than one automatically preferred optimum.

The interface shows all objectives separately and includes a two-objective slice obtained by sweeping alignment while holding the other controls fixed. It deliberately refuses to aggregate them into one score because the weights of such an aggregation would encode value judgments that the mathematics itself cannot choose.

## 17. What "organism" means here

"Organism" is a modeling analogy.

Evolutionary biology contains stronger concepts such as organismality and superorganisms, often associated with very high cooperation, low internal conflict, functional integration, and adaptation at the collective level.

Human civilization satisfies some organism-like analogies and violates others. This project therefore uses **networked collective** as the literal description and **emergent organism** as the exploratory metaphor.

## Selected references

- Albert R, Jeong H, Barabási A-L. *Error and attack tolerance of complex networks*. Nature (2000). https://doi.org/10.1038/35019019
- Eckmann J-P, Ruelle D. *Ergodic theory of chaos and strange attractors*. Reviews of Modern Physics (1985). https://doi.org/10.1103/RevModPhys.57.617
- Deb K, Pratap A, Agarwal S, Meyarivan T. *A fast and elitist multiobjective genetic algorithm: NSGA-II*. IEEE Transactions on Evolutionary Computation (2002). https://doi.org/10.1109/4235.996017
- Broido AD, Clauset A. *Scale-free networks are rare*. Nature Communications (2019). https://doi.org/10.1038/s41467-019-08746-5
- Watts DJ, Strogatz SH. *Collective dynamics of small-world networks*. Nature (1998). https://doi.org/10.1038/30918
- Deffuant G et al. *Mixing beliefs among interacting agents*. Advances in Complex Systems (2000). https://doi.org/10.1142/S0219525900000078
- Vicsek T et al. *Novel type of phase transition in a system of self-driven particles*. Physical Review Letters (1995). https://doi.org/10.1103/PhysRevLett.75.1226
- Shannon CE. *A Mathematical Theory of Communication*. Bell System Technical Journal (1948). https://doi.org/10.1002/j.1538-7305.1948.tb01338.x
- Queller DC, Strassmann JE. *Beyond society: the evolution of organismality*. Philosophical Transactions B (2009). https://doi.org/10.1098/rstb.2009.0095
- Bonabeau E, Theraulaz G, Deneubourg J-L, Aron S, Camazine S. *Self-organization in social insects*. Trends in Ecology & Evolution (1997). https://doi.org/10.1016/S0169-5347(97)01048-3
- Deneubourg J-L, Aron S, Goss S, Pasteels JM. *The self-organizing exploratory pattern of the Argentine ant*. Journal of Insect Behavior (1990). https://doi.org/10.1007/BF01417909
- Tero A et al. *Rules for biologically inspired adaptive network design*. Science (2010). https://doi.org/10.1126/science.1177894
- Muthukrishna M, Henrich J. *Innovation in the collective brain*. Philosophical Transactions B (2016). https://doi.org/10.1098/rstb.2015.0192
- Woolley AW et al. *Evidence for a collective intelligence factor in the performance of human groups*. Science (2010). https://doi.org/10.1126/science.1193147
- Vosoughi S, Roy D, Aral S. *The spread of true and false news online*. Science (2018). https://doi.org/10.1126/science.aap9559

## Interpretation rule

For every chapter, keep four layers separate:

[
oxed{
	ext{metaphor}
ightarrow
	ext{toy model}
ightarrow
	ext{empirical claim}
ightarrow
	ext{philosophical interpretation}
}
]

A successful visualization can demonstrate the behavior of its toy model. It cannot, by itself, establish that the same mechanism dominates real human civilization.
