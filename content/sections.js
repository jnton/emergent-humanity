// ==========================================================================
 // The Content Core — concise reader-facing edition
// ==========================================================================

export const SECTIONS = [
  {
    id: 'node-capacity',
    number: '01',
    title: 'The Human Node',
    subtitle: 'One person, simplified for the model.',
    body: [
      'Each person is a complex biological system with changing memories, skills, goals, and internal states.',
      'In the model, that complexity is compressed into a node. The node is useful because it lets us study the network, but it is never the whole person.'
    ],
    insight: 'A node is not a person. It is a way to study what happens between people.',
    vizHint: 'Watch a complex human representation collapse into a single model node.',
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
    subtitle: 'Connection creates new capabilities.',
    body: [
      'A single person cannot build a civilization. Networks of people can divide work, store knowledge, coordinate, create institutions, and accumulate science and culture across generations.',
      'I use the organism as an analogy, not a biological claim. The point is simpler: the network can do things no individual can do alone.'
    ],
    insight: 'Civilization is not inside any one person. It emerges from the network.',
    vizHint: 'The network is the object of study. “Organism” is the analogy.',
    controls: []
  },
  {
    id: 'emergent-organism',
    number: '04',
    title: 'Losing a Node',
    subtitle: 'Impact depends on what the node does.',
    body: [
      'In a redundant network, removing one ordinary node may barely change the global structure. Remove a hub, bridge, specialist, or unique source of knowledge and the effect can be much larger.',
      'Importance is not just about how many nodes remain. It depends on connections, redundancy, and function.'
    ],
    insight: 'A node’s effect on the system depends on where it sits and what it carries.',
    vizHint: 'Compare removing an ordinary node with removing a hub.',
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
    title: 'Small Changes, Different Futures',
    subtitle: 'Emergence is not automatically chaos.',
    body: [
      'A tiny change can disappear, stay local, or spread through the system. In some regimes nearby trajectories converge; in others they separate rapidly.',
      'Causing a different future does not automatically make an event important. The system determines whether a perturbation is absorbed or amplified.'
    ],
    insight: 'Small causes can matter. They do not always matter.',
    vizHint: 'Apply the same tiny perturbation in a stable and a sensitive regime.',
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
      'Writing, printing, telecommunications, and the Internet made it much easier for information to cross distance. They did not connect everyone to everyone, but they made far more people reachable through far fewer steps.',
      'The remaining limits are attention, trust, language, access, and institutions.'
    ],
    insight: 'Connection removes distance. It does not remove bottlenecks.',
    vizHint: 'Add long-range links and watch distant clusters become easier to reach.',
    controls: [
      { id: 'deploy-internet', type: 'button', label: 'Add Long-Range Links' },
      { id: 'reset-connections', type: 'button', label: 'Reset', variant: 'outline' }
    ]
  },
  {
    id: 'connection-quality',
    number: '08',
    title: 'Better Connections',
    subtitle: 'More communication is not better information.',
    body: [
      'A message can fail because it is corrupted, irrelevant, misleading, misunderstood, untrusted, or pushed by bad incentives. These are different problems and should not be collapsed into one idea of noise.',
      'Useful information has to reach the right person with enough fidelity and context to change action.'
    ],
    insight: 'Information flow matters only when the receiver gets something useful.',
    vizHint: 'This toy model isolates one part of quality: transmission reliability.',
    controls: [
      { id: 'fidelity-slider', type: 'slider', label: 'Edge Reliability', min: '0', max: '1', step: '0.1', value: '0.8' }
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
    vizHint: 'Watch directional coherence rise or fall between 0 and 1.',
    controls: [
      { id: 'align-goals', type: 'button', label: 'Increase Coupling' },
      { id: 'scramble-goals', type: 'button', label: 'Scramble', variant: 'outline' }
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
    vizHint: 'Release observations and watch nearby nodes acquire them.',
    controls: [
      { id: 'release-info', type: 'button', label: 'Release Information' }
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
      { id: 'invent', type: 'button', label: 'Invent Writing & Monuments' }
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
    title: 'What\'s Next?',
    subtitle: 'Make the model harder to fool.',
    body: [
      'This project is not meant to defend one metaphor. It is meant to turn an intuition into something clearer, testable, and easier to challenge.',
      'The next step is to connect nodes, links, memory, information quality, coordination, and performance without pretending the toy models are reality.'
    ],
    insight: 'A useful model should become easier to test as it becomes more ambitious.',
    vizHint: 'Keep reshaping the network. Every representation is provisional.',
    controls: []
  }
];
