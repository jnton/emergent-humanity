import { readFileSync } from 'node:fs';

const reportPaths = process.argv.slice(2);
if (reportPaths.length === 0) {
  console.error('Usage: node tests/lighthouse-budgets.mjs <report.json> [...]');
  process.exit(1);
}

const thresholds = {
  performance: 0.70,
  accessibility: 0.95,
  'best-practices': 0.90,
  seo: 0.90,
};

const grouped = new Map();
for (const path of reportPaths) {
  const group = path.replace(/-\d+\.json$/i, '').replace(/\.json$/i, '');
  const reports = grouped.get(group) ?? [];
  reports.push({ path, report: JSON.parse(readFileSync(path, 'utf8')) });
  grouped.set(group, reports);
}

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};

const failures = [];
for (const [group, reports] of grouped) {
  console.log(`\n${group} (${reports.length} runs)`);
  for (const [category, minimum] of Object.entries(thresholds)) {
    const scores = reports.map(({ path, report }) => {
      const score = report.categories?.[category]?.score;
      if (typeof score !== 'number') failures.push(`${path}: missing ${category} score`);
      return score;
    }).filter((score) => typeof score === 'number');

    if (scores.length !== reports.length) continue;
    const aggregate = median(scores);
    const percentages = scores.map((score) => Math.round(score * 100));
    console.log(`- ${category}: median ${Math.round(aggregate * 100)}; runs ${percentages.join(', ')}`);
    if (aggregate < minimum) {
      failures.push(`${group}: ${category} median ${Math.round(aggregate * 100)} is below ${Math.round(minimum * 100)}`);
    }
  }
}

if (failures.length) {
  console.error('\nLighthouse budgets failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('\nLighthouse budgets passed.');
