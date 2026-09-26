const timeline=document.querySelector('#timeline'),search=document.querySelector('#search'),status=document.querySelector('#status');
let events=[];
async function load(){
 try{
  const text=await fetch('./data/ai/events.jsonl',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.text()});
  events=text.split(/\n+/).filter(Boolean).map(line=>JSON.parse(line)).sort((a,b)=>new Date(b.timestamp)-new Date(a.timestamp));
  render();
 }catch(err){timeline.innerHTML='<div class="empty">이벤트 로그를 불러오지 못했습니다: '+escapeHtml(err.message)+'</div>';}
}
function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
function render(){
 const q=search.value.trim().toLowerCase(),s=status.value;
 const filtered=events.filter(e=>(!s||e.status===s)&&(!q||JSON.stringify(e).toLowerCase().includes(q)));
 timeline.innerHTML=filtered.length?filtered.map(e=>`<article class="event"><div class="rail"><i></i></div><div class="card"><div class="meta"><span class="agent">${escapeHtml(e.agent)}</span><span class="status">${escapeHtml(e.status)}</span><time>${new Date(e.timestamp).toLocaleString('ko-KR')}</time></div><h2>${escapeHtml(e.title)}</h2><p>${escapeHtml(e.description)}</p><dl><div><dt>Cycle</dt><dd>${escapeHtml(e.cycle_id||'-')}</dd></div><div><dt>Experiment</dt><dd>${escapeHtml(e.experiment_id||'-')}</dd></div><div><dt>Result</dt><dd>${escapeHtml(e.result||'-')}</dd></div><div><dt>Next</dt><dd>${escapeHtml(e.next_action||'-')}</dd></div></dl></div></article>`).join(''):'<div class="empty">조건에 맞는 기록이 없습니다.</div>';
}
search.addEventListener('input',render);status.addEventListener('change',render);load();