const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const para=t=>String(t||'').split(/\n+/).filter(Boolean).map(x=>`<p>${esc(x)}</p>`).join('');
const img=(src,alt)=>src?`<img src="${esc(src)}" alt="${esc(alt||'')}" loading="lazy" onerror="this.remove()">`:'';
const tagLine=t=>(t||[]).map(x=>`<span>${esc(x)}</span>`).join('');
const TBD='（待填）';const LI=`<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><rect width="24" height="24" rx="4" fill="currentColor"/><text x="12" y="17.5" font-size="14" font-weight="700" text-anchor="middle" fill="#2456A4" font-family="Arial,sans-serif">in</text></svg>`,FB=`<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="currentColor"/><text x="13.5" y="20" font-size="19" font-weight="700" text-anchor="middle" fill="#2456A4" font-family="Arial,sans-serif">f</text></svg>`;
const dlg=$('#dlg');let lastBtn=null;
$('#d-x').onclick=()=>dlg.close();
dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
dlg.addEventListener('close',()=>lastBtn&&lastBtn.focus());

function filterable(chipsEl,listEl,items,card,emptyMsg,pre){
  let cur='全部';
  const cats=['全部',...new Set(items.map(i=>i.category||i.type).filter(Boolean))];
  const draw=()=>{
    chipsEl.innerHTML=cats.length>2?cats.map(c=>`<button aria-pressed="${c===cur}" data-c="${esc(c)}">${esc(c)}</button>`).join(''):'';
    const v=items.filter(i=>cur==='全部'||(i.category||i.type)===cur);
    listEl.innerHTML=v.length?v.map(card).join(''):`<p class="empty">${emptyMsg}</p>`;
  };
  chipsEl.onclick=e=>{const b=e.target.closest('button');if(b){cur=b.dataset.c;draw()}};
  draw();
}
const cardHtml=k=>i=>`<button class="card" data-k="${k}" data-s="${esc(i.slug||i.title)}">${img(i.cover_image,i.cover_alt)}<div><small>${esc(i.category)}</small><b>${esc(i.title)}</b>${esc(i.summary)}</div></button>`;

