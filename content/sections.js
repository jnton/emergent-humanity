// ==========================================================================
// The Content Core — Formalized exploratory edition
// ==========================================================================

export const SECTIONS = [
  {
    id: 'node-capacity',
    number: '01',
    title: 'The Human Node',
    subtitle: 'The depth of a single point.',
    body: [
      'A human being is not a static data point. We are dynamic biological systems with changing internal states, memories, skills, goals, and incomplete views of reality.',
      'To study humanity at scale, this framework deliberately compresses that complexity into a node. The node is not the person. It is a coarse-grained representation of whatever properties matter for the question being asked.'
    ],
    insight: 'A node is a useful abstraction, not a complete description of a human.',
    vizHint: 'Watch a high-dimensional human representation collapse into a single model node.',
    controls: []
  },
  {
    id: 'node-limits',
    number: '02',
    title: 'Node Limits & Bottlenecks',
    subtitle: 'Finite biological hardware.',
    body: [
      'A single human has finite attention, memory, time, energy, and information-processing capacity. Education, health, nutrition, practice, tools, and environment can change usable capacity enormously.',
      'But for a fixed organism and current biological technology, removing environmental constraints does not make capacity infinite. Inherited biology still constrains the attainable range, differently across traits and environments.',
      'This is not one universal maximum potential. It is a multidimensional performance envelope.'
    ],
    insight: 'Environment can move the boundary dramatically; biology still bounds the system.',
    vizHint: 'The circle is a toy capacity variable: optimization approaches a finite biological envelope.',
    controls: [
      { id: 'optimize-nodes', type: 'button', label: 'Optimize Environment' },
      { id: 'reset-limits', type: 'button', label: 'Reset', variant: 'outline' }
    ]
  },
  {
    id: 'intro',
    number: '03',
    title: 'The Great Organism',
    subtitle: 'Emergence from interaction.',
    body: [
      'When nodes connect, new properties appear at the network level: specialization, coordination, shared memory, institutions, markets, science, and culture.',
      'I use the organism as a modeling analogy. Humanity is not established here as a literal biological superorganism. The useful claim is narrower: a connected human network can display emergent properties that do not belong to any isolated individual.'
    ],
    insight: 'The network can do things no single node can do alone.',
    vizHint: 'The network is the object of study; “organism” is the guiding analogy.',
    controls: []
  },
  {
    id: 'emergent-organism',
    number: '04',
    title: 'One Node Goes Dark',
    subtitle: 'Loss depends on structure.',
    body: [
      'Start with the simplest model: equal-weight nodes in a redundant network. Losing one ordinary node usually produces a small global structural change, even when the local human cost is enormous.',
      'Real networks do not stay equal. Some nodes become hubs, bridges, specialists, or unique repositories of knowledge. Their removal can matter far more because structural and functional importance are unevenly distributed.',
      'So the effect of losing a node depends on topology, redundancy, and function—not merely on population size.'
    ],
    insight: 'Most nodes may be structurally replaceable; some become disproportionately important.',
    vizHint: 'Reveal structural weight, then compare removing an ordinary node with removing a hub.',
    controls: [
      { id: 'show-centrality', type: 'switch', label: 'Show Structural Weight', value: false },
      { id: 'remove-node', type: 'button', label: 'Remove Ordinary Node' },
      { id: 'remove-hub', type: 'button', label: 'Remove Hub' },
      { id: 'reset-network', type: 'button', label: 'Reset', variant: 'outline' }
    ]
  },
  {
    id: 'illusion-of-significance',
    number: '05',
    title: 'The Illusion of Significance',
    subtitle: 'Sensitivity is conditional.',
    body: [
      'A small change can alter a system\'s future, but not every complex or emergent system is chaotic. In stable regimes, perturbations can decay. In sensitive regimes, nearby trajectories can diverge rapidly.',
      'The important philosophical distinction is simpler: causing a different future does not, by itself, establish special meaning or importance. A causal perturbation can be large, small, amplified, or absorbed.'
    ],
    insight: 'Causal influence and significance are different questions.',
    vizHint: 'Apply the same tiny perturbation in a stable regime and a sensitive regime.',
    controls: [
      { id: 'stable-regime', type: 'button', label: 'Stable Regime', variant: 'outline' },
      { id: 'sensitive-regime', type: 'button', label: 'Sensitive Regime' },
      { id: 'shift-node', type: 'button', label: 'Perturb One Node' }
    ]
  },
  {
    id: 'node-quantity',
    number: '06',
    title: 'Node Quantity',
    subtitle: 'More capacity, more coordination.',
    body: [
      'More nodes can provide more parallel search, specialization, observations, and cultural accumulation. That increases the system\'s potential capacity.',
      'But additional nodes also create coordination and communication costs. Whether the network improves depends on node capabilities, topology, task structure, communication quality, and how well work can be decomposed.'
    ],
    insight: 'More nodes create potential; coordination determines how much of it becomes usable.',
    vizHint: 'Scale the population. Node count rises together with the structure that must coordinate it.',
    controls: [
      { id: 'population-slider', type: 'slider', label: 'Population Scale', min: '0.1', max: '1', step: '0.1', value: '0.3' }
    ]
  },
  {
    id: 'connection-quantity',
    number: '07',
    title: 'Connection Quantity',
    subtitle: 'Reducing distance across the graph.',
    body: [
      'For most of history, geography and communication cost constrained who could exchange information. Writing, printing, telecommunications, and the Internet progressively reduced those constraints.',
      'The result is not a complete graph where everyone meaningfully talks to everyone. It is a network with much greater potential reachability and many shorter paths—still limited by attention, language, institutions, access, and trust.'
    ],
    insight: 'Connectivity expands possible coordination, but attention remains scarce.',
    vizHint: 'Add long-range links and watch formerly local clusters become globally reachable.',
    controls: [
      { id: 'deploy-internet', type: 'button', label: 'Add Long-Range Links' },
      { id: 'reset-connections', type: 'button', label: 'Reset', variant: 'outline' }
    ]
  },
  {
    id: 'connection-quality',
    number: '08',
    title: 'Connection Quality',
    subtitle: 'Useful information is more than bandwidth.',
    body: [
      'A connection can fail in different ways: transmission error, low trust, low relevance, deception, poor interpretation, or incentives that reward attention rather than accuracy.',
      'These are not the same thing. Engagement is not noise in the Shannon sense, and misinformation is not random channel noise.',
      'For the organism to learn, useful information must reach the right nodes with enough fidelity, context, and credibility to be acted on.'
    ],
    insight: 'More communication is not the same as better information flow.',
    vizHint: 'This toy model isolates one dimension of quality: edge transmission reliability.',
    controls: [
      { id: 'fidelity-slider', type: 'slider', label: 'Edge Reliability', min: '0', max: '1', step: '0.1', value: '0.8' }
    ]
  },
  {
    id: 'cohesion',
    number: '09',
    title: 'Cohesion & Polarization',
    subtitle: 'Beliefs and topology interact.',
    body: [
      'Polarization has at least two layers: what nodes believe and who interacts with whom. They can reinforce each other through homophily and selective exposure, but they are not identical.',
      'Dense local clusters can become weakly connected across disagreement. Bridging ties can restore exchange, but simply exposing opposing groups to one another does not guarantee convergence; the effect depends on the interaction rule, trust, and incentives.'
    ],
    insight: 'A bridge creates an opportunity for exchange, not an automatic cure.',
    vizHint: 'A bounded-confidence toy model forms opinion clusters as interaction tolerance falls.',
    controls: [
      { id: 'polarize-slider', type: 'slider', label: 'Interaction Selectivity', min: '0', max: '1', step: '0.1', value: '0.6' },
      { id: 'deploy-bridges', type: 'button', label: 'Add Cross-Group Bridges' }
    ]
  },
  {
    id: 'alignment',
    number: '10',
    title: 'Alignment & Shared Goals',
    subtitle: 'Coordination without uniformity.',
    body: [
      'If nodes pursue incompatible directions, some effort can cancel or interfere. But opposite preferences produce exactly zero net movement only under exact cancellation.',
      'Alignment is better treated as a degree of directional coherence, not an all-or-nothing state. High coordination can increase effectiveness toward a goal, while diversity can improve exploration, specialization, and error correction.',
      'And alignment says nothing about whether the goal itself is good.'
    ],
    insight: 'Coordination and objective quality are separate variables.',
    vizHint: 'The displayed order parameter measures directional coherence from 0 to 1.',
    controls: [
      { id: 'align-goals', type: 'button', label: 'Increase Coupling' },
      { id: 'scramble-goals', type: 'button', label: 'Scramble', variant: 'outline' }
    ]
  },
  {
    id: 'environment',
    number: '11',
    title: 'Environmental Interaction',
    subtitle: 'Information enters through contact with reality.',
    body: [
      'Humans and instruments sample the environment. Observations, measurements, experiments, and feedback provide inputs that can update internal models.',
      'But not all knowledge begins as a fresh local observation. New knowledge can also arise through inference, recombination, computation, simulation, and collective measurement.'
    ],
    insight: 'Intelligence depends on both sensing reality and transforming what is already known.',
    vizHint: 'Release observations into the environment and watch local nodes acquire them.',
    controls: [
      { id: 'release-info', type: 'button', label: 'Release Information' }
    ]
  },
  {
    id: 'collective-memory',
    number: '12',
    title: 'Collective Memory',
    subtitle: 'Information survives by replication.',
    body: [
      'A node is mortal. Information can persist when it is copied into other people, practices, institutions, or artifacts.',
      'Persistence is therefore a population process: copies spread, mutate, disappear, and sometimes become redundant enough to survive the loss of the originator.',
      'The network does not magically rescue an idea. If every surviving copy disappears, the information is lost.'
    ],
    insight: 'Collective memory is redundancy across carriers.',
    vizHint: 'Spawn one idea, let it replicate, then kill carriers—including its originator.',
    controls: [
      { id: 'spawn-idea', type: 'button', label: 'Spawn Idea' }
    ]
  },
  {
    id: 'external-storage',
    number: '13',
    title: 'External Memory & The Cloud',
    subtitle: 'Storage escapes the biological lifetime.',
    body: [
      'Writing, printing, photography, recording, databases, and networked storage changed the persistence, fidelity, capacity, and searchability of human memory.',
      'None of these media is permanent or perfectly objective. Instruments sample reality through limited sensors and encodings; physical and digital records can decay, disappear, become unreadable, or be altered.',
      'The Internet is also not one central cloud. It is distributed infrastructure that makes replication and retrieval dramatically easier.'
    ],
    insight: 'External storage makes knowledge more persistent—not immortal.',
    vizHint: 'Move through storage epochs and watch information gain non-biological carriers.',
    controls: [
      { id: 'invent', type: 'button', label: 'Invent Writing & Monuments' }
    ]
  },
  {
    id: 'entropy',
    number: '14',
    title: 'Noise, Fidelity & Error Correction',
    subtitle: 'Transmission can fail—and can be repaired.',
    body: [
      'Noisy communication can corrupt information, but degradation is not an unavoidable increase of entropy at every hop. Shannon entropy, semantic drift, and thermodynamic entropy are different concepts.',
      'A channel has an error process. Redundancy and error-correcting codes can make communication highly reliable when the transmission rate stays within the channel\'s capacity.',
      'Human retelling adds another layer: interpretation can change meaning even when the physical signal is transmitted perfectly.'
    ],
    insight: 'Information loss is a channel-and-decoding problem, not a universal march toward chaos.',
    vizHint: 'Send a bit string through noisy hops; enable five-copy majority decoding to correct errors.',
    controls: [
      { id: 'channel-noise', type: 'slider', label: 'Per-Hop Bit Flip', min: '0', max: '0.15', step: '0.01', value: '0.04' },
      { id: 'toggle-redundancy', type: 'switch', label: '5× Repetition Code' },
      { id: 'send-message', type: 'button', label: 'Send Message' }
    ]
  },
  {
    id: 'productivity',
    number: '15',
    title: 'Productivity & Shared Knowledge',
    subtitle: 'From distributed capacity to collective intelligence.',
    body: [
      'A network can combine specialization, memory, parallel search, and coordination to solve problems beyond any single person\'s capacity.',
      'But performance is not a monotonic function of population or edge count. Bottlenecks, coordination costs, misinformation, duplicated work, incentives, and resource constraints can erase the benefit of scale.',
      'Shared knowledge can support collective intelligence. That does not establish a single collective consciousness.'
    ],
    insight: 'Collective intelligence emerges when distributed capacity is organized well enough to become usable.',
    vizHint: 'The metrics are transparent proxies for capacity, reachability, and coordination load—not empirical productivity.',
    controls: [
      { id: 'optimize-all', type: 'button', label: 'Build Scalable Network' },
      { id: 'reset-productivity', type: 'button', label: 'Reset', variant: 'outline' }
    ]
  },
  {
    id: 'comparative-emergence',
    number: '16',
    title: 'Same Pattern, Different Substrate',
    subtitle: 'Emergence can rhyme without being identical.',
    body: [
      'Very different systems can share the same abstract dynamical motif. Ant trails, flocks, adaptive slime-mold networks, and human networks can all be described with recurring ideas such as feedback, order parameters, distributed traces, and cost-efficiency trade-offs.',
      'That does not make the systems equivalent. Reusing an equation or observable means that one structural relationship is shared; the underlying biology, cognition, scale, and causal mechanism may still be radically different.',
      'The useful question is therefore not “is humanity literally an ant colony?” but “which mathematical patterns transfer across substrates, and exactly where does the analogy break?”'
    ],
    insight: 'Shared mathematics can reveal a recurring structure without erasing the differences between systems.',
    vizHint: 'Switch motifs. The biological and human substrates change while the same mathematical object remains on screen.',
    controls: [
      { id: 'pattern-trace', type: 'button', label: 'Reinforcing Traces' },
      { id: 'pattern-alignment', type: 'button', label: 'Directional Order', variant: 'outline' },
      { id: 'pattern-network', type: 'button', label: 'Adaptive Networks', variant: 'outline' }
    ]
  },
  {
    id: 'whats-next',
    number: '17',
    title: 'What\'s Next?',
    subtitle: 'An open model.',
    body: [
      'This project is a living framework. The goal is not to make the metaphor win; it is to make every claim progressively clearer, more testable, and easier to falsify.',
      'The next step is to connect heterogeneous nodes, network structure, information fidelity, memory, coordination, and performance.',
      'A separate technical note defines the toy models and their limits so the visual story can stay simple without hiding the mathematics.'
    ],
    insight: 'Keep the interface intuitive and the assumptions auditable.',
    vizHint: 'The network stays open: reshape it and treat every representation as provisional.',
    controls: []
  }
];
