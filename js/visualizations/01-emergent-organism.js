import { createNetworkEngine } from '../lib/network-engine.js';

export function initEmergentOrganism(canvas, controls) {
  let rippleRadius = 0;
  let rippleCenter = null;
  const mobile = canvas.clientWidth <= 900;
  const nodeCount = mobile ? 60 : 80;
  const stats = document.getElementById('stats-emergent-organism');

  const engine = createNetworkEngine(canvas, {
    nodeCount,
    linkDistance: mobile ? 36 : 60,
    chargeStrength: mobile ? -44 : -80,
    onTick: () => {
      const nodes = engine.getNodes();

      for (const node of nodes) {
        if (node.signal > 0) {
          node.signal = Math.max(0, node.signal - 0.02);
          if (node.signal === 0) node.signalType = null;
        }
      }

      applyStructuralWeights();

      if (rippleCenter) {
        const ctx = canvas.getContext('2d');
        const maximumRipple = mobile ? 110 : 150;
        ctx.beginPath();
        ctx.arc(rippleCenter.x, rippleCenter.y, rippleRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(239, 68, 68, ${Math.max(0, 1 - rippleRadius / maximumRipple)})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        rippleRadius += mobile ? 3 : 4;
        if (rippleRadius > maximumRipple) rippleCenter = null;
      }
    }
  });

  function endpointId(endpoint) {
    return typeof endpoint === 'object' ? endpoint.id : endpoint;
  }

  function degreeOf(node) {
    let degree = 0;
    for (const link of engine.getLinks()) {
      if (endpointId(link.source) === node.id || endpointId(link.target) === node.id) degree += 1;
    }
    return degree;
  }

  function applyStructuralWeights() {
    const nodes = engine.getNodes();
    if (nodes.length === 0) return;

    const show = Boolean(controls['show-centrality']?.checked);
    const degrees = nodes.map(degreeOf);
    const maxDegree = Math.max(1, ...degrees);

    nodes.forEach((node, index) => {
      node.radius = show
        ? (mobile ? 3.8 : 4.5) + (degrees[index] / maxDegree) * (mobile ? 5 : 8)
        : (mobile ? 4.2 : 5);
    });
  }

  function largestComponentFraction() {
    const adj = engine.getAdjacency();
    if (adj.size === 0) return 0;

    const visited = new Set();
    let largest = 0;

    for (const start of adj.keys()) {
      if (visited.has(start)) continue;
      let size = 0;
      const stack = [start];
      visited.add(start);

      while (stack.length) {
        const current = stack.pop();
        size += 1;
        for (const neighbor of adj.get(current) ?? []) {
          if (!visited.has(neighbor.id)) {
            visited.add(neighbor.id);
            stack.push(neighbor.id);
          }
        }
      }

      largest = Math.max(largest, size);
    }

    return largest / adj.size;
  }

  function updateStats(lastRemoval = '') {
    if (!stats) return;
    const nodes = engine.getNodes();
    const maxDegree = nodes.length ? Math.max(...nodes.map(degreeOf)) : 0;
    const giant = Math.round(largestComponentFraction() * 100);
    stats.textContent = `${nodes.length} nodes · largest component ${giant}% · max degree ${maxDegree}${lastRemoval ? ` · ${lastRemoval}` : ''}`;
  }

  function removeByRole(role) {
    const nodes = engine.getNodes();
    if (nodes.length < 2) return;

    const ranked = nodes
      .map((node) => ({ node, degree: degreeOf(node) }))
      .sort((a, b) => a.degree - b.degree);

    let selected;
    if (role === 'hub') {
      selected = ranked[ranked.length - 1];
    } else {
      const upper = Math.max(1, Math.floor(ranked.length * 0.5));
      selected = ranked[Math.floor(Math.random() * upper)];
    }

    const { node, degree } = selected;
    rippleCenter = { x: node.x, y: node.y };
    rippleRadius = 0;

    const affectedIds = engine.removeNode(node);
    for (const id of affectedIds) {
      const affected = engine.getNodes().find((candidate) => candidate.id === id);
      if (affected) {
        affected.signal = 1;
        affected.signalType = 'noise';
      }
    }

    applyStructuralWeights();
    updateStats(`${role === 'hub' ? 'hub' : 'ordinary'} degree ${degree} removed`);
    canvas.__EMERGENT_NETWORK_VIEWPORT__?.refresh();
  }

  controls['show-centrality']?.addEventListener('change', () => {
    applyStructuralWeights();
    updateStats();
  });

  controls['remove-node']?.addEventListener('click', () => removeByRole('ordinary'));
  controls['remove-hub']?.addEventListener('click', () => removeByRole('hub'));

  controls['reset-network']?.addEventListener('click', () => {
    engine.reset(nodeCount);
    const simulation = engine.getSimulation();
    simulation.force('charge').strength(mobile ? -44 : -80);
    simulation.force('link').distance(mobile ? 36 : 60);
    applyStructuralWeights();
    updateStats();
    canvas.__EMERGENT_NETWORK_VIEWPORT__?.refresh();
  });

  const defaultInit = engine.init.bind(engine);
  engine.init = function init() {
    defaultInit();
    applyStructuralWeights();
    updateStats();
    canvas.__EMERGENT_NETWORK_VIEWPORT__?.refresh();
    return engine;
  };

  engine.init();
  return engine;
}
