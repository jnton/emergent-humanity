import { createNetworkEngine } from '../lib/network-engine.js';

export function initEmergentOrganism(canvas, controls) {
  const mobile = canvas.clientWidth <= 900;
  const nodeCount = mobile ? 60 : 90;
  const stats = document.getElementById('stats-emergent-organism');

  let criticalNodeId = null;
  let lastMessage = '';

  const engine = createNetworkEngine(canvas, {
    nodeCount,
    linkDistance: mobile ? 38 : 58,
    chargeStrength: mobile ? -46 : -82,
    onTick: () => {
      const ctx = canvas.getContext('2d');
      const critical = engine.getNodes().find((n) => n.id === criticalNodeId);
      if (critical) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(critical.x, critical.y, critical.radius + 7, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(250,204,21,0.9)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 5]);
        ctx.stroke();
        ctx.fillStyle = 'rgba(250,204,21,0.92)';
        ctx.font = '600 11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('critical role', critical.x, critical.y - critical.radius - 12);
        ctx.restore();
      }
      applyStructuralWeights();
    }
  });

  function endpointId(endpoint) {
    return typeof endpoint === 'object' ? endpoint.id : endpoint;
  }

  function degreeOf(node) {
    let degree = 0;
    for (const link of engine.getLinks()) {
      const a = endpointId(link.source);
      const b = endpointId(link.target);
      if (a === node.id || b === node.id) degree += 1;
    }
    return degree;
  }

  function adjacency(excludedId = null) {
    const nodes = engine.getNodes().filter((n) => n.id !== excludedId);
    const map = new Map(nodes.map((node) => [node.id, []]));
    for (const link of engine.getLinks()) {
      const a = endpointId(link.source);
      const b = endpointId(link.target);
      if (a === excludedId || b === excludedId || !map.has(a) || !map.has(b)) continue;
      map.get(a).push(b);
      map.get(b).push(a);
    }
    return map;
  }

  function largestComponentFraction(excludedId = null) {
    const graph = adjacency(excludedId);
    if (!graph.size) return 0;
    const visited = new Set();
    let largest = 0;
    for (const start of graph.keys()) {
      if (visited.has(start)) continue;
      const stack = [start];
      visited.add(start);
      let size = 0;
      while (stack.length) {
        const cur = stack.pop();
        size += 1;
        for (const next of graph.get(cur) ?? []) {
          if (!visited.has(next)) {
            visited.add(next);
            stack.push(next);
          }
        }
      }
      largest = Math.max(largest, size);
    }
    return largest / graph.size;
  }

  function globalEfficiency(excludedId = null) {
    const graph = adjacency(excludedId);
    const ids = [...graph.keys()];
    if (ids.length < 2) return 0;
    let sum = 0;
    let pairs = 0;

    for (let i = 0; i < ids.length; i += 1) {
      const start = ids[i];
      const queue = [start];
      const dist = new Map([[start, 0]]);
      while (queue.length) {
        const cur = queue.shift();
        for (const next of graph.get(cur) ?? []) {
          if (dist.has(next)) continue;
          dist.set(next, dist.get(cur) + 1);
          queue.push(next);
        }
      }
      for (let j = i + 1; j < ids.length; j += 1) {
        const d = dist.get(ids[j]);
        sum += d === undefined ? 0 : 1 / d;
        pairs += 1;
      }
    }
    return pairs ? sum / pairs : 0;
  }

  function taskCoverage(excludedId = null) {
    // Four common functions are redundant; a developed critical node can add
    // one unique function. The metric deliberately makes the chosen observable explicit.
    const uniquePresent = criticalNodeId !== null
      && criticalNodeId !== excludedId
      && engine.getNodes().some((n) => n.id === criticalNodeId);
    return uniquePresent ? 1 : 0.8;
  }

  function applyStructuralWeights() {
    const nodes = engine.getNodes();
    if (!nodes.length) return;
    const show = Boolean(controls['show-centrality']?.checked);
    const degrees = nodes.map(degreeOf);
    const maxDegree = Math.max(1, ...degrees);
    nodes.forEach((node, i) => {
      const base = mobile ? 4 : 4.8;
      node.radius = node.id === criticalNodeId
        ? base + 5
        : show
          ? base + (degrees[i] / maxDegree) * (mobile ? 4 : 7)
          : base;
    });
  }

  function updateStats(message = lastMessage) {
    if (!stats) return;
    const giant = largestComponentFraction();
    const eff = globalEfficiency();
    const coverage = taskCoverage();
    stats.textContent = `${engine.getNodes().length} nodes · giant component ${Math.round(giant * 100)}% · efficiency ${eff.toFixed(3)} · task coverage ${Math.round(coverage * 100)}%${message ? ' · ' + message : ''}`;
  }

  function removeNode(node, label) {
    if (!node) return;
    const beforeEff = globalEfficiency();
    const beforeGiant = largestComponentFraction();
    const beforeCoverage = taskCoverage();

    const removedId = node.id;
    engine.removeNode(node);
    if (removedId === criticalNodeId) criticalNodeId = null;

    const afterEff = globalEfficiency();
    const afterGiant = largestComponentFraction();
    const afterCoverage = taskCoverage();

    const dEff = beforeEff - afterEff;
    const dGiant = beforeGiant - afterGiant;
    const dCoverage = beforeCoverage - afterCoverage;
    lastMessage = `${label}: Δeff ${dEff >= 0 ? '−' : '+'}${Math.abs(dEff).toFixed(3)}, Δcomponent ${dGiant >= 0 ? '−' : '+'}${Math.abs(dGiant * 100).toFixed(0)}pp, Δtask ${dCoverage >= 0 ? '−' : '+'}${Math.abs(dCoverage * 100).toFixed(0)}pp`;
    applyStructuralWeights();
    updateStats();
    canvas.__EMERGENT_NETWORK_VIEWPORT__?.refresh();
  }

  function ordinaryNode() {
    const ranked = engine.getNodes()
      .filter((n) => n.id !== criticalNodeId)
      .map((node) => ({ node, degree: degreeOf(node) }))
      .sort((a, b) => a.degree - b.degree);
    const pool = ranked.slice(0, Math.max(1, Math.floor(ranked.length * 0.6)));
    return pool[Math.floor(Math.random() * pool.length)]?.node;
  }

  function criticalNode() {
    const explicit = engine.getNodes().find((n) => n.id === criticalNodeId);
    if (explicit) return explicit;
    return [...engine.getNodes()].sort((a, b) => degreeOf(b) - degreeOf(a))[0];
  }

  function developCriticalRole() {
    if (criticalNodeId !== null) return;
    const candidate = ordinaryNode();
    if (!candidate) return;
    criticalNodeId = candidate.id;

    // Add cross-network links so an initially ordinary node becomes a bridge/hub.
    const others = engine.getNodes()
      .filter((n) => n.id !== candidate.id)
      .sort((a, b) => degreeOf(b) - degreeOf(a));
    const targets = [];
    for (const node of others) {
      if (targets.length >= 8) break;
      const exists = engine.getLinks().some((link) => {
        const a = endpointId(link.source);
        const b = endpointId(link.target);
        return (a === candidate.id && b === node.id) || (b === candidate.id && a === node.id);
      });
      if (!exists) targets.push(node);
    }

    for (const target of targets) {
      engine.getLinks().push({
        source: candidate,
        target,
        type: 'bridge',
        weight: 1,
        active: true
      });
    }

    candidate.signal = 1;
    candidate.signalType = 'signal';
    engine.rebuildSimulation();
    lastMessage = 'one previously ordinary node acquired bridge links + one unique task';
    applyStructuralWeights();
    updateStats();
  }

  controls['show-centrality']?.addEventListener('change', () => {
    applyStructuralWeights();
    updateStats();
  });
  controls['remove-node']?.addEventListener('click', () => removeNode(ordinaryNode(), 'ordinary removal'));
  controls['develop-node']?.addEventListener('click', developCriticalRole);
  controls['remove-hub']?.addEventListener('click', () => removeNode(criticalNode(), 'critical removal'));
  controls['reset-network']?.addEventListener('click', () => {
    criticalNodeId = null;
    lastMessage = '';
    engine.reset(nodeCount);
    engine.getSimulation().force('charge').strength(mobile ? -46 : -82);
    engine.getSimulation().force('link').distance(mobile ? 38 : 58);
    applyStructuralWeights();
    updateStats();
    canvas.__EMERGENT_NETWORK_VIEWPORT__?.refresh();
  });

  const defaultInit = engine.init.bind(engine);
  engine.init = function init() {
    defaultInit();
    criticalNodeId = null;
    lastMessage = '';
    applyStructuralWeights();
    updateStats();
    return engine;
  };

  engine.init();
  return engine;
}
