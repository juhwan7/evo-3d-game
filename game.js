import * as THREE from 'three';

const canvas=document.querySelector('#game');
const ui={
 hp:document.querySelector('#hp'),level:document.querySelector('#level'),score:document.querySelector('#score'),
 time:document.querySelector('#time'),fps:document.querySelector('#fps'),xp:document.querySelector('#xp-fill'),
 message:document.querySelector('#message'),startPanel:document.querySelector('#start-panel'),
 upgradePanel:document.querySelector('#upgrade-panel'),upgradeOptions:document.querySelector('#upgrade-options'),
 gameoverPanel:document.querySelector('#gameover-panel'),summary:document.querySelector('#summary'),
 pause:document.querySelector('#pause')
};

const gl=canvas.getContext('webgl2',{antialias:true,powerPreference:'high-performance'});
if(!gl){
 ui.startPanel.innerHTML='<p class="eyebrow">RENDERER UNAVAILABLE</p><h1>WebGL 2 필요</h1><p>이 브라우저 또는 그래픽 환경에서는 WebGL 2를 사용할 수 없습니다. 브라우저와 그래픽 드라이버를 업데이트하거나 하드웨어 가속을 활성화한 뒤 다시 시도하세요.</p>';
 ui.message.textContent='WebGL 2 초기화 실패 · 게임은 시작되지 않았습니다';
 throw new Error('VOID HARVEST requires WebGL 2');
}
const renderer=new THREE.WebGLRenderer({canvas,context:gl,antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5));
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.15;

const scene=new THREE.Scene();
scene.background=new THREE.Color(0x05070d);
scene.fog=new THREE.FogExp2(0x05070d,0.018);
const camera=new THREE.PerspectiveCamera(58,1,.1,180);
const clock=new THREE.Clock();

scene.add(new THREE.HemisphereLight(0x8fb7ff,0x10131d,1.55));
const sun=new THREE.DirectionalLight(0xcfe0ff,2.6);
sun.position.set(12,22,8);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
sun.shadow.camera.left=-30;sun.shadow.camera.right=30;sun.shadow.camera.top=30;sun.shadow.camera.bottom=-30;
scene.add(sun);

const ground=new THREE.Mesh(
 new THREE.CircleGeometry(56,64),
 new THREE.MeshStandardMaterial({color:0x0b1320,roughness:.93,metalness:.08})
);
ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);

const rings=new THREE.Group();
for(let r=8;r<=48;r+=8){
 const g=new THREE.RingGeometry(r-.035,r+.035,96);
 const m=new THREE.MeshBasicMaterial({color:r%16===0?0x26486f:0x14283d,transparent:true,opacity:.45,side:THREE.DoubleSide});
 const mesh=new THREE.Mesh(g,m);mesh.rotation.x=-Math.PI/2;mesh.position.y=.015;rings.add(mesh);
}
scene.add(rings);

const obstacleMat=new THREE.MeshStandardMaterial({color:0x111d2d,roughness:.8,metalness:.35});
const obstacles=[];
for(let i=0;i<34;i++){
 const a=(i/34)*Math.PI*2+Math.sin(i*4.1)*.22;
 const d=15+(i%6)*5.7;
 const h=1.4+(i%5)*.65;
 const mesh=new THREE.Mesh(new THREE.CylinderGeometry(.45+.08*(i%3),.7,h,6),obstacleMat);
 mesh.position.set(Math.cos(a)*d,h/2,Math.sin(a)*d);mesh.rotation.y=a;mesh.castShadow=true;mesh.receiveShadow=true;
 scene.add(mesh);obstacles.push(mesh);
}

const player=new THREE.Group();
const bodyMat=new THREE.MeshStandardMaterial({color:0x75f6d4,emissive:0x123e3a,emissiveIntensity:1.3,metalness:.35,roughness:.27});
const body=new THREE.Mesh(new THREE.CylinderGeometry(.65,.8,1.3,8),bodyMat);body.position.y=.78;body.castShadow=true;player.add(body);
const core=new THREE.Mesh(new THREE.OctahedronGeometry(.36,0),new THREE.MeshStandardMaterial({color:0xeafcff,emissive:0x6dcdf5,emissiveIntensity:2.2}));
core.position.y=1.55;player.add(core);
const ring=new THREE.Mesh(new THREE.TorusGeometry(.95,.05,8,32),new THREE.MeshBasicMaterial({color:0x6fa8ff}));
ring.rotation.x=Math.PI/2;ring.position.y=.18;player.add(ring);
scene.add(player);

const enemyGeo=new THREE.OctahedronGeometry(.72,1);
const enemyMats=[
 new THREE.MeshStandardMaterial({color:0xff5a7c,emissive:0x501022,emissiveIntensity:1.2,roughness:.35}),
 new THREE.MeshStandardMaterial({color:0xffa85a,emissive:0x4b2710,emissiveIntensity:1.0,roughness:.4}),
 new THREE.MeshStandardMaterial({color:0xb778ff,emissive:0x32114e,emissiveIntensity:1.2,roughness:.35})
];
const bulletGeo=new THREE.SphereGeometry(.11,8,8);
const bulletMat=new THREE.MeshBasicMaterial({color:0x8dffe1});
const shardGeo=new THREE.IcosahedronGeometry(.18,0);
const shardMat=new THREE.MeshStandardMaterial({color:0x89c8ff,emissive:0x225999,emissiveIntensity:1.8});

