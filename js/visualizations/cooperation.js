import { createNetworkEngine } from '../lib/network-engine.js';

export function initCooperation(canvas, controls) {
  const engine = createNetworkEngine(canvas, {
    nodeCount: 60,
    linkDistance: 35,
    chargeStrength: -40,
  });

  let gameInterval = null;

  engine.init = function() {
    engine.resize();
    const nodes = engine.getNodes();
    
    // Assign random strategies
    nodes.forEach(n => {
      n.strategy = Math.random() > 0.3 ? 'cooperator' : 'defector';
      n.payoff = 0;
    });

    engine.rebuildSimulation();

    const b = 1.5; // Benefit
    const c = 1.0; // Cost

    function playRound() {
      if (!engine.isActive) return;
      const links = engine.getLinks();
      const adj = engine.getAdjacency();

      // Reset payoffs
      nodes.forEach(n => n.payoff = 0);

      // Play game on edges
      links.forEach(l => {
        const s = typeof l.source === 'object' ? l.source : nodes[l.source];
        const t = typeof l.target === 'object' ? l.target : nodes[l.target];
        if (s.state === 0 || t.state === 0) return;

        if (s.strategy === 'cooperator') {
          t.payoff += b;
          s.payoff -= c;
        }
        if (t.strategy === 'cooperator') {
          s.payoff += b;
          t.payoff -= c;
        }
      });

      // Update strategies (Imitation updating)
      const newStrats = nodes.map(n => n.strategy);
      nodes.forEach((n, i) => {
        if (n.state === 0) return;
        const neighbors = adj.get(n.id) || [];
        if (neighbors.length === 0) return;
        
        // Pick random neighbor
        const neighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
        
        // If neighbor did better, copy them with some probability
        if (neighbor.payoff > n.payoff) {
          const diff = neighbor.payoff - n.payoff;
          const maxDiff = neighbors.length * b; // theoretical max diff
          if (Math.random() < diff / maxDiff) {
            newStrats[i] = neighbor.strategy;
          }
        }
      });

      nodes.forEach((n, i) => n.strategy = newStrats[i]);
    }

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(playRound, 500);

    if (controls['inject-defector']) {
      controls['inject-defector'].addEventListener('click', () => {
        const cooperators = nodes.filter(n => n.strategy === 'cooperator');
        if (cooperators.length > 0) {
          const target = cooperators[Math.floor(Math.random() * cooperators.length)];
          target.strategy = 'defector';
        }
      });
    }

    if (controls['rewire-topology']) {
      controls['rewire-topology'].addEventListener('click', () => {
        // Increase connectivity (adding links reduces spatial reciprocity)
        const links = engine.getLinks();
        for(let i=0; i<5; i++) {
          const n1 = nodes[Math.floor(Math.random() * nodes.length)];
          const n2 = nodes[Math.floor(Math.random() * nodes.length)];
          if (n1.id !== n2.id) {
            links.push({ source: n1, target: n2, type: 'default', weight: 1.0, active: true });
          }
        }
        engine.rebuildSimulation();
      });
    }
  };

  const origDestroy = engine.destroy;
  engine.destroy = function() {
    if (gameInterval) clearInterval(gameInterval);
    origDestroy();
  };

  engine.init();
  return engine;
}
