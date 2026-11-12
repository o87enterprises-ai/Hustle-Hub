(()=>{
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>(n<0?'-':'')+'$'+Math.abs(n).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
const load=(k,d)=>{try{return JSON.parse(localStorage.getItem('hh_'+k))??d}catch{return d}};
const save=(k,v)=>{try{localStorage.setItem('hh_'+k,JSON.stringify(v))}catch{}};
const uid=()=>Math.random().toString(36).slice(2,10);
const CATS=['Home & Yard','Tutoring','Creative','Tech Help','Errands','Pets','Events','Fitness'];
const SAMPLES=[
{id:'s1',title:'Weekend lawn & garden cleanup',cat:'Home & Yard',price:60,by:'Sample Seller',desc:'Mowing, edging and bagging. Sample listing.'},
{id:'s2',title:'1-hour math tutoring (grades 6-10)',cat:'Tutoring',price:30,by:'Sample Seller',desc:'Homework help and test prep. Sample listing.'},
{id:'s3',title:'Logo + brand colour kit',cat:'Creative',price:120,by:'Sample Seller',desc:'Three concepts, one revision round. Sample listing.'},
{id:'s4',title:'Phone & laptop setup help',cat:'Tech Help',price:45,by:'Sample Seller',desc:'Backups, updates and account setup. Sample listing.'},
{id:'s5',title:'Grocery pickup & delivery',cat:'Errands',price:20,by:'Sample Seller',desc:'Within 10 miles. Sample listing.'},
{id:'s6',title:'Dog walking (30 min)',cat:'Pets',price:18,by:'Sample Seller',desc:'Solo or small group walks. Sample listing.'},
{id:'s7',title:'Event photo coverage (2 hr)',cat:'Events',price:180,by:'Sample Seller',desc:'Edited gallery within a week. Sample listing.'},
{id:'s8',title:'Beginner personal training',cat:'Fitness',price:40,by:'Sample Seller',desc:'Bodyweight plans, outdoors or virtual. Sample listing.'}];
const S={tx:load('tx',[]),ideas:load('ideas',[]),plan:load('plan',[]),listings:load('listings',[]),q:'',cat:'All',tab:load('tab','home')};
const TABS=[['home','🏠','Home'],['tracker','💵','Income'],['ideas','💡','Ideas'],['planner','✅','Planner'],['market','🛒','Market'],['listings','📝','My Listings'],['plans','⭐','Plans']];
const today=()=>new Date().toISOString().slice(0,10);

function tabs(){const n=$('.tabs');n.innerHTML=TABS.map(([id,i,l])=>`<button data-t="${id}" ${S.tab===id?'aria-current="page"':''}><span aria-hidden="true">${i}</span>${l}</button>`).join('');
 n.onclick=e=>{const b=e.target.closest('button');if(b){S.tab=b.dataset.t;save('tab',S.tab);show()}}}
function show(){TABS.forEach(([id])=>$('#'+id).hidden=id!==S.tab);tabs();R[S.tab]()}
const head=(id,t,s)=>`<h2 id="h-${id}">${t}</h2><p class="sub">${s}</p>`;

const R={
home(){$('#home').innerHTML=`<div class="hero"><h2 id="h-home">HustleHub</h2><h3>Turn your skills into money.</h3><p>One app that helps everyday people find ways to make money, launch side businesses, find customers, and grow.</p></div>
 <div class="feat">${[['market','💼','Find gigs','Discover ways to earn.'],['tracker','👛','Track income',"Know what you're making."],['listings','👥','Find customers','Connect with opportunities.'],['planner','🧠','AI business coach','Guided action plans (no live AI yet).']].map(([t,i,b,s])=>`<button data-go="${t}"><span aria-hidden="true">${i}</span><b>${b}</b><small>${s}</small></button>`).join('')}</div>
 <div class="card" style="margin-top:12px"><b>Fees, upfront.</b><p class="mut" style="margin:.3rem 0 0">Our illustrative marketplace fee is a flat 10%. See the calculator under Plans so you always know what you keep.</p></div>`;
 $('#home').onclick=e=>{const b=e.target.closest('[data-go]');if(b){S.tab=b.dataset.go;save('tab',S.tab);show()}}},
tracker(){const inc=S.tx.filter(t=>t.type==='income').reduce((a,t)=>a+t.amt,0),exp=S.tx.filter(t=>t.type==='expense').reduce((a,t)=>a+t.amt,0);
 $('#tracker').innerHTML=head('tracker','Income tracker','Log side-hustle earnings and costs.')+
 `<div class="stats"><div class="stat"><b class="income">${money(inc)}</b><span>Income</span></div><div class="stat"><b class="expense">${money(exp)}</b><span>Expenses</span></div><div class="stat"><b>${money(inc-exp)}</b><span>Net</span></div></div>
 <form class="card" id="txf"><div class="row"><label>Type<select name="type"><option value="income">Income</option><option value="expense">Expense</option></select></label><label>Amount ($)<input name="amt" type="number" min="0.01" step="0.01" required></label></div>
 <div class="row"><label>Source / note<input name="note" required maxlength="80"></label><label>Date<input name="date" type="date" value="${today()}" required></label></div><button class="btn">Add entry</button></form>
 <div class="card">${S.tx.length?S.tx.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(t=>`<div class="item"><div>${esc(t.note)}<br><small>${esc(t.date)}</small></div><div><span class="${t.type}">${t.type==='income'?'+':'-'}${money(t.amt)}</span> <button class="btn danger sm" data-del="${t.id}" aria-label="Delete entry">✕</button></div></div>`).join(''):'<div class="empty">No entries yet.</div>'}</div>`;
 $('#txf').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);S.tx.push({id:uid(),type:f.get('type'),amt:+f.get('amt'),note:f.get('note'),date:f.get('date')});save('tx',S.tx);R.tracker()};
 $('#tracker').onclick=e=>{const d=e.target.closest('[data-del]');if(d){S.tx=S.tx.filter(t=>t.id!==d.dataset.del);save('tx',S.tx);R.tracker()}}},
ideas(){$('#ideas').innerHTML=head('ideas','Idea board','Capture side-income ideas and rate them.')+
 `<form class="card" id="idf"><label>Idea<input name="t" required maxlength="80"></label><label>Notes<textarea name="n" rows="2" maxlength="300"></textarea></label><div class="row"><label>Effort<select name="e"><option>Low</option><option>Medium</option><option>High</option></select></label><label>Potential<select name="p"><option>Low</option><option selected>Medium</option><option>High</option></select></label></div><button class="btn">Add idea</button></form>
 <div class="grid">${S.ideas.map(i=>`<div class="card"><b>${esc(i.t)}</b><p class="mut">${esc(i.n)}</p><span class="tag">Effort: ${esc(i.e)}</span> <span class="tag">Potential: ${esc(i.p)}</span><p><button class="btn ghost sm" data-plan="${i.id}">Make action plan</button> <button class="btn danger sm" data-del="${i.id}">Delete</button></p></div>`).join('')||'<div class="empty">No ideas yet.</div>'}</div>`;
 $('#idf').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);S.ideas.push({id:uid(),t:f.get('t'),n:f.get('n'),e:f.get('e'),p:f.get('p')});save('ideas',S.ideas);R.ideas()};
 $('#ideas').onclick=e=>{const d=e.target.closest('[data-del]'),p=e.target.closest('[data-plan]');
  if(d){S.ideas=S.ideas.filter(i=>i.id!==d.dataset.del);save('ideas',S.ideas);R.ideas()}
  if(p){const i=S.ideas.find(x=>x.id===p.dataset.plan);['Define who will pay and for what','Set a first price','Tell 5 people about it','Complete one paid job','Review results and adjust'].forEach(s=>S.plan.push({id:uid(),s:i.t+': '+s,done:false}));save('plan',S.plan);S.tab='planner';save('tab','planner');show()}}},