let enemies=[],bullets=[],shards=[];
const keys=new Set();
const state={
 running:false,paused:false,gameOver:false,time:0,hp:100,maxHp:100,level:1,xp:0,nextXp:7,score:0,
 speed:8.4,fireRate:.48,fireTimer:0,damage:1,bulletSpeed:24,magnet:2.2,spawnTimer:0,spawnEvery:1.05,maxEnemies:58,
 kills:0,regen:0,pierce:0
};

function reset(){
 enemies.forEach(x=>scene.remove(x.mesh));bullets.forEach(x=>scene.remove(x.mesh));shards.forEach(x=>scene.remove(x.mesh));
 enemies=[];bullets=[];shards=[];Object.assign(state,{running:true,paused:false,gameOver:false,time:0,hp:100,maxHp:100,level:1,xp:0,nextXp:7,score:0,speed:8.4,fireRate:.48,fireTimer:0,damage:1,bulletSpeed:24,magnet:2.2,spawnTimer:0,spawnEvery:1.05,maxEnemies:58,kills:0,regen:0,pierce:0});
 player.position.set(0,0,0);ui.startPanel.classList.add('hidden');ui.gameoverPanel.classList.add('hidden');ui.upgradePanel.classList.add('hidden');ui.pause.classList.add('hidden');clock.getDelta();updateHud();
}

function spawnEnemy(){
 if(enemies.length>=state.maxEnemies)return;
 const angle=Math.random()*Math.PI*2;
 const dist=27+Math.random()*16;
 const tier=Math.min(2,Math.floor(state.time/70));
 const mesh=new THREE.Mesh(enemyGeo,enemyMats[tier]);
 const scale=1+tier*.12+Math.random()*.2;
 mesh.scale.setScalar(scale);mesh.position.set(player.position.x+Math.cos(angle)*dist,.85,player.position.z+Math.sin(angle)*dist);
 mesh.castShadow=true;scene.add(mesh);
 enemies.push({mesh,hp:1+tier+Math.floor(state.time/100),speed:2.45+tier*.55+Math.min(2,state.time*.008),touch:0});
}

function fireAtNearest(){
 let best=null,bestD=Infinity;
 for(const e of enemies){const d=player.position.distanceToSquared(e.mesh.position);if(d<bestD&&d<24*24){best=e;bestD=d;}}
 if(!best)return;
 const dir=best.mesh.position.clone().sub(player.position).setY(0).normalize();
 const mesh=new THREE.Mesh(bulletGeo,bulletMat);mesh.position.copy(player.position).add(new THREE.Vector3(0,1.05,0));scene.add(mesh);
 bullets.push({mesh,vel:dir.multiplyScalar(state.bulletSpeed),life:1.4,hits:0});
}

function dropShard(pos){
 const mesh=new THREE.Mesh(shardGeo,shardMat);mesh.position.copy(pos);mesh.position.y=.36;mesh.rotation.set(Math.random()*3,Math.random()*3,0);scene.add(mesh);
 shards.push({mesh,spin:.9+Math.random()*1.8});
}

function gainXp(){
 state.score++;state.xp++;
 if(state.xp>=state.nextXp){state.xp-=state.nextXp;state.level++;state.nextXp=Math.round(state.nextXp*1.33+2);openUpgrade();}
}

const upgrades=[
 {name:'가속 코어',desc:'이동 속도 +12%',apply:()=>state.speed*=1.12},
 {name:'과충전 포탑',desc:'공격 속도 +15%',apply:()=>state.fireRate*=.85},
 {name:'고밀도 빔',desc:'공격 피해 +1',apply:()=>state.damage+=1},
 {name:'자력장',desc:'파편 흡수 범위 +35%',apply:()=>state.magnet*=1.35},
 {name:'외장 증폭',desc:'최대 HP +25, 즉시 회복',apply:()=>{state.maxHp+=25;state.hp=Math.min(state.maxHp,state.hp+35)}},
 {name:'재생 회로',desc:'초당 HP 재생 +0.35',apply:()=>state.regen+=.35},
 {name:'관통 펄스',desc:'투사체 관통 +1',apply:()=>state.pierce+=1}
];

function openUpgrade(){
 state.paused=true;ui.upgradePanel.classList.remove('hidden');ui.upgradeOptions.innerHTML='';
 const picks=[...upgrades].sort(()=>Math.random()-.5).slice(0,3);
 for(const u of picks){
  const b=document.createElement('button');b.className='upgrade';b.innerHTML='<strong>'+u.name+'</strong><small>'+u.desc+'</small>';
  b.addEventListener('click',()=>{u.apply();ui.upgradePanel.classList.add('hidden');state.paused=false;clock.getDelta();updateHud();},{once:true});
  ui.upgradeOptions.appendChild(b);
 }
}

