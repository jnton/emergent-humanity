import { createNetworkEngine } from '../lib/network-engine.js';

export function initAlignment(canvas, controls) {
  let coupling = 0.04;
  let noise = 0.28;
  let frame = 0;
  const targetDirection = 0;
  const stats = document.getElementById('stats-alignment');

  const engine = createNetworkEngine(canvas, {
    nodeCount: 60,
    linkDistance: 46,
    chargeStrength: -52,
    onTick: () => {
      frame += 1;
      const ctx = canvas.getContext('2d');
      const nodes = engine.getNodes();

      if (frame % 2 === 0) angularConsensusStep();

      let sumCos = 0;
      let sumSin = 0;

      ctx.save();
      for (const node of nodes) {
        sumCos += Math.cos(node.theta);
        sumSin += Math.sin(node.theta);

        node.vx = (node.vx ?? 0) + Math.cos(node.theta) * 0.08;
        node.vy = (node.vy ?? 0) + Math.sin(node.theta) * 0.08;

        const length = 12;
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(node.x + Math.cos(node.theta) * length, node.y + Math.sin(node.theta) * length);
        ctx.strokeStyle = 'rgba(79,156,247,0.78)';
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }

      const cx = canvas.clientWidth * 0.82;
      const cy = 36;
      ctx.beginPath();
      ctx.moveTo(cx - 24, cy);
      ctx.lineTo(cx + 24, cy);
      ctx.strokeStyle = 'rgba(34,197,94,0.9)';
      ctx.lineWidth = 2.3;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 24, cy);
      ctx.lineTo(cx + 15, cy - 6);
      ctx.lineTo(cx + 15, cy + 6);
      ctx.closePath();
      ctx.fillStyle = 'rgba(34,197,94,0.9)';
      ctx.fill();
      ctx.fillStyle = 'rgba(226,232,240,0.72)';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('external target', cx, cy - 11);
      ctx.restore();

      const order = nodes.length ? Math.hypot(sumCos, sumSin) / nodes.length : 0;
      const meanDirection = Math.atan2(sumSin, sumCos);
      const targetAgreement = (1 + Math.cos(meanDirection - targetDirection)) / 2;
      const coverage = directionalCoverage(nodes);

      if (stats) {
        stats.textContent = `coherence R ${order.toFixed(2)} · target agreement ${targetAgreement.toFixed(2)} · directional coverage ${Math.round(coverage * 100)}% · coupling ${coupling.toFixed(2)}`;
      }
    }
  });

  function endpointId(endpoint) {
    return typeof endpoint === 'object' ? endpoint.id : endpoint;
  }

  function buildAdjacency() {
    const adj = new Map(engine.getNodes().map((node) => [node.id, []]));
    for (const link of engine.getLinks()) {
      const sourceId = endpointId(link.source);
      const targetId = endpointId(link.target);
      adj.get(sourceId)?.push(targetId);
      adj.get(targetId)?.push(sourceId);
    }
    return adj;
  }

  function circularMean(ids, byId, self) {
    let x = Math.cos(self.theta);
    let y = Math.sin(self.theta);
    let count = 1;
    for (const id of ids) {
      const node = byId.get(id);
      if (!node) continue;
      x += Math.cos(node.theta);
      y += Math.sin(node.theta);
      count += 1;
    }
    return Math.atan2(y / count, x / count);
  }

  function angleDifference(target, current) {
    return Math.atan2(Math.sin(target - current), Math.cos(target - current));
  }

  function directionalCoverage(nodes) {
    const bins = new Set();
    for (const node of nodes) {
      let theta = node.theta % (Math.PI * 2);
      if (theta < 0) theta += Math.PI * 2;
      bins.add(Math.min(7, Math.floor(theta / (Math.PI * 2) * 8)));
    }
    return bins.size / 8;
  }

  function angularConsensusStep() {
    const nodes = engine.getNodes();
    const byId = new Map(nodes.map((node) => [node.id, node]));
    const adjacency = buildAdjacency();
    const updates = new Map();

    for (const node of nodes) {
      const mean = circularMean(adjacency.get(node.id) ?? [], byId, node);
      const drift = angleDifference(mean, node.theta) * coupling;
      const randomTerm = (Math.random() - 0.5) * noise;
      updates.set(node.id, node.theta + drift + randomTerm);
    }

    for (const node of nodes) node.theta = updates.get(node.id);
  }

  function seedMostlyWrongButDiverse() {
    const nodes = engine.getNodes();
    for (let i = 0; i < nodes.length; i += 1) {
      const spread = ((i * 37) % 101) / 100;
      nodes[i].theta = Math.PI * 0.68 + (spread - 0.5) * Math.PI * 1.5;
    }
  }

  function randomizeDirections() {
    for (const node of engine.getNodes()) {
      node.theta = Math.random() * Math.PI * 2;
    }
  }

  controls['align-goals']?.addEventListener('click', () => {
    coupling = 0.24;
    noise = 0.018;
    engine.getSimulation()?.alpha(0.5).restart();
  });

  controls['scramble-goals']?.addEventListener('click', () => {
    coupling = 0.025;
    noise = 0.34;
    randomizeDirections();
    engine.getSimulation()?.alpha(0.5).restart();
  });

  const defaultInit = engine.init.bind(engine);
  engine.init = function init() {
    defaultInit();
    frame = 0;
    coupling = 0.04;
    noise = 0.28;
    seedMostlyWrongButDiverse();

    const simulation = engine.getSimulation();
    simulation.force('center', d3.forceCenter(canvas.clientWidth / 2, canvas.clientHeight / 2).strength(0.02));
    return engine;
  };

  engine.init();
  return engine;
}
