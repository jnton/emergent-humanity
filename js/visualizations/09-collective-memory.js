import { createNetworkEngine } from '../lib/network-engine.js';

export function initCollectiveMemory(canvas, controls) {
  let idea = null;
  let packets = [];
  let frame = 0;
  const mutationProbability = 0.08;
  const stats = document.getElementById('stats-collective-memory');

  const engine = createNetworkEngine(canvas, {
    nodeCount: 50,
    linkDistance: 50,
    chargeStrength: -80,
    onTick: () => {
      frame += 1;
      const ctx = canvas.getContext('2d');

      updatePackets(ctx);
      drawCarriers(ctx);

      if (idea && !idea.lost && frame % 52 === 0) spreadIdea();
      if (idea && !idea.lost && frame % 360 === 0) forgetRareCopies();

      updateStats();
    }
  });

  function endpointId(endpoint) {
    return typeof endpoint === 'object' ? endpoint.id : endpoint;
  }

  function nodeById(id) {
    return engine.getNodes().find((node) => node.id === id);
  }

  function neighborsOf(id) {
    const result = [];
    for (const link of engine.getLinks()) {
      const sourceId = endpointId(link.source);
      const targetId = endpointId(link.target);
      if (sourceId === id) result.push(targetId);
      if (targetId === id) result.push(sourceId);
    }
    return result;
  }

  function variantOf(id) {
    return idea?.variants.get(id) ?? 0;
  }

  function spreadIdea() {
    if (!idea) return;

    const carriers = [...idea.carriers].filter((id) => nodeById(id));
    idea.carriers = new Set(carriers);

    if (carriers.length === 0) {
      idea.lost = true;
      return;
    }

    const shuffled = carriers.sort(() => Math.random() - 0.5);
    for (const sourceId of shuffled.slice(0, Math.min(4, shuffled.length))) {
      const candidates = neighborsOf(sourceId).filter((id) => !idea.carriers.has(id));
      if (candidates.length === 0 || Math.random() > 0.55) continue;

      const targetId = candidates[Math.floor(Math.random() * candidates.length)];
      if (packets.some((packet) => packet.targetId === targetId)) continue;

      packets.push({
        sourceId,
        targetId,
        progress: 0,
        variant: variantOf(sourceId)
      });
    }
  }

  function forgetRareCopies() {
    if (!idea || idea.carriers.size <= 1) return;

    for (const id of [...idea.carriers]) {
      if (id === idea.originId) continue;
      if (Math.random() < 0.04) {
        idea.carriers.delete(id);
        idea.variants.delete(id);
      }
    }

    if (idea.carriers.size === 0) idea.lost = true;
  }

  function updatePackets(ctx) {
    for (let i = packets.length - 1; i >= 0; i -= 1) {
      const packet = packets[i];
      const source = nodeById(packet.sourceId);
      const target = nodeById(packet.targetId);

      if (!source || !target || !idea || idea.lost) {
        packets.splice(i, 1);
        continue;
      }

      packet.progress += 0.035;

      const x = source.x + (target.x - source.x) * packet.progress;
      const y = source.y + (target.y - source.y) * packet.progress;
      const hue = 32 + (packet.variant % 6) * 42;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${hue} 82% 66%)`;
      ctx.shadowColor = `hsl(${hue} 82% 66%)`;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      if (packet.progress >= 1) {
        const mutated = Math.random() < mutationProbability;
        const newVariant = mutated ? idea.nextVariant++ : packet.variant;

        idea.carriers.add(packet.targetId);
        idea.variants.set(packet.targetId, newVariant);
        if (mutated) idea.mutations += 1;

        target.signal = 1;
        target.signalType = mutated ? 'noise' : 'signal';
        packets.splice(i, 1);
      }
    }
  }

  function drawCarriers(ctx) {
    if (!idea) return;

    for (const id of [...idea.carriers]) {
      const node = nodeById(id);
      if (!node) {
        idea.carriers.delete(id);
        idea.variants.delete(id);
        continue;
      }

      const variant = variantOf(id);
      const hue = 32 + (variant % 6) * 42;

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius + 5, 0, Math.PI * 2);
      ctx.strokeStyle = id === idea.originId
        ? 'rgba(255,184,108,1)'
        : `hsla(${hue} 82% 66% / 0.72)`;
      ctx.lineWidth = id === idea.originId ? 2 : 1.2;
      ctx.stroke();

      if (variant > 0) {
        ctx.fillStyle = `hsl(${hue} 82% 70%)`;
        ctx.font = '600 9px ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`v${variant}`, node.x, node.y - node.radius - 9);
      }
    }

    if (idea.carriers.size === 0) idea.lost = true;
  }

  function updateStats() {
    if (!stats) return;

    if (!idea) {
      stats.textContent = 'No idea yet · copies can spread, mutate, disappear, or outlive the origin';
      return;
    }

    const originAlive = Boolean(nodeById(idea.originId));
    const variants = new Set([...idea.carriers].map((id) => variantOf(id))).size;
    const status = idea.lost ? 'LOST' : 'PERSISTING';
    stats.textContent = `copies ${idea.carriers.size} · variants ${variants} · mutation events ${idea.mutations} · origin ${originAlive ? 'alive' : 'gone'} · ${status}`;
  }

  function spawnIdea() {
    const nodes = engine.getNodes();
    if (nodes.length === 0) return;

    const source = nodes[Math.floor(Math.random() * nodes.length)];
    idea = {
      originId: source.id,
      carriers: new Set([source.id]),
      variants: new Map([[source.id, 0]]),
      nextVariant: 1,
      mutations: 0,
      lost: false
    };
    packets = [];
    source.signal = 1;
    source.signalType = 'signal';
    updateStats();
  }

  canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const clicked = engine.getNodes().find(
      (node) => Math.hypot(node.x - x, node.y - y) < node.radius + 7
    );
    if (!clicked) return;

    const removedId = clicked.id;
    engine.removeNode(clicked);

    packets = packets.filter(
      (packet) => packet.sourceId !== removedId && packet.targetId !== removedId
    );

    if (idea) {
      idea.carriers.delete(removedId);
      idea.variants.delete(removedId);
      if (idea.carriers.size === 0) idea.lost = true;
    }

    updateStats();
    canvas.__EMERGENT_NETWORK_VIEWPORT__?.refresh();
  });

  controls['spawn-idea']?.addEventListener('click', spawnIdea);

  const defaultInit = engine.init.bind(engine);
  engine.init = function init() {
    defaultInit();
    frame = 0;
    idea = null;
    packets = [];
    updateStats();
    return engine;
  };

  engine.init();
  return engine;
}
