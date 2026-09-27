import { createNetworkEngine } from '../lib/network-engine.js';

export function initProductivity(canvas, controls) {
  let optimized = false;

  const engine = createNetworkEngine(canvas, {
    nodeCount: 50,
    linkDistance: 40,
    chargeStrength: -50,
    onTick: () => {
      if (!optimized) return;

      const ctx = canvas.getContext('2d');
      const links = engine.getLinks();
      const nodes = engine.getNodes();
      const mobile = canvas.clientWidth <= 900;

      // Randomly draw knowledge sparks traveling along links.
      links.forEach((link) => {
        if (Math.random() <= 0.96) return;
        const source = typeof link.source === 'object' ? link.source : nodes[link.source];
        const target = typeof link.target === 'object' ? link.target : nodes[link.target];
        if (!source || !target) return;

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = `rgba(79, 156, 247, ${Math.random()})`;
        ctx.lineWidth = mobile ? 2 : 3;
        ctx.stroke();

        source.signal = 1;
        target.signal = 1;
      });
    },
  });

  const defaultInit = engine.init.bind(engine);
  engine.init = function() {
    defaultInit();

    const nodes = engine.getNodes();
    const links = engine.getLinks();

    function setBaseline() {
      optimized = false;
      nodes.length = 0;
      links.length = 0;

      for (let index = 0; index < 30; index += 1) {
        nodes.push({
          id: index,
          state: 1,
          quality: 0.4,
          signal: 0,
          signalType: null,
          radius: 4,
          degree: 0,
        });
      }

      for (let index = 0; index < 30; index += 1) {
        const targetIndex = Math.floor(Math.random() * 30);
        if (index === targetIndex) continue;
        links.push({
          source: index,
          target: targetIndex,
          type: 'default',
          weight: 0.5,
          active: true,
          phase: Math.random() * Math.PI * 2,
        });
        nodes[index].degree += 1;
        nodes[targetIndex].degree += 1;
      }

      engine.rebuildSimulation();
      const simulation = engine.getSimulation();
      simulation.force('charge').strength(-50);
      simulation.force('link').distance(40);
      simulation.alphaTarget(0).alpha(1).restart();
      canvas.__EMERGENT_NETWORK_VIEWPORT__?.refresh();
    }

    function setOptimized() {
      if (optimized) return;
      optimized = true;

      const mobile = canvas.clientWidth <= 900;
      const targetNodeCount = mobile ? 105 : 200;
      const edgesPerNode = mobile ? 2 : 3;
      const nodeRadius = mobile ? 4.2 : 6;

      for (let index = nodes.length; index < targetNodeCount; index += 1) {
        nodes.push({
          id: index,
          state: 1,
          quality: 1,
          signal: 1,
          signalType: 'signal',
          radius: nodeRadius,
          degree: 0,
          x: canvas.clientWidth / 2 + (Math.random() - 0.5) * 20,
          y: canvas.clientHeight * 0.58 + (Math.random() - 0.5) * 20,
        });
      }

      for (let index = 0; index < targetNodeCount; index += 1) {
        for (let edge = 0; edge < edgesPerNode; edge += 1) {
          const targetIndex = Math.floor(Math.random() * targetNodeCount);
          if (index === targetIndex) continue;
          links.push({
            source: nodes[index],
            target: nodes[targetIndex],
            type: 'strong',
            weight: mobile ? 0.65 : 1,
            active: true,
            phase: Math.random() * Math.PI * 2,
          });
          nodes[index].degree += 1;
          nodes[targetIndex].degree += 1;
        }
        nodes[index].quality = 1;
        nodes[index].radius = nodeRadius;
      }

      engine.rebuildSimulation();
      const simulation = engine.getSimulation();
      simulation.force('charge').strength(mobile ? -18 : -30);
      simulation.force('link').distance(mobile ? 18 : 20);
      simulation.alphaTarget(mobile ? 0.08 : 0.3).alpha(1).restart();
      canvas.__EMERGENT_NETWORK_VIEWPORT__?.refresh();
    }

    setBaseline();

    controls['optimize-all']?.addEventListener('click', setOptimized);
    controls['reset-productivity']?.addEventListener('click', setBaseline);
  };

  engine.init();
  return engine;
}
