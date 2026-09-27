import { createNetworkEngine } from '../lib/network-engine.js';

export function initProductivity(canvas, controls) {
  let scalable = false;
  const stats = document.getElementById('stats-productivity');
  const roleTarget = 6;

  const engine = createNetworkEngine(canvas, {
    nodeCount: 30,
    linkDistance: 40,
    chargeStrength: -50,
    onTick: () => {
      const ctx = canvas.getContext('2d');
      const links = engine.getLinks();
      const mobile = canvas.clientWidth <= 900;

      // The moving traces represent active work/information flow. Their count
      // is decorative; the quantitative claims are reported explicitly below.
      if (scalable) {
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
          ctx.strokeStyle = `rgba(79,156,247,${0.25 + Math.random() * 0.55})`;
          ctx.lineWidth = mobile ? 1.5 : 2.2;
          ctx.stroke();
        }
      }

      for (const node of engine.getNodes()) {
        if (node.hasSharedMemory) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 3, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(250,204,21,0.30)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        if (node.badInfo) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 6, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(239,68,68,0.38)';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        if (node.duplicateTask) {
          ctx.fillStyle = 'rgba(226,232,240,0.62)';
          ctx.font = '8px ui-monospace, monospace';
          ctx.textAlign = 'center';
          ctx.fillText('×2', node.x, node.y - node.radius - 7);
        }
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
    const roles = new Set(nodes.map((node) => node.role)).size;
    const memoryFraction = nodes.length ? nodes.filter((n) => n.hasSharedMemory).length / nodes.length : 0;
    const duplicateFraction = nodes.length ? nodes.filter((n) => n.duplicateTask).length / nodes.length : 0;
    const badInfoFraction = nodes.length ? nodes.filter((n) => n.badInfo).length / nodes.length : 0;
    const mismatchFraction = nodes.length ? nodes.filter((n) => !n.incentiveAligned).length / nodes.length : 0;

    stats.textContent =
      `Σcapacity ${capacity.toFixed(0)} · component ${Math.round(reachability * 100)}% · roles ${roles}/${roleTarget} · shared-memory carriers ${Math.round(memoryFraction * 100)}% · duplicate work ${Math.round(duplicateFraction * 100)}% · bad-info nodes ${Math.round(badInfoFraction * 100)}% · incentive mismatch ${Math.round(mismatchFraction * 100)}% · E/N ${load.toFixed(1)}`;
  }

  function clearGraph() {
    engine.getNodes().length = 0;
    engine.getLinks().length = 0;
  }

  function decorateNode(node, i, mode) {
    const scalableMode = mode === 'scalable';
    node.role = scalableMode ? i % roleTarget : i % 3;
    node.hasSharedMemory = scalableMode ? (i % 5 !== 0) : (i % 5 === 0);
    node.duplicateTask = scalableMode ? (i % 13 === 0) : (i % 4 === 0);

    // Keep these two failure modes present in both architectures so the
    // "scalable network" button does not pretend topology magically fixes them.
    node.badInfo = i % 11 === 0;
    node.incentiveAligned = i % 9 !== 0;

    if (node.badInfo) {
      node.signal = 0.55;
      node.signalType = 'noise';
    }
  }

  function setBaseline() {
    scalable = false;
    clearGraph();

    const nodes = engine.getNodes();
    const links = engine.getLinks();

    for (let i = 0; i < 30; i += 1) {
      const node = {
        id: i,
        state: 1,
        quality: 0.4,
        signal: 0,
        signalType: null,
        radius: 4.5,
        degree: 0,
        community: i % 3
      };
      decorateNode(node, i, 'baseline');
      nodes.push(node);
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
      const node = {
        id: i,
        state: 1,
        quality: 1,
        signal: 0.35,
        signalType: 'signal',
        radius: mobile ? 4 : 5.4,
        degree: 0,
        community: i % moduleCount
      };
      decorateNode(node, i, 'scalable');
      nodes.push(node);
    }

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
