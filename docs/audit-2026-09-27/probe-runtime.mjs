// Audit utility: run from the repository root with the loopback preview on port 4174.
import { chromium } from 'playwright';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch();const p=await browser.newPage({viewport:{width:390,height:844},hasTouch:true});
await p.goto('http://127.0.0.1:4174');await p.waitForFunction(()=>window.emergentHumanity);await p.addStyleTag({content:'html{scroll-behavior:auto!important}'});
const go=async id=>{await p.locator('#section-'+id).evaluate(e=>window.scrollTo(0,e.offsetTop-65));await p.waitForTimeout(500)};
const out={};
await go('entropy');await p.locator('#ctrl-send-message').evaluate(e=>e.click());await p.locator('#ctrl-toggle-redundancy').evaluate(e=>{e.checked=true;e.dispatchEvent(new Event('change',{bubbles:true}))});await p.waitForTimeout(5500);out.changedInFlight=await p.locator('#stats-entropy').innerText();
await go('illusion-of-significance');out.chaosBefore=await p.locator('#canvas-illusion-of-significance').evaluate(c=>({backing:c.width,css:c.clientWidth}));await p.setViewportSize({width:844,height:390});await p.waitForTimeout(500);out.chaosAfter=await p.locator('#canvas-illusion-of-significance').evaluate(c=>({backing:c.width,css:c.clientWidth,parent:c.parentElement.clientWidth}));await p.locator('#section-illusion-of-significance').screenshot({path:'docs/audit-2026-09-27/rotation-chaos.png'});
await p.setViewportSize({width:390,height:844});await p.emulateMedia({reducedMotion:'reduce'});await go('connection-quality');out.reducedBefore=await p.locator('#stats-connection-quality').innerText();await p.waitForTimeout(1200);out.reducedAfter=await p.locator('#stats-connection-quality').innerText();
await p.emulateMedia({reducedMotion:'no-preference'});
for(const sec of await p.locator('.section').all()){
 const id=await sec.getAttribute('data-section-id');await go(id);
 for(const el of await sec.locator('.viz-controls button').all()){if(/Reset|Scramble|Stable Regime/.test(await el.innerText()))continue;await el.evaluate(e=>e.click())}
 for(const el of await sec.locator('.viz-controls input[type=range]').all())await el.evaluate(e=>{e.value=e.max;e.dispatchEvent(new Event('input',{bubbles:true}))});
 await p.waitForTimeout(id==='intro'?4800:800);
 await sec.locator('.viz-pane').screenshot({path:`docs/audit-2026-09-27/interacted-${id}.png`});
}
await writeFile('docs/audit-2026-09-27/runtime-probes.json',JSON.stringify(out,null,2));console.log(out);await browser.close();
