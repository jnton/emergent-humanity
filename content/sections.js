// ==========================================================================
 // The Content Core — concise reader-facing edition
// ==========================================================================

export const SECTIONS = [
  {
    id: 'node-capacity',
    number: '01',
    title: 'The Human Node',
    subtitle: 'A stylized approximation of one person.',
    body: [
      'Each person is a complex biological system with changing memories, skills, goals, and internal states.',
      'In this model, a node is a stylized approximation of a person. It keeps only the properties relevant to the question and deliberately discards the rest.'
    ],
    insight: 'A useful model is incomplete by design.',
    vizHint: 'Watch a high-dimensional person become a lower-dimensional model state—and see what gets discarded.',
    controls: []
  },
  {
    id: 'node-limits',
    number: '02',
    title: 'Node Limits',
    subtitle: 'No person has unlimited capacity.',
    body: [
      'Attention, memory, time, energy, and information processing are finite. Health, education, practice, tools, and environment can push performance much higher, but they do not make a fixed human unlimited.',
      'There is no single maximum potential. Different traits have different limits, and those limits depend partly on environment.'
    ],
    insight: 'Environment can move the limit. It does not remove it.',
    vizHint: 'Improve the environment and watch performance approach a finite limit.',
    controls: [
      { id: 'optimize-nodes', type: 'button', label: 'Optimize Environment' },
      { id: 'reset-limits', type: 'button', label: 'Reset', variant: 'outline' }
    ]
  },
  {
    id: 'intro',
    number: '03',
    title: 'The Great Organism',
    subtitle: 'The whole can acquire capabilities no part has alone.',
    body: [
      'A single person cannot build a civilization. Communities can divide work, preserve knowledge, coordinate, create institutions, and accumulate science and culture across generations.',
      'Humanity is not literally one biological organism. The useful comparison is structural: many limited units can interact to produce capabilities that exist only at the collective level.'
    ],
    insight: 'Civilization is not inside any one person. It emerges from interaction.',
    vizHint: 'Watch isolated people connect, differentiate, share information, and acquire collective capabilities.',
    controls: []
  },
  {
    id: 'emergent-organism',
    number: '04',
    title: 'Losing a Node',
    subtitle: 'Most nodes barely affect the whole. Some become critical.',
    body: [
      'In a large, redundant network, removing most individual nodes has almost no effect on global structure or performance. In that narrow systems sense, most of us are probably not special to humanity as a whole.',
      'But importance is not fixed. A node can become a hub, a bridge, a specialist, or the unique carrier of useful information. What matters is marginal effect on a chosen system function—not human worth.'
    ],
    insight: 'Most nodes are replaceable to the system. Structural importance can change.',
    vizHint: 'Remove ordinary nodes, then let one develop a critical role and compare its marginal effect.',
    controls: [
      { id: 'show-centrality', type: 'switch', label: 'Show Structural Weight', value: false },
      { id: 'remove-node', type: 'button', label: 'Remove Ordinary Node' },
      { id: 'develop-node', type: 'button', label: 'Develop a Critical Role' },
      { id: 'remove-hub', type: 'button', label: 'Remove Critical Node' },
      { id: 'reset-network', type: 'button', label: 'Reset', variant: 'outline' }
    ]
  },
  {
    id: 'illusion-of-significance',
    number: '05',
    title: 'Small Causes, Large Futures',
    subtitle: 'The system decides whether a tiny difference dies or explodes.',
    body: [
      'In a chaotic regime, two nearly identical states can separate exponentially. A common diagnostic is the largest Lyapunov exponent: positive values indicate local exponential instability.',
      'In a stable regime, the same perturbation can shrink. The lesson is not that every tiny event changes history. It is that the size of a cause and the size of its eventual effect can be radically different.'
    ],
    insight: 'A tiny perturbation can become macroscopic when the dynamics amplify it.',
    vizHint: 'Apply the same ε perturbation in contracting and sensitive regimes; watch divergence and the finite-time Lyapunov estimate.',
    controls: [
      { id: 'stable-regime', type: 'button', label: 'Stable Regime', variant: 'outline' },
      { id: 'sensitive-regime', type: 'button', label: 'Sensitive Regime' },
      { id: 'shift-node', type: 'button', label: 'Perturb One Node' }
    ]
  },
  {
    id: 'node-quantity',
    number: '06',
    title: 'More Nodes',
    subtitle: 'Scale adds capacity and coordination costs.',
    body: [
      'More people can mean more ideas, specialization, observations, and parallel work. It also means more communication, duplication, conflict, and coordination.',
      'Scale helps only when the network can turn extra people into usable collective capacity.'
    ],
    insight: 'More nodes create potential. Organization determines how much becomes usable.',
    vizHint: 'Increase the population and watch capacity and coordination load grow together.',
    controls: [
      { id: 'population-slider', type: 'slider', label: 'Population Scale', min: '0.1', max: '1', step: '0.1', value: '0.3' }
    ]
  },
  {
    id: 'connection-quantity',
    number: '07',
    title: 'More Connections',
    subtitle: 'Shorter paths change what the network can do.',
    body: [
      'Adding links can reduce shortest-path distance and make more of a network reachable. Writing, printing, telecommunications, and the Internet did this at enormous scale.',
      'But possible connections can grow faster than a node’s finite communication and processing capacity. More connectivity changes the bottleneck; it does not abolish bottlenecks.'
    ],
    insight: 'Reachability can grow faster than usable attention or bandwidth.',
    vizHint: 'Add long-range links: path length falls while finite per-node processing budgets begin to saturate.',
    controls: [
      { id: 'deploy-internet', type: 'button', label: 'Add Long-Range Links' },
      { id: 'reset-connections', type: 'button', label: 'Reset', variant: 'outline' }
    ]
  },
  {
    id: 'connection-quality',
    number: '08',
    title: 'Better Connections',
    subtitle: 'A perfect channel can still deliver bad information.',
    body: [
      'Information can fail at different layers: the signal can be corrupted, the source can be wrong, the message can be misinterpreted, or trust can be badly calibrated. These are different mechanisms.',
      'Incentives are different again. They do not necessarily damage a connection; they change what gets produced, selected, repeated, and amplified. None of these should be collapsed into one idea of “noise.”'
    ],
    insight: 'Good information flow depends on the channel, the source, the receiver, and the selection process.',
    vizHint: 'Change each layer separately and watch accurate, false, rejected, and amplified messages propagate differently.',
    controls: [
      { id: 'fidelity-slider', type: 'slider', label: 'Channel Fidelity', min: '0', max: '1', step: '0.05', value: '0.9' },
      { id: 'source-accuracy', type: 'slider', label: 'Source Accuracy', min: '0', max: '1', step: '0.05', value: '0.8' },
      { id: 'interpretation-fidelity', type: 'slider', label: 'Interpretation Fidelity', min: '0', max: '1', step: '0.05', value: '0.85' },
      { id: 'trust-calibration', type: 'slider', label: 'Trust Calibration', min: '0', max: '1', step: '0.05', value: '0.75' },
      { id: 'selection-pressure', type: 'slider', label: 'Amplification Bias', min: '0', max: '1', step: '0.05', value: '0.25' }
    ]
  },
  {
    id: 'cohesion',
    number: '09',
    title: 'Polarization',
    subtitle: 'Beliefs and connections can pull apart together.',
    body: [
      'People tend to interact with people they already understand or trust. That can create clusters where opinions and network structure reinforce each other.',
      'Bridges between groups can reopen exchange, but contact alone does not guarantee convergence. Trust, incentives, and the rules of interaction still matter.'
    ],
    insight: 'A bridge creates contact. What happens next depends on the interaction.',
    vizHint: 'Change interaction selectivity and watch opinion clusters form or reconnect.',
    controls: [
      { id: 'polarize-slider', type: 'slider', label: 'Interaction Selectivity', min: '0', max: '1', step: '0.1', value: '0.6' },
      { id: 'deploy-bridges', type: 'button', label: 'Add Cross-Group Bridges' }
    ]
  },
  {
    id: 'alignment',
    number: '10',
    title: 'Alignment',
    subtitle: 'Moving together is different from moving well.',
    body: [
      'When people push in incompatible directions, some effort cancels or interferes. Greater alignment can make a group more effective at pursuing a goal.',
      'But alignment is not automatically good. Diversity can improve exploration and error correction, and a perfectly coordinated group can still pursue a bad objective.'
    ],
    insight: 'Coordination increases coherence, not correctness.',
    vizHint: 'Watch coherence, directional coverage, and agreement with an external target separately. High R can still point the wrong way.',
    controls: [
      { id: 'align-goals', type: 'button', label: 'Increase Coupling' },
      { id: 'scramble-goals', type: 'button', label: 'Restore Diversity', variant: 'outline' }
    ]
  },
  {
    id: 'environment',
    number: '11',
    title: 'Learning from Reality',
    subtitle: 'The network needs input from the world.',
    body: [
      'Observation, measurement, experiments, and feedback give the network new information.',
      'Knowledge also grows by transforming what is already known through inference, recombination, computation, and simulation.'
    ],
    insight: 'Learning needs both evidence and inference.',
    vizHint: 'Release observations from outside the network, then combine stored observations to create an inferred proposition.',
    controls: [
      { id: 'release-info', type: 'button', label: 'Release Observations' },
      { id: 'infer-knowledge', type: 'button', label: 'Run Inference', variant: 'outline' }
    ]
  },
  {
    id: 'collective-memory',
    number: '12',
    title: 'Collective Memory',
    subtitle: 'Ideas survive only if they have somewhere to go.',
    body: [
      'People die and memories fade. Information persists when it is copied into other people, practices, institutions, or artifacts.',
      'Copies can spread, change, disappear, or become redundant enough to survive the loss of the original carrier.'
    ],
    insight: 'Memory becomes collective when information outlives the person who first held it.',
    vizHint: 'Create one idea, let it spread, then remove its carriers.',
    controls: [
      { id: 'spawn-idea', type: 'button', label: 'Spawn Idea' }
    ]
  },
  {
    id: 'external-storage',
    number: '13',
    title: 'External Memory',
    subtitle: 'Writing changed what humanity could remember.',
    body: [
      'Writing, printing, photography, databases, and networked storage moved memory outside the brain. That increased capacity, fidelity, searchability, and the chance that knowledge survives a human lifetime.',
      'External memory is still fragile. Records can decay, disappear, become unreadable, or be altered.'
    ],
    insight: 'External storage lets knowledge survive us, but not forever.',
    vizHint: 'Move through storage technologies and watch information gain new carriers.',
    controls: [
      { id: 'invent', type: 'button', label: 'Invent Writing & Monuments' },
      { id: 'stress-storage', type: 'button', label: 'Damage a Record', variant: 'outline' }
    ]
  },
  {
    id: 'entropy',
    number: '14',
    title: 'Noise and Error Correction',
    subtitle: 'Information can be damaged—and repaired.',
    body: [
      'Communication channels make errors. Repetition and coding can reduce those errors dramatically; corruption is not an unavoidable march toward disorder.',
      'Human communication adds another problem: a message can arrive perfectly and still be misunderstood. Physical fidelity and meaning are different layers.'
    ],
    insight: 'Reliable communication depends on both the channel and the interpretation.',
    vizHint: 'Send a bit string through noisy links, then use redundancy to recover it.',
    controls: [
      { id: 'channel-noise', type: 'slider', label: 'Per-Hop Bit Flip', min: '0', max: '0.15', step: '0.01', value: '0.04' },
      { id: 'toggle-redundancy', type: 'switch', label: '5× Repetition Code' },
      { id: 'send-message', type: 'button', label: 'Send Message' }
    ]
  },
  {
    id: 'productivity',
    number: '15',
    title: 'Collective Intelligence',
    subtitle: 'The network can solve problems no individual can.',
    body: [
      'Specialization, shared memory, parallel search, and coordination let groups solve problems beyond the capacity of one person. But scale alone is not enough.',
      'Bottlenecks, duplicated work, bad incentives, misinformation, and coordination costs can waste that capacity. Collective intelligence appears when the network turns distributed ability into useful work.'
    ],
    insight: 'Collective capacity matters only when the network can use it.',
    vizHint: 'Compare capacity, reachability, and coordination load.',
    controls: [
      { id: 'optimize-all', type: 'button', label: 'Build Scalable Network' },
      { id: 'reset-productivity', type: 'button', label: 'Reset', variant: 'outline' }
    ]
  },
  {
    id: 'comparative-emergence',
    number: '16',
    title: 'Different Systems, Same Pattern',
    subtitle: 'Different systems can follow the same rule.',
    body: [
      'Ant colonies, flocks, slime molds, and human networks are very different. Yet some of their large-scale behavior can be described with the same kinds of feedback, alignment, memory, and network trade-offs.',
      'That does not make the systems equivalent. It means the same mathematical pattern can appear in very different physical systems.',
      'The useful question is simple: where does the comparison work, and where does it stop?'
    ],
    insight: 'Same pattern does not mean same mechanism.',
    vizHint: 'Switch examples. The system changes; the mathematical pattern stays.',
    controls: [
      { id: 'pattern-trace', type: 'button', label: 'Reinforcing Traces' },
      { id: 'pattern-alignment', type: 'button', label: 'Directional Order', variant: 'outline' },
      { id: 'pattern-network', type: 'button', label: 'Adaptive Networks', variant: 'outline' }
    ]
  },
  {
    id: 'whats-next',
    number: '17',
    title: 'What Helps Humanity Thrive?',
    subtitle: 'There is no single variable to maximize.',
    body: [
      'If the goals include learning, coordination, resilience, adaptation, and preserving useful knowledge, several properties matter at once: human capability, connectivity, information quality, memory, redundancy, diversity, alignment, and feedback from reality.',
      'These objectives can conflict. More alignment can reduce exploration. More redundancy costs resources. More connectivity can increase coordination load. Strong memory can preserve errors as well as knowledge. This is a multi-objective problem: improvement can move along a Pareto frontier rather than toward one universal optimum.',
      'Mathematics can expose the trade-offs. It cannot decide what humanity should value. The practical task is to build systems that learn, coordinate, remember, adapt, correct errors, and recover—without silently sacrificing the properties that make those abilities possible.'
    ],
    insight: 'Improve humanity by improving the system—but measure what every improvement costs elsewhere.',
    vizHint: 'Move the system variables. The dashboard reports several objectives separately; no hidden “humanity score” decides for you.',
    controls: [
      { id: 'thrive-capability', type: 'slider', label: 'Node Capability', min: '0', max: '1', step: '0.05', value: '0.65' },
      { id: 'thrive-connectivity', type: 'slider', label: 'Connectivity', min: '0', max: '1', step: '0.05', value: '0.55' },
      { id: 'thrive-fidelity', type: 'slider', label: 'Information Fidelity', min: '0', max: '1', step: '0.05', value: '0.7' },
      { id: 'thrive-memory', type: 'slider', label: 'Memory', min: '0', max: '1', step: '0.05', value: '0.6' },
      { id: 'thrive-redundancy', type: 'slider', label: 'Redundancy', min: '0', max: '1', step: '0.05', value: '0.5' },
      { id: 'thrive-alignment', type: 'slider', label: 'Alignment', min: '0', max: '1', step: '0.05', value: '0.55' },
      { id: 'thrive-diversity', type: 'slider', label: 'Diversity', min: '0', max: '1', step: '0.05', value: '0.6' },
      { id: 'thrive-feedback', type: 'slider', label: 'Reality Feedback', min: '0', max: '1', step: '0.05', value: '0.7' }
    ]
  }
];