async function init(){
  $('#yr').textContent=new Date().getFullYear();
  const [site,about,ba,tl,pj,ins,life]=await Promise.all(['site-settings','about','business-architecting','timeline'].map(n=>Loader.get(`data/${n}.json`)));
  if(!site&&!about)document.body.insertAdjacentHTML('afterbegin','<p style="padding:12px;background:#fff3cd">內容載入失敗：請用本機伺服器或 GitHub Pages 開啟。</p>');
  if(site){
    $('#h-tag').textContent=site.tagline||'';$('#h-intro').textContent=site.intro||'';
    $('#photo').innerHTML=site.photo?img(site.photo,site.photo_alt||'董建一'):'個人照片<br>（待上傳）';
    [['#h-li',site.linkedin,'LinkedIn',LI],['#h-fb',site.facebook,'Facebook',FB]].forEach(([q,u,l,i])=>{if(u){const a=$(q);a.href=u;a.hidden=false;a.setAttribute('aria-label',l);a.innerHTML=i}});
    $('#clist').innerHTML=`<li><span>Email</span>${site.email?`<a href="mailto:${esc(site.email)}">${esc(site.email)}</a>`:TBD}</li><li><span>社群</span><div class="soc">${site.linkedin?`<a href="${esc(site.linkedin)}" target="_blank" rel="noopener" aria-label="LinkedIn">${LI}</a>`:''}${site.facebook?`<a href="${esc(site.facebook)}" target="_blank" rel="noopener" aria-label="Facebook">${FB}</a>`:''}</div></li>`;
  }
  if(about){
    $('#a-intro').textContent=about.intro||TBD;$('#a-phil').textContent=about.philosophy||TBD;
    $('#a-bg').innerHTML=(about.background||[]).map(x=>`<li>${esc(x)}</li>`).join('');
    $('#a-focus').innerHTML=tagLine(about.focus);
  }
  if(ba){
    $('#b-def').textContent=ba.definition||'';
    $('#chain').innerHTML=Loader.published(ba.steps).map((s,i)=>`<li><details><summary><span class="dot">${i+1}</span><span><b>${esc(s.name)}</b><small>${esc(s.en)}｜${esc(s.summary)}</small></span></summary><ul class="cs">${(s.cases||[]).map(c=>`<li>${esc(c)}</li>`).join('')||'<li>'+TBD+'</li>'}</ul></details></li>`).join('');
  }
  window._t=Loader.published(tl?.items);
  {const fi=a=>a.map(i=>`<button class="fi" data-k="t" data-s="${esc(i.slug||i.title)}"><b>${esc(i.organization||i.title)}</b><small>${esc(i.title)}</small></button>`).join('');const cr=window._t.filter(i=>i.type==='職涯'),so=window._t.filter(i=>i.type!=='職涯');$('#tl').innerHTML=`<div class="lab">職涯</div><div class="row up">${fi(cr)}</div><div class="spine"><span>商業創構</span></div><div class="lab">社會參與 ・ 求學</div><div class="row down">${fi(so)}</div>`;}
  window._p=[];
  window._l=Loader.published(life?.items);
  filterable($('#l-chips'),$('#l-cards'),window._l,cardHtml('l'),'內容準備中，敬請期待。');
  const feat=window._l.filter(i=>i.featured).slice(0,4);
  if(feat.length&&window._l.length>feat.length){
    const all=$('#l-cards').innerHTML;
    $('#l-cards').innerHTML=feat.map(cardHtml('l')).join('')+'<button class="btn" id="l-all" style="grid-column:1/-1;color:var(--navy)">查看全部生活內容</button>';
    $('#l-all').onclick=()=>{$('#l-cards').innerHTML=all};
  }
}
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-k]');if(!b)return;
  const i=({t:window._t,p:window._p,l:window._l}[b.dataset.k]||[]).find(x=>(x.slug||x.title)===b.dataset.s);if(!i)return;
  const secs=[['我的角色',i.role_and_contribution],['背景與問題',i.challenge],['分析與洞察',i.approach],['策略與解決方案',i.solution],['執行與整合',i.execution],['成果與反思',i.outcome]];
  const hl=(i.highlights||[]).length?`<ul>${i.highlights.map(h=>`<li>${esc(h)}</li>`).join('')}</ul>`:'';
  const gal=(i.photo_gallery||[]).map(g=>img(g.image||g,g.alt)).join('');
  const refs=(i.references||[]).map(r=>`<li><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.title||r.url)}</a></li>`).join('');
  lastBtn=b;
  $('#d-body').innerHTML=`${img(i.cover_image||i.image,i.cover_alt)}<h3 id="d-title">${esc(i.title)}</h3><p>${esc(i.organization||'')} ${esc(i.role||'')}</p><p class="tags">${tagLine(i.tags)}</p>${para(i.summary)}${para(i.description)}${hl}${secs.filter(s=>s[1]).map(s=>`<h3>${s[0]}</h3>${para(s[1])}`).join('')}${para(i.body)}${gal}${refs?`<h3>參考資料</h3><ul>${refs}</ul>`:''}${i.external_url?`<p><a href="${esc(i.external_url)}" target="_blank" rel="noopener">相關連結</a></p>`:''}`;
  dlg.showModal();
});
const nav=$('#nav'),mb=$('#mbtn');
mb.onclick=()=>mb.setAttribute('aria-expanded',nav.classList.toggle('open'));
nav.onclick=e=>{if(e.target.tagName==='A'){nav.classList.remove('open');mb.setAttribute('aria-expanded','false')}};
const topBtn=$('#top');addEventListener('scroll',()=>topBtn.hidden=scrollY<600,{passive:true});topBtn.onclick=()=>scrollTo({top:0});
async function lifeCats(){
const L=await Loader.get('data/life.json'),C=Loader.published(L&&L.categories);if(!C.length)return;
const N=5,H=[205,35,150];
const ph=(h,i,t)=>{const s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${h},48%,${70-i*5}%)"/><stop offset="1" stop-color="hsl(${h},52%,${52-i*4}%)"/></linearGradient></defs><rect width="600" height="450" fill="url(#g)"/><text x="300" y="235" font-size="26" fill="#fff" fill-opacity=".9" text-anchor="middle" font-family="sans-serif">${t} ${i+1}/${N}</text></svg>`;return 'data:image/svg+xml;utf8,'+encodeURIComponent(s)};
let demo=true;
const cats=C.map((c,k)=>{const real=(c.photos||[]).filter(x=>x.image).slice(0,N);if(real.length)demo=false;return{t:c.name,e:c.en,d:c.summary,p:real.length?real:Array.from({length:N},(_,i)=>({image:ph(H[k%3],i,c.name),alt:`${c.name}範例照片 ${i+1}`}))}});
$('#l-chips').innerHTML='';
if(demo)$('#l-chips').insertAdjacentHTML('beforebegin','<p class="hint">目前為示意圖，請於後台上傳照片。</p>');
const rot=[-8,6,-4,9];
$('#l-cards').innerHTML=cats.map((c,k)=>{const r=Math.floor(Math.random()*c.p.length);const back=c.p.map((_,i)=>i).filter(i=>i!==r).map((i,j)=>`<img src="${esc(c.p[i].image)}" alt="" style="transform:rotate(${rot[j%4]}deg) translate(${j%2?3:-3}%,${-j*1.5}%);z-index:${j}">`).join('');
return `<button class="stk" data-cat="${k}" aria-label="${esc(c.t)}：查看全部照片"><span class="pile">${back}<img src="${esc(c.p[r].image)}" alt="${esc(c.p[r].alt||c.t)}" style="z-index:9"></span><b>${esc(c.t)}</b><small>${esc(c.e)}</small><span class="d">${esc(c.d)}</span></button>`}).join('');
$('#l-cards').onclick=e=>{const b=e.target.closest('[data-cat]');if(!b)return;const c=cats[+b.dataset.cat];lastBtn=b;$('#d-body').innerHTML=`<h3 id="d-title">${esc(c.t)}</h3><p>${esc(c.d)}</p>`+c.p.map(x=>`<img src="${esc(x.image)}" alt="${esc(x.alt||c.t)}" loading="lazy">`).join('');dlg.showModal()};
}
init().then(()=>{lifeCats();roles()});
