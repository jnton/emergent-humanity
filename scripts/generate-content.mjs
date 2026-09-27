import { writeFile, readFile } from "node:fs/promises";
import { SECTIONS } from "../content/sections.js";
import { ILLUSTRATIONS } from "../content/illustrations.js";
import { REFERENCES } from "../content/references.js";
const root = new URL("../", import.meta.url),
  check = process.argv.includes("--check");
const escape = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
const shell = (title, body) =>
  `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} — Emergent Humanity</title><link rel="stylesheet" href="css/lab.css"></head><body><main class="methods"><a href="index.html">← Interactive essay</a><h1>${title}</h1>${body}</main></body></html>\n`;
let essay =
  "# Emergent Humanity\n\nGenerated from content/sections.js. Illustrative models show consequences of assumptions, not a universal theory of civilization.\n";
let notes =
  "# Emergent Humanity — Implemented model notes\n\nThese notes describe the quantitative experiments at lab.html. The main animated essay uses separate illustrative visualizations. Generated from the canonical chapter records. Model version 2.0.0. Mathematical results are conditional on assumptions. Independent specialist review remains pending.\n";
let methods =
  '<p>The <a href="index.html">animated essay</a> uses the original visual illustrations. These notes describe the separate <a href="lab.html">quantitative model lab</a>.</p><p>These are inspectable toy models and illustrations. They do not establish that a mechanism dominates real societies. Mathematical, empirical, interpretive, and normative claims are different kinds of claims.</p><p>The models are deterministic for a fixed seed and sequence of actions. Default seed: 74291. Run advances a fixed logical step every 300 ms; Step advances once. Drawing size and display refresh rate do not affect scientific state. There is no human flourishing score.</p><p><strong>Review status:</strong> local implementation checks are distinct from independent specialist review, which is still pending. Source access limitations are listed below.</p><nav aria-label="Model chapters"><ol>' +
  SECTIONS.map(
    (s) => `<li><a href="#${s.id}">${escape(s.title)}</a></li>`,
  ).join("") +
  "</ol></nav>";
let reading = "";
const claims = [];
for (const s of SECTIONS) {
  const m = s.method;
  const reader = { ...s, ...ILLUSTRATIONS[s.id] };
  for (const id of m.sources)
    if (!REFERENCES[id]) throw new Error(`Missing reference ${id}`);
  essay += `\n## ${s.number} — ${s.title}\n\n*${reader.subtitle}*\n\n${reader.body.join("\n\n")}\n\n**Key insight:** ${reader.insight}\n\n**Limit:** ${m.limits}\n`;
  notes += `\n## ${s.number} — ${s.title}\n\nType: ${m.kind}\n\nAssumptions: ${m.assumptions}\n\nParameters: ${m.parameters}\n\n${m.formula}\n\nLimits: ${m.limits}\n\n${m.sources.map((id) => `${REFERENCES[id].title}: ${REFERENCES[id].url}`).join("\n")}\n`;
  reading += `<article id="${s.id}"><p class="section-number">${s.number}</p><h2>${escape(s.title)}</h2><p>${escape(reader.subtitle)}</p>${reader.body.map((p) => `<p>${escape(p)}</p>`).join("")}<aside class="insight">${escape(reader.insight)}</aside><p><strong>Limit:</strong> ${escape(m.limits)}</p><a href="methods.html#${s.id}">Model and sources</a></article>`;
  methods += `<article id="${s.id}"><h2>${s.number} — ${escape(s.title)}</h2><dl>${[
    ["Claim type", m.kind],
    ["Assumptions", m.assumptions],
    ["Parameters and intervention", m.parameters],
    ["What this does not establish", m.limits],
  ]
    .map(([k, v]) => `<dt>${k}</dt><dd>${escape(v)}</dd>`)
    .join(
      "",
    )}</dl><p>Update rule / observable (plain-text mathematical notation):</p><pre>${escape(m.formula)}</pre><p>${escape(m.reviewStatus)}</p><ul>${m.sources
    .map((id) => {
      const r = REFERENCES[id];
      return `<li><a href="${escape(r.url)}">${escape(r.title)}</a><p>${escape(r.scope)} ${escape(r.status)}</p></li>`;
    })
    .join(
      "",
    )}</ul><a href="lab.html#section-${s.id}">Try this experiment →</a></article>`;
  claims.push({
    id: `${s.id}-principal`,
    chapter: s.id,
    exactText: s.insight,
    kind: m.kind,
    modelVersion: m.version,
    assumptions: m.assumptions,
    observable: m.formula,
    sourceIds: m.sources,
    limitations: m.limits,
    reviewStatus: m.reviewStatus,
    reviewedAt: "2026-09-27",
  });
}
const outputs = {
  "content/essay.md": essay,
  "content/model-notes.md": notes,
  "methods.html": shell("Models, evidence, and limits", methods),
  "essay.html": shell("Read the essay", reading),
  "content/claims.json": JSON.stringify(claims, null, 2) + "\n",
};
for (const [path, text] of Object.entries(outputs)) {
  if (check) {
    if ((await readFile(new URL(path, root), "utf8")) !== text)
      throw new Error(`${path} is stale; run npm run generate`);
  } else await writeFile(new URL(path, root), text);
}
console.log(
  `${check ? "Checked" : "Generated"} ${Object.keys(outputs).length} editions from ${SECTIONS.length} chapter records.`,
);
