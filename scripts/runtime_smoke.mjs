import { chromium } from 'playwright';

const url=process.env.SMOKE_URL || 'http://127.0.0.1:8080/';
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
const page=await browser.newPage({viewport:{width:1280,height:720}});
const errors=[];
page.on('pageerror',e=>errors.push('pageerror: '+e.message));
page.on('console',m=>{if(m.type()==='error') errors.push('console: '+m.text())});
await page.goto(url,{waitUntil:'networkidle'});
await page.locator('#start').click();
await page.waitForTimeout(3500);
const result=await page.evaluate(()=>({
 fps:document.querySelector('#fps')?.textContent,
 hp:document.querySelector('#hp')?.textContent,
 canvas:{w:document.querySelector('#game')?.width,h:document.querySelector('#game')?.height},
 startHidden:document.querySelector('#start-panel')?.classList.contains('hidden')
}));
console.log(JSON.stringify(result));
if(errors.length) throw new Error(errors.join('\n'));
if(!result.startHidden) throw new Error('game did not leave start panel');
if(!/^\d+$/.test(result.fps||'')) throw new Error('FPS HUD did not become numeric');
if(Number(result.hp)<=0) throw new Error('player died during smoke window');
if(!result.canvas.w||!result.canvas.h) throw new Error('canvas has zero drawing-buffer size');
await browser.close();
