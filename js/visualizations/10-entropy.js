import { createNetworkEngine } from '../lib/network-engine.js';

export function initEntropy(canvas, controls) {
  let channelNoise = Number.parseFloat(controls['channel-noise']?.value ?? '0.04');
  let redundancyActive = Boolean(controls['toggle-redundancy']?.checked);
  let run = null;
  let packets = [];
  let originalBits = [];
  let receivedCopies = [];
  let path = [];
  let resultText = 'Ready';

  const stats = document.getElementById('stats-entropy');
  const bitCount = 15;

  const engine = createNetworkEngine(canvas, {
    nodeCount: 60,
    linkDistance: 46,
    chargeStrength: -45,
    onTick: () => {
      const ctx = canvas.getContext('2d');
      updatePackets(ctx);
      updateStats();
    }
  });

  function endpointId(endpoint) {
    return typeof endpoint === 'object' ? endpoint.id : endpoint;
  }

  function nodeById(id) {
    return engine.getNodes().find((node) => node.id === id);
  }

  function adjacency() {
    const map = new Map(engine.getNodes().map((node) => [node.id, []]));
    for (const link of engine.getLinks()) {
      const sourceId = endpointId(link.source);
      const targetId = endpointId(link.target);
      map.get(sourceId)?.push(targetId);
      map.get(targetId)?.push(sourceId);
    }
    return map;
  }

  function farthestPath() {
    const nodes = engine.getNodes();
    if (nodes.length < 2) return null;

    const graph = adjacency();
    const start = nodes[0].id;
    const queue = [start];
    const parent = new Map([[start, null]]);
    let farthest = start;

    while (queue.length) {
      const current = queue.shift();
      farthest = current;
      for (const next of graph.get(current) ?? []) {
        if (parent.has(next)) continue;
        parent.set(next, current);
        queue.push(next);
      }
    }

    if (farthest === start) return null;

    const result = [];
    let cursor = farthest;
    while (cursor !== null) {
      result.push(cursor);
      cursor = parent.get(cursor) ?? null;
    }
    result.reverse();
    return result;
  }

  function randomBits() {
    return Array.from({ length: bitCount }, () => (Math.random() < 0.5 ? 0 : 1));
  }

  function transmitHop(bits) {
    return bits.map((bit) => (Math.random() < (run?.noise ?? channelNoise) ? 1 - bit : bit));
  }

  function hammingErrors(a, b) {
    let errors = 0;
    for (let i = 0; i < Math.min(a.length, b.length); i += 1) {
      if (a[i] !== b[i]) errors += 1;
    }
    return errors;
  }

  function majorityDecode(copies) {
    return Array.from({ length: bitCount }, (_, index) => {
      const ones = copies.reduce((sum, bits) => sum + bits[index], 0);
      return ones >= Math.ceil(copies.length / 2) ? 1 : 0;
    });
  }

  function effectiveHopError(p, hops) {
    return (1 - (1 - 2 * p) ** hops) / 2;
  }

  function majorityError5(p) {
    let total = 0;
    for (let k = 3; k <= 5; k += 1) {
      const combinations = k === 3 ? 10 : k === 4 ? 5 : 1;
      total += combinations * (p ** k) * ((1 - p) ** (5 - k));
    }
    return total;
  }

  function launchMessage() {
    path = farthestPath();
    packets = [];
    receivedCopies = [];
    originalBits = randomBits();

    if (!path || path.length < 2) {
      resultText = 'No connected path';
      updateStats();
      return;
    }

    run = Object.freeze({noise:channelNoise,redundancy:redundancyActive,copies:redundancyActive ? 5 : 1});
    const copies = run.copies;
    for (let i = 0; i < copies; i += 1) {
      packets.push({
        path: [...path],
        hopIndex: 0,
        progress: -i * 0.22,
        bits: [...originalBits],
        copyIndex: i
      });
    }

    resultText = 'Transmitting';
    const source = nodeById(path[0]);
    if (source) {
      source.signal = 1;
      source.signalType = 'signal';
    }
  }

  function finishIfReady() {
    const expectedCopies = run?.copies ?? 0;
    if (receivedCopies.length !== expectedCopies) return;

    const decoded = run.redundancy
      ? majorityDecode(receivedCopies)
      : receivedCopies[0];

    const errors = hammingErrors(originalBits, decoded);
    const hops = Math.max(0, path.length - 1);
    const pEff = effectiveHopError(run.noise, hops);
    const expected = run.redundancy ? majorityError5(pEff) : pEff;

    resultText = `decoded errors ${errors}/${bitCount} · expected bit error ≈ ${(expected * 100).toFixed(1)}%`;

    const target = nodeById(path[path.length - 1]);
    if (target) {
      target.signal = 1;
      target.signalType = errors === 0 ? 'signal' : 'noise';
    }
  }

  function updatePackets(ctx) {
    for (let i = packets.length - 1; i >= 0; i -= 1) {
      const packet = packets[i];
      if (packet.progress < 0) {
        packet.progress += 0.035;
        continue;
      }

      const current = nodeById(packet.path[packet.hopIndex]);
      const next = nodeById(packet.path[packet.hopIndex + 1]);

      if (!current || !next) {
        packets.splice(i, 1);
        resultText = 'Path interrupted';
        continue;
      }

      packet.progress += 0.035;

      const x = current.x + (next.x - current.x) * Math.min(1, packet.progress);
      const y = current.y + (next.y - current.y) * Math.min(1, packet.progress);
      const offset = (packet.copyIndex - 2) * 2.2;

      ctx.beginPath();
      ctx.arc(x, y + offset, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = packet.copyIndex === 0 ? '#38bdf8' : 'rgba(167, 139, 250, 0.85)';
      ctx.fill();

      if (packet.progress < 1) continue;

      packet.bits = transmitHop(packet.bits);
      packet.hopIndex += 1;
      packet.progress = 0;

      if (packet.hopIndex >= packet.path.length - 1) {
        receivedCopies.push(packet.bits);
        packets.splice(i, 1);
        finishIfReady();
      }
    }
  }

  function updateStats() {
    if (!stats) return;
    const hops = path.length > 1 ? path.length - 1 : 0;
    stats.textContent = `p ${((run?.noise ?? channelNoise) * 100).toFixed(0)}%/hop · ${hops} hops · ${(run?.redundancy ?? redundancyActive) ? '5× majority decode' : 'single copy'} · ${resultText} · settings apply to the next message`;
  }

  controls['channel-noise']?.addEventListener('input', (event) => {
    channelNoise = Number.parseFloat(event.target.value);
    updateStats();
  });

  controls['toggle-redundancy']?.addEventListener('change', (event) => {
    redundancyActive = event.target.checked;
    updateStats();
  });

  controls['send-message']?.addEventListener('click', launchMessage);

  const defaultInit = engine.init.bind(engine);
  engine.init = function init() {
    defaultInit();
    packets = [];
    receivedCopies = [];
    path = [];
    originalBits = [];
    resultText = 'Ready';
    run = null;

    for (const node of engine.getNodes()) {
      node.signal = 0;
      node.signalType = null;
    }

    updateStats();
    return engine;
  };

  engine.init();
  return engine;
}
