// Shared chapter titles and quantitative experiments.
export const SECTIONS = [
  {
    "id": "node-capacity",
    "number": "01",
    "title": "The Human Node",
    "subtitle": "The dot is not a person.",
    "body": [
      "Every model selects. To study communication, we might keep contacts and messages. To study memory, we need different variables.",
      "Changing the question changes what the model must remember. Experience, agency, relationships, and context do not disappear just because the diagram leaves them out."
    ],
    "insight": "A useful model is incomplete by design. Ask what its omissions cost.",
    "vizHint": "Choose a lens, then simplify the person. This is an illustration of abstraction, not a complete human simulation.",
    "controls": [
      {
        "id": "simplify-person",
        "type": "button",
        "label": "Person ↔ node"
      },
      {
        "id": "lens-communication",
        "type": "button",
        "label": "Communication"
      },
      {
        "id": "lens-memory",
        "type": "button",
        "label": "Memory"
      },
      {
        "id": "lens-task",
        "type": "button",
        "label": "Task"
      }
    ],
    "evidence": {
      "Claim": "Illustration",
      "Assumptions": "A question selects a subset of properties. No claim of a full human state.",
      "Limits": "No biological or psychological quantities are estimated."
    },
    "method": {
      "kind": "Illustration",
      "assumptions": "A question selects a subset of properties. No claim of a full human state.",
      "parameters": "Choose a lens; toggle person/node.",
      "limits": "No biological or psychological quantities are estimated.",
      "formula": "x = φ(person; question)",
      "sources": [
        "emergence"
      ],
      "version": "2.0.0",
      "reviewStatus": "Implementation checked locally; independent specialist review pending."
    }
  },
  {
    "id": "intro",
    "number": "02",
    "title": "The Great Organism",
    "subtitle": "The capability exists in what people do together.",
    "body": [
      "Imagine a task that requires observation, design, construction, and verification. No role alone meets all four requirements.",
      "Connecting complementary roles makes the task possible in this dependency model. Real collective work also needs resources, trust, institutions, and ways to resolve conflict. Calling society organism-like is an analogy, not proof that it is one organism or one mind."
    ],
    "insight": "No person contains the system. The relationships make a difference.",
    "vizHint": "An abstract dependency puzzle: all four roles must be available and connected. This is not an engineering design.",
    "controls": [
      {
        "id": "connect-roles",
        "type": "button",
        "label": "Connect / isolate roles"
      },
      {
        "id": "missing-role",
        "type": "button",
        "label": "Remove / restore verification"
      }
    ],
    "evidence": {
      "Claim": "Dependency model + analogy",
      "Assumptions": "Four distinct roles and their coordination are all necessary.",
      "Limits": "Not a realistic engineering design, biological organism, or evidence of consciousness."
    },
    "method": {
      "kind": "Dependency model + analogy",
      "assumptions": "Four distinct roles and their coordination are all necessary.",
      "parameters": "Toggle connectivity and the verification role.",
      "limits": "Not a realistic engineering design, biological organism, or evidence of consciousness.",
      "formula": "success = connected AND all four roles available",
      "sources": [
        "organismality",
        "intentionality"
      ],
      "version": "2.0.0",
      "reviewStatus": "Implementation checked locally; independent specialist review pending."
    }
  },
  {
    "id": "node-limits",
    "number": "03",
    "title": "The Limits of a Node",
    "subtitle": "You cannot attend to everything.",
    "body": [
      "Finite time and resources constrain what can happen in one interval. Change the available budget or the amount of work and see what gets deferred.",
      "The units here are hypothetical. This task budget is not a measured biological ceiling or a judgment about someone’s lifetime potential. Tools and environment can change what a task requires."
    ],
    "insight": "Changing the task, tools, or environment changes what your limits mean.",
    "vizHint": "One task uses one work unit. Blue is capacity; purple is demand; green is completed work; amber is deferred work.",
    "controls": [
      {
        "id": "available-time",
        "type": "slider",
        "label": "Work budget",
        "min": 1,
        "max": 24,
        "step": 1,
        "value": 8
      },
      {
        "id": "task-demand",
        "type": "slider",
        "label": "Task demand",
        "min": 1,
        "max": 24,
        "step": 1,
        "value": 16
      }
    ],
    "evidence": {
      "Claim": "Toy resource model",
      "Assumptions": "One job consumes one unit; work occurs within a fixed interval.",
      "Limits": "A bounded work budget does not imply a finite cardinality of human states."
    },
    "method": {
      "kind": "Toy resource model",
      "assumptions": "One job consumes one unit; work occurs within a fixed interval.",
      "parameters": "Capacity b ∈ [1,24]; demand d ∈ [1,24].",
      "limits": "A bounded work budget does not imply a finite cardinality of human states.",
      "formula": "completed = min(b,d); deferred = max(0,d−b)",
      "sources": [],
      "version": "2.0.0",
      "reviewStatus": "Implementation checked locally; independent specialist review pending."
    }
  },
  {
    "id": "emergent-organism",
    "number": "04",
    "title": "A Node Goes Dark",
    "subtitle": "Importance depends on what you measure.",
    "body": [
      "A person can be redundant for one function and essential for another. A low-degree bridge connects these two groups; a different person carries a unique required skill.",
      "Remove one person and compare connectivity with skill coverage. These are selected system outcomes, not measures of human worth or estimates of anyone’s total contribution."
    ],
    "insight": "Importance is a relationship between a person, a function, and a moment.",
    "vizHint": "Blue: members. Purple node 12: bridge. Amber node 2: unique skill. Predict which removal changes which outcome.",
    "controls": [
      {
        "id": "remove-node",
        "type": "button",
        "label": "Remove redundant member"
      },
      {
        "id": "remove-hub",
        "type": "button",
        "label": "Remove bridge"
      },
      {
        "id": "remove-specialist",
        "type": "button",
        "label": "Remove unique skill"
      }
    ],
    "evidence": {
      "Claim": "Graph intervention",
      "Assumptions": "Two six-person cliques joined by node 12; node 2 alone supplies one of three required skills.",
      "Limits": "Chosen metrics do not measure moral worth. Denominators use the original 13 people."
    },
    "method": {
      "kind": "Graph intervention",
      "assumptions": "Two six-person cliques joined by node 12; node 2 alone supplies one of three required skills.",
      "parameters": "Remove member 1, bridge 12, or specialist 2. Every intervention starts from the intact graph.",
      "limits": "Chosen metrics do not measure moral worth. Denominators use the original 13 people.",
      "formula": "reach = reachable ordered pairs / (13 × 12)",
      "sources": [
        "networks"
      ],
      "version": "2.0.0",
      "reviewStatus": "Implementation checked locally; independent specialist review pending."
    }
  },
  {
    "id": "illusion-of-significance",
    "number": "05",
    "title": "A Tiny Difference",
    "subtitle": "A small difference can fade, persist, or grow.",
    "body": [
      "Start two copies of the same state. Change one value by one ten-millionth and apply the same rule to both.",
      "Averaging disperses this difference but retains a small common offset. The coupled nonlinear map can amplify it. Finite-time separation is a diagnostic of these trajectories, not proof that civilization is chaotic."
    ],
    "insight": "The rules determine what a perturbation becomes.",
    "vizHint": "Compare equal-size reference and perturbed panels. Choose a regime, perturb once, then Step or Run.",
    "controls": [
      {
        "id": "stable-regime",
        "type": "button",
        "label": "Averaging"
      },
      {
        "id": "sensitive-regime",
        "type": "button",
        "label": "Sensitive map"
      },
      {
        "id": "shift-node",
        "type": "button",
        "label": "Perturb one value"
      }
    ],
    "evidence": {
      "Claim": "Discrete dynamical model",
      "Assumptions": "Twenty-four nodes on a ring; two identical initial states; one perturbation of 10⁻⁷.",
      "Limits": "The averaging consensus mode preserves an offset; finite-time separation is not a maximal Lyapunov exponent."
    },
    "method": {
      "kind": "Discrete dynamical model",
      "assumptions": "Twenty-four nodes on a ring; two identical initial states; one perturbation of 10⁻⁷.",
      "parameters": "Averaging weights .62/.38; nonlinear logistic parameter 3.9, coupling .08.",
      "limits": "The averaging consensus mode preserves an offset; finite-time separation is not a maximal Lyapunov exponent.",
      "formula": "averaging: xᵢ′=.62xᵢ+.38 mean(neighbors)\nsensitive: f(x)=3.9x(1−x); xᵢ′=.92f(xᵢ)+.08 mean(f(neighbors))\ngₜ=log(maxᵢ|aᵢ−bᵢ|/10⁻⁷)/t",
      "sources": [
        "chaos"
      ],
      "version": "2.0.0",
      "reviewStatus": "Implementation checked locally; independent specialist review pending."
    }
  },
  {
    "id": "node-quantity",
    "number": "06",
    "title": "More Minds",
    "subtitle": "More workers help when the task allows it.",
    "body": [
      "Twenty-four jobs await workers with identical capacity. In the parallel task, each worker can finish one job per round. In the serial task, only one job can advance per round.",
      "The extra capacity is real inside these assumptions. It is not a prediction that population alone determines innovation or prosperity. Changing a control restarts the same task."
    ],
    "insight": "More people create potential. The organization and task determine what becomes usable.",
    "vizHint": "Choose workers and task structure, then Run. Green shows completed jobs; attempts and duplicates are separate.",
    "controls": [
      {
        "id": "population-slider",
        "type": "slider",
        "label": "Workers",
        "min": 1,
        "max": 12,
        "step": 1,
        "value": 6
      },
      {
        "id": "serial-task",
        "type": "switch",
        "label": "Serial dependency",
        "value": false
      }
    ],
    "evidence": {
      "Claim": "Task simulation",
      "Assumptions": "Twenty-four identical unit jobs. Each worker completes at most one per round; assignments do not overlap.",
      "Limits": "No claim about population, demographic policy, or real production functions."
    },
    "method": {
      "kind": "Task simulation",
      "assumptions": "Twenty-four identical unit jobs. Each worker completes at most one per round; assignments do not overlap.",
      "parameters": "One to twelve workers; serial mode limits progress to one job per round.",
      "limits": "No claim about population, demographic policy, or real production functions.",
      "formula": "parallel progress per round = min(workers, remaining jobs)\nserial progress per round = min(1, remaining jobs)",
      "sources": [],
      "version": "2.0.0",
      "reviewStatus": "Implementation checked locally; independent specialist review pending."
    }
  },
  {
    "id": "connection-quantity",
    "number": "07",
    "title": "Closing the Distance",
    "subtitle": "Shorter paths do not create more attention.",
    "body": [
      "One long-range link can shorten routes through this ring. Every link also demands a unit of processing from each endpoint during the same time window.",
      "A node can service only its selected budget. More reach can coexist with overload. This budget is illustrative, not an estimate of human attention."
    ],
    "insight": "A shorter path helps a message travel. It does not create time to understand it.",
    "vizHint": "Add one long-range link at a time. Compare shortest paths with the fraction of communication demand that fits the budget.",
    "controls": [
      {
        "id": "deploy-internet",
        "type": "button",
        "label": "Add long-range link"
      },
      {
        "id": "processing-budget",
        "type": "slider",
        "label": "Budget per node",
        "min": 1,
        "max": 12,
        "step": 1,
        "value": 2
      }
    ],
    "evidence": {
      "Claim": "Graph + budget model",
      "Assumptions": "Twelve-node undirected ring; unique chords added in a fixed long-range-first order; one demand unit at each incident endpoint.",
      "Limits": "Demand is stipulated. Path length and usable communication are different observables."
    },
    "method": {
      "kind": "Graph + budget model",
      "assumptions": "Twelve-node undirected ring; unique chords added in a fixed long-range-first order; one demand unit at each incident endpoint.",
      "parameters": "Per-node processing budget b from 1 to 12.",
      "limits": "Demand is stipulated. Path length and usable communication are different observables.",
      "formula": "mean path = sum of finite distances / reachable ordered pairs\nserviced fraction = Σ min(kᵢ,b) / Σ kᵢ",
      "sources": [
        "smallworld"
      ],
      "version": "2.0.0",
      "reviewStatus": "Implementation checked locally; independent specialist review pending."
    }
  },
  {
    "id": "connection-quality",
    "number": "08",
    "title": "When Information Fails",
    "subtitle": "Perfect transmission can preserve a mistake.",
    "body": [
      "The source can be wrong even when the channel transmits every bit correctly. A receiver can also interpret a correct message differently. These are separate mechanisms.",
      "Selection determines which claims are repeated. The adversarial selection option deliberately repeats errors; it does not assert that real incentives always favor falsehood."
    ],
    "insight": "Ask where a claim came from, how it traveled, and how it was checked.",
    "vizHint": "Green circles agree with the stipulated world state. Amber circles differ. A dash means the claim was not selected for repetition.",
    "controls": [
      {
        "id": "source-true",
        "type": "switch",
        "label": "Source claim is true",
        "value": true
      },
      {
        "id": "fidelity-slider",
        "type": "slider",
        "label": "Channel fidelity",
        "min": 0,
        "max": 1,
        "step": 0.1,
        "value": 1
      },
      {
        "id": "interpret-correctly",
        "type": "switch",
        "label": "Interpret without inversion",
        "value": true
      },
      {
        "id": "amplify-errors",
        "type": "switch",
        "label": "Repeat only errors (toy case)",
        "value": false
      },
      {
        "id": "send-claim",
        "type": "button",
        "label": "Send another claim"
      }
    ],
    "evidence": {
      "Claim": "Layered toy experiment",
      "Assumptions": "Binary world state is fixed at 1. Source truth, channel fidelity and interpretation are separate.",
      "Limits": "Real semantics, trust, and incentives are not binary switches; trial totals mix settings if controls change."
    },
    "method": {
      "kind": "Layered toy experiment",
      "assumptions": "Binary world state is fixed at 1. Source truth, channel fidelity and interpretation are separate.",
      "parameters": "Bernoulli channel fidelity; optional inversion; adversarial selection repeats only errors.",
      "limits": "Real semantics, trust, and incentives are not binary switches; trial totals mix settings if controls change.",
      "formula": "source → channel flip with probability 1−q → optional interpretation inversion → selection",
      "sources": [
        "shannon"
      ],
      "version": "2.0.0",
      "reviewStatus": "Implementation checked locally; independent specialist review pending."
    }
  },
  {
    "id": "cohesion",
    "number": "09",
    "title": "The Network Splits",
    "subtitle": "Contact does not determine what happens next.",
    "body": [
      "In this bounded-confidence model, two agents move toward each other only when their opinions are sufficiently close. The histogram makes clusters visible.",
      "Trusted contact changes that rule for three agents. It is an assumption to explore, not a demonstrated cure for political conflict. Opinion dispersion is also different from hostility between groups."
    ],
    "insight": "A bridge creates contact. Trust and the rules of interaction still matter.",
    "vizHint": "Step or Run to sample encounters. Changing selectivity restarts the original opinions and removes the trusted-contact intervention.",
    "controls": [
      {
        "id": "polarize-slider",
        "type": "slider",
        "label": "Selectivity",
        "min": 0,
        "max": 1,
        "step": 0.1,
        "value": 0.6
      },
      {
        "id": "deploy-bridges",
        "type": "button",
        "label": "Allow trusted contact"
      }
    ],
    "evidence": {
      "Claim": "Bounded-confidence toy model",
      "Assumptions": "Forty seeded opinions, uniform over [−1,1]. Random pair encounters use simultaneous symmetric updates.",
      "Limits": "The histogram concerns opinions, not hostility or all mechanisms of political polarization."
    },
    "method": {
      "kind": "Bounded-confidence toy model",
      "assumptions": "Forty seeded opinions, uniform over [−1,1]. Random pair encounters use simultaneous symmetric updates.",
      "parameters": "μ=.12; ε=1.85−1.7×selectivity. Trusted mode waives ε for three agents.",
      "limits": "The histogram concerns opinions, not hostility or all mechanisms of political polarization.",
      "formula": "if |oᵢ−oⱼ|≤ε: oᵢ′=oᵢ+.12(oⱼ−oᵢ); oⱼ′=oⱼ−.12(oⱼ−oᵢ)",
      "sources": [
        "deffuant",
        "bail"
      ],
      "version": "2.0.0",
      "reviewStatus": "Implementation checked locally; independent specialist review pending."
    }
  },
  {
    "id": "alignment",
    "number": "10",
    "title": "Moving Together",
    "subtitle": "Moving together is different from moving well.",
    "body": [
      "When people push in incompatible directions, some effort cancels or interferes. Greater alignment can make a group more effective at pursuing a goal.",
      "But alignment is not automatically good. Diversity can improve exploration and error correction, and a perfectly coordinated group can still pursue a bad objective."
    ],
    "insight": "We can agree completely and still be wrong.",
    "vizHint": "Arrows show directions of effort. The task target is rightward. Compare agreement with performance on this specific task.",
    "controls": [
      {
        "id": "align-goals",
        "type": "button",
        "label": "Agree toward target"
      },
      {
        "id": "wrong-goals",
        "type": "button",
        "label": "Agree away from target"
      },
      {
        "id": "scramble-goals",
        "type": "button",
        "label": "Disagree"
      },
      {
        "id": "coupling",
        "type": "slider",
        "label": "Coupling",
        "min": 0,
        "max": 0.5,
        "step": 0.05,
        "value": 0.15
      },
      {
        "id": "alignment-noise",
        "type": "slider",
        "label": "Noise",
        "min": 0,
        "max": 1,
        "step": 0.01,
        "value": 0.12
      }
    ],
    "evidence": {
      "Claim": "Circular-order model",
      "Assumptions": "Twenty-four headings; global mean-direction coupling. The externally stipulated target is rightward.",
      "Limits": "No externally given compass resolves moral disagreement; global alignment is not original local-neighbor flocking."
    },
    "method": {
      "kind": "Circular-order model",
      "assumptions": "Twenty-four headings; global mean-direction coupling. The externally stipulated target is rightward.",
      "parameters": "Coupling and noise vary independently. Presets set all headings toward/away or randomize them.",
      "limits": "No externally given compass resolves moral disagreement; global alignment is not original local-neighbor flocking.",
      "formula": "R = |Σ exp(iθᵢ)|/N\nQ = Σ cos(θᵢ−0)/N",
      "sources": [
        "vicsek",
        "lorenz",
        "becker"
      ],
      "version": "2.0.0",
      "reviewStatus": "Implementation checked locally; independent specialist review pending."
    }
  },
  {
    "id": "environment",
    "number": "11",
    "title": "Touching Reality",
    "subtitle": "Repeating a claim is not checking it.",
    "body": [
      "A sensor measures a known target with noise. Independent measurements can help an estimator; copying an existing measurement does not create another independent observation.",
      "A biased sensor can repeatedly miss the target. The green estimate is the arithmetic mean of all displayed observations, including duplicates, so repeated claims can move it without adding evidence."
    ],
    "insight": "Learning requires contact with reality—and scrutiny of how that contact works.",
    "vizHint": "Amber line: target 50. Blue dots: observations. Green dot: their mean. Sensor bias adds 15 units; changing bias starts a fresh trial.",
    "controls": [
      {
        "id": "release-info",
        "type": "button",
        "label": "Take measurement"
      },
      {
        "id": "copy-observation",
        "type": "button",
        "label": "Repeat last observation"
      },
      {
        "id": "sensor-bias",
        "type": "switch",
        "label": "Biased sensor (+15)",
        "value": false
      }
    ],
    "evidence": {
      "Claim": "Estimation model",
      "Assumptions": "Target 50; independent uniform measurement noise over [−15,15]; optional +15 bias.",
      "Limits": "Repeated samples reweight the arithmetic mean; no confidence interval falsely treats them as independent."
    },
    "method": {
      "kind": "Estimation model",
      "assumptions": "Target 50; independent uniform measurement noise over [−15,15]; optional +15 bias.",
      "parameters": "Take a new measurement or repeat the previous value.",
      "limits": "Repeated samples reweight the arithmetic mean; no confidence interval falsely treats them as independent.",
      "formula": "estimate = arithmetic mean of displayed observations\nabsolute error = |estimate−50|",
      "sources": [
        "shannon"
      ],
      "version": "2.0.0",
      "reviewStatus": "Implementation checked locally; independent specialist review pending."
    }
  },
  {
    "id": "collective-memory",
    "number": "12",
    "title": "Memory Beyond the Individual",
    "subtitle": "Survival does not guarantee fidelity.",
    "body": [
      "Information persists when usable copies remain after the original carrier disappears. In this model, copies travel along neighboring links one logical step at a time.",
      "Optional mutation changes a copied variant. A surviving lineage is not necessarily an exact record, and an exact record is not necessarily true."
    ],
    "insight": "An idea can outlive its author without surviving unchanged.",
    "vizHint": "Amber rings mark carriers. Pink carriers hold altered variants. Spawn an idea, Step to copy it, then remove carriers with the buttons.",
    "controls": [
      {
        "id": "spawn-idea",
        "type": "button",
        "label": "Spawn idea"
      },
      {
        "id": "remove-origin",
        "type": "button",
        "label": "Remove origin"
      },
      {
        "id": "remove-carrier",
        "type": "button",
        "label": "Remove another carrier"
      },
      {
        "id": "mutate-copy",
        "type": "switch",
        "label": "Allow mutation (8% per copy)",
        "value": false
      }
    ],
    "evidence": {
      "Claim": "Replication model",
      "Assumptions": "Twelve-node ring. Each carrier copies to at most one available neighboring recipient per step.",
      "Limits": "Copying is instantaneous at logical steps; no forgetting or in-flight storage is modeled. Exact copying does not establish truth."
    },
    "method": {
      "kind": "Replication model",
      "assumptions": "Twelve-node ring. Each carrier copies to at most one available neighboring recipient per step.",
      "parameters": "Mutation off by default; if on, 8% chance of incrementing a variant at each copy (illustrative).",
      "limits": "Copying is instantaneous at logical steps; no forgetting or in-flight storage is modeled. Exact copying does not establish truth.",
      "formula": "lineage survives if live copy count > 0\nexact fidelity counts variant 0 only",
      "sources": [],
      "version": "2.0.0",
      "reviewStatus": "Implementation checked locally; independent specialist review pending."
    }
  },
  {
    "id": "external-storage",
    "number": "13",
    "title": "Memory Outside the Brain",
    "subtitle": "A record still needs a reader.",
    "body": [
      "Writing and other media let encoded information survive beyond an individual life. Independent replicas can protect against a single loss.",
      "Records can be altered, destroyed together, or become inaccessible. Preserved marks do not automatically preserve their interpretation. These arrangements are a comparison, not a universal ladder of historical progress."
    ],
    "insight": "Someone still has to preserve, access, and understand the record.",
    "vizHint": "Copy from the person to record A, then to B. Test independent loss, shared loss, alteration, and loss of access.",
    "controls": [
      {
        "id": "invent",
        "type": "button",
        "label": "Write record A"
      },
      {
        "id": "replicate-record",
        "type": "button",
        "label": "Copy A to B"
      },
      {
        "id": "lose-person",
        "type": "button",
        "label": "Lose person"
      },
      {
        "id": "lose-record",
        "type": "button",
        "label": "Lose record A"
      },
      {
        "id": "alter-record",
        "type": "button",
        "label": "Alter record A"
      },
      {
        "id": "shared-loss",
        "type": "button",
        "label": "Lose both records"
      },
      {
        "id": "lose-access",
        "type": "button",
        "label": "Toggle record access"
      }
    ],
    "evidence": {
      "Claim": "Carrier failure model",
      "Assumptions": "One person and two records; original variant 0, altered variant 1.",
      "Limits": "Records are not permanent or self-interpreting; loss events are not calibrated failure rates."
    },
    "method": {
      "kind": "Carrier failure model",
      "assumptions": "One person and two records; original variant 0, altered variant 1.",
      "parameters": "Copy, loss, alteration, shared failure, and access toggles are explicit interventions.",
      "limits": "Records are not permanent or self-interpreting; loss events are not calibrated failure rates.",
      "formula": "usable originals = original person copy + accessible original records",
      "sources": [],
      "version": "2.0.0",
      "reviewStatus": "Implementation checked locally; independent specialist review pending."
    }
  },
  {
    "id": "entropy",
    "number": "14",
    "title": "Against Noise",
    "subtitle": "Information can be damaged—and repaired.",
    "body": [
      "Independent bit errors can be reduced by sending five copies and decoding each bit by majority. The gain costs five times the bandwidth and is probabilistic, not a guarantee for every message.",
      "Shared errors across copies undermine that advantage. Physical fidelity is also distinct from meaning: “meet me by the bank” can arrive perfectly while the receiver thinks of the wrong place."
    ],
    "insight": "Reliability has a cost—and assumptions.",
    "vizHint": "Each square is a bit. Red marks a changed bit. Five copies cost five times the transmission bandwidth.",
    "controls": [
      {
        "id": "channel-noise",
        "type": "slider",
        "label": "Per-Hop Bit Flip",
        "min": "0",
        "max": "0.15",
        "step": "0.01",
        "value": "0.04"
      },
      {
        "id": "toggle-redundancy",
        "type": "switch",
        "label": "5× Repetition Code"
      },
      {
        "id": "send-message",
        "type": "button",
        "label": "Send Message"
      },
      {
        "id": "shared-errors",
        "type": "switch",
        "label": "Shared copy errors"
      }
    ],
    "evidence": {
      "Claim": "Binary symmetric channel",
      "Assumptions": "Three identical independent hops; twelve bits; one or five copies; per-run settings frozen.",
      "Limits": "Majority benefit assumes independent copies. Expected bit error is not whole-message error or semantic correctness."
    },
    "method": {
      "kind": "Binary symmetric channel",
      "assumptions": "Three identical independent hops; twelve bits; one or five copies; per-run settings frozen.",
      "parameters": "Bit-flip p in [0,.15]. Shared-error mode uses the same flip mask across all copies per hop.",
      "limits": "Majority benefit assumes independent copies. Expected bit error is not whole-message error or semantic correctness.",
      "formula": "pₕ = [1−(1−2p)ʰ]/2\nP₅ = 10pₕ³(1−pₕ)² + 5pₕ⁴(1−pₕ) + pₕ⁵",
      "sources": [
        "shannon"
      ],
      "version": "2.0.0",
      "reviewStatus": "Implementation checked locally; independent specialist review pending."
    }
  },
  {
    "id": "productivity",
    "number": "15",
    "title": "More Than the Sum",
    "subtitle": "Same people. Same task. Different organization.",
    "body": [
      "Six workers attempt the same twenty-four jobs. Independent selection can duplicate work; a shared assignment queue avoids duplication but spends one coordination message per assignment.",
      "The comparison holds population and worker capacity fixed. A wrong shared plan shows another limitation: coordinated attempts need not produce correct work. These synthetic jobs do not measure a universal group intelligence."
    ],
    "insight": "Collective intelligence is an achievement on a task, not a property of every crowd.",
    "vizHint": "Compare independent assignment with a shared queue. Both restart the same 24 jobs and six workers; Run to measure the outcome.",
    "controls": [
      {
        "id": "uncoordinated",
        "type": "button",
        "label": "Independent assignment"
      },
      {
        "id": "optimize-all",
        "type": "button",
        "label": "Shared assignment queue"
      },
      {
        "id": "bad-plan",
        "type": "switch",
        "label": "Wrong shared plan",
        "value": false
      }
    ],
    "evidence": {
      "Claim": "Task simulation",
      "Assumptions": "Six equal workers, 24 unit jobs, fixed seed. Independent selection is with replacement; shared queue avoids duplicates.",
      "Limits": "These observables do not define a general intelligence score or establish a universally optimal institution."
    },
    "method": {
      "kind": "Task simulation",
      "assumptions": "Six equal workers, 24 unit jobs, fixed seed. Independent selection is with replacement; shared queue avoids duplicates.",
      "parameters": "One coordination message per assigned shared-queue job; optional wrong-plan condition.",
      "limits": "These observables do not define a general intelligence score or establish a universally optimal institution.",
      "formula": "correct output = number of distinct correctly completed jobs\nduplicates = attempts at jobs already completed",
      "sources": [
        "woolley",
        "ostrom"
      ],
      "version": "2.0.0",
      "reviewStatus": "Implementation checked locally; independent specialist review pending."
    }
  },
  {
    "id": "comparative-emergence",
    "number": "16",
    "title": "Same Pattern, Different Matter",
    "subtitle": "Shared mathematics is not shared identity.",
    "body": [
      "A decaying trace, a measure of directional agreement, and the response of a transport network to damage can be useful across different subjects.",
      "The examples here are generic toy mechanisms. A human public signal is not pheromone, an effort direction is not a bird’s heading, and a ring graph is not Physarum physiology."
    ],
    "insight": "Same pattern does not mean same mechanism.",
    "vizHint": "Switch the mathematical comparison. Trace and order evolve with Step; the transport example has an explicit damage intervention.",
    "controls": [
      {
        "id": "pattern-trace",
        "type": "button",
        "label": "Reinforcement + decay"
      },
      {
        "id": "pattern-alignment",
        "type": "button",
        "label": "Directional order"
      },
      {
        "id": "pattern-network",
        "type": "button",
        "label": "Transport network"
      },
      {
        "id": "damage-network",
        "type": "button",
        "label": "Toggle node-0 edge failure"
      }
    ],
    "evidence": {
      "Claim": "Structural analogy",
      "Assumptions": "Separate generic recurrence, global heading consensus, and ring-graph failure example.",
      "Limits": "No inference of shared physiology, incentives, consciousness, or biological optimization."
    },
    "method": {
      "kind": "Structural analogy",
      "assumptions": "Separate generic recurrence, global heading consensus, and ring-graph failure example.",
      "parameters": "Trace traffic fixed at 3 and 2; transport damage removes incident edges of node 0.",
      "limits": "No inference of shared physiology, incentives, consciousness, or biological optimization.",
      "formula": "T′ = .93T + .055F\nR = |Σ exp(iθᵢ)|/N\nefficiency = Σᵢ≠ⱼ 1/d(i,j) / [N(N−1)] (unreachable terms 0)",
      "sources": [
        "vicsek",
        "tero"
      ],
      "version": "2.0.0",
      "reviewStatus": "Implementation checked locally; independent specialist review pending."
    }
  },
  {
    "id": "whats-next",
    "number": "17",
    "title": "How Humanity Thrives",
    "subtitle": "Better for whom, and at what cost?",
    "body": [
      "Use a fixed budget to connect twelve nodes. Eleven messages must travel from node 0 to the others within three hops. Extra links cost resources and can create alternative routes.",
      "The chart compares nine sampled designs, not every possible network. Test a failure and inspect who loses service. A high delivered total can still conceal someone’s exclusion.",
      "Mathematics can expose costs and consequences. It does not choose whose needs deserve priority, or make a nondominated design fair."
    ],
    "insight": "What is being measured? What is missing? What would change your mind?",
    "vizHint": "Horizontal axis: link cost. Vertical axis: fraction delivered within three hops. Green: sampled nondominated designs; amber: your selection.",
    "controls": [
      {
        "id": "design-links",
        "type": "slider",
        "label": "Extra links",
        "min": 0,
        "max": 8,
        "step": 1,
        "value": 0
      },
      {
        "id": "failure-test",
        "type": "switch",
        "label": "Fail node 5",
        "value": false
      }
    ],
    "evidence": {
      "Claim": "Constrained graph comparison + normative reflection",
      "Assumptions": "Twelve-node ring, eight candidate chords, budget 20 links. Eleven requests from node 0; deadline three hops.",
      "Limits": "Frontier is among nine sampled designs for these two objectives. It does not establish fairness or the full Pareto frontier."
    },
    "method": {
      "kind": "Constrained graph comparison + normative reflection",
      "assumptions": "Twelve-node ring, eight candidate chords, budget 20 links. Eleven requests from node 0; deadline three hops.",
      "parameters": "Choose zero to eight extra links; optionally remove node 5 and incident edges.",
      "limits": "Frontier is among nine sampled designs for these two objectives. It does not establish fairness or the full Pareto frontier.",
      "formula": "cost = installed links; service = delivered requests / 11\nA dominates B if costA≤costB and serviceA≥serviceB, with at least one strict inequality",
      "sources": [
        "ostrom"
      ],
      "version": "2.0.0",
      "reviewStatus": "Implementation checked locally; independent specialist review pending."
    }
  }
];
