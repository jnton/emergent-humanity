import { createNetworkEngine } from '../lib/network-engine.js';

export function initConnectionQuantity(canvas, controls) {
  let deployInterval = null;
  const stats = document.getElementById('stats-connection-quantity');
  const processingBudget = 8;

  const engine = createNetworkEngine(canvas, {
    nodeCount: 60,
    linkDistance: 50,
    chargeStrength: -80,
  });

  function endpointId(endpoint) {
    return typeof endpoint === 'object' ? endpoint.id : endpoint;
  }

  function linkExists(a, b) {
    return engine.getLinks().some((link) => {
      const sourceId = endpointId(link.source);
      const targetId = endpointId(link.target);
      return (sourceId === a && targetId === b) || (sourceId === b && targetId === a);
    });
  }

  function degreeMap() {
    const degree = new Map(engine.getNodes().map((n) => [n.id, 0]));
    for (const link of engine.getLinks()) {
      const a = endpointId(link.source);
      const b = endpointId(link.target);
      degree.set(a, (degree.get(a) ?? 0) + 1);
      degree.set(b, (degree.get(b) ?? 0) + 1);
    }
    return degree;
  }

  function applyBudgetEncoding() {
    const degrees = degreeMap();
    for (const node of engine.getNodes()) {
      const overloaded = (degrees.get(node.id) ?? 0) > processingBudget;
      node.signal = overloaded ? 0.75 : 0;
      node.signalType = overloaded ? 'noise' : null;
      node.radius = overloaded ? 6.3 : 5;
    }
  }

  function buildLocalNetwork() {
    const nodes = engine.getNodes();
    const links = engine.getLinks();
    nodes.length = 0;
    links.length = 0;

    for (let i = 0; i < 60; i += 1) {
      nodes.push({
        id: i, state: 1, quality: 1, signal: 0, signalType: null,
        radius: 5, community: Math.floor(i / 10), degree: 0,
        x: canvas.clientWidth / 2 + (Math.random() - 0.5) * 180,
        y: canvas.clientHeight / 2 + (Math.random() - 0.5) * 180
      });
    }

    for (let i = 0; i < 60; i += 1) {
      for (let j = i + 1; j < 60; j += 1) {
        if (nodes[i].community === nodes[j].community && Math.random() < 0.3) {
          links.push({ source: nodes[i], target: nodes[j], type: 'strong', weight: 0.75, active: true });
        }
      }
    }

    for (let community = 0; community < 6; community += 1) {
      const a = nodes[community * 10];
      const b = nodes[((community + 1) % 6) * 10];
      links.push({ source: a, target: b, type: 'weak', weight: 0.25, active: true });
    }

    engine.rebuildSimulation();
    applyBudgetEncoding();
    updateStats();
  }

  function adjacency() {
    const map = new Map(engine.getNodes().map((node) => [node.id, []]));
    for (const link of engine.getLinks()) {
      const a = endpointId(link.source);
      const b = endpointId(link.target);
      map.get(a)?.push(b);
      map.get(b)?.push(a);
    }
    return map;
  }

  function meanShortestPath() {
    const graph = adjacency();
    const ids = [...graph.keys()];
    if (ids.length < 2) return { mean: 0, reachableFraction: 1 };

    let distanceSum = 0;
    let reachablePairs = 0;
    const totalPairs = ids.length * (ids.length - 1) / 2;

    for (let index = 0; index < ids.length; index += 1) {
      const start = ids[index];
      const queue = [start];
      const distances = new Map([[start, 0]]);
      while (queue.length) {
        const current = queue.shift();
        for (const next of graph.get(current) ?? []) {
          if (distances.has(next)) continue;
          distances.set(next, distances.get(current) + 1);
          queue.push(next);
        }
      }
      for (let j = index + 1; j < ids.length; j += 1) {
        const distance = distances.get(ids[j]);
        if (distance === undefined) continue;
        distanceSum += distance;
        reachablePairs += 1;
      }
    }

    return {
      mean: reachablePairs ? distanceSum / reachablePairs : Infinity,
      reachableFraction: totalPairs ? reachablePairs / totalPairs : 1
    };
  }

  function budgetMetrics() {
    const degrees = degreeMap();
    const degreeValues = [...degrees.values()];
    const directedDemand = degreeValues.reduce((sum, d) => sum + d, 0);
    const directedUsable = degreeValues.reduce((sum, d) => sum + Math.min(d, processingBudget), 0);
    const saturated = degreeValues.filter((d) => d > processingBudget).length;
    return {
      usableFraction: directedDemand ? directedUsable / directedDemand : 1,
      saturatedFraction: degreeValues.length ? saturated / degreeValues.length : 0,
      meanDegree: degreeValues.length ? directedDemand / degreeValues.length : 0
    };
  }

  function updateStats() {
    if (!stats) return;
    const paths = meanShortestPath();
    const budget = budgetMetrics();
    const meanText = Number.isFinite(paths.mean) ? paths.mean.toFixed(2) : '∞';
    stats.textContent = `${engine.getLinks().length} edges · mean path ${meanText} hops · reachable ${Math.round(paths.reachableFraction * 100)}% · mean degree ${budget.meanDegree.toFixed(1)} · usable under b=${processingBudget}: ${Math.round(budget.usableFraction * 100)}% · saturated nodes ${Math.round(budget.saturatedFraction * 100)}%`;
  }

  function addLongRangeLinks() {
    if (deployInterval) clearInterval(deployInterval);
    const nodes = engine.getNodes();
    let added = 0;
    const target = 150;

    deployInterval = setInterval(() => {
      let batch = 0;
      let attempts = 0;
      while (batch < 5 && added < target && attempts < 100) {
        attempts += 1;
        const a = nodes[Math.floor(Math.random() * nodes.length)];
        const b = nodes[Math.floor(Math.random() * nodes.length)];
        if (a === b || a.community === b.community || linkExists(a.id, b.id)) continue;

        engine.getLinks().push({
          source: a, target: b, type: 'bridge', weight: 0.55, active: true
        });
        added += 1;
        batch += 1;
      }

      engine.rebuildSimulation();
      applyBudgetEncoding();
      updateStats();

      if (added >= target) {
        clearInterval(deployInterval);
        deployInterval = null;
      }
    }, 90);
  }

  controls['deploy-internet']?.addEventListener('click', addLongRangeLinks);
  controls['reset-connections']?.addEventListener('click', () => {
    if (deployInterval) clearInterval(deployInterval);
    deployInterval = null;
    buildLocalNetwork();
  });

  const defaultInit = engine.init.bind(engine);
  engine.init = function init() {
    defaultInit();
    if (deployInterval) clearInterval(deployInterval);
    deployInterval = null;
    buildLocalNetwork();
    return engine;
  };

  engine.init();
  return engine;
}