function hurt(amount){
 state.hp-=amount;if(state.hp<=0){state.hp=0;endGame();}
}

function endGame(){
 state.gameOver=true;state.running=false;state.paused=false;
 ui.summary.textContent=`${formatTime(state.time)} 생존 · 레벨 ${state.level} · 파편 ${state.score} · 처치 ${state.kills}`;
 ui.gameoverPanel.classList.remove('hidden');updateHud();
}

function update(dt){
 state.time+=dt;state.fireTimer-=dt;state.spawnTimer-=dt;
 if(state.regen>0)state.hp=Math.min(state.maxHp,state.hp+state.regen*dt);
 const move=new THREE.Vector3((keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0),0,(keys.has('KeyS')||keys.has('ArrowDown')?1:0)-(keys.has('KeyW')||keys.has('ArrowUp')?1:0));
 if(move.lengthSq()>0){move.normalize().multiplyScalar(state.speed*dt);player.position.add(move);const r=Math.hypot(player.position.x,player.position.z);if(r>51)player.position.multiplyScalar(51/r);}
 core.rotation.y+=dt*2.8;ring.rotation.z+=dt*.65;

 if(state.spawnTimer<=0){spawnEnemy();state.spawnTimer=Math.max(.34,state.spawnEvery-state.time*.0028);}
 if(state.fireTimer<=0){fireAtNearest();state.fireTimer=state.fireRate;}

 for(const e of enemies){
  const dir=player.position.clone().sub(e.mesh.position).setY(0);const d=dir.length();if(d>0.001)e.mesh.position.addScaledVector(dir.normalize(),e.speed*dt);
  e.mesh.rotation.x+=dt*.9;e.mesh.rotation.y+=dt*1.3;e.touch-=dt;
  if(d<1.25&&e.touch<=0){hurt(9+Math.min(10,state.time*.035));e.touch=.75;}
 }

 for(let i=bullets.length-1;i>=0;i--){
  const b=bullets[i];b.mesh.position.addScaledVector(b.vel,dt);b.life-=dt;let removed=false;
  for(let j=enemies.length-1;j>=0&&!removed;j--){
   const e=enemies[j];if(b.mesh.position.distanceToSquared(e.mesh.position)<1.0){
    e.hp-=state.damage;b.hits++;
    if(e.hp<=0){const pos=e.mesh.position.clone();scene.remove(e.mesh);enemies.splice(j,1);dropShard(pos);state.kills++;}
    if(b.hits>state.pierce){scene.remove(b.mesh);bullets.splice(i,1);removed=true;}
   }
  }
  if(!removed&&b.life<=0){scene.remove(b.mesh);bullets.splice(i,1);}
 }

 for(let i=shards.length-1;i>=0;i--){
  const s=shards[i];s.mesh.rotation.y+=dt*s.spin;s.mesh.position.y=.34+Math.sin(state.time*4+i)*.08;
  const d=s.mesh.position.distanceTo(player.position);
  if(d<state.magnet)s.mesh.position.lerp(player.position.clone().add(new THREE.Vector3(0,.45,0)),Math.min(1,dt*(5+(state.magnet-d)*2)));
  if(d<.75){scene.remove(s.mesh);shards.splice(i,1);gainXp();}
 }

 const desired=new THREE.Vector3(player.position.x,15.5,player.position.z+18);
 camera.position.lerp(desired,1-Math.pow(.001,dt));
 camera.lookAt(player.position.x,0,player.position.z-2.5);
}

function formatTime(sec){const m=Math.floor(sec/60).toString().padStart(2,'0');const s=Math.floor(sec%60).toString().padStart(2,'0');return m+':'+s;}
function updateHud(){
 ui.hp.textContent=Math.ceil(state.hp);ui.level.textContent=state.level;ui.score.textContent=state.score;ui.time.textContent=formatTime(state.time);ui.xp.style.width=Math.min(100,(state.xp/state.nextXp)*100)+'%';
}

let fpsFrames=0,fpsTime=0;
function animate(){
 requestAnimationFrame(animate);
 let dt=Math.min(.05,clock.getDelta());
 if(state.running&&!state.paused&&!state.gameOver){update(dt);updateHud();}
 fpsFrames++;fpsTime+=dt;if(fpsTime>.5){ui.fps.textContent=Math.round(fpsFrames/fpsTime);fpsFrames=0;fpsTime=0;}
 renderer.render(scene,camera);
}
animate();

function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
window.addEventListener('resize',resize);resize();
window.addEventListener('keydown',e=>{
 if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();
 keys.add(e.code);
 if(e.code==='Escape'&&state.running&&!state.gameOver&&!ui.upgradePanel.classList.contains('hidden'))return;
 if(e.code==='Escape'&&state.running&&!state.gameOver){state.paused=!state.paused;ui.pause.classList.toggle('hidden',!state.paused);clock.getDelta();}
});
window.addEventListener('keyup',e=>keys.delete(e.code));
document.querySelector('#start').addEventListener('click',reset);
document.querySelector('#restart').addEventListener('click',reset);
camera.position.set(0,15.5,18);camera.lookAt(0,0,-2);