planner(){const d=S.plan.filter(x=>x.done).length;
 $('#planner').innerHTML=head('planner','Guided action planner',`${d} of ${S.plan.length} steps done.`)+
 `<form class="card row" id="plf"><input name="s" placeholder="Add a next step" required maxlength="120" aria-label="Next step"><button class="btn" style="flex:0 0 auto">Add</button></form>
 <div class="card">${S.plan.map(x=>`<div class="step"><input type="checkbox" data-c="${x.id}" ${x.done?'checked':''} aria-label="Done"><span class="${x.done?'done':''}" style="flex:1">${esc(x.s)}</span><button class="btn danger sm" data-del="${x.id}" aria-label="Delete step">✕</button></div>`).join('')||'<div class="empty">No steps yet. Add one, or turn an idea into a plan.</div>'}</div>`;
 $('#plf').onsubmit=e=>{e.preventDefault();S.plan.push({id:uid(),s:new FormData(e.target).get('s'),done:false});save('plan',S.plan);R.planner()};
 $('#planner').onclick=e=>{const d=e.target.closest('[data-del]');if(d){S.plan=S.plan.filter(x=>x.id!==d.dataset.del);save('plan',S.plan);R.planner()}};
 $('#planner').onchange=e=>{const c=e.target.dataset.c;if(c){S.plan.find(x=>x.id===c).done=e.target.checked;save('plan',S.plan);R.planner()}}},
