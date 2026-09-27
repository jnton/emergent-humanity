// Plain-language narrative and controls for the animated essay.
export const ILLUSTRATIONS = {
  "node-capacity": {
    "subtitle": "Start with a person.",
    "body": [
      "A person has a life: memories, needs, intentions, relationships. No dot can contain all of that.",
      "But to see how people connect, we can simplify the picture. Keep the person in mind. Change the view."
    ],
    "insight": "The person has not become less. The picture has become simpler.",
    "vizHint": "Behind one node is a whole person.",
    "controls": []
  },
  "node-limits": {
    "subtitle": "No person has unlimited capacity.",
    "body": [
      "Attention, memory, time, energy, and information processing are finite. Health, education, practice, tools, and environment can push performance much higher, but they do not make a fixed human unlimited.",
      "This picture uses a stipulated ceiling to illustrate a finite resource. It does not measure a person’s potential. Different capacities have different limits, and tools and environment can change what a task requires."
    ],
    "insight": "Environment can move the limit. It does not remove it.",
    "vizHint": "Improve the conditions. Watch the person’s capacity change.",
    "controls": [
      {
        "id": "optimize-nodes",
        "type": "button",
        "label": "Improve conditions"
      },
      {
        "id": "reset-limits",
        "type": "button",
        "label": "Reset",
        "variant": "outline"
      }
    ]
  },
  "intro": {
    "subtitle": "You were never outside it.",
    "body": [
      "From where you stand, you are at the centre. Pull back: your life is one among many, shaped by relationships that reach beyond what you can see. Together, these lives form a connected whole.",
      "Here, “organism” is a metaphor for that interdependence. People remain distinct, with different and sometimes conflicting goals. The whole does not have a single mind or will."
    ],
    "insight": "You are not looking at humanity from the outside.",
    "vizHint": "Let the view pull back.",
    "controls": []
  },
  "emergent-organism": {
    "subtitle": "Importance depends on the function and the scale.",
    "body": [
      "A network can continue after some members disappear. Removing a bridge, a hub, or the only carrier of a needed skill can have a very different effect. Redundancy for one function does not imply redundancy for another.",
      "The animation compares structural roles in a toy network. It does not estimate anyone’s total contribution, replaceability, or human worth. The quantitative model lets you distinguish connectivity from skill coverage."
    ],
    "insight": "What survives depends on what was connected—and what you needed it to do.",
    "vizHint": "Reveal structural weight, then compare removing an ordinary node with removing a hub.",
    "controls": [
      {
        "id": "show-centrality",
        "type": "switch",
        "label": "Show connections",
        "value": false
      },
      {
        "id": "remove-node",
        "type": "button",
        "label": "Remove a person"
      },
      {
        "id": "remove-hub",
        "type": "button",
        "label": "Remove a hub"
      },
      {
        "id": "reset-network",
        "type": "button",
        "label": "Reset",
        "variant": "outline"
      }
    ]
  },
  "illusion-of-significance": {
    "subtitle": "A small difference can fade, persist, or grow.",
    "body": [
      "Start two copies of the same state. Change one value by one ten-millionth and apply the same rule to both.",
      "Averaging disperses this difference but retains a small common offset. The coupled nonlinear map can amplify it. Finite-time separation is a diagnostic of these trajectories, not proof that civilization is chaotic."
    ],
    "insight": "The dynamics determine what becomes of a tiny difference.",
    "vizHint": "Compare averaging, which can retain a common offset, with a sensitive nonlinear rule.",
    "controls": [
      {
        "id": "stable-regime",
        "type": "button",
        "label": "Let differences settle",
        "variant": "outline"
      },
      {
        "id": "sensitive-regime",
        "type": "button",
        "label": "Let differences grow"
      },
      {
        "id": "shift-node",
        "type": "button",
        "label": "Make a tiny change"
      }
    ]
  },
  "node-quantity": {
    "subtitle": "Scale adds capacity and coordination costs.",
    "body": [
      "More people can mean more ideas, specialization, observations, and parallel work. It also means more communication, duplication, conflict, and coordination.",
      "Scale helps only when the network can turn extra people into usable collective capacity."
    ],
    "insight": "More nodes create potential. Organization determines how much becomes usable.",
    "vizHint": "Scale the population. Node count rises together with the structure that must coordinate it.",
    "controls": [
      {
        "id": "population-slider",
        "type": "slider",
        "label": "Population Scale",
        "min": "0.1",
        "max": "1",
        "step": "0.1",
        "value": "0.3"
      }
    ]
  },
  "connection-quantity": {
    "subtitle": "Shorter paths change what the network can do.",
    "body": [
      "Adding links can reduce shortest-path distance and make more of a network reachable. Writing, printing, telecommunications, and the Internet did this at enormous scale.",
      "But possible connections can grow faster than a node’s finite communication and processing capacity. More connectivity changes the bottleneck; it does not abolish bottlenecks."
    ],
    "insight": "Reachability can grow faster than usable attention or bandwidth.",
    "vizHint": "Bring distant groups closer. Watch the paths between them change.",
    "controls": [
      {
        "id": "deploy-internet",
        "type": "button",
        "label": "Connect distant groups"
      },
      {
        "id": "reset-connections",
        "type": "button",
        "label": "Reset",
        "variant": "outline"
      }
    ]
  },
  "connection-quality": {
    "subtitle": "A perfect channel can still deliver bad information.",
    "body": [
      "Information can fail at different layers: the signal can be corrupted, the source can be wrong, the message can be misinterpreted, or trust can be badly calibrated. These are different mechanisms.",
      "Incentives are different again. They do not necessarily damage a connection; they change what gets produced, selected, repeated, and amplified. None of these should be collapsed into one idea of “noise.”"
    ],
    "insight": "Good information flow depends on the channel, the source, the receiver, and the selection process.",
    "vizHint": "This toy model isolates one dimension of quality: edge transmission reliability.",
    "controls": [
      {
        "id": "fidelity-slider",
        "type": "slider",
        "label": "Message clarity",
        "min": "0",
        "max": "1",
        "step": "0.1",
        "value": "0.8"
      }
    ]
  },
  "cohesion": {
    "subtitle": "Beliefs and connections can pull apart together.",
    "body": [
      "Who interacts with whom can affect how opinions cluster. In this bounded-confidence model, sufficiently similar opinions influence each other; the outcome depends on the interaction rule.",
      "The cross-group contact control changes an assumption. It is not a demonstrated cure for political conflict, and low opinion dispersion is not the same as understanding or low hostility."
    ],
    "insight": "A bridge creates contact. What happens next depends on the interaction.",
    "vizHint": "Change interaction selectivity and watch opinion clusters form or reconnect.",
    "controls": [
      {
        "id": "polarize-slider",
        "type": "slider",
        "label": "How selective?",
        "min": "0",
        "max": "1",
        "step": "0.1",
        "value": "0.6"
      },
      {
        "id": "deploy-bridges",
        "type": "button",
        "label": "Open cross-group contact"
      }
    ]
  },
  "alignment": {
    "subtitle": "Moving together is different from moving well.",
    "body": [
      "When people push in incompatible directions, some effort cancels or interferes. Greater alignment can make a group more effective at pursuing a goal.",
      "But alignment is not automatically good. Diversity can improve exploration and error correction, and a perfectly coordinated group can still pursue a bad objective."
    ],
    "insight": "Coordination increases coherence, not correctness.",
    "vizHint": "Help neighbouring nodes influence one another. Agreement can grow without becoming truth.",
    "controls": [
      {
        "id": "align-goals",
        "type": "button",
        "label": "Bring directions together"
      },
      {
        "id": "scramble-goals",
        "type": "button",
        "label": "Start with disagreement",
        "variant": "outline"
      }
    ]
  },
  "environment": {
    "subtitle": "The network needs input from the world.",
    "body": [
      "Observation, measurement, experiments, and feedback give the network new information.",
      "Knowledge also grows by transforming what is already known through inference, recombination, computation, and simulation."
    ],
    "insight": "Learning needs both evidence and inference.",
    "vizHint": "Release observations into the environment and watch local nodes acquire them.",
    "controls": [
      {
        "id": "release-info",
        "type": "button",
        "label": "Release Information"
      }
    ]
  },
  "collective-memory": {
    "subtitle": "Ideas survive only if they have somewhere to go.",
    "body": [
      "People die and memories fade. Information persists when it is copied into other people, practices, institutions, or artifacts.",
      "Copies can spread, change, disappear, or become redundant enough to survive the loss of the original carrier."
    ],
    "insight": "Memory becomes collective when information outlives the person who first held it.",
    "vizHint": "Create an idea, let others copy it, then remove the original carrier.",
    "controls": [
      {
        "id": "spawn-idea",
        "type": "button",
        "label": "Spawn Idea"
      },
      {
        "id": "remove-origin",
        "type": "button",
        "label": "Remove the origin",
        "variant": "outline"
      },
      {
        "id": "reset-memory",
        "type": "button",
        "label": "Start again",
        "variant": "outline"
      }
    ]
  },
  "external-storage": {
    "subtitle": "Writing changed what humanity could remember.",
    "body": [
      "Writing, printing, photography, databases, and networked storage moved memory outside the brain. That increased capacity, fidelity, searchability, and the chance that knowledge survives a human lifetime.",
      "External memory is still fragile. Records can decay, disappear, become unreadable, or be altered."
    ],
    "insight": "External storage lets knowledge survive us, but not forever.",
    "vizHint": "Move through storage epochs and watch information gain non-biological carriers.",
    "controls": [
      {
        "id": "invent",
        "type": "button",
        "label": "Give memory a home"
      },
      {
        "id": "reset-storage",
        "type": "button",
        "label": "Start again",
        "variant": "outline"
      }
    ]
  },
  "entropy": {
    "subtitle": "Information can be damaged—and repaired.",
    "body": [
      "Communication channels make errors. Repetition and coding can reduce those errors dramatically; corruption is not an unavoidable march toward disorder.",
      "Human communication adds another problem: a message can arrive perfectly and still be misunderstood. Physical fidelity and meaning are different layers."
    ],
    "insight": "Reliable communication depends on both the channel and the interpretation.",
    "vizHint": "Send a message. Then try extra copies and compare what arrives.",
    "controls": [
      {
        "id": "channel-noise",
        "type": "slider",
        "label": "Channel noise",
        "min": "0",
        "max": "0.15",
        "step": "0.01",
        "value": "0.04"
      },
      {
        "id": "toggle-redundancy",
        "type": "switch",
        "label": "Send extra copies"
      },
      {
        "id": "send-message",
        "type": "button",
        "label": "Send a message"
      }
    ]
  },
  "productivity": {
    "subtitle": "The network can solve problems no individual can.",
    "body": [
      "Specialization, shared memory, parallel search, and coordination let groups solve problems beyond the capacity of one person. But scale alone is not enough.",
      "Bottlenecks, duplicated work, bad incentives, misinformation, and coordination costs can waste that capacity. Collective intelligence appears when the network turns distributed ability into useful work."
    ],
    "insight": "Collective capacity matters only when the network can use it.",
    "vizHint": "An illustration of collective capacity. Several things change together; this is not a controlled comparison.",
    "controls": [
      {
        "id": "optimize-all",
        "type": "button",
        "label": "Grow and reorganize"
      },
      {
        "id": "reset-productivity",
        "type": "button",
        "label": "Reset",
        "variant": "outline"
      }
    ]
  },
  "comparative-emergence": {
    "subtitle": "Different systems can follow the same rule.",
    "body": [
      "Ant colonies, flocks, slime molds, and human networks are very different. Yet some of their large-scale behavior can be described with the same kinds of feedback, alignment, memory, and network trade-offs.",
      "That does not make the systems equivalent. It means the same mathematical pattern can appear in very different physical systems.",
      "The useful question is simple: where does the comparison work, and where does it stop?"
    ],
    "insight": "Same pattern does not mean same mechanism.",
    "vizHint": "Compare illustrative feedback, directional order, and transport mechanisms. A shared mathematical pattern does not make the underlying systems identical.",
    "controls": [
      {
        "id": "pattern-trace",
        "type": "button",
        "label": "Traces"
      },
      {
        "id": "pattern-alignment",
        "type": "button",
        "label": "Moving together",
        "variant": "outline"
      },
      {
        "id": "pattern-network",
        "type": "button",
        "label": "Routes",
        "variant": "outline"
      }
    ]
  },
  "whats-next": {
    "subtitle": "There is no single variable to maximize.",
    "body": [
      "If the goals include learning, coordination, resilience, adaptation, and preserving useful knowledge, several properties matter at once: human capability, connectivity, information quality, memory, redundancy, diversity, alignment, and feedback from reality.",
      "These goals can conflict. More agreement can leave less room for exploration. Extra copies cost resources. More connections can add coordination work. And memory can preserve mistakes as well as knowledge.",
      "Mathematics can expose the trade-offs. It cannot decide what humanity should value. The practical task is to build systems that learn, coordinate, remember, adapt, correct errors, and recover—without silently sacrificing the properties that make those abilities possible."
    ],
    "insight": "Improve humanity by improving the system—but measure what every improvement costs elsewhere.",
    "vizHint": "The network stays open: reshape it and treat every representation as provisional.",
    "controls": []
  }
};
