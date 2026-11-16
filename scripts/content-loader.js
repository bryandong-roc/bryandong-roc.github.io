/* 讀取 data/*.json；只回傳 status=published 的項目並依 sort_order 排序 */
const Loader={
  async get(p){try{const r=await fetch(p);if(!r.ok)throw new Error(r.status);return await r.json()}catch(e){console.warn('載入失敗',p,e);return null}},
  published(a){return(a||[]).filter(x=>x.status==='published').sort((a,b)=>(a.sort_order??99)-(b.sort_order??99))}
};
