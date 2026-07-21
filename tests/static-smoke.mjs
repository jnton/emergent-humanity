import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SECTIONS } from '../content/sections.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFile(resolve(root, path), 'utf8');
const index = await read('index.html');
const app = await read('js/app.js');
const audio = await read('js/audio.js');
const experience = await read('css/experience.css');
const essay = await read('content/essay.md');
const llms = await read('llms.txt');

assert.match(index, /css\/experience\.css/, 'The experience stylesheet must be loaded.');
assert.match(index, /css\/audio\.css/, 'The audio stylesheet must be loaded.');
assert.match(index, /js\/app\.js/, 'The revised application entry point must be loaded.');
assert.match(index, /js\/audio\.js/, 'The soundscape controller must be loaded.');
assert.doesNotMatch(index, /js\/main\.js/, 'The legacy entry point must not be loaded.');
assert.match(index, /application\/ld\+json/, 'Structured website metadata must be present.');
assert.match(index, /href="llms\.txt"/, 'The AI agent guide must be discoverable.');
assert.match(app, /https:\/\/github\.com\/jnton\/emergent-humanity/, 'The source link must target this repository.');
assert.doesNotMatch(app, /startAudioOnInteract|audioBtn\.click\(\)/, 'Ambient audio must never auto-start.');
assert.doesNotMatch(audio, /startAudioOnInteract|\.click\(\)\s*;/, 'The new soundscape must remain explicitly opt-in.');
assert.match(audio, /playActivationCue/, 'Audio activation must provide audible feedback.');
assert.match(audio, /__EMERGENT_AUDIO_DEBUG__/, 'Browser tests need an observable Web Audio signal.');
assert.match(experience, /scroll-snap-type:\s*none/, 'Mandatory snap scrolling must remain disabled.');
assert.match(experience, /:focus-visible/, 'Keyboard focus styles must be present.');

const sectionIds = SECTIONS.map(({ id }) => id);
assert.equal(new Set(sectionIds).size, sectionIds.length, 'Section IDs must be unique.');

const controlIds = SECTIONS.flatMap(({ controls = [] }) => controls.map(({ id }) => id));
assert.equal(new Set(controlIds).size, controlIds.length, 'Control IDs must be unique across the document.');

for (const section of SECTIONS) {
  const escapedId = section.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  assert.match(app, new RegExp(`['"]?${escapedId}['"]?\\s*:`), `Missing visualization mapping for ${section.id}.`);
  assert.ok(essay.includes(section.title), `The text edition is missing ${section.title}.`);
  assert.ok(llms.includes(`\`${section.id}\``), `The AI guide is missing section ID ${section.id}.`);
}

const importPaths = [...app.matchAll(/from\s+['"](\.\/[^'"]+)['"]/g)]
  .map((match) => match[1].split('?')[0]);
for (const importPath of importPaths) {
  await access(resolve(root, 'js', importPath));
}

for (const asset of [
  'assets/icon.png',
  'assets/social-preview.png',
  'content/essay.md',
  'llms.txt',
  'robots.txt',
]) {
  await access(resolve(root, asset));
}

console.log(`Static smoke tests passed for ${SECTIONS.length} chapters and ${controlIds.length} controls.`);
