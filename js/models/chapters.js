import {
  randomSource,
  clone,
  clamp,
  ring,
  graphMetrics,
  distances,
  uniqueEdges,
  order,
  dominates,
} from "./core.js";
export function createPerson() {
  let simple = false,
    lens = "Communication: contacts and messages";
  return {
    act(a) {
      if (a === "simplify-person") simple = !simple;
      if (a === "lens-communication")
        lens = "Communication: contacts and messages";
      if (a === "lens-memory") lens = "Memory: usable copies and access";
      if (a === "lens-task") lens = "Task: skills and available time";
    },
    step() {
      simple = !simple;
    },
    snapshot: () => ({ type: "person", simple, lens, done: true }),
  };
}
export function createCapacity() {
  let budget = 8,
    demand = 16;
  return {
    act(a, v) {
      if (a === "available-time") budget = v;
      if (a === "task-demand") demand = v;
    },
    step() {},
    snapshot: () => ({
      type: "capacity",
      budget,
      demand,
      completed: Math.min(budget, demand),
      done: true,
    }),
  };
}
export function createRoles() {
  let connected = false,
    missing = false;
  return {
    act(a) {
      if (a === "connect-roles") connected = !connected;
      if (a === "missing-role") missing = !missing;
    },
    step() {},
    snapshot: () => ({
      type: "roles",
      connected,
      missing,
      success: connected && !missing,
      done: true,
    }),
  };
}
export function createJobs(seed, quantity = false) {
  let workers = 6,
    serial = false,
    organized = quantity,
    badPlan = false,
    t = 0,
    attempts = 0,
    duplicates = 0,
    completed = new Set(),
    communications = 0,
    rng = randomSource(seed);
  function restart() {
    t = 0;
    attempts = 0;
    duplicates = 0;
    completed = new Set();
    communications = 0;
    rng = randomSource(seed);
  }
  return {
    act(a, v) {
      if (a === "population-slider") workers = v;
      if (a === "serial-task") serial = v;
      if (a === "optimize-all") organized = true;
      if (a === "uncoordinated") organized = false;
      if (a === "bad-plan") badPlan = v;
      restart();
    },
    step() {
      if (completed.size === 24 || t >= 24) return;
      t++;
      for (let i = 0; i < (serial ? 1 : workers); i++) {
        if (completed.size === 24) break;
        const job = organized
          ? Array.from({ length: 24 }, (_, j) => j).find(
              (j) => !completed.has(j),
            )
          : Math.floor(rng() * 24);
        attempts++;
        if (organized) communications++;
        if (completed.has(job)) duplicates++;
        else if (!badPlan) completed.add(job);
      }
    },
    snapshot() {
      return {
        type: "jobs",
        workers,
        serial,
        organized,
        badPlan,
        t,
        attempts,
        duplicates,
        communications,
        completed: completed.size,
        total: 24,
        done: completed.size === 24 || t >= 24,
      };
    },
  };
}
export function createConnectivity() {
  const base = ring(12);
  const candidates = [];
  for (let a = 0; a < 12; a++)
    for (let b = a + 1; b < 12; b++)
      if (!base.edges.some((e) => e.includes(a) && e.includes(b)))
        candidates.push([a, b]);
  candidates.sort(
    (a, b) =>
      Math.min(b[1] - b[0], 12 - b[1] + b[0]) -
      Math.min(a[1] - a[0], 12 - a[1] + a[0]),
  );
  let added = 0,
    budget = 2;
  const edges = () =>
    uniqueEdges([...base.edges, ...candidates.slice(0, added)]);
  return {
    act(a, v) {
      if (a === "deploy-internet")
        added = Math.min(candidates.length, added + 1);
      if (a === "link-count") added = v;
      if (a === "processing-budget") budget = v;
    },
    step() {},
    snapshot() {
      const es = edges(),
        degrees = base.nodes.map(
          (n) => es.filter((e) => e.includes(n.id)).length,
        );
      return {
        type: "graph",
        kind: "connectivity",
        ...base,
        edges: es,
        added,
        budget,
        served:
          degrees.reduce((sum, k) => sum + Math.min(k, budget), 0) /
          (2 * es.length),
        metrics: graphMetrics(base.nodes, es),
        done: true,
      };
    },
  };
}
export function createChain(seed) {
  let truth = 1,
    sourceTrue = true,
    reliability = 1,
    interpret = true,
    amplify = false,
    values = [1, 1, 1, 1, 1],
    rng = randomSource(seed),
    trials = 0,
    correct = 0,
    repeated = 0;
  function transmit() {
    const src = sourceTrue ? truth : 1 - truth,
      channel = rng() < reliability ? src : 1 - src,
      receiver = interpret ? channel : 1 - channel;
    const repeat = !amplify || receiver !== truth;
    values = [truth, src, channel, receiver, repeat ? receiver : "–"];
    trials++;
    correct += +(receiver === truth);
    repeated += +repeat;
  }
  transmit();
  return {
    act(a, v) {
      if (a === "source-true") sourceTrue = v;
      if (a === "fidelity-slider") reliability = v;
      if (a === "interpret-correctly") interpret = v;
      if (a === "amplify-errors") amplify = v;
      transmit();
    },
    step: transmit,
    snapshot: () => ({
      type: "chain",
      truth,
      values: [...values],
      sourceTrue,
      reliability,
      interpret,
      amplify,
      trials,
      correct,
      repeated,
      done: trials >= 30,
    }),
  };
}
export function createOpinions(seed) {
  let selectivity = 0.6,
    trusted = false,
    t = 0,
    opinions = [],
    rng;
  function reset() {
    rng = randomSource(seed);
    opinions = Array.from({ length: 40 }, () => rng() * 2 - 1);
    t = 0;
    trusted = false;
  }
  reset();
  return {
    act(a, v) {
      if (a === "polarize-slider") {
        selectivity = v;
        reset();
      }
      if (a === "deploy-bridges") trusted = true;
    },
    step() {
      for (let j = 0; j < 20; j++) {
        const a = Math.floor(rng() * 40),
          b = Math.floor(rng() * 40),
          delta = opinions[b] - opinions[a];
        if (
          Math.abs(delta) <= 1.85 - 1.7 * selectivity ||
          (trusted && (a < 3 || b < 3))
        ) {
          opinions[a] += 0.12 * delta;
          opinions[b] -= 0.12 * delta;
        }
      }
      t++;
    },
    snapshot() {
      const mean = opinions.reduce((s, x) => s + x, 0) / 40;
      return {
        type: "opinions",
        opinions: [...opinions],
        mean,
        sd: Math.sqrt(opinions.reduce((s, x) => s + (x - mean) ** 2, 0) / 40),
        epsilon: 1.85 - 1.7 * selectivity,
        trusted,
        t,
        done: t >= 100,
      };
    },
  };
}
export function createLearning(seed) {
  let observations = [],
    independent = 0,
    bias = false,
    copies = 0,
    rng = randomSource(seed);
  function observe() {
    observations.push(50 + (rng() - 0.5) * 30 + (bias ? 15 : 0));
    independent++;
  }
  return {
    act(a, v) {
      if (a === "release-info") observe();
      if (a === "copy-observation" && observations.length) {
        observations.push(observations.at(-1));
        copies++;
      }
      if (a === "sensor-bias") {
        bias = v;
        observations = [];
        independent = 0;
        copies = 0;
        rng = randomSource(seed);
      }
    },
    step: observe,
    snapshot() {
      const mean = observations.length
        ? observations.reduce((s, x) => s + x, 0) / observations.length
        : 0;
      return {
        type: "estimate",
        truth: 50,
        observations: [...observations],
        independent,
        copies,
        bias,
        mean,
        error: observations.length ? Math.abs(mean - 50) : null,
        done: observations.length >= 50,
      };
    },
  };
}
export function createMemory(seed) {
  const base = ring(12);
  let carriers = new Map(),
    removed = new Set(),
    mutation = false,
    t = 0,
    rng = randomSource(seed);
  return {
    act(a, v) {
      if (a === "spawn-idea") {
        carriers = new Map([[0, 0]]);
        removed = new Set();
        t = 0;
        rng = randomSource(seed);
      }
      if (a === "mutate-copy") mutation = v;
      if (a === "remove-origin") {
        removed.add(0);
        carriers.delete(0);
      }
      if (a === "remove-carrier") {
        const id =
          [...carriers.keys()].find((x) => x !== 0) ?? [...carriers.keys()][0];
        if (id !== undefined) {
          removed.add(id);
          carriers.delete(id);
        }
      }
    },
    step() {
      const additions = [];
      for (const [id, variant] of carriers) {
        const neighbors = base.edges
          .filter((e) => e.includes(id))
          .map((e) => e.find((x) => x !== id));
        for (const other of neighbors)
          if (
            !removed.has(other) &&
            !carriers.has(other) &&
            !additions.some(([x]) => x === other)
          ) {
            additions.push([
              other,
              mutation && rng() < 0.08 ? variant + 1 : variant,
            ]);
            break;
          }
      }
      for (const [id, v] of additions) carriers.set(id, v);
      t++;
    },
    snapshot() {
      return {
        type: "graph",
        kind: "memory",
        nodes: base.nodes
          .filter((n) => !removed.has(n.id))
          .map((n) => ({
            ...n,
            carrier: carriers.has(n.id),
            color: carriers.has(n.id)
              ? carriers.get(n.id) === 0
                ? "#ffc77a"
                : "#fa8c9a"
              : "#79baff",
          })),
        edges: base.edges.filter((e) => e.every((x) => !removed.has(x))),
        copies: carriers.size,
        originals: [...carriers.values()].filter((v) => v === 0).length,
        origin: !removed.has(0),
        mutation,
        t,
        done:
          carriers.size === 0 || carriers.size === 12 - removed.size || t >= 20,
      };
    },
  };
}
export function createStorage() {
  let copies = [0, null, null],
    accessible = true;
  return {
    act(a) {
      if (a === "invent" && copies[0] !== null) copies[1] = copies[0];
      if (a === "replicate-record" && copies[1] !== null) copies[2] = copies[1];
      if (a === "lose-person") copies[0] = null;
      if (a === "lose-record") copies[1] = null;
      if (a === "alter-record" && copies[1] !== null) copies[1] = 1;
      if (a === "shared-loss") {
        copies[1] = null;
        copies[2] = null;
      }
      if (a === "lose-access") accessible = !accessible;
    },
    step() {},
    snapshot: () => ({
      type: "storage",
      copies: [...copies],
      accessible,
      originals: copies.filter((v) => v === 0).length,
      usable: copies.filter((v, i) => v === 0 && (i === 0 || accessible))
        .length,
      done: true,
    }),
  };
}
export function createChaos() {
  const n = 24,
    adj = Array.from({ length: n }, (_, i) => [(i + 1) % n, (i + n - 1) % n]);
  let regime = "averaging",
    a,
    b,
    t,
    perturbed,
    initial;
  function reset() {
    a = Array.from({ length: n }, (_, i) => 0.12 + ((i * 37) % 83) / 100);
    b = [...a];
    t = 0;
    perturbed = false;
    initial = 0;
  }
  reset();
  return {
    act(action) {
      if (action === "stable-regime") {
        regime = "averaging";
        reset();
      }
      if (action === "sensitive-regime") {
        regime = "sensitive";
        reset();
      }
      if (action === "shift-node" && !perturbed) {
        b[0] += 1e-7;
        initial = 1e-7;
        t = 0;
        perturbed = true;
      }
    },
    step() {
      const update = (values) => {
        const v =
          regime === "sensitive"
            ? values.map((x) => 3.9 * x * (1 - x))
            : values;
        return v.map((x, i) =>
          regime === "sensitive"
            ? 0.92 * x + (0.08 * (v[adj[i][0]] + v[adj[i][1]])) / 2
            : 0.62 * x + (0.38 * (v[adj[i][0]] + v[adj[i][1]])) / 2,
        );
      };
      a = update(a);
      b = update(b);
      t++;
    },
    snapshot() {
      const norm = Math.max(...a.map((x, i) => Math.abs(x - b[i])));
      return {
        type: "twins",
        a: [...a],
        b: [...b],
        regime,
        t,
        perturbed,
        norm,
        growth:
          perturbed && t > 0 && norm > 0 ? Math.log(norm / initial) / t : null,
        done: t >= 100,
      };
    },
  };
}
export function createComparative(seed) {
  let mode = "trace",
    t = 0,
    traces = [0.6, 0.4],
    rng = randomSource(seed),
    angles = Array.from({ length: 24 }, () => rng() * Math.PI * 2);
  const base = ring(12);
  let damage = false;
  return {
    act(a) {
      mode =
        a === "pattern-alignment"
          ? "alignment"
          : a === "pattern-network"
            ? "network"
            : a === "pattern-trace"
              ? "trace"
              : mode;
      if (a === "damage-network") damage = !damage;
    },
    step() {
      t++;
      traces = traces.map((v, i) => 0.93 * v + 0.055 * (i === 0 ? 3 : 2));
      const mean = Math.atan2(
        angles.reduce((s, x) => s + Math.sin(x), 0),
        angles.reduce((s, x) => s + Math.cos(x), 0),
      );
      angles = angles.map(
        (x) => x + 0.12 * Math.atan2(Math.sin(mean - x), Math.cos(mean - x)),
      );
    },
    snapshot() {
      if (mode === "alignment")
        return {
          type: "arrows",
          kind: "comparative",
          angles: [...angles],
          ...order(angles),
          t,
          done: t >= 40,
        };
      if (mode === "network") {
        const edges = damage
          ? base.edges.filter((e) => !e.includes(0))
          : base.edges;
        return {
          type: "graph",
          kind: "comparative",
          ...base,
          edges,
          metrics: graphMetrics(base.nodes, edges),
          damage,
          done: true,
        };
      }
      return {
        type: "traces",
        kind: "comparative",
        labels: ["Trail trace (toy units)", "Public trace (toy units)"],
        traces: [...traces],
        t,
        done: t >= 40,
      };
    },
  };
}
function design(extra, failed) {
  const base = ring(12),
    chords = [
      [0, 6],
      [0, 3],
      [0, 9],
      [2, 8],
      [3, 9],
      [1, 7],
      [4, 10],
      [5, 11],
    ].slice(0, extra),
    edges = uniqueEdges([...base.edges, ...chords]),
    nodes = failed ? base.nodes.filter((n) => n.id !== 5) : base.nodes,
    live = failed ? edges.filter((e) => !e.includes(5)) : edges,
    d = distances(nodes, live, 0);
  const served = Array.from({ length: 11 }, (_, i) => i + 1).filter(
    (id) => d.has(id) && d.get(id) <= 3,
  );
  return {
    cost: edges.length,
    service: served.length / 11,
    served,
    excluded: Array.from({ length: 11 }, (_, i) => i + 1).filter(
      (id) => !served.includes(id),
    ),
    metrics: graphMetrics(nodes, live, 12),
  };
}
export function createTradeoff() {
  let extra = 0,
    failed = false;
  return {
    act(a, v) {
      if (a === "design-links") extra = v;
      if (a === "failure-test") failed = v;
    },
    step() {},
    snapshot() {
      const designs = Array.from({ length: 9 }, (_, i) => ({
        ...design(i, failed),
        selected: i === extra,
      }));
      for (const d of designs)
        d.front = !designs.some((other) => dominates(other, d));
      return {
        type: "tradeoff",
        designs,
        current: designs[extra],
        failed,
        extra,
        done: true,
      };
    },
  };
}
