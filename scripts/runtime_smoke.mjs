import { chromium } from 'playwright';

const url=process.env.SMOKE_URL || 'http://127.0.0.1:8080/?debug=1&seed=1337';
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
const page=await browser.newPage({viewport:{width:1280,height:720}});
const errors=[];
page.on('pageerror',e=>errors.push('pageerror: '+e.message));
page.on('console',m=>{if(m.type()==='error') errors.push('console: '+m.text())});
await page.goto(url,{waitUntil:'networkidle'});
await page.locator('#start').click();
const samples=[];
for(let i=0;i<5;i++){
 await page.waitForTimeout(2000);
 samples.push(await page.evaluate(()=>({
  fps:Number(document.querySelector('#fps')?.textContent||0),
  time:window.__VOID_HARVEST_DEBUG__?.snapshot?.time||0,
  calls:window.__VOID_HARVEST_DEBUG__?.snapshot?.renderer?.calls||0,
  triangles:window.__VOID_HARVEST_DEBUG__?.snapshot?.renderer?.triangles||0,
  geometries:window.__VOID_HARVEST_DEBUG__?.snapshot?.renderer?.geometries||0,
  textures:window.__VOID_HARVEST_DEBUG__?.snapshot?.renderer?.textures||0
 })));
}
const result=await page.evaluate(()=>({
 fps:document.querySelector('#fps')?.textContent,
 hp:document.querySelector('#hp')?.textContent,
 canvas:{w:document.querySelector('#game')?.width,h:document.querySelector('#game')?.height},
 startHidden:document.querySelector('#start-panel')?.classList.contains('hidden'),
 debug:window.__VOID_HARVEST_DEBUG__?.snapshot
}));
console.log(JSON.stringify({result,samples}));
if(errors.length) throw new Error(errors.join('\n'));
if(!result.startHidden) throw new Error('game did not leave start panel');
if(!/^\d+$/.test(result.fps||'')) throw new Error('FPS HUD did not become numeric');
if(Number(result.hp)<=0) throw new Error('player died during smoke window');
if(!result.canvas.w||!result.canvas.h) throw new Error('canvas has zero drawing-buffer size');
if(!result.debug) throw new Error('deterministic debug snapshot unavailable');
const ecology=result.debug.ecology;
if(!ecology) throw new Error('ecology debug snapshot unavailable');
for(const key of ['playerShardCollects','enemyShardConsumes','mutations','partialMutationSalvage','completedMutationShardShare','mutationRuptures','ruptureEnemyHits','ruptureKills']){
 if(!Number.isFinite(ecology[key])) throw new Error('ecology telemetry '+key+' is missing or non-finite');
}
if(ecology.partialMutationSalvage<0) throw new Error('partialMutationSalvage must be non-negative');
if(ecology.completedMutationShardShare<0||ecology.completedMutationShardShare>1) throw new Error('completedMutationShardShare must be within [0,1]');
if(result.debug.renderer.calls<=0) throw new Error('renderer reported zero draw calls');
if(samples.some(s=>!Number.isFinite(s.fps)||!Number.isFinite(s.calls)||!Number.isFinite(s.triangles))) throw new Error('runtime sample contains non-finite metrics');
if(samples.at(-1).time<=samples[0].time) throw new Error('simulation time did not advance during sustained smoke');
if(samples.some(s=>s.calls<=0)) throw new Error('renderer reported zero draw calls in sustained smoke');
await browser.close();
