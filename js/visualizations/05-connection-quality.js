import { createNetworkEngine } from '../lib/network-engine.js';

export function initConnectionQuality(canvas, controls) {
  let channelFidelity = Number.parseFloat(controls['fidelity-slider']?.value ?? '0.9');
  let sourceAccuracy = Number.parseFloat(controls['source-accuracy']?.value ?? '0.8');
  let interpretationFidelity = Number.parseFloat(controls['interpretation-fidelity']?.value ?? '0.85');
  let trustCalibration = Number.parseFloat(controls['trust-calibration']?.value ?? '0.75');
  let selectionPressure = Number.parseFloat(controls['selection-pressure']?.value ?? '0.25');

  let frame = 0;
  let frontier = [];
  let seen = new Set();
  let sourceTruth = true;
  let acceptedTrue = 0;
  let acceptedFalse = 0;
  let rejected = 0;
  let transmissions = 0;
  let amplifiedFalse = 0;

  const stats = document.getElementById('stats-connection-quality');

  const engine = createNetworkEngine(canvas, {
    nodeCount: 46,
    linkDistance: 66,
    chargeStrength: -105,
    onTick: () => {
      frame += 1;
      for (const node of engine.getNodes()) {
        if (node.signal > 0) node.signal = Math.max(0.12, node.signal - 0.008);
      }
      if (frame % 260 === 1) startCascade();
      if (frame % 24 === 0) propagateWave();
      drawLayerLegend();
      updateStats();
    }
  });

  function endpointId(endpoint) {
    return typeof endpoint === 'object' ? endpoint.id : endpoint;
  }

  function neighborsOf(id) {
    const result = [];
    for (const link of engine.getLinks()) {
      const a = endpointId(link.source);
      const b = endpointId(link.target);
      if (a === id) result.push(b);
      if (b === id) result.push(a);
    }
    return result;
  }

  function nodeById(id) {
    return engine.getNodes().find((n) => n.id === id);
  }

  function flip(value, probability) {
    return Math.random() < probability ? !value : value;
  }

  function startCascade() {
    frontier = [];
    seen = new Set();
    acceptedTrue = 0;
    acceptedFalse = 0;
    rejected = 0;
    transmissions = 0;
    amplifiedFalse = 0;

    for (const node of engine.getNodes()) {
      node.signal = 0;
      node.signalType = null;
    }

    const nodes = engine.getNodes();
    if (!nodes.length) return;
    const source = nodes[Math.floor(Math.random() * nodes.length)];
    sourceTruth = Math.random() < sourceAccuracy;

    const message = {
      nodeId: source.id,
      truth: sourceTruth,
      content: sourceTruth,
      depth: 0
    };
    frontier.push(message);
    seen.add(source.id);
    source.signal = 1;
    source.signalType = sourceTruth ? 'signal' : 'noise';
  }

  function propagateWave() {
    if (!frontier.length) return;
    const next = [];

    for (const message of frontier.slice(0, 10)) {
      const candidates = neighborsOf(message.nodeId).filter((id) => !seen.has(id));
      if (!candidates.length) continue;

      const targets = [...candidates].sort(() => Math.random() - 0.5).slice(0, 2);
      for (const targetId of targets) {
        transmissions += 1;
        seen.add(targetId);

        // Layer 1: physical/channel transmission.
        const afterChannel = flip(message.content, 1 - channelFidelity);

        // Layer 2: interpretation.
        const interpreted = flip(afterChannel, 1 - interpretationFidelity);
        const accurateAtReceiver = interpreted === message.truth;

        // Layer 3: trust calibration. Perfect calibration accepts accurate
        // messages and rejects inaccurate ones; poor calibration increasingly reverses that.
        const assessmentCorrect = Math.random() < trustCalibration;
        const accept = assessmentCorrect ? accurateAtReceiver : !accurateAtReceiver;

        const node = nodeById(targetId);
        if (!accept) {
          rejected += 1;
          if (node) {
            node.signal = 0.45;
            node.signalType = null;
          }
          continue;
        }

        if (accurateAtReceiver) acceptedTrue += 1;
        else acceptedFalse += 1;

        if (node) {
          node.signal = 1;
          node.signalType = accurateAtReceiver ? 'signal' : 'noise';
        }

        // Layer 4: selection/amplification. This toy slider represents a
        // system that preferentially repeats inaccurate content; it is not a
        // claim that incentives always favor falsehood.
        let repeatProbability;
        if (accurateAtReceiver) {
          repeatProbability = 0.62 - 0.25 * selectionPressure;
        } else {
          repeatProbability = 0.38 + 0.55 * selectionPressure;
        }

        if (Math.random() < repeatProbability && message.depth < 7) {
          if (!accurateAtReceiver && selectionPressure > 0) amplifiedFalse += 1;
          next.push({
            nodeId: targetId,
            truth: message.truth,
            content: interpreted,
            depth: message.depth + 1
          });
        }
      }
    }

    frontier = next;
  }

  function updateEdgeDisplay() {
    for (const link of engine.getLinks()) {
      link.weight = 0.15 + channelFidelity * 0.85;
      link.type = channelFidelity >= 0.8 ? 'strong' : channelFidelity <= 0.45 ? 'weak' : 'default';
    }
    engine.getSimulation()?.alpha(0.2).restart();
  }

  function drawLayerLegend() {
    const ctx = canvas.getContext('2d');
    const W = canvas.clientWidth;
    ctx.save();
    ctx.fillStyle = 'rgba(226,232,240,0.72)';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      'SOURCE → CHANNEL → INTERPRETATION → TRUST → SELECTION',
      W / 2,
      24
    );
    ctx.restore();
  }

  function updateStats() {
    if (!stats) return;
    const accepted = acceptedTrue + acceptedFalse;
    const accuracy = accepted ? acceptedTrue / accepted : 1;
    stats.textContent = `source claim ${sourceTruth ? 'true' : 'false'} · reached ${seen.size} · accepted true ${acceptedTrue} · accepted false ${acceptedFalse} · rejected ${rejected} · accepted accuracy ${Math.round(accuracy * 100)}% · selective false repeats ${amplifiedFalse}`;
  }

  function resetCascadeAndEdges() {
    updateEdgeDisplay();
    startCascade();
    updateStats();
  }

  controls['fidelity-slider']?.addEventListener('input', (e) => {
    channelFidelity = Number.parseFloat(e.target.value);
    resetCascadeAndEdges();
  });
  controls['source-accuracy']?.addEventListener('input', (e) => {
    sourceAccuracy = Number.parseFloat(e.target.value);
    startCascade();
  });
  controls['interpretation-fidelity']?.addEventListener('input', (e) => {
    interpretationFidelity = Number.parseFloat(e.target.value);
    startCascade();
  });
  controls['trust-calibration']?.addEventListener('input', (e) => {
    trustCalibration = Number.parseFloat(e.target.value);
    startCascade();
  });
  controls['selection-pressure']?.addEventListener('input', (e) => {
    selectionPressure = Number.parseFloat(e.target.value);
    startCascade();
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
