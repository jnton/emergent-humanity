import { createNetworkEngine } from '../lib/network-engine.js';

export function initIntro(canvas) {
  const stats = document.getElementById('stats-intro');
  let phase = 0;
  let spawnInterval = null;
  let transitionTimer = null;
  let active = false;

  const engine = createNetworkEngine(canvas, {
    nodeCount: 1,
    linkDistance: 54,
    chargeStrength: -38,
    onTick: () => {
      const ctx = canvas.getContext('2d');
      const nodes = engine.getNodes();
      const links = engine.getLinks();

      // Collective capabilities are encoded only after the network has enough
      // structure to support the corresponding toy behavior.
      const capabilities = [];
      if (nodes.length >= 8) capabilities.push('coordination');
      if (nodes.length >= 16) capabilities.push('specialization');
      if (nodes.length >= 24) capabilities.push('shared memory');
      if (nodes.length >= 36) capabilities.push('collective search');

      if (nodes.length >= 16) {
        // Role differentiation: nodes take on distinct toy functions.
        nodes.forEach((node, i) => {
          node.community = i % 4;
          node.radius = 4.4 + (i % 11 === 0 ? 2.4 : 0);
        });
      }

      if (nodes.length >= 24 && Math.random() < 0.035) {
        // A visible packet stands for information that exists in more than one node.
        const source = nodes[Math.floor(Math.random() * nodes.length)];
        const neighbors = engine.getAdjacency().get(source.id) ?? [];
        if (neighbors.length) {
          const target = neighbors[Math.floor(Math.random() * neighbors.length)];
          source.signal = 1;
          source.signalType = 'signal';
          target.signal = 1;
          target.signalType = 'signal';
        }
      }

      for (const node of nodes) {
        if (node.signal > 0) node.signal = Math.max(0, node.signal - 0.015);
      }

      ctx.save();
      ctx.fillStyle = 'rgba(226,232,240,0.72)';
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'center';
      const label = nodes.length === 1
        ? 'ONE PERSON'
        : nodes.length < 12
          ? 'SMALL COMMUNITY'
          : nodes.length < 36
            ? 'CONNECTED COMMUNITY'
            : 'LARGER COLLECTIVE';
      ctx.fillText(label, canvas.clientWidth / 2, 25);

      if (capabilities.length) {
        ctx.fillStyle = 'rgba(56,189,248,0.8)';
        ctx.font = '600 11px Inter, sans-serif';
        ctx.fillText(
          'toy collective capabilities: ' + capabilities.join(' · '),
          canvas.clientWidth / 2,
          canvas.clientHeight - 22
        );
      }
      ctx.restore();

      if (stats) {
        stats.textContent = `${nodes.length} nodes · ${links.length} links · ${capabilities.length ? capabilities.join(' + ') : 'no collective capability encoded yet'}`;
      }
    }
  });

  function clearTimers() {
    if (spawnInterval) clearInterval(spawnInterval);
    if (transitionTimer) clearTimeout(transitionTimer);
    spawnInterval = null;
    transitionTimer = null;
  }

  function reset() {
    clearTimers();
    phase = 0;
    engine.reset(1);
    const nodes = engine.getNodes();
    const links = engine.getLinks();
    nodes.length = 1;
    links.length = 0;
    nodes[0].radius = 5;
    nodes[0].quality = 0.9;
    nodes[0].x = canvas.clientWidth / 2;
    nodes[0].y = canvas.clientHeight / 2;
    engine.rebuildSimulation();

    transitionTimer = setTimeout(() => {
      if (!active) return;
      phase = 1;
      const target = canvas.clientWidth <= 900 ? 42 : 64;
      let nextId = 1;

      spawnInterval = setInterval(() => {
        if (!active || nextId >= target) {
          clearInterval(spawnInterval);
          spawnInterval = null;
          return;
        }

        const batch = Math.min(2, target - nextId);
        for (let n = 0; n < batch; n += 1) {
          const parent = nodes[Math.floor(Math.random() * nodes.length)];
          const node = {
            id: nextId++,
            state: 1,
            quality: 0.8,
            signal: 0,
            signalType: null,
            radius: 4.4,
            community: null,
            x: parent.x + (Math.random() - 0.5) * 18,
            y: parent.y + (Math.random() - 0.5) * 18
          };
          nodes.push(node);
          links.push({ source: node, target: parent, type: 'default', weight: 0.7, active: true });

          if (nodes.length > 6 && Math.random() < 0.45) {
            const second = nodes[Math.floor(Math.random() * (nodes.length - 1))];
            if (second && second !== parent) {
              links.push({ source: node, target: second, type: 'default', weight: 0.5, active: true });
            }
          }
        }
        engine.rebuildSimulation();
      }, 110);
    }, 700);
  }

  const defaultInit = engine.init.bind(engine);
  engine.init = function init() {
    defaultInit();
    reset();
    return engine;
  };

  const defaultDestroy = engine.destroy?.bind(engine);
  engine.destroy = function destroy() {
    clearTimers();
    defaultDestroy?.();
  };

  const baseActivate = engine.activate?.bind(engine);
  engine.activate = function activate() {
    active = true;
    baseActivate?.();
    reset();
  };

  const baseDeactivate = engine.deactivate?.bind(engine);
  engine.deactivate = function deactivate() {
    active = false;
    clearTimers();
    baseDeactivate?.();
  };

  engine.init();
  return engine;
}
