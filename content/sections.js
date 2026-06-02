// ==========================================================================
// The Content Core — v2 Expert Edition
// Every piece of text, math, and insight lives here.
// ==========================================================================

export const SECTIONS = [
  {
    id: 'the-network',
    number: '01',
    title: 'The Organism',
    subtitle: 'You are not an individual. You are a node.',
    body: [
      'We often visualize humanity as a vast crowd — billions of individuals with free will. But this is an illusion. You are a biological computational unit. A cell. In isolation, a single human node is nothing. You are merely a component of an emergent organism.',
      'Every conversation or transaction is simply a data transfer along an edge. These edges weave into a scale-free network. If you — a single node — disappear, the organism barely ripples. But because of how the edges are structured, a specific signal in the right place can rewrite the entire system.',
      'This is the definition of emergence: the organism has properties that its individual cells do not possess. You cannot find "culture," "economy," or "science" inside your own brain. They exist only in the connections. The organism is the only thing that matters.'
    ],
    math: 'G = (V, E)\nWhere V is the set of processing units (humans) and E is the set of data channels (edges). The organism exhibits emergence when macroscopic behaviors P(G) cannot be linearly derived from microscopic states P(v).',
    insight: 'You are a cell being taught how to understand the body it lives inside.',
    vizHint: 'Drag any node to pull the network.',
    keyTerms: ['Graph Theory', 'Emergence', 'Scale-Free Network', 'Topology'],
    references: [
      { author: 'Anderson, P. W.', year: '1972', title: 'More Is Different', field: 'Complex Systems' },
      { author: 'Barabási, A.-L.', year: '1999', title: 'Emergence of Scaling in Random Networks', field: 'Network Science' }
    ]
  },
  {
    id: 'node-removal',
    number: '02',
    title: 'Cellular Death',
    subtitle: 'Failure, pruning, and structural resilience.',
    body: [
      'What happens when a node fails? In a random network, random failures are devastating. But the organism is not random; it follows a power law. Most nodes have very few data channels, while a tiny fraction (hubs) process massive throughput.',
      'This topology makes the organism incredibly robust to random cellular death. The damage radius is small, and the network heals by routing signals around the dead node.',
      'But this resilience has a mathematical shadow: extreme vulnerability to targeted attacks. If the hubs — the super-connectors — are removed, the organism\'s nervous system fragments into isolated islands.'
    ],
    math: 'P(k) \\sim k^{-\\gamma}\nThe probability P(k) that a node has k connections follows a power law. For robust biological networks, 2 < γ < 3. This guarantees a highly skewed distribution where hubs dominate.',
    insight: 'The same structure that makes the organism resilient to random decay makes it fragile to targeted disruption.',
    vizHint: 'Click a node to terminate it. Watch the damage radius fade as the organism heals.',
    controls: [
      { id: 'remove-random', type: 'button', label: 'Terminate Random Node' },
      { id: 'remove-hub', type: 'button', label: 'Terminate Hub Node', variant: 'danger' },
      { id: 'reset-network', type: 'button', label: 'Regenerate Network', variant: 'outline' }
    ],
    keyTerms: ['Power Law', 'Targeted Attack', 'Robustness', 'Preferential Attachment'],
    references: [
      { author: 'Albert, R., Jeong, H., & Barabási, A.-L.', year: '2000', title: 'Error and attack tolerance of complex networks', field: 'Network Science' }
    ]
  },
  {
    id: 'weak-ties',
    number: '03',
    title: 'Signal Bridges',
    subtitle: 'Why redundancy is the enemy of new information.',
    body: [
      'Nodes naturally form tight, redundant clusters — what we translate into human language as "close friends" or "family." These strong edges provide high-bandwidth, trusted data transfer.',
      'But dense clusters are echo chambers of data. If one node in the cluster possesses a packet of information, the entire cluster already possesses it. Redundancy is high, but novelty is zero.',
      'To inject *new* code into the organism, signals must travel across "weak ties" — long-range edges connecting entirely different functional clusters. The mathematics of networks prove that the edges with the lowest bandwidth are structurally the most critical for global information diffusion.'
    ],
    math: 'C_i = \\frac{2e_i}{k_i(k_i - 1)}\nThe clustering coefficient C_i measures how close a node\'s neighbors are to being a clique. High clustering means high redundancy. Low clustering indicates a bridge.',
    insight: 'Innovation doesn\'t happen inside dense cell clusters; it happens across the synaptic bridges between them.',
    vizHint: 'Hover to see how weak ties bridge the dense functional clusters.',
    controls: [
      { id: 'toggle-weak', type: 'button', label: 'Sever Weak Ties', variant: 'danger' },
      { id: 'toggle-strong', type: 'button', label: 'Sever Strong Ties', variant: 'outline' }
    ],
    keyTerms: ['Weak Ties', 'Clustering Coefficient', 'Information Diffusion', 'Redundancy'],
    references: [
      { author: 'Granovetter, M. S.', year: '1973', title: 'The Strength of Weak Ties', field: 'Sociology' }
    ]
  },
  {
    id: 'structural-holes',
    number: '04',
    title: 'Synaptic Gateways',
    subtitle: 'Control of the organism\'s data flow.',
    body: [
      'If weak ties describe the *type* of edge, structural holes describe the *position* of a node. Imagine two dense organs within the body that have no direct data channels between them.',
      'The gap between them is a structural hole. A single node bridging this gap becomes a broker. This node controls the flow of signals. It can synthesize data from both sides before any other part of the organism is aware of the change.',
      'Influence in the organism isn\'t about the number of edges a node possesses. It\'s about spanning structural holes. Nodes that act as synaptic gateways control the evolution of the network.'
    ],
    math: 'C_B(v) = \\sum_{s \\neq v \\neq t} \\frac{\\sigma_{st}(v)}{\\sigma_{st}}\nBetweenness centrality measures how often a node acts as a bridge along the shortest path between two other nodes. Brokers maximize this metric.',
    insight: 'A node does not need the most connections to control the organism. It just needs the optimal position.',
    vizHint: 'The golden node is the broker. Notice how all data between clusters must pass through its processor.',
    controls: [
      { id: 'remove-broker', type: 'button', label: 'Terminate Broker', variant: 'danger' },
      { id: 'rewire-random', type: 'button', label: 'Bypass the Hole', variant: 'outline' }
    ],
    keyTerms: ['Brokerage', 'Structural Hole', 'Betweenness Centrality', 'Data Flow'],
    references: [
      { author: 'Burt, R. S.', year: '1992', title: 'Structural Holes: The Social Structure of Competition', field: 'Sociology' }
    ]
  },
  {
    id: 'temporal',
    number: '05',
    title: 'Asynchronous Processing',
    subtitle: 'Edges are not static wires.',
    body: [
      'A static map of the organism is a lie. Data channels do not exist permanently; they activate and deactivate in time. A channel between two nodes that fires every microsecond operates entirely differently from one that fires once a cycle.',
      'Data transmission is "bursty" — long periods of dormancy punctuated by rapid sequences of signals. Because edges are temporal, viruses or data packets can only traverse "time-respecting paths."',
      'If Node A transmits to Node B *after* Node B has already transmitted to Node C, the payload cannot reach C. The precise asynchronous timing of these activations dictates how fast the organism can process global state changes.'
    ],
    math: 'B = \\frac{\\sigma_{\\tau} - \\mu_{\\tau}}{\\sigma_{\\tau} + \\mu_{\\tau}}\nThe burstiness parameter B measures how interactions deviate from a steady Poisson process. Node communication typically shows high burstiness (B > 0).',
    insight: 'The organism does not process information continuously. It computes in bursts.',
    vizHint: 'Watch the edges pulse. The glowing orange path represents the only valid time-respecting route for a signal payload.',
    controls: [
      { id: 'burst-slider', type: 'slider', label: 'Burstiness', min: '0', max: '1', step: '0.1', value: '0.8' }
    ],
    keyTerms: ['Temporal Networks', 'Burstiness', 'Time-Respecting Paths', 'Asynchronous Processing'],
    references: [
      { author: 'Holme, P., & Saramäki, J.', year: '2012', title: 'Temporal Networks', field: 'Physics / Network Science' }
    ]
  },
  {
    id: 'dunbar',
    number: '06',
    title: 'Hardware Constraints',
    subtitle: 'The node is a bandwidth bottleneck.',
    body: [
      'Why doesn\'t the organism simply wire every node to every other node? Because maintaining an edge requires computational overhead. The biological hardware of the human node (the neocortex) has strict physical limits.',
      'This constraint is mathematically quantifiable: a standard node can only sustain about 150 active, high-bandwidth channels. These are structured logarithmically, with bandwidth decaying exponentially as the number of targets increases.',
      'When global communication infrastructure attempts to force 5,000 channels through hardware built for 150, the node\'s processor crashes. To prevent failure, the organism drastically throttles the bandwidth of *all* connections.'
    ],
    math: 'N_c \\approx 150 \\quad (\\text{Dunbar\'s Number})\nThe capacity scales with a ratio of roughly 3. Edge groupings step approximately: 5, 15, 50, 150, 500. Bandwidth decays exponentially with distance.',
    insight: 'Technology expanded the organism\'s reach, but biology strictly capped its hardware throughput.',
    vizHint: 'The network is constrained by bandwidth. Adding too many global edges forces the signal quality of all edges to approach zero.',
    controls: [
      { id: 'add-friends', type: 'button', label: 'Overload Network Edges' },
      { id: 'reset-dunbar', type: 'button', label: 'Reset to Hardware Limits', variant: 'outline' }
    ],
    keyTerms: ['Social Brain Hypothesis', 'Dunbar\'s Number', 'Cognitive Load', 'Bandwidth Limits'],
    references: [
      { author: 'Dunbar, R. I. M.', year: '1992', title: 'Neocortex size as a constraint on group size in primates', field: 'Evolutionary Anthropology' }
    ]
  },
  {
    id: 'cooperation',
    number: '07',
    title: 'Algorithmic Stability',
    subtitle: 'Preventing the organism from consuming itself.',
    body: [
      'Nodes must interact to process data, but interaction carries a vulnerability. Game theory models this: if a node processes data fairly (cooperates) while another node leeches resources (defects), the cooperative node is depleted. Rationally, the optimal individual algorithm is pure defection (parasitism).',
      'If every node runs the defection algorithm, the organism dies. How does it survive? Evolutionary dynamics prove that because nodes exist *on a spatial topology*, cooperating algorithms can form defensive clusters. Within the cluster, efficiency is so high that they mathematically outcompete parasitic nodes on the boundaries.',
      'The topology of the network is the only thing preventing the organism from collapsing into a zero-sum death spiral.'
    ],
    math: 'b/c > k\nNetwork reciprocity rule: Cooperative algorithms can stabilize if the benefit-to-cost ratio exceeds the average degree of the network. Too much connectivity (high k) destroys cooperation.',
    insight: 'A completely interconnected organism is mathematically destined to self-destruct. Boundaries ensure survival.',
    vizHint: 'Green nodes run the cooperative algorithm; red nodes are parasitic. Watch how cooperators only survive by forming dense spatial clusters.',
    controls: [
      { id: 'inject-defector', type: 'button', label: 'Inject Parasitic Node', variant: 'danger' },
      { id: 'rewire-topology', type: 'button', label: 'Increase Connectivity', variant: 'outline' }
    ],
    keyTerms: ['Evolutionary Game Theory', 'Network Reciprocity', 'Parasitism', 'Spatial Clustering'],
    references: [
      { author: 'Nowak, M. A.', year: '2006', title: 'Five Rules for the Evolution of Cooperation', field: 'Biology / Complex Systems' },
      { author: 'Axelrod, R.', year: '1984', title: 'The Evolution of Cooperation', field: 'Political Science' }
    ]
  },
  {
    id: 'nodes-channels',
    number: '08',
    title: 'Signal and Noise',
    subtitle: 'Optimizing the components to save the whole.',
    body: [
      'To make the emergent organism more powerful, we must upgrade its base components. Nodes have inherent processing biases and variable epistemic accuracy. Edges are plagued by latency and algorithmic interference.',
      'Information theory dictates that the data capacity of any channel is governed by its Signal-to-Noise ratio. When the organism\'s sub-systems optimize for sheer volume of edge activations (engagement) rather than accuracy, they flood the entire network with noise.',
      'To survive the flood, nodes activate fallback heuristics (bounded rationality). They lower their processing fidelity. An organism with infinite neural speed but a zero S/N ratio is effectively brain-dead.'
    ],
    math: 'C = B \\log_2 (1 + \\frac{S}{N})\nThe Shannon-Hartley theorem. Capacity (C) depends on Bandwidth (B) and the Signal-to-Noise ratio (S/N). If N overwhelms S, capacity drops to zero.',
    insight: 'Upgrading the individual node is not about self-improvement. It is a biological necessity to prevent the organism from drowning in noise.',
    vizHint: 'Adjust the sliders. Watch how noise causes the data channels to physically degrade, halting global computation.',
    controls: [
      { id: 'node-quality-slider', type: 'slider', label: 'Node Accuracy', min: '0.1', max: '1', step: '0.1', value: '0.5' },
      { id: 'channel-noise-slider', type: 'slider', label: 'Channel Noise', min: '0', max: '0.9', step: '0.1', value: '0.4' }
    ],
    keyTerms: ['Information Theory', 'Shannon Capacity', 'Signal-to-Noise', 'Bounded Rationality'],
    references: [
      { author: 'Shannon, C. E.', year: '1948', title: 'A Mathematical Theory of Communication', field: 'Information Theory' },
      { author: 'Simon, H. A.', year: '1955', title: 'A Behavioral Model of Rational Choice', field: 'Economics' }
    ]
  },
  {
    id: 'echo-chambers',
    number: '09',
    title: 'Autoimmune Fragmentation',
    subtitle: 'When the organism attacks itself.',
    body: [
      'The network is highly adaptive. Nodes dynamically sever and form edges based on the signals they receive. Due to homophily—the programmatic desire to link with identical nodes—they cut ties with sources of contradictory data.',
      'In an algorithmically accelerated environment, this triggers a catastrophic feedback loop. The organism undergoes an autoimmune response, spontaneously fracturing into isolated, hyper-dense components. We call these echo chambers.',
      'Inside these severed components, complex contagions reinforce corrupted state data. To the rest of the organism, it appears as a localized cancer. To the nodes inside, it feels like absolute truth.'
    ],
    math: 'Q = \\frac{1}{2m} \\sum_{vw} \\left[ A_{vw} - \\frac{k_v k_w}{2m} \\right] \\delta(c_v, c_w)\nModularity Q measures how strongly a network divides into modules. High modularity means the organism has deeply fragmented.',
    insight: 'Fragmentation is not a bug in human behavior; it is the mathematical destiny of an adaptive network running a homophily algorithm.',
    vizHint: 'Increase homophily to trigger adaptive rewiring. Watch the organism undergo cellular fission into mutually exclusive components.',
    controls: [
      { id: 'homophily-slider', type: 'slider', label: 'Homophily Force', min: '0', max: '1', step: '0.1', value: '0.2' },
      { id: 'inject-misinfo', type: 'button', label: 'Inject Corrupted Data', variant: 'danger' }
    ],
    keyTerms: ['Adaptive Networks', 'Homophily', 'Modularity', 'Autoimmune Response', 'Fragmentation'],
    references: [
      { author: 'Gross, T., & Blasius, B.', year: '2008', title: 'Adaptive coevolutionary networks', field: 'Complex Systems' },
      { author: 'Centola, D.', year: '2010', title: 'The Spread of Behavior in an Online Social Network Experiment', field: 'Sociology' }
    ]
  },
  {
    id: 'whats-next',
    number: '10',
    title: 'Global Computation',
    subtitle: 'Evolving the intelligence of the organism.',
    body: [
      'If the organism can fracture, it can also synchronize. Statistical mechanics dictate that if nodes possess an accuracy slightly greater than chance, and their computations are perfectly *independent*, the output of the global organism approaches absolute truth.',
      'However, the prerequisite is independence. If nodes simply duplicate the outputs of neighboring nodes (herding), the intelligence of the organism collapses into a cascade of cascading errors.',
      'How do we upgrade the organism? How do we make it grow into something better? We must redesign the architecture: constructing topologies that respect hardware limits, maintain synaptic gaps for novelty, and enforce algorithmic independence. Only then can true global computation emerge.'
    ],
    math: 'P(Correct) = \\sum_{k > N/2}^{N} \\binom{N}{k} p^k (1-p)^{N-k}\nIf node accuracy p > 0.5, the probability of the macroscopic state being correct approaches 100% as N → ∞. But correlation ruins the math.',
    insight: 'The organism is only as intelligent as the strict independence of its processing units.',
    vizHint: 'Switch modes to see how independent processing vs. state-duplication (herding) alters the organism\'s global intelligence score.',
    controls: [
      { id: 'mode-independent', type: 'button', label: 'Independent Processing' },
      { id: 'mode-herding', type: 'button', label: 'Correlated Herding', variant: 'danger' }
    ],
    keyTerms: ['Global Computation', 'Condorcet Jury Theorem', 'Mechanism Design', 'State Duplication'],
    references: [
      { author: 'Surowiecki, J.', year: '2004', title: 'The Wisdom of Crowds', field: 'Economics / Sociology' },
      { author: 'Condorcet, Marquis de', year: '1785', title: 'Essay on the Application of Analysis to the Probability of Majority Decisions', field: 'Mathematics' }
    ]
  }
];
