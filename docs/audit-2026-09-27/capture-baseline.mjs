// Audit utility: run from the repository root with the loopback preview on port 4174.
import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';
const browser=await chromium.launch();
const report=[];
for(const width of [390,1440]){
 const page=await browser.newPage({viewport:{width,height:width===390?844:900},deviceScaleFactor:1,hasTouch:width===390});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4174');await page.waitForFunction(()=>document.querySelectorAll('.section').length===17);
 await page.addStyleTag({content:'html {scroll-behavior:auto !important}'});
 for(const section of await page.locator('.section').all()){
  const id=await section.getAttribute('data-section-id');
  await section.evaluate(e=>window.scrollTo(0,e.offsetTop-65));await page.waitForTimeout(450);
  const metrics=await section.evaluate(e=>{const c=e.querySelector('canvas'),s=e.querySelector('.viz-stats'),h=e.querySelector('.viz-hint');const r=x=>{const b=x.getBoundingClientRect();return {x:b.x,y:b.y,w:b.width,h:b.height}};const a=r(s),b=h?r(h):null;return {canvas:r(c),backing:[c.width,c.height],stats:s.textContent,overlap:b&&a.w>0&&a.h>0&&a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y}});
  await section.locator('.viz-pane').screenshot({path:`docs/audit-2026-09-27/${width}-${id}.png`});report.push({width,id,...metrics});
 }
 console.log(JSON.stringify({width,errors}));
 await page.close();
}
await writeFile('docs/audit-2026-09-27/browser-observations.json',JSON.stringify(report,null,2));
await browser.close();
