import { createNetworkEngine } from '../lib/network-engine.js';

export function initCohesion(canvas, controls) {
  let polarization = 0;
  let bridgesActive = false;

  const engine = createNetworkEngine(canvas, {
    nodeCount: 80,
    linkDistance: 40,
    chargeStrength: -60,
  });

  const defaultInit = engine.init.bind(engine);
  engine.init = function() {
    defaultInit();

    const nodes = engine.getNodes();
    const links = engine.getLinks();

    // Assign communities.
    nodes.forEach((node, index) => {
      node.community = index % 2;
      node.isBridge = false;
      node.isBroker = false;
    });

    function updateNetwork() {
      // Link types and bridge additions require the link force to be reinitialized.
      // Rebuild first, then configure and restart only the new current simulation.
      // Restarting the pre-rebuild simulation caused two physics engines to mutate
      // the same nodes concurrently and could drive every coordinate off-canvas.
      engine.rebuildSimulation();
      const simulation = engine.getSimulation();

      simulation.force('x', d3.forceX((node) => {
        if (node.isBridge || polarization === 0) return canvas.clientWidth / 2;
        return node.community === 0 ? canvas.clientWidth * 0.3 : canvas.clientWidth * 0.7;
      }).strength(polarization * 0.2));

      simulation.force('y', d3.forceY(canvas.clientHeight / 2).strength(0.1));
      simulation.alpha(1).restart();
    }

    function updateLinkTypes() {
      links.forEach((link) => {
        const source = typeof link.source === 'object' ? link.source : nodes[link.source];
        const target = typeof link.target === 'object' ? link.target : nodes[link.target];
        if (!source || !target || source.community === target.community) return;

        const touchesBridge = source.isBridge || target.isBridge;
        if (bridgesActive && touchesBridge) {
          link.weight = 1;
          link.type = 'strong';
        } else {
          link.weight = Math.max(0.01, 1 - polarization);
          link.type = polarization > 0.5 ? 'weak' : 'default';
        }
      });
    }

    if (controls['polarize-slider']) {
      controls['polarize-slider'].addEventListener('input', (event) => {
        polarization = Number.parseFloat(event.target.value);
        bridgesActive = false;
        nodes.forEach((node) => {
          node.isBridge = false;
          node.isBroker = false;
          if (node.community === 2) node.community = node.id % 2;
          node.radius = Math.min(node.radius, 7);
        });
        updateLinkTypes();
        updateNetwork();
      });
    }

    if (controls['deploy-bridges']) {
      controls['deploy-bridges'].addEventListener('click', () => {
        if (polarization === 0 || bridgesActive) return;
        bridgesActive = true;

        const candidates = [...nodes].sort(() => Math.random() - 0.5).slice(0, 5);
        for (const node of candidates) {
          node.isBridge = true;
          node.isBroker = true;
          node.community = 2;
          node.radius = 7;

          const side0 = nodes.find((candidate) => candidate.community === 0);
          const side1 = nodes.find((candidate) => candidate.community === 1);
          if (side0) links.push({ source: node, target: side0, type: 'strong', weight: 1, active: true });
          if (side1) links.push({ source: node, target: side1, type: 'strong', weight: 1, active: true });
        }

        updateLinkTypes();
        updateNetwork();
      });
    }

    updateLinkTypes();
    updateNetwork();
  };

  engine.init();
  return engine;
}
