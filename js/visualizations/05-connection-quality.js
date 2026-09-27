import { createNetworkEngine } from '../lib/network-engine.js';

export function initConnectionQuality(canvas, controls) {
  let reliability = Number.parseFloat(controls['fidelity-slider']?.value ?? '0.8');
  let frame = 0;
  let transmissions = 0;
  let corrupted = 0;
  let informed = new Map();

  const stats = document.getElementById('stats-connection-quality');

  const engine = createNetworkEngine(canvas, {
    nodeCount: 44,
    linkDistance: 68,
    chargeStrength: -110,
    onTick: () => {
      frame += 1;

      for (const node of engine.getNodes()) {
        if (node.signal > 0) {
          node.signal = Math.max(0.18, node.signal - 0.006);
        }
      }

      if (frame % 210 === 1) startCascade();
      if (frame % 24 === 0) propagateOneWave();
      updateStats();
    }
  });

  function endpointId(endpoint) {
    return typeof endpoint === 'object' ? endpoint.id : endpoint;
  }

  function neighborsOf(nodeId) {
    const result = [];
    for (const link of engine.getLinks()) {
      const sourceId = endpointId(link.source);
      const targetId = endpointId(link.target);
      if (sourceId === nodeId) result.push(targetId);
      if (targetId === nodeId) result.push(sourceId);
    }
    return result;
  }

  function updateEdgeDisplay() {
    for (const link of engine.getLinks()) {
      link.weight = 0.15 + reliability * 0.85;
      link.type = reliability >= 0.7 ? 'strong' : reliability <= 0.35 ? 'weak' : 'default';
    }
    engine.getSimulation()?.alpha(0.25).restart();
  }

  function startCascade() {
    informed = new Map();
    transmissions = 0;
    corrupted = 0;

    for (const node of engine.getNodes()) {
      node.signal = 0;
      node.signalType = null;
    }

    const nodes = engine.getNodes();
    if (nodes.length === 0) return;
    const source = nodes[Math.floor(Math.random() * nodes.length)];
    informed.set(source.id, 'signal');
    source.signal = 1;
    source.signalType = 'signal';
  }

  function propagateOneWave() {
    if (informed.size === 0) {
      startCascade();
      return;
    }

    const additions = [];
    const shuffled = [...informed.entries()].sort(() => Math.random() - 0.5);

    for (const [sourceId, sourceType] of shuffled.slice(0, 6)) {
      const candidates = neighborsOf(sourceId).filter((id) => !informed.has(id));
      if (candidates.length === 0) continue;

      const targetId = candidates[Math.floor(Math.random() * candidates.length)];
      const flips = Math.random() > reliability;
      const targetType = flips
        ? (sourceType === 'signal' ? 'noise' : 'signal')
        : sourceType;

      additions.push([targetId, targetType]);
      transmissions += 1;
      if (targetType === 'noise') corrupted += 1;
    }

    for (const [targetId, type] of additions) {
      informed.set(targetId, type);
      const node = engine.getNodes().find((candidate) => candidate.id === targetId);
      if (node) {
        node.signal = 1;
        node.signalType = type;
      }
    }
  }

  function updateStats() {
    if (!stats) return;
    const corruptCopies = [...informed.values()].filter((type) => type === 'noise').length;
    stats.textContent = `edge reliability ${Math.round(reliability * 100)}% · reached ${informed.size} · corrupted copies ${corruptCopies} · transmissions ${transmissions}`;
  }

  controls['fidelity-slider']?.addEventListener('input', (event) => {
    reliability = Number.parseFloat(event.target.value);
    updateEdgeDisplay();
    startCascade();
    updateStats();
  });

  const defaultInit = engine.init.bind(engine);
  engine.init = function init() {
    defaultInit();

    for (const node of engine.getNodes()) {
      node.quality = 1;
      node.radius = 5.5;
    }

    frame = 0;
    updateEdgeDisplay();
    startCascade();
    updateStats();
    return engine;
  };

  engine.init();
  return engine;
}
