import { test } from "node:test";
import assert from "node:assert/strict";
import {
  graphMetrics,
  ring,
  uniqueEdges,
  order,
  hopError,
  majorityError,
  majority,
  dominates,
} from "../js/models/core.js";
import { createExperiment } from "../js/models/index.js";
test("graph fixtures and canonical edges", () => {
  assert.equal(graphMetrics([], []).efficiency, 0);
  assert.equal(graphMetrics([{ id: 0 }], []).largest, 1);
  const g = ring(4);
  assert.equal(graphMetrics(g.nodes, g.edges).efficiency, 5 / 6);
  assert.equal(
    uniqueEdges([
      [0, 1],
      [1, 0],
      [0, 0],
    ]).length,
    1,
  );
});
test("removal separates task coverage from reachability", () => {
  const m = createExperiment("emergent-organism");
  m.act("remove-specialist");
  assert.equal(m.snapshot().coverage, 2);
  assert.equal(m.snapshot().metrics.largest, 12);
  m.reset();
  m.act("remove-hub");
  assert.equal(m.snapshot().coverage, 3);
  assert.equal(m.snapshot().metrics.largest, 6);
});
test("alignment is not accuracy", () => {
  assert.equal(order([0, 0]).r, 1);
  assert.equal(order([Math.PI, Math.PI]).q, -1);
  assert.ok(order([0, Math.PI]).r < 1e-12);
});
test("coding parameters belong to the run", () => {
  const m = createExperiment("entropy");
  m.act("channel-noise", 0);
  m.act("send-message");
  m.act("toggle-redundancy", true);
  m.act("channel-noise", 0.15);
  for (let i = 0; i < 3; i++) m.step();
  const r = m.snapshot().run;
  assert.equal(r.done, true);
  assert.equal(r.copies.length, 1);
  assert.equal(r.errors, 0);
  assert.equal(r.p, 0);
  m.act("send-message");
  assert.equal(m.snapshot().run.copies.length, 5);
});
test("channel mathematics and decoder", () => {
  assert.equal(hopError(0, 3), 0);
  assert.equal(hopError(0.5, 3), 0.5);
  assert.equal(majorityError(0.5), 0.5);
  assert.ok(majorityError(0.1) < 0.1);
  assert.deepEqual(
    majority([
      [1, 0],
      [1, 0],
      [0, 1],
    ]),
    [1, 0],
  );
});
test("seeded replay and reset", () => {
  const a = createExperiment("alignment", 42),
    b = createExperiment("alignment", 42);
  for (let i = 0; i < 50; i++) {
    a.step();
    b.step();
  }
  assert.deepEqual(a.snapshot(), b.snapshot());
  a.reset();
  assert.deepEqual(a.snapshot(), createExperiment("alignment", 42).snapshot());
});
test("Pareto ties do not dominate", () => {
  assert.equal(
    dominates({ cost: 2, service: 1 }, { cost: 3, service: 1 }),
    true,
  );
  assert.equal(
    dominates({ cost: 2, service: 1 }, { cost: 2, service: 1 }),
    false,
  );
});
import { SECTIONS } from "../content/sections.js";
import { randomSource } from "../js/models/core.js";
test("all models replay identically under different rendering schedules", () => {
  for (const s of SECTIONS) {
    const a = createExperiment(s.id, 82),
      b = createExperiment(s.id, 82);
    for (const c of s.controls) {
      const v =
        c.type === "slider"
          ? c.value
          : c.type === "switch"
            ? c.value
            : undefined;
      a.act(c.id, v);
      b.act(c.id, v);
    }
    for (let i = 0; i < 100; i++) {
      a.step();
      b.step();
      for (let render = 0; render < 4; render++) b.snapshot();
    }
    assert.deepEqual(a.snapshot(), b.snapshot(), s.id);
  }
});
test("averaging preserves a nonzero common perturbation", () => {
  const m = createExperiment("illusion-of-significance");
  m.act("shift-node");
  for (let i = 0; i < 2000; i++) m.step();
  const s = m.snapshot();
  assert.ok(Math.abs(s.norm - 1e-7 / 24) < 1e-13);
});
test("symmetric opinion updates conserve mean and bounds", () => {
  const m = createExperiment("cohesion");
  const mean = m.snapshot().mean;
  for (let i = 0; i < 100; i++) m.step();
  assert.ok(Math.abs(m.snapshot().mean - mean) < 1e-12);
  assert.ok(m.snapshot().opinions.every((x) => x >= -1 && x <= 1));
});
test("work limits, serial bottleneck and organization are matched", () => {
  const m = createExperiment("node-limits");
  m.act("available-time", 4);
  assert.equal(m.snapshot().completed, 4);
  const parallel = createExperiment("node-quantity"),
    serial = createExperiment("node-quantity");
  serial.act("serial-task", true);
  parallel.step();
  serial.step();
  assert.equal(parallel.snapshot().completed, 6);
  assert.equal(serial.snapshot().completed, 1);
  const organized = createExperiment("productivity");
  organized.act("optimize-all");
  for (let i = 0; i < 4; i++) organized.step();
  assert.equal(organized.snapshot().completed, 24);
  assert.equal(organized.snapshot().workers, 6);
  assert.equal(organized.snapshot().duplicates, 0);
});
test("copies are not independent observations", () => {
  const m = createExperiment("environment");
  m.act("release-info");
  const v = m.snapshot().mean;
  for (let i = 0; i < 10; i++) m.act("copy-observation");
  assert.equal(m.snapshot().independent, 1);
  assert.ok(Math.abs(m.snapshot().mean - v) < 1e-12);
});
test("memory survives origin loss but not loss of every carrier", () => {
  const m = createExperiment("collective-memory");
  m.act("spawn-idea");
  m.step();
  m.act("remove-origin");
  assert.equal(m.snapshot().copies, 1);
  m.act("remove-carrier");
  assert.equal(m.snapshot().copies, 0);
  m.step();
  assert.equal(m.snapshot().copies, 0);
});
test("archive loss, alteration and access are distinct", () => {
  const m = createExperiment("external-storage");
  m.act("invent");
  m.act("replicate-record");
  m.act("lose-person");
  m.act("alter-record");
  assert.equal(m.snapshot().originals, 1);
  m.act("lose-access");
  assert.equal(m.snapshot().usable, 0);
  m.act("lose-access");
  m.act("shared-loss");
  assert.equal(m.snapshot().originals, 0);
});
test("channel Monte Carlo matches independent-copy theory", () => {
  const rng = randomSource(19);
  const p = 0.12,
    h = 3,
    expected = majorityError(hopError(p, h));
  let errors = 0;
  const n = 40000;
  for (let i = 0; i < n; i++) {
    let votes = 0;
    for (let c = 0; c < 5; c++) {
      let bit = 0;
      for (let j = 0; j < h; j++) if (rng() < p) bit = 1 - bit;
      votes += bit;
    }
    errors += +(votes >= 3);
  }
  assert.ok(
    Math.abs(errors / n - expected) < 0.008,
    `${errors / n} vs ${expected}`,
  );
});
test("perfect channel preserves an incorrect source", () => {
  const m = createExperiment("connection-quality");
  m.act("source-true", false);
  assert.deepEqual(m.snapshot().values, [1, 0, 0, 0, 0]);
});
test("edge additions saturate without duplicate edges or unbounded work", () => {
  const m = createExperiment("connection-quantity");
  for (let i = 0; i < 100; i++) m.act("deploy-internet");
  const s = m.snapshot();
  assert.equal(s.edges.length, 66);
  assert.equal(uniqueEdges(s.edges).length, 66);
  assert.ok(Math.abs(s.metrics.mean - 1) < 1e-12);
});
test("trade-off frontier uses measured sampled designs", () => {
  const m = createExperiment("whats-next");
  let s = m.snapshot();
  for (const d of s.designs)
    assert.equal(d.front, !s.designs.some((other) => dominates(other, d)));
  m.act("failure-test", true);
  s = m.snapshot();
  assert.ok(s.designs.every((d) => d.excluded.includes(5)));
  assert.ok(s.designs.every((d) => d.cost <= 20));
});
