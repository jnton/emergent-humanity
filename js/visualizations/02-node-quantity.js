import { createNetworkEngine } from '../lib/network-engine.js';

export function initNodeQuantity(canvas, controls) {
  const engine = createNetworkEngine(canvas, {
    nodeCount: 30, // Start small
    linkDistance: 50,
    chargeStrength: -100,
  });

  const defaultInit = engine.init.bind(engine);
  engine.init = function() {
    defaultInit();

    // Sync network with current slider value after reset
    if (controls['population-slider']) {
      controls['population-slider'].dispatchEvent(new Event('input'));
    }
  };

  if (controls['population-slider']) {
    controls['population-slider'].addEventListener('input', (event) => {
      const value = Number.parseFloat(event.target.value); // 0.1 to 1.0
      const mobile = canvas.clientWidth <= 900;

      const label = event.target.parentElement?.querySelector('.slider-value');
      if (label) label.textContent = `${Math.round(value * 100)}%`;

      // Preserve the meaning of a dramatic population increase without drawing
      // 200 overlapping touch-sized nodes into a phone-width rectangle.
      const maximumNodes = mobile ? 110 : 200;
      const targetNodes = Math.max(12, Math.floor(value * maximumNodes));

      const nodes = engine.getNodes();
      const links = engine.getLinks();

      if (targetNodes > nodes.length) {
        const diff = targetNodes - nodes.length;
        for (let index = 0; index < diff; index += 1) {
          const newNode = {
            id: Date.now() + index,
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
              links.push({ source: newNode.id, target: target.id, type: 'default', weight: 1, active: true });
              newNode.degree += 1;
              target.degree += 1;
            }
          }
        }
      } else if (targetNodes < nodes.length) {
        const diff = nodes.length - targetNodes;
        nodes.splice(-diff, diff);
        const validIds = new Set(nodes.map((node) => node.id));
        for (let index = links.length - 1; index >= 0; index -= 1) {
          const sourceId = typeof links[index].source === 'object' ? links[index].source.id : links[index].source;
          const targetId = typeof links[index].target === 'object' ? links[index].target.id : links[index].target;
          if (!validIds.has(sourceId) || !validIds.has(targetId)) links.splice(index, 1);
        }
      }

      const simulation = engine.getSimulation();
      simulation.force('charge').strength(mobile ? (-38 + value * 16) : (-100 + value * 50));
      simulation.force('link').distance(mobile ? 24 : 50);
      simulation.nodes(nodes);
      simulation.force('link').links(links);
      simulation.alpha(0.55).restart();
      canvas.__EMERGENT_NETWORK_VIEWPORT__?.refresh();
    });
  }

  engine.init();
  return engine;
}
