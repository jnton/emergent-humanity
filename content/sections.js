// ==========================================================================
// The Content Core — V3 Exploratory Edition
// ==========================================================================

export const SECTIONS = [
  {
    id: 'intro',
    number: '01',
    title: 'The Great Organism',
    subtitle: 'From single humans to an emergent entity.',
    body: [
      'I currently visualize humanity as a vast network. The points are humans. A single human is just a single point, isolated in space.',
      'But when these single points begin to connect, something incredible happens. Information flows, structures form, and the network takes on a life of its own.',
      'The true entity is the network itself. Humanity is a larger organism, an emerging one, just like cells compose a human body. To understand it, we must analyze how to make this organism grow and get better.'
    ],
    insight: 'This project is about constructing my view of the world: exploring how to improve the Emergent Organism.',
    vizHint: 'Click to spark connections. Watch the isolated humans merge into the great Humanity.',
    controls: []
  },
  {
    id: 'emergent-organism',
    number: '02',
    title: 'One Node Goes Dark',
    subtitle: 'Failure, loss, and structural resilience.',
    body: [
      'A human is a node, essentially a state that can flip from 1 to 0.',
      'If a point suddenly disappears—a 1 flipping to a 0—it doesn\'t affect the net that much. Only the nearest points feel the loss for a limited time. Obviously, according to chaos theory, even a small change has a huge impact in the long term, but the immediate structural loss is minimal.',
      'The organism easily routes around the dead node. This is the fundamental resilience of the human network.'
    ],
    insight: 'The loss of a node is a tragedy for the local cluster, but a rounding error for the organism.',
    vizHint: 'Click a node to flip its state from 1 to 0. Watch the network absorb the loss.',
    controls: [
      { id: 'remove-node', type: 'button', label: 'Flip a Node to 0 (Failure)' },
      { id: 'reset-network', type: 'button', label: 'Regenerate Organism', variant: 'outline' }
    ]
  },
  {
    id: 'node-quantity',
    number: '03',
    title: 'Node Quantity',
    subtitle: 'Scaling the processing power of the organism.',
    body: [
      'How do we improve Humanity? The first axis is the sheer number of nodes. More nodes mean more processing units, more potential connections, and a larger overall organism.',
      'Historically, we have increased the number of active nodes through massive health interventions: sanitation, vaccines, antibiotics, and agriculture. These innovations prevented premature 1-to-0 flips, allowing the organism to scale from millions to billions.',
      'A larger network is fundamentally capable of more complex emergence, but only if the structural integrity scales with the mass.'
    ],
    insight: 'Scaling the node count is the baseline for upgrading the organism.',
    vizHint: 'Use the slider to scale the population of the network. Notice the structural complexity increase.',
    controls: [
      { id: 'population-slider', type: 'slider', label: 'Population Scale', min: '0.1', max: '1', step: '0.1', value: '0.3' }
    ]
  },
  {
    id: 'node-quality',
    number: '04',
    title: 'Node Quality',
    subtitle: 'Upgrading the individual processing units.',
    body: [
      'Having billions of nodes is useless if the nodes are defective or operating at low capacity. The second axis of improvement is the Quality of the nodes.',
      'How do we increase the quality of a human node? Education, critical thinking, mental health, and epistemic accuracy. A high-quality node processes signals cleanly, resists noise, and makes optimal routing decisions.',
      'When we educate a node, we are effectively upgrading the biological hardware and software of the organism\'s constituent cells.'
    ],
    insight: 'Education is the firmware update for the human node.',
    vizHint: 'Click to educate nodes. High-quality nodes glow brighter and process connections more efficiently.',
    controls: [
      { id: 'educate-nodes', type: 'button', label: 'Deploy Education Intervention' },
      { id: 'reset-quality', type: 'button', label: 'Reset Node Quality', variant: 'outline' }
    ]
  },
  {
    id: 'connection-quantity',
    number: '05',
    title: 'Connection Quantity',
    subtitle: 'Zero-friction wiring and the internet.',
    body: [
      'A network of brilliant nodes still fails if they cannot talk to each other. The third axis is the Number of Connections.',
      'For most of history, geography strictly limited connection quantity. Then came the printing press, the telegraph, and finally, the Internet. We solved the wiring problem. We created zero-friction networking where any node can connect to any other node instantly.',
      'But hyper-connectivity introduced a severe bottleneck: the biological node was never designed to process 5,000 active channels simultaneously.'
    ],
    insight: 'We successfully wired the entire globe. What could possibly be the next innovation?',
    vizHint: 'Click to simulate the invention of the internet, massively increasing the number of active edges.',
    controls: [
      { id: 'deploy-internet', type: 'button', label: 'Deploy the Internet' },
      { id: 'reset-connections', type: 'button', label: 'Revert to Local Topologies', variant: 'outline' }
    ]
  },
  {
    id: 'connection-quality',
    number: '06',
    title: 'Connection Quality',
    subtitle: 'Information flow, selection, and the battle against noise.',
    body: [
      'This is my current obsession. If we have the nodes, and we have the wires, why is the organism still failing? Because of Connection Quality.',
      'It\'s all about information flow and selection. We have infinite bandwidth but terrible signal-to-noise ratios. Algorithms optimize for engagement (noise) rather than truth (signal). Misinformation propagates faster than knowledge.',
      'How do we increase the quality of connections? We must improve how information flows and how it is selected. We need filters, trust mechanisms, and routing protocols that prioritize high-value data.'
    ],
    insight: 'The ultimate bottleneck of modern humanity is no longer physical; it is informational.',
    vizHint: 'Adjust the algorithm to favor Signal (truth) or Noise (engagement). Watch how noise physically degrades the network\'s cohesion.',
    controls: [
      { id: 'algorithm-slider', type: 'slider', label: 'Signal vs Noise', min: '0', max: '1', step: '0.1', value: '0.2' }
    ]
  },
  {
    id: 'cohesion',
    number: '07',
    title: 'Cohesion & Polarization',
    subtitle: 'Echo chambers and the splintering of the organism.',
    body: [
      'When connection quality degrades and noise reigns, nodes retreat into local clusters of extreme agreement. The organism undergoes a physical phase transition: Polarization.',
      'Echo chambers form. These dense sub-networks repel one another. The overarching emergent entity literally fractures into multiple, hostile sub-organisms that refuse to share processing power.',
      'To heal the organism, we cannot simply add more connections. We need Bridging Nodes: diplomats and translators that can span across the chasm, pulling the network back into a single unified architecture.'
    ],
    insight: 'A polarized network is a lobotomized organism.',
    vizHint: 'Drag the slider to polarize the network into echo chambers. Click to deploy Bridging Nodes to heal it.',
    controls: [
      { id: 'polarize-slider', type: 'slider', label: 'Polarization', min: '0', max: '1', step: '0.1', value: '0' },
      { id: 'deploy-bridges', type: 'button', label: 'Deploy Bridging Nodes' }
    ]
  },
  {
    id: 'alignment',
    number: '08',
    title: 'Alignment & Shared Goals',
    subtitle: 'Synchronization of vector paths.',
    body: [
      'Imagine we have successfully healed the echo chambers. The organism is one mass again. But if the nodes are pulling in opposite directions, the net forward progress of the organism is exactly zero.',
      'Alignment is the meta-layer of connection quality. If half the network optimizes for X and the other half for Y, they cancel each other out. The network vibrates in chaotic stagnation.',
      'When the organism adopts a shared narrative—like exploring space, curing disease, or building a utopia—the vectors of individual nodes synchronize. The entire network begins to move fluidly in a single direction.'
    ],
    insight: 'Without a shared goal, extreme processing power is just extreme heat.',
    vizHint: 'The network is chaotic. Click to introduce a unifying vision and watch the vectors synchronize.',
    controls: [
      { id: 'align-goals', type: 'button', label: 'Introduce Unifying Vision' },
      { id: 'scramble-goals', type: 'button', label: 'Return to Chaos', variant: 'outline' }
    ]
  },
  {
    id: 'collective-memory',
    number: '09',
    title: 'Collective Memory',
    subtitle: 'Information persistence beyond the individual.',
    body: [
      'Nodes are mortal. A human eventually flips from 1 to 0. If all knowledge lived purely inside the nodes, the organism would suffer catastrophic amnesia constantly.',
      'A high-quality organism stores knowledge in its structure, not just its nodes. When nodes learn and interact, they build a physical lattice of structural memory—institutions, open-source code, books, and art.',
      'When a central, highly educated node dies, this structural lattice remains. A new node spawning in that location immediately inherits the stored wisdom of the organism.'
    ],
    insight: 'Institutions and culture are the long-term memory of the emergent organism.',
    vizHint: 'Watch nodes build structural lattice over time. Click a node to terminate it, and watch the structure persist.',
    controls: [
      { id: 'accelerate-learning', type: 'button', label: 'Accelerate Learning' },
      { id: 'clear-memory', type: 'button', label: 'Erase Structural Memory', variant: 'outline' }
    ]
  },
  {
    id: 'productivity',
    number: '10',
    title: 'Productivity & Shared Knowledge',
    subtitle: 'The ultimate output of the organism.',
    body: [
      'When you optimize Node Quantity, Node Quality, Connection Quantity, and Connection Quality—and when the organism is cohesive, aligned, and capable of structural memory—what is the result?',
      'Massive, compounding collective intelligence. The organism computes solutions to problems that no individual node could even comprehend. Science accelerates. Poverty collapses. Art flourishes.',
      'This is not an abstract theory. This is the observable mechanism of human progress over the last ten thousand years, mathematically mapped to a graph.'
    ],
    insight: 'Shared knowledge is the emergent consciousness of the organism.',
    vizHint: 'Watch the organism achieve high productivity. Clusters of high-quality nodes with strong connections generate intense bursts of shared knowledge.',
    controls: [
      { id: 'optimize-all', type: 'button', label: 'Optimize Organism (Achieve CI)' },
      { id: 'reset-productivity', type: 'button', label: 'Reset to Baseline', variant: 'outline' }
    ]
  },
  {
    id: 'whats-next',
    number: '11',
    title: 'What\'s Next?',
    subtitle: 'Building the next evolution.',
    body: [
      'This project is a living framework. I want everything to be correct, empirically grounded, and based on real science. There will surely be errors, and things to integrate or adjust.',
      'But the fundamental questions remain: If the internet solved the number of connections, what solves the quality of connections? How do we build mechanisms that naturally filter noise and amplify signal?',
      'This is how I am constructing my view of the world. Sharing it. Building it. Improving it.'
    ],
    insight: 'The organism is not finished growing.',
    vizHint: 'The network is open. Drag nodes to reshape the topology yourself.',
    controls: []
  }
];
