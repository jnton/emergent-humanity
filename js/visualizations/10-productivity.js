import { createNetworkEngine } from '../lib/network-engine.js';

export function initProductivity(canvas, controls) {
  let scalable = false;
  const stats = document.getElementById('stats-productivity');

  const engine = createNetworkEngine(canvas, {
    nodeCount: 30,
    linkDistance: 40,
    chargeStrength: -50,
    onTick: () => {
      if (!scalable) return;

      const ctx = canvas.getContext('2d');
      const links = engine.getLinks();
      const mobile = canvas.clientWidth <= 900;

      // Decorative flow: the quantitative claims are in the explicit metrics,
      // not in the number of sparks.
      for (const link of links) {
        if (Math.random() < 0.975) continue;
        const source = typeof link.source === 'object'
          ? link.source
          : engine.getNodes().find((node) => node.id === link.source);
        const target = typeof link.target === 'object'
          ? link.target
          : engine.getNodes().find((node) => node.id === link.target);
        if (!source || !target) continue;

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = `rgba(79, 156, 247, ${0.25 + Math.random() * 0.55})`;
        ctx.lineWidth = mobile ? 1.5 : 2.2;
        ctx.stroke();
      }
    },
  });

  function endpointId(endpoint) {
    return typeof endpoint === 'object' ? endpoint.id : endpoint;
  }

  function largestComponentFraction() {
    const nodes = engine.getNodes();
    if (nodes.length === 0) return 0;

    const adjacency = new Map(nodes.map((node) => [node.id, []]));
    for (const link of engine.getLinks()) {
      const sourceId = endpointId(link.source);
      const targetId = endpointId(link.target);
      adjacency.get(sourceId)?.push(targetId);
      adjacency.get(targetId)?.push(sourceId);
    }

    const visited = new Set();
    let largest = 0;

    for (const start of adjacency.keys()) {
      if (visited.has(start)) continue;
      const stack = [start];
      visited.add(start);
      let size = 0;

      while (stack.length) {
        const current = stack.pop();
        size += 1;
        for (const next of adjacency.get(current) ?? []) {
          if (visited.has(next)) continue;
          visited.add(next);
          stack.push(next);
        }
      }

      largest = Math.max(largest, size);
    }

    return largest / nodes.length;
  }

  function updateStats() {
    if (!stats) return;

    const nodes = engine.getNodes();
    const edges = engine.getLinks().length;
    const capacity = nodes.reduce((sum, node) => sum + (node.quality ?? 0), 0);
    const reachability = largestComponentFraction();
    const load = nodes.length ? edges / nodes.length : 0;

    stats.textContent = `capacity proxy Σq ${capacity.toFixed(0)} · largest component ${Math.round(reachability * 100)}% · coordination load E/N ${load.toFixed(1)}`;
  }

  function clearGraph() {
    engine.getNodes().length = 0;
    engine.getLinks().length = 0;
  }

  function setBaseline() {
    scalable = false;
    clearGraph();

    const nodes = engine.getNodes();
    const links = engine.getLinks();

    for (let i = 0; i < 30; i += 1) {
      nodes.push({
        id: i,
        state: 1,
        quality: 0.4,
        signal: 0,
        signalType: null,
        radius: 4.5,
        degree: 0,
        community: i % 3
      });
    }

    for (let i = 0; i < 30; i += 1) {
      const target = Math.floor(Math.random() * 30);
      if (target === i) continue;
      links.push({
        source: nodes[i],
        target: nodes[target],
        type: 'default',
        weight: 0.5,
        active: true
      });
    }

    engine.rebuildSimulation();
    const simulation = engine.getSimulation();
    simulation.force('charge').strength(-50);
    simulation.force('link').distance(40);
    simulation.alphaTarget(0).alpha(1).restart();

    updateStats();
    canvas.__EMERGENT_NETWORK_VIEWPORT__?.refresh();
  }

  function setScalable() {
    scalable = true;
    clearGraph();

    const mobile = canvas.clientWidth <= 900;
    const nodeCount = mobile ? 105 : 180;
    const moduleCount = 6;
    const nodes = engine.getNodes();
    const links = engine.getLinks();

    for (let i = 0; i < nodeCount; i += 1) {
      nodes.push({
        id: i,
        state: 1,
        quality: 1,
        signal: 0.35,
        signalType: 'signal',
        radius: mobile ? 4 : 5.4,
        degree: 0,
        community: i % moduleCount
      });
    }

    // Sparse modular structure: most communication stays local, with a small
    // number of inter-module bridges. This is a toy scalable architecture,
    // not a claim that one topology is globally optimal.
    for (let i = 0; i < nodeCount; i += 1) {
      const sameModule = nodes.filter(
        (node) => node.community === nodes[i].community && node.id !== i
      );

      for (let edge = 0; edge < 2; edge += 1) {
        const target = sameModule[Math.floor(Math.random() * sameModule.length)];
        if (!target) continue;
        links.push({
          source: nodes[i],
          target,
          type: 'strong',
          weight: 0.8,
          active: true
        });
      }

      if (i % Math.max(3, Math.floor(nodeCount / 24)) === 0) {
        const candidates = nodes.filter((node) => node.community !== nodes[i].community);
        const target = candidates[Math.floor(Math.random() * candidates.length)];
        if (target) {
          links.push({
            source: nodes[i],
            target,
            type: 'bridge',
            weight: 0.65,
            active: true
          });
        }
      }
    }

    // Guarantee that every module is connected to the next.
    for (let module = 0; module < moduleCount; module += 1) {
      const source = nodes.find((node) => node.community === module);
      const target = nodes.find((node) => node.community === (module + 1) % moduleCount);
      if (source && target) {
        links.push({
          source,
          target,
          type: 'bridge',
          weight: 1,
          active: true
        });
      }
    }

    engine.rebuildSimulation();
    const simulation = engine.getSimulation();
    simulation.force('charge').strength(mobile ? -18 : -28);
    simulation.force('link').distance(mobile ? 18 : 24);
    simulation.alphaTarget(mobile ? 0.05 : 0.12).alpha(1).restart();

    updateStats();
    canvas.__EMERGENT_NETWORK_VIEWPORT__?.refresh();
  }

  controls['optimize-all']?.addEventListener('click', setScalable);
  controls['reset-productivity']?.addEventListener('click', setBaseline);

  const defaultInit = engine.init.bind(engine);
  engine.init = function init() {
    defaultInit();
    setBaseline();
    return engine;
  };

  engine.init();
  return engine;
}
