import {
  createPerson,
  createCapacity,
  createRoles,
  createJobs,
  createConnectivity,
  createChain,
  createOpinions,
  createLearning,
  createMemory,
  createStorage,
  createChaos,
  createComparative,
  createTradeoff,
} from "./chapters.js";
import {
  createRemoval,
  createAlignment,
  createChannel,
  clone,
} from "./core.js";
export const MODEL_VERSION = "2.0.0";
export function createExperiment(id, seed = 74291) {
  const factory = {
    "emergent-organism": createRemoval,
    alignment: createAlignment,
    entropy: createChannel,
    "node-capacity": createPerson,
    "node-limits": createCapacity,
    intro: createRoles,
    "node-quantity": (seed) => createJobs(seed, true),
    "connection-quantity": createConnectivity,
    "connection-quality": createChain,
    cohesion: createOpinions,
    environment: createLearning,
    "collective-memory": createMemory,
    "external-storage": createStorage,
    "illusion-of-significance": createChaos,
    productivity: createJobs,
    "comparative-emergence": createComparative,
    "whats-next": createTradeoff,
  }[id];
  if (!factory) throw new Error(`Unknown experiment: ${id}`);
  let model = factory(seed);
  return {
    act: (a, v) => model.act(a, v),
    step: () => model.step(),
    snapshot: () => ({
      ...clone(model.snapshot()),
      canRun: [
        "alignment",
        "entropy",
        "illusion-of-significance",
        "node-quantity",
        "connection-quality",
        "cohesion",
        "environment",
        "collective-memory",
        "productivity",
        "comparative-emergence",
      ].includes(id),
    }),
    reset() {
      model = factory(seed);
    },
  };
}
export function describe(s) {
  if (s.type === "graph" && !s.kind)
    return `Largest surviving component: ${s.metrics.largest}/13 original people. Reachable ordered pairs: ${(s.metrics.reach * 100).toFixed(0)}%. Required skills available: ${s.coverage}/3. ${s.removed === null ? "No removal." : `Removed node ${s.removed}.`}`;
  if (s.type === "arrows" && !s.kind)
    return `Coherence R = ${s.r.toFixed(2)}. Mean target projection Q = ${s.q.toFixed(2)} (−1 away, +1 toward). Coupling ${s.coupling.toFixed(2)}, noise ${s.noise.toFixed(2)}. Step ${s.t}.`;
  if (s.type === "bits") {
    const r = s.run;
    return !r
      ? "Ready. Choose settings, send a message, then Step through three hops or Run. Red squares mark differences from the original."
      : `Run ${r.trial}: ${r.repetition ? "5 copies" : "1 copy"}, p = ${r.p}, ${r.shared ? "shared" : "independent"} errors. Hop ${r.hops}/3. ${r.done ? `Decoded errors ${r.errors}/12. Expected per-bit error ${(r.expected * 100).toFixed(1)}%.` : "Transmission paused or in progress; Step or Run to continue."} Settings changes apply to the next message.`;
  }

  if (s.type === "person")
    return `${s.simple ? "Simplified node" : "Human illustration"}. Lens: ${s.lens}. Experience, values, relationships and other properties are omitted; no lens is a complete person.`;
  if (s.type === "capacity")
    return `${s.completed} of ${s.demand} work units completed in this interval; ${s.demand - s.completed} deferred. Available capacity ${s.budget}. One task uses one unit: an illustrative resource budget, not a biological maximum.`;
  if (s.type === "roles")
    return `${s.success ? "Task completed" : "Task incomplete"}. ${s.connected ? "Roles connected" : "Roles isolated"}; ${s.missing ? "verification role absent" : "all four required roles available"}. Success requires all roles and their coordination.`;
  if (s.type === "jobs")
    return `Round ${s.t}: ${s.completed}/${s.total} correct jobs completed with ${s.workers} workers. ${s.attempts} attempts; ${s.duplicates} duplicates; ${s.communications} assignment messages. ${s.serial ? "Only one job can advance per round." : s.organized ? "Workers share an assignment queue." : "Workers independently select jobs."} ${s.badPlan ? "The shared plan is wrong; attempted jobs are not correct." : ""}`;
  if (s.kind === "connectivity")
    return `${s.edges.length} links. Mean distance among reachable pairs ${s.metrics.mean.toFixed(2)} hops; ${(100 * s.metrics.reach).toFixed(0)}% pairs reachable. ${(100 * s.served).toFixed(0)}% of one-unit-per-link demand serviced with budget ${s.budget} per person.`;
  if (s.type === "chain")
    return `Underlying truth: ${s.truth}. Receiver has ${s.values[3] === s.truth ? "correct" : "incorrect"} claim. ${s.correct}/${s.trials} trials interpreted correctly; ${s.repeated} claims selected for repetition. ${s.amplify ? "Selection deliberately repeats only incorrect claims: an adversarial example, not a general law." : "All received claims are repeated."}`;
  if (s.type === "opinions")
    return `Step ${s.t}. Confidence bound ε = ${s.epsilon.toFixed(2)}. Opinion SD ${s.sd.toFixed(3)}; mean ${s.mean.toFixed(3)}. ${s.trusted ? "Three agents can interact across all opinion distances by assumption." : "Only sufficiently similar opinions interact."} Dispersion is not a complete measure of polarization.`;
  if (s.type === "estimate")
    return s.observations.length
      ? `${s.observations.length} displayed observations, from ${s.independent} independent draws and ${s.copies} repeats. Mean ${s.mean.toFixed(1)}; distance from target ${s.error.toFixed(1)}. ${s.bias ? "Sensor bias: +15 units." : "Unbiased uniform noise: ±15 units."} Repeated copies are not independent evidence.`
      : "Take a measurement or Run. The target is 50. Blue dots are measurements; green marks their mean. No uncertainty interval assumes repeated copies are independent.";
  if (s.kind === "memory")
    return `${s.copies} live copies, ${s.originals} exact originals. Origin ${s.origin ? "present" : "removed"}. ${s.copies ? "The information lineage persists." : "No surviving copies: spawn an idea."} ${s.mutation ? "Mutation probability 8% per copy (illustrative)." : "Exact copying."}`;
  if (s.type === "storage")
    return `${s.originals} exact original copies remain; ${s.usable} are accessible. ${s.accessible ? "Records can be read." : "External records cannot currently be read."} An altered record is not an exact original; storage does not establish truth.`;
  if (s.type === "twins")
    return `${s.regime === "averaging" ? "Averaging: dispersal with a residual" : "Sensitive coupled logistic map"}. Step ${s.t}; maximum separation ${s.norm.toExponential(2)}. ${s.growth === null ? "Apply a perturbation, then Step or Run." : `Finite-time log growth ${s.growth.toFixed(3)} per step (not a maximal Lyapunov exponent).`} ${s.regime === "averaging" ? "A common offset can survive." : ""}`;
  if (s.kind === "comparative" && s.type === "traces")
    return `Step ${s.t}. Both traces use T′ = 0.93T + 0.055F, with fixed F = 3 and 2 respectively. This shares a recurrence, not a biological or institutional mechanism.`;
  if (s.kind === "comparative" && s.type === "arrows")
    return `Step ${s.t}. Generic global alignment: R = ${s.r.toFixed(2)}. Physical heading and abstract effort can share this observable. This is not the original local-neighbor Vicsek model.`;
  if (s.kind === "comparative")
    return `Transport example: ${s.edges.length} links; largest component ${s.metrics.largest}/12; efficiency ${s.metrics.efficiency.toFixed(3)}. ${s.damage ? "Edges at node 0 removed." : "Intact ring."} This measures a specified failure, not general robustness or Physarum physiology.`;
  if (s.type === "tradeoff")
    return `${s.current.cost}/20 link budget used. Delivered within three hops: ${s.current.served.length}/11 requests from node 0. Unserved recipients: ${s.current.excluded.join(", ") || "none"}. ${s.failed ? "Node 5 failed." : "All nodes available."} Green points are nondominated among nine sampled designs; amber is your selection. No universal optimum.`;
  return "";
}
