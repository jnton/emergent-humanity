// ==========================================================================
// The Content Core — V3 Exploratory Edition
// ==========================================================================

export const SECTIONS = [
  {
    id: 'node-capacity',
    number: '01',
    title: 'The Human Node',
    subtitle: 'The depth of a single point.',
    body: [
      'Before we draw a single connection, we must look at the node itself. A human being is not a static data point. We are dynamic, living systems, carrying massive amounts of information that varies across every physical part of our bodies and changes from one moment to the next.',
      'Our physical bodies are shaped by deep biological history and continuous physical changes. On top of that, we hold decades of subjective experience, memories, thoughts, and our own unique views of reality. Even in isolation, a single person is an entire universe of information.',
      'But to understand humanity at a large scale, we have to simplify. For this network model, we take this vast, ever-changing universe of human complexity and reduce it down to a single point: a Node.'
    ],
    insight: 'The node is a massive oversimplification of a human, necessary to see the larger structure.',
    vizHint: 'Watch the human form abstract down into a single mathematical point.',
    controls: []
  },
  {
    id: 'node-limits',
    number: '02',
    title: 'Node Limits & Bottlenecks',
    subtitle: 'The boundaries of the biological hardware.',
    body: [
      'While a single node contains a universe of information, its processing power has hard physical and cognitive bottlenecks. For example, we have limited memory and limited information processing abilities. The biological brain is incredibly plastic—it can train, adapt, and highly specialize in specific tasks even into adulthood.',
      'Historically, we have improved these nodes by optimizing environmental factors: education, mental health, and nutrition allow a node to reach its maximum potential and specialize deeply.',
      'Even with perfect environmental optimization and extreme specialization, we eventually hit the hard genetic limits of the biological hardware. No single node can hold or process everything. To process reality at scale, the node must connect.'
    ],
    insight: 'Environmental optimization eventually hits the ceiling of genetic limits.',
    vizHint: 'Click to optimize nodes. Watch them reach their maximum possible capacity before hitting the genetic limit.',
    controls: [
      { id: 'optimize-nodes', type: 'button', label: 'Optimize Environment' },
      { id: 'reset-limits', type: 'button', label: 'Reset', variant: 'outline' }
    ]
  },
  {
    id: 'intro',
    number: '03',
    title: 'The Great Organism',
    subtitle: 'Just one point in many.',
    body: [
      'But no matter how complex the individual node is, you are just a single point in space. A mere 1 or a 0 in the grand scheme.',
      'When these single points begin to connect, something incredible happens. Information flows, structures form, and the network takes on a life of its own.',
      'The true entity is the network itself. Humanity is a larger organism, an emerging one, just like cells compose a human body. We have to understand it to make it grow and get better.'
    ],
    insight: 'This project is about constructing my view of the world: exploring how to improve the Emergent Organism.',
    vizHint: 'Watch the isolated node get swallowed by the immense scale of the organism.',
    controls: []
  },
  {
    id: 'emergent-organism',
    number: '04',
    title: 'One Node Goes Dark',
    subtitle: 'What happens when a piece of the network disappears.',
    body: [
      'A human is a node, essentially a state that can flip from 1 to 0.',
      'If a point suddenly disappears—a 1 flipping to a 0—it doesn\'t affect the net that much. Only the nearest points feel the loss for a limited time. Obviously even a small change has a huge impact in the long term, but the immediate structural loss is minimal.',
      'The organism easily routes around the dead node. This is the fundamental resilience of a scaled human network.'
    ],
    insight: 'The loss of a node is a tragedy for the local cluster, but a rounding error for the organism.',
    vizHint: 'Click a node to flip its state from 1 to 0. Watch the network absorb the loss.',
    controls: [
      { id: 'highlight-affected', type: 'switch', label: 'Highlight Affected Nodes', value: false },
      { id: 'remove-node', type: 'button', label: 'Remove Node' },
      { id: 'reset-network', type: 'button', label: 'Reset', variant: 'outline' }
    ]
  },
  {
    id: 'illusion-of-significance',
    number: '05',
    title: 'The Illusion of Significance',
    subtitle: 'The inevitability of cascading consequences.',
    body: [
      'It is true that in a highly connected system, a single node disappearing or shifting slightly will eventually alter the entire future state of the network.',
      'We often use this fact to comfort ourselves, claiming it proves that every individual node is deeply important and holds inherent meaning within the grand design.',
      'But this is an illusion of significance. Moving a single grain of sand on a dune will also completely change the long-term cascade of events across the desert. It is not inherent meaning; it is simply the mechanical nature of complex systems over time.'
    ],
    insight: 'You change the future just by existing, but so does a rock.',
    vizHint: 'Click to slightly shift a single node. Watch how the passage of time naturally amplifies this tiny change until the two timelines are completely different.',
    controls: [
      { id: 'shift-node', type: 'button', label: 'Shift One Node' }
    ]
  },
  {
    id: 'node-quantity',
    number: '06',
    title: 'Node Quantity',
    subtitle: 'Scaling the processing power of the organism.',
    body: [
      'Since a single node cannot be infinitely upgraded, the first axis to improve the organism is the sheer number of nodes. More nodes mean more processing units.',
      'Historically, we increased the number of active nodes through massive health interventions, allowing the organism to scale from millions to billions.',
      'But just adding more nodes isn\'t enough. If the network scales up without the right structure, it becomes fragile. A massive network can easily collapse under its own weight.'
    ],
    insight: 'Scaling the node count is the baseline for upgrading the organism.',
    vizHint: 'Use the slider to scale the population of the network. Notice the structural complexity increase.',
    controls: [
      { id: 'population-slider', type: 'slider', label: 'Population Scale', min: '0.1', max: '1', step: '0.1', value: '0.3' }
    ]
  },
  {
    id: 'connection-quantity',
    number: '07',
    title: 'Connection Quantity',
    subtitle: 'Building the wires between the nodes.',
    body: [
      'A network of brilliant, healthy nodes still fails if they cannot talk to each other. The next axis is the Number of Connections.',
      'For most of history, geography strictly limited the edges in our graph. Then came the printing press, the telegraph, and finally, the Internet. We solved the wiring problem. We created a graph where almost any node can connect to any other node instantly.',
      'But this extreme connectivity created a new problem: the human mind is simply not built to handle thousands of relationships at once.'
    ],
    insight: 'We successfully wired the entire globe. What could possibly be the next innovation?',
    vizHint: 'Click to simulate the invention of the internet, massively increasing the number of active edges.',
    controls: [
      { id: 'deploy-internet', type: 'button', label: 'Connect Everyone' },
      { id: 'reset-connections', type: 'button', label: 'Reset', variant: 'outline' }
    ]
  },
  {
    id: 'connection-quality',
    number: '08',
    title: 'Connection Quality',
    subtitle: 'Signal, noise, and information flow.',
    body: [
      'If we have the people and the connections, the next crucial factor is the quality of the data flowing between them. When a channel is flooded with random noise, the actual signal is completely lost.',
      'Applied to humans, this is the modern internet. We built infinite connections, but the algorithms optimize for engagement (noise) rather than truth (signal). Disinformation propagates through the network far faster than actual knowledge.',
      'To fix the organism, we have to filter the noise. We need to prioritize high-value edges and ensure that true, useful signals can travel without being drowned out.'
    ],
    insight: 'A network flooded with noise cannot function efficiently, no matter how large it grows.',
    vizHint: 'Adjust the algorithm to favor Signal or Noise. Watch how noise physically degrades the network.',
    controls: [
      { id: 'algorithm-slider', type: 'slider', label: 'Signal vs Noise', min: '0', max: '1', step: '0.1', value: '0.2' }
    ]
  },
  {
    id: 'cohesion',
    number: '09',
    title: 'Cohesion & Polarization',
    subtitle: 'Echo chambers and the splintering of the graph.',
    body: [
      'When connection quality degrades and noise reigns, nodes retreat into local clusters of extreme agreement. The graph undergoes a phase transition: Polarization.',
      'Echo chambers form. These dense sub-networks repel one another. The overarching emergent entity literally fractures into multiple, hostile sub-graphs that refuse to share processing power.',
      'To heal the organism, we cannot simply add more connections. We need Bridging Nodes: elements that can span across the chasm, pulling the network back into a single unified architecture.'
    ],
    insight: 'A polarized network is a lobotomized organism.',
    vizHint: 'Drag the slider to polarize the network into echo chambers. Click to add Bridging Nodes to heal it.',
    controls: [
      { id: 'polarize-slider', type: 'slider', label: 'Polarization', min: '0', max: '1', step: '0.1', value: '0' },
      { id: 'deploy-bridges', type: 'button', label: 'Add Bridges' }
    ]
  },
  {
    id: 'alignment',
    number: '10',
    title: 'Alignment & Shared Goals',
    subtitle: 'Synchronization of vector paths.',
    body: [
      'Imagine we have successfully healed the echo chambers. The organism is one mass again. But if the nodes are pulling in opposite directions, the net forward progress of the entire graph is exactly zero.',
      'Alignment is a meta-layer of the network. If half the nodes optimize for X and the other half for Y, they cancel each other out. The network vibrates in chaotic stagnation.',
      'When the organism adopts a shared narrative—like exploring space, curing disease, or building a utopia—the vectors of individual nodes synchronize. The entire network begins to move fluidly in a single direction.'
    ],
    insight: 'Without a shared goal, extreme processing power is just extreme heat.',
    vizHint: 'The network is chaotic. Click to align vectors and watch the graph synchronize.',
    controls: [
      { id: 'align-goals', type: 'button', label: 'Align Vectors' },
      { id: 'scramble-goals', type: 'button', label: 'Scramble', variant: 'outline' }
    ]
  },
  {
    id: 'environment',
    number: '11',
    title: 'Environmental Interaction',
    subtitle: 'Sensing and storing local information.',
    body: [
      "Nodes aren't just calculators; they are sensors. They exist within a physical environment, constantly bombarded by phenomena, signals, and raw data.",
      "When a node encounters a piece of information in the wild, it can extract it, process it, and store it locally.",
      "This individual learning is the foundation of all intelligence. Before information can be shared across the network, it must first be harvested from reality by an individual."
    ],
    insight: 'All network knowledge begins as a local observation.',
    vizHint: 'Release information into the environment and watch nodes encounter and store it.',
    controls: [
      { id: 'release-info', type: 'button', label: 'Release Information' }
    ]
  },
  {
    id: 'collective-memory',
    number: '12',
    title: 'Collective Memory',
    subtitle: 'Information persistence beyond the individual.',
    body: [
      "Nodes are mortal. A human eventually flips from 1 to 0. If all knowledge lived purely inside individual nodes, the organism would suffer catastrophic amnesia constantly.",
      "But ideas, culture, and discoveries are messages that circulate through the network. When a node spawns an idea, it passes it to its connections.",
      "Even when the original node dies, the message continues to propagate through the surviving structure. This circulating information is the collective memory of the organism."
    ],
    insight: 'An idea can outlive its creator if the network is strong enough to carry it.',
    vizHint: 'Spawn an idea, then click its creator node to kill it. Watch the idea continue to circulate.',
    controls: [
      { id: 'spawn-idea', type: 'button', label: 'Spawn Idea' }
    ]
  },
  {
    id: 'external-storage',
    number: '13',
    title: 'External Memory & The Cloud',
    subtitle: 'The evolution of information storage outside the human brain.',
    body: [
      "Initially, biological nodes were the only containers of memory. This was fragile: nodes die, and communication heavily distorts information.",
      "Then, we started storing information externally. Cave paintings and monuments created almost permanent storage. Writing locked information into physical objects, making it effectively permanent.",
      "The Printing Press became fundamental. By creating massive redundancy through copies, it made information effectively immortal.",
      "Photography and recording instruments revolutionized things further. We invented instruments to objectively store information independently of humans. Visual and auditory information was captured by a third device, completely bypassing human senses, brain elaboration, and vocal transmission. Experience was locked in time from an object.",
      "Finally, the Internet and the ubiquitous availability of these instruments (smartphones, cameras) to everyone connected every node to a central 'Cloud', flooding the network with indestructible, instant redundancy."
    ],
    insight: 'By offloading memory to the environment, the organism became immortal.',
    vizHint: 'Click the button to guide the organism through technological innovations.',
    controls: [
      { id: 'invent', type: 'button', label: 'Invent Writing & Monuments' }
    ]
  },
  {
    id: 'entropy',
    number: '14',
    title: 'Entropy & Information Decay',
    subtitle: 'The distortion of knowledge over distance.',
    body: [
      "When information travels across a network, it doesn't arrive perfectly. Each hop introduces a chance for distortion, misinterpretation, or loss.",
      "This is the fundamental problem of entropy in communication. A message passed through ten nodes will rarely resemble the original. To combat this, networks require redundancy, error correction, and reliable storage.",
      "Without these mechanisms, the organism's shared knowledge degrades into noise."
    ],
    insight: 'The universe naturally tends toward chaos.',
    vizHint: 'Send a message across the network. Watch as the packet travels and accumulates distortion over multiple hops.',
    controls: [
      { id: 'send-message', type: 'button', label: 'Send Message' },
      { id: 'toggle-redundancy', type: 'switch', label: 'Enable Redundancy' }
    ]
  },
  {
    id: 'productivity',
    number: '15',
    title: 'Productivity & Shared Knowledge',
    subtitle: 'The ultimate output of the organism.',
    body: [
      'When you optimize Node Quantity, Node Quality, Connection Quantity, and Connection Quality—and when the organism is cohesive, aligned, and capable of fighting decay—what is the result?',
      'Massive, compounding collective intelligence. The organism computes solutions to problems that no individual node could even comprehend. Science accelerates. Poverty collapses. Art flourishes.',
      'This is not an abstract concept. This is the observable mechanism of human progress over the last ten thousand years.'
    ],
    insight: 'Shared knowledge is the emergent consciousness of the organism.',
    vizHint: 'Watch the organism achieve high productivity. Clusters of high-quality nodes with strong edges generate intense bursts of shared knowledge.',
    controls: [
      { id: 'optimize-all', type: 'button', label: 'Maximize Network' },
      { id: 'reset-productivity', type: 'button', label: 'Reset', variant: 'outline' }
    ]
  },
  {
    id: 'whats-next',
    number: '16',
    title: 'What\'s Next?',
    subtitle: 'Building the next evolution.',
    body: [
      'This project is a living framework. I want everything to be correct, logically grounded, and auditable. There will surely be errors, and things to integrate or adjust over time.',
      'We still have to solve the core problem: how do we filter noise and amplify the signal? How do we fix the network we built?',
      'This is how I am constructing my view of the world. Sharing it. Building it. Improving it.'
    ],
    insight: 'The organism is not finished growing.',
    vizHint: 'The network is open. Drag nodes to reshape the topology yourself.',
    controls: []
  }
];
