import { createNetworkEngine } from '../lib/network-engine.js';

export function initNodeQuantity(canvas, controls) {
  const stats = document.getElementById('stats-node-quantity');

  const engine = createNetworkEngine(canvas, {
    nodeCount: 30,
    linkDistance: 50,
    chargeStrength: -100,
  });

  function updateStats() {
    if (!stats) return;
    const n = engine.getNodes().length;
    const e = engine.getLinks().length;
    const complete = n * (n - 1) / 2;
    const edgeLoad = n > 0 ? e / n : 0;
    stats.textContent = `${n} nodes · ${e} active edges · E/N ${edgeLoad.toFixed(1)} · complete graph would need ${Math.round(complete).toLocaleString()} edges`;
  }

  function nextNodeId() {
    const ids = engine.getNodes().map((node) => Number(node.id)).filter(Number.isFinite);
    return ids.length ? Math.max(...ids) + 1 : 0;
  }

  function applyPopulationScale(value) {
    const mobile = canvas.clientWidth <= 900;
    const maximumNodes = mobile ? 110 : 200;
    const targetNodes = Math.max(12, Math.floor(value * maximumNodes));

    const nodes = engine.getNodes();
    const links = engine.getLinks();

    if (targetNodes > nodes.length) {
      const diff = targetNodes - nodes.length;
      let id = nextNodeId();

      for (let index = 0; index < diff; index += 1) {
        const newNode = {
          id: id++,
          state: 1,
          quality: 1,
          signal: 0,
          radius: mobile ? 4 : 5,
          community: 0,
          degree: 0,
          x: canvas.clientWidth / 2 + (Math.random() - 0.5) * 80,
          y: canvas.clientHeight * 0.58 + (Math.random() - 0.5) * 80,
        };
        nodes.push(newNode);

        if (nodes.length > 1) {
          const numEdges = 1 + Math.floor(Math.random() * 2);
          for (let edge = 0; edge < numEdges; edge += 1) {
            const target = nodes[Math.floor(Math.random() * (nodes.length - 1))];
            links.push({
              source: newNode,
              target,
              type: 'default',
              weight: 1,
              active: true
            });
          }
        }
      }
    } else if (targetNodes < nodes.length) {
      const removed = nodes.splice(targetNodes);
      const removedIds = new Set(removed.map((node) => node.id));

      for (let index = links.length - 1; index >= 0; index -= 1) {
        const sourceId = typeof links[index].source === 'object' ? links[index].source.id : links[index].source;
        const targetId = typeof links[index].target === 'object' ? links[index].target.id : links[index].target;
        if (removedIds.has(sourceId) || removedIds.has(targetId)) links.splice(index, 1);
      }
    }

    engine.rebuildSimulation();
    const simulation = engine.getSimulation();
    simulation.force('charge').strength(mobile ? (-38 + value * 16) : (-100 + value * 50));
    simulation.force('link').distance(mobile ? 24 : 50);
    simulation.alpha(0.55).restart();

    updateStats();
    canvas.__EMERGENT_NETWORK_VIEWPORT__?.refresh();
  }

  controls['population-slider']?.addEventListener('input', (event) => {
    applyPopulationScale(Number.parseFloat(event.target.value));
  });

  const defaultInit = engine.init.bind(engine);
  engine.init = function init() {
    defaultInit();
    applyPopulationScale(Number.parseFloat(controls['population-slider']?.value ?? '0.3'));
    updateStats();
    return engine;
  };

  engine.init();
  return engine;
}