market(){const all=SAMPLES.concat(S.listings.filter(l=>l.status==='published-preview').map(l=>({...l,by:'You (local preview)'})));
 const q=S.q.toLowerCase(),res=all.filter(l=>(S.cat==='All'||l.cat===S.cat)&&(l.title+l.desc).toLowerCase().includes(q));
 $('#market').innerHTML=head('market','Marketplace preview','Sample listings only. Booking and payment are not enabled.')+
 `<div class="card row"><input id="q" type="search" placeholder="Search services" value="${esc(S.q)}" aria-label="Search services"><select id="cat" aria-label="Category"><option>All</option>${CATS.map(c=>`<option ${c===S.cat?'selected':''}>${c}</option>`).join('')}</select></div>
 <div class="grid">${res.map(l=>`<div class="card"><span class="tag">${esc(l.cat)}</span><h3 style="margin:.4rem 0">${esc(l.title)}</h3><p class="mut">${esc(l.desc)}</p><div class="item" style="border:0;padding:0"><span class="price">${money(+l.price)}</span><button class="btn ghost sm" disabled title="Booking not available in prototype">Book (disabled)</button></div><small>${esc(l.by)}</small></div>`).join('')||'<div class="empty">No matches.</div>'}</div>`;
 const q2=$('#q');q2.oninput=e=>{S.q=e.target.value;const p=e.target.selectionStart;R.market();const n=$('#q');n.focus();n.setSelectionRange(p,p)};
 $('#cat').onchange=e=>{S.cat=e.target.value;R.market()}},
listings(){$('#listings').innerHTML=head('listings','My service listings','Draft listings, saved locally. Preview them in the marketplace.')+
 `<form class="card" id="lf"><label>Title<input name="title" required maxlength="80"></label><div class="row"><label>Category<select name="cat">${CATS.map(c=>`<option>${c}</option>`).join('')}</select></label><label>Price ($)<input name="price" type="number" min="1" step="1" required></label></div><label>Description<textarea name="desc" rows="3" maxlength="300" required></textarea></label><button class="btn">Save draft</button></form>
 ${S.listings.map(l=>`<div class="card"><span class="tag">${esc(l.cat)}</span> <span class="tag">${l.status==='draft'?'Draft':'Previewing locally'}</span><h3 style="margin:.4rem 0">${esc(l.title)} · ${money(+l.price)}</h3><p class="mut">${esc(l.desc)}</p><button class="btn ghost sm" data-tog="${l.id}">${l.status==='draft'?'Show in preview':'Back to draft'}</button> <button class="btn danger sm" data-del="${l.id}">Delete</button></div>`).join('')||'<div class="empty">No listings yet.</div>'}`;
 $('#lf').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);S.listings.push({id:uid(),title:f.get('title'),cat:f.get('cat'),price:+f.get('price'),desc:f.get('desc'),status:'draft'});save('listings',S.listings);R.listings()};
 $('#listings').onclick=e=>{const d=e.target.closest('[data-del]'),t=e.target.closest('[data-tog]');
  if(d)S.listings=S.listings.filter(l=>l.id!==d.dataset.del);
  if(t){const l=S.listings.find(x=>x.id===t.dataset.tog);l.status=l.status==='draft'?'published-preview':'draft'}
  if(d||t){save('listings',S.listings);R.listings()}}},
plans(){const T=[['Free','$0',['Income tracker','Idea board','Action planner','Browse marketplace preview','Up to 3 listing drafts']],['Plus','$9.99/month',['Everything in Free','Unlimited listing drafts','Priority listing placement (hypothesis)','Export your data'],1],['Business','$19.99/month',['Everything in Plus','Multiple service profiles','Team members (hypothesis)','Insights dashboard (hypothesis)']]];
 $('#plans').innerHTML=head('plans','Plans & fee calculator','Proposed tiers to validate with real customers. No billing is active.')+
 `<div class="tiers">${T.map(([n,p,f,pop])=>`<div class="card tier ${pop?'pop':''}"><h3 style="margin:0">${n}</h3><div class="price">${p}</div><ul>${f.map(x=>`<li>${x}</li>`).join('')}</ul><button class="btn ghost" disabled>Not available yet</button></div>`).join('')}</div>
 <form class="card" id="ff"><h3 style="margin:0">Illustrative 10% marketplace fee</h3><label>Job price ($)<input id="fp" type="number" min="0" step="1" value="100"></label><div id="fo"></div></form>`;
 const calc=()=>{const p=Math.max(0,+$('#fp').value||0),f=p*.1;$('#fo').innerHTML=`<div class="item"><span>Marketplace fee (10%)</span><b>${money(f)}</b></div><div class="item"><span>Seller keeps</span><b class="income">${money(p-f)}</b></div><small>Illustration only; no money is collected.</small>`};
 $('#ff').onsubmit=e=>e.preventDefault();$('#fp').oninput=calc;calc()}
};
let dp;addEventListener('beforeinstallprompt',e=>{e.preventDefault();dp=e;$('#installBtn').hidden=false});
$('#installBtn').onclick=async()=>{if(dp){dp.prompt();await dp.userChoice;dp=null;$('#installBtn').hidden=true}};
if(!TABS.some(t=>t[0]===S.tab))S.tab='home';
show();
if('serviceWorker' in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('sw.js').catch(()=>{});
})();
