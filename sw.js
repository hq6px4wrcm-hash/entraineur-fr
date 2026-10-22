const CACHE='entraineur-v1';
const FILES=['./','./index.html','./manifest.json','./icon-180.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const url=new URL(e.request.url);
  if(url.origin!==location.origin){ e.respondWith(fetch(e.request).catch(()=>new Response('',{status:503}))); return; }
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>{
    const net=fetch(e.request).then(res=>{ if(res.ok){ const copy=res.clone(); caches.open(CACHE).then(c=>c.put(e.request,copy)); } return res; }).catch(()=>r);
    return r||net;
  }));
});
