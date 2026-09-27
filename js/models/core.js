// Scientific state is independent of browser size, rendering and wall time.
export function randomSource(seed = 74291) {
  let value = seed >>> 0;
  return () => (value = (1664525 * value + 1013904223) >>> 0) / 4294967296;
}
export const clone = (value) => structuredClone(value);
export const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
export function uniqueEdges(edges) {
  return [
    ...new Map(
      edges
        .filter(([a, b]) => a !== b)
        .map(([a, b]) => [a < b ? `${a}:${b}` : `${b}:${a}`, [a, b]]),
    ).values(),
  ];
}
export function distances(nodes, edges, source) {
  const adj = new Map(nodes.map((n) => [n.id, []]));
  for (const [a, b] of edges)
    if (adj.has(a) && adj.has(b)) {
      adj.get(a).push(b);
      adj.get(b).push(a);
    }
  const d = new Map([[source, 0]]),
    queue = [source];
  for (let i = 0; i < queue.length; i++)
    for (const j of adj.get(queue[i]) ?? [])
      if (!d.has(j)) {
        d.set(j, d.get(queue[i]) + 1);
        queue.push(j);
      }
  return d;
}
export function graphMetrics(nodes, edges, denominator = nodes.length) {
  let reachable = 0,
    totalDistance = 0,
    inverse = 0,
    largest = 0;
  for (const n of nodes) {
    const d = distances(nodes, edges, n.id);
    largest = Math.max(largest, d.size);
    for (const [j, x] of d)
      if (j !== n.id) {
        reachable++;
        totalDistance += x;
        inverse += 1 / x;
      }
  }
  const pairs = denominator * (denominator - 1);
  return {
    largest,
    reach: pairs > 0 ? reachable / pairs : 0,
    efficiency: pairs > 0 ? inverse / pairs : 0,
    mean: reachable ? totalDistance / reachable : 0,
  };
}
export function ring(n = 12) {
  return {
    nodes: Array.from({ length: n }, (_, id) => ({
      id,
      x: 0.5 + 0.36 * Math.cos((id / n) * Math.PI * 2 - Math.PI / 2),
      y: 0.5 + 0.36 * Math.sin((id / n) * Math.PI * 2 - Math.PI / 2),
    })),
    edges: Array.from({ length: n }, (_, i) => [i, (i + 1) % n]),
  };
}
export function removalGraph() {
  const nodes = Array.from({ length: 13 }, (_, id) =>
    id === 12
      ? { id, x: 0.5, y: 0.5, role: "bridge" }
      : {
          id,
          x:
            (id < 6 ? 0.24 : 0.76) +
            0.16 * Math.cos(((id % 6) / 6) * 2 * Math.PI),
          y: 0.5 + 0.29 * Math.sin(((id % 6) / 6) * 2 * Math.PI),
          role: id === 2 ? "unique skill" : "member",
        },
  );
  const edges = [];
  for (let i = 0; i < 12; i++)
    for (let j = i + 1; j < 12; j++)
      if (Math.floor(i / 6) === Math.floor(j / 6)) edges.push([i, j]);
  edges.push([0, 12], [12, 6]);
  return { nodes, edges };
}
export function order(angles, target = 0) {
  const n = angles.length;
  if (!n) return { r: 0, q: 0 };
  return {
    r:
      Math.hypot(
        angles.reduce((s, t) => s + Math.cos(t), 0),
        angles.reduce((s, t) => s + Math.sin(t), 0),
      ) / n,
    q: angles.reduce((s, t) => s + Math.cos(t - target), 0) / n,
  };
}
export const hopError = (p, h) => (1 - (1 - 2 * p) ** h) / 2;
export const majorityError = (p) =>
  10 * p ** 3 * (1 - p) ** 2 + 5 * p ** 4 * (1 - p) + p ** 5;
export const majority = (copies) =>
  copies[0].map(
    (_, i) => +(copies.reduce((s, c) => s + c[i], 0) > copies.length / 2),
  );
export const dominates = (a, b) =>
  a.cost <= b.cost &&
  a.service >= b.service &&
  (a.cost < b.cost || a.service > b.service);
export function createRemoval() {
  const base = removalGraph();
  let removed = null;
  return {
    act(a) {
      removed =
        a === "remove-node"
          ? 1
          : a === "remove-hub"
            ? 12
            : a === "remove-specialist"
              ? 2
              : null;
    },
    step() {},
    snapshot() {
      const nodes = base.nodes.filter((n) => n.id !== removed),
        edges = base.edges.filter((e) => !e.includes(removed));
      return {
        type: "graph",
        ...base,
        removed,
        metrics: graphMetrics(nodes, edges, 13),
        coverage: removed === 2 ? 2 : 3,
        done: true,
      };
    },
  };
}
export function createAlignment(seed) {
  const rng = randomSource(seed);
  let angles = Array.from({ length: 24 }, () => rng() * 2 * Math.PI),
    coupling = 0.15,
    noise = 0.12,
    t = 0;
  return {
    act(a, v) {
      if (a === "coupling") coupling = v;
      if (a === "alignment-noise") noise = v;
      if (a === "align-goals") angles = angles.map(() => 0);
      if (a === "wrong-goals") angles = angles.map(() => Math.PI);
      if (a === "scramble-goals")
        angles = Array.from({ length: 24 }, () => rng() * 2 * Math.PI);
      t = 0;
    },
    step() {
      const mean = Math.atan2(
        angles.reduce((s, x) => s + Math.sin(x), 0),
        angles.reduce((s, x) => s + Math.cos(x), 0),
      );
      angles = angles.map(
        (x) =>
          x +
          Math.atan2(Math.sin(mean - x), Math.cos(mean - x)) * coupling +
          (rng() - 0.5) * noise,
      );
      t++;
    },
    snapshot() {
      return {
        type: "arrows",
        angles: [...angles],
        ...order(angles),
        coupling,
        noise,
        t,
        done: t >= 100,
      };
    },
  };
}
export function createChannel(seed) {
  let p = 0.04,
    repetition = false,
    shared = false,
    run = null,
    trial = 0;
  const rng = randomSource(seed);
  function send() {
    const bits = Array.from({ length: 12 }, () => +(rng() > 0.5));
    run = {
      p,
      repetition,
      shared,
      hops: 0,
      totalHops: 3,
      bits,
      copies: Array.from({ length: repetition ? 5 : 1 }, () => [...bits]),
      done: false,
      trial: ++trial,
    };
  }
  return {
    act(a, v) {
      if (a === "channel-noise") p = v;
      if (a === "toggle-redundancy") repetition = v;
      if (a === "shared-errors") shared = v;
      if (a === "send-message") send();
    },
    step() {
      if (!run || run.done) return;
      const sharedFlips = run.bits.map(() => rng() < run.p);
      run.copies = run.copies.map((c) =>
        c.map((bit, i) =>
          (run.shared ? sharedFlips[i] : rng() < run.p) ? 1 - bit : bit,
        ),
      );
      run.hops++;
      if (run.hops === run.totalHops) {
        run.done = true;
        run.decoded = majority(run.copies);
        run.errors = run.decoded.filter((b, i) => b !== run.bits[i]).length;
        const effective = hopError(run.p, run.hops);
        run.expected =
          run.repetition && !run.shared ? majorityError(effective) : effective;
      }
    },
    snapshot() {
      return {
        type: "bits",
        p,
        repetition,
        shared,
        run: clone(run),
        done: !run || run.done,
      };
    },
  };
}
