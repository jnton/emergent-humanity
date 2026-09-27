import { createNetworkEngine } from '../lib/network-engine.js';

export function initCohesion(canvas, controls) {
  let selectivity = Number.parseFloat(controls['polarize-slider']?.value ?? '0.6');
  let confidenceBound = 0.8;
  let bridgesActive = false;
  let frame = 0;

  const stats = document.getElementById('stats-cohesion');

  const engine = createNetworkEngine(canvas, {
    nodeCount: 80,
    linkDistance: 42,
    chargeStrength: -58,
    onTick: () => {
      frame += 1;

      if (frame % 5 === 0) {
        boundedConfidenceStep();
        updateLinkDisplay();
      }

      // Position is only a visual encoding of the current opinion.
      const width = canvas.clientWidth;
      for (const node of engine.getNodes()) {
        const targetX = width / 2 + node.opinion * width * 0.29;
        node.vx = (node.vx ?? 0) + (targetX - node.x) * 0.0035;
        node.community = node.opinion < -0.15 ? 0 : node.opinion > 0.15 ? 1 : 2;
      }

      updateStats();
    }
  });

  function endpoint(endpoint) {
    if (typeof endpoint === 'object') return endpoint;
    return engine.getNodes().find((node) => node.id === endpoint);
  }

  function setConfidenceBound() {
    // 0 selectivity -> nearly everyone can interact.
    // 1 selectivity -> only very similar opinions interact.
    confidenceBound = 1.85 - 1.7 * selectivity;
  }

  function seedOpinions() {
    bridgesActive = false;
    setConfidenceBound();

    for (const node of engine.getNodes()) {
      // Deterministic pseudo-random spread over [-1, 1].
      const unit = ((node.id * 37 + 11) % 97) / 96;
      node.opinion = unit * 2 - 1;
      node.isBridge = false;
      node.isBroker = false;
      node.radius = 5;
    }

    updateLinkDisplay();
    updateStats();
  }

  function boundedConfidenceStep() {
    const links = engine.getLinks();
    if (links.length === 0) return;

    const sampleCount = Math.min(24, links.length);
    for (let n = 0; n < sampleCount; n += 1) {
      const link = links[Math.floor(Math.random() * links.length)];
      const a = endpoint(link.source);
      const b = endpoint(link.target);
      if (!a || !b) continue;

      const distance = Math.abs(a.opinion - b.opinion);
      const trustedBridge = bridgesActive && (a.isBridge || b.isBridge);
      if (!trustedBridge && distance > confidenceBound) continue;

      const mu = trustedBridge ? 0.06 : 0.12;
      const delta = b.opinion - a.opinion;
      a.opinion = Math.max(-1, Math.min(1, a.opinion + mu * delta));
      b.opinion = Math.max(-1, Math.min(1, b.opinion - mu * delta));
    }
  }

  function updateLinkDisplay() {
    for (const link of engine.getLinks()) {
      const a = endpoint(link.source);
      const b = endpoint(link.target);
      if (!a || !b) continue;

      const distance = Math.abs(a.opinion - b.opinion);
      const trustedBridge = bridgesActive && (a.isBridge || b.isBridge);

      if (trustedBridge) {
        link.type = 'bridge';
        link.weight = 1;
      } else if (distance <= confidenceBound) {
        link.type = 'strong';
        link.weight = Math.max(0.35, 1 - distance / 2);
      } else {
        link.type = 'weak';
        link.weight = 0.08;
      }
    }
  }

  function opinionDispersion() {
    const nodes = engine.getNodes();
    if (nodes.length === 0) return 0;
    const mean = nodes.reduce((sum, node) => sum + node.opinion, 0) / nodes.length;
    const variance = nodes.reduce((sum, node) => sum + (node.opinion - mean) ** 2, 0) / nodes.length;
    return Math.sqrt(variance);
  }

  function activeCrossGroupEdges() {
    let count = 0;
    let total = 0;

    for (const link of engine.getLinks()) {
      const a = endpoint(link.source);
      const b = endpoint(link.target);
      if (!a || !b) continue;
      total += 1;

      const oppositeSigns = (a.opinion < 0 && b.opinion > 0) || (a.opinion > 0 && b.opinion < 0);
      const canInteract = Math.abs(a.opinion - b.opinion) <= confidenceBound || a.isBridge || b.isBridge;
      if (oppositeSigns && canInteract) count += 1;
    }

    return { count, total };
  }

  function updateStats() {
    if (!stats) return;
    const cross = activeCrossGroupEdges();
    stats.textContent = `confidence ε ${confidenceBound.toFixed(2)} · opinion SD ${opinionDispersion().toFixed(2)} · active cross-group edges ${cross.count}/${cross.total}`;
  }

  controls['polarize-slider']?.addEventListener('input', (event) => {
    selectivity = Number.parseFloat(event.target.value);
    seedOpinions();
    engine.getSimulation()?.alpha(0.6).restart();
  });

  controls['deploy-bridges']?.addEventListener('click', () => {
    if (bridgesActive) return;
    bridgesActive = true;

    const nodes = engine.getNodes();
    const bridgeNodes = [...nodes]
      .sort((a, b) => Math.abs(a.opinion) - Math.abs(b.opinion))
      .slice(0, 5);

    const negative = [...nodes].sort((a, b) => a.opinion - b.opinion).slice(0, 8);
    const positive = [...nodes].sort((a, b) => b.opinion - a.opinion).slice(0, 8);

    for (let i = 0; i < bridgeNodes.length; i += 1) {
      const bridge = bridgeNodes[i];
      bridge.isBridge = true;
      bridge.isBroker = true;
      bridge.radius = 7;

      const left = negative[i % negative.length];
      const right = positive[i % positive.length];

      if (left && left !== bridge) {
        engine.getLinks().push({ source: bridge, target: left, type: 'bridge', weight: 1, active: true });
      }
      if (right && right !== bridge) {
        engine.getLinks().push({ source: bridge, target: right, type: 'bridge', weight: 1, active: true });
      }
    }

    engine.rebuildSimulation();
    updateLinkDisplay();
    updateStats();
  });

  const defaultInit = engine.init.bind(engine);
  engine.init = function init() {
    defaultInit();
    frame = 0;
    seedOpinions();
    return engine;
  };

  engine.init();
  return engine;
}
