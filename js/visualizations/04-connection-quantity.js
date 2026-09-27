import { createNetworkEngine } from "../lib/network-engine.js";

export function initConnectionQuantity(canvas, controls) {
  const stats = document.getElementById("stats-connection-quantity");

  const engine = createNetworkEngine(canvas, {
    nodeCount: 60,
    linkDistance: 50,
    chargeStrength: -80,
  });

  function endpointId(endpoint) {
    return typeof endpoint === "object" ? endpoint.id : endpoint;
  }

  function linkExists(a, b) {
    return engine.getLinks().some((link) => {
      const sourceId = endpointId(link.source);
      const targetId = endpointId(link.target);
      return (
        (sourceId === a && targetId === b) || (sourceId === b && targetId === a)
      );
    });
  }

  function buildLocalNetwork() {
    const nodes = engine.getNodes();
    const links = engine.getLinks();
    nodes.length = 0;
    links.length = 0;

    for (let i = 0; i < 60; i += 1) {
      nodes.push({
        id: i,
        state: 1,
        quality: 1,
        signal: 0,
        signalType: null,
        radius: 5,
        community: Math.floor(i / 10),
        degree: 0,
        x: canvas.clientWidth / 2 + (Math.random() - 0.5) * 180,
        y: canvas.clientHeight / 2 + (Math.random() - 0.5) * 180,
      });
    }

    // Dense local communities.
    for (let i = 0; i < 60; i += 1) {
      for (let j = i + 1; j < 60; j += 1) {
        if (nodes[i].community === nodes[j].community && Math.random() < 0.42) {
          links.push({
            source: nodes[i],
            target: nodes[j],
            type: "strong",
            weight: 0.9,
            active: true,
          });
        }
      }
    }

    for (let i = 0; i < 60; i += 1) {
      const next = Math.floor(i / 10) * 10 + ((i + 1) % 10);
      if (!linkExists(i, next))
        links.push({
          source: nodes[i],
          target: nodes[next],
          type: "strong",
          weight: 0.9,
          active: true,
        });
    }

    // A sparse backbone keeps the initial graph reachable but path-heavy.
    for (let community = 0; community < 6; community += 1) {
      const a = nodes[community * 10];
      const b = nodes[((community + 1) % 6) * 10];
      links.push({
        source: a,
        target: b,
        type: "weak",
        weight: 0.25,
        active: true,
      });
    }

    if (controls["deploy-internet"])
      controls["deploy-internet"].disabled = false;
    engine.rebuildSimulation();
    updateStats();
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

  function meanShortestPath() {
    const graph = adjacency();
    const ids = [...graph.keys()];
    if (ids.length < 2) return { mean: 0, reachableFraction: 1 };

    let distanceSum = 0;
    let reachablePairs = 0;
    const totalPairs = (ids.length * (ids.length - 1)) / 2;

    for (let index = 0; index < ids.length; index += 1) {
      const start = ids[index];
      const queue = [start];
      const distances = new Map([[start, 0]]);

      while (queue.length) {
        const current = queue.shift();
        for (const next of graph.get(current) ?? []) {
          if (distances.has(next)) continue;
          distances.set(next, distances.get(current) + 1);
          queue.push(next);
        }
      }

      for (let j = index + 1; j < ids.length; j += 1) {
        const distance = distances.get(ids[j]);
        if (distance === undefined) continue;
        distanceSum += distance;
        reachablePairs += 1;
      }
    }

    return {
      mean: reachablePairs ? distanceSum / reachablePairs : Infinity,
      reachableFraction: totalPairs ? reachablePairs / totalPairs : 1,
    };
  }

  function updateStats() {
    if (!stats) return;
    const paths = meanShortestPath();
    const meanText = Number.isFinite(paths.mean) ? paths.mean.toFixed(2) : "∞";
    stats.textContent = `${engine.getLinks().length} edges · mean shortest path ${meanText} hops · reachable pairs ${Math.round(paths.reachableFraction * 100)}%`;
  }

  function addLongRangeLinks() {
    const nodes = engine.getNodes();
    const candidates = [];
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        if (
          nodes[i].community !== nodes[j].community &&
          !linkExists(nodes[i].id, nodes[j].id)
        ) {
          candidates.push([nodes[i], nodes[j]]);
        }
      }
    }
    // Each tap makes one bounded change, including when every possible bridge exists.
    const count = Math.min(24, candidates.length);
    for (let i = 0; i < count; i += 1) {
      const pick = i + Math.floor(Math.random() * (candidates.length - i));
      [candidates[i], candidates[pick]] = [candidates[pick], candidates[i]];
      const [a, b] = candidates[i];
      engine
        .getLinks()
        .push({
          source: a,
          target: b,
          type: "bridge",
          weight: 0.55,
          active: true,
        });
      a.signal = b.signal = 1;
      a.signalType = b.signalType = "signal";
    }
    if (controls["deploy-internet"])
      controls["deploy-internet"].disabled = count === candidates.length;
    engine.rebuildSimulation();
    updateStats();
    engine.renderStatic?.();
  }

  controls["deploy-internet"]?.addEventListener("click", addLongRangeLinks);

  controls["reset-connections"]?.addEventListener("click", () => {
    buildLocalNetwork();
  });

  const defaultInit = engine.init.bind(engine);
  engine.init = function init() {
    defaultInit();
    buildLocalNetwork();
    return engine;
  };

  engine.init();
  return engine;
}
