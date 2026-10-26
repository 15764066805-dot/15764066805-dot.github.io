const embedded=window.parent!==window;
const isDetail=url=>url.origin===location.origin&&url.pathname!=='/'&&!url.pathname.startsWith('/assets/')&&!/\.[a-z0-9]+$/i.test(url.pathname.replace(/index\.html$/,''));
const canonical=href=>{const url=new URL(href,location.href);url.pathname=url.pathname.replace(/index\.html$/,'').replace(/\/?$/,'/');return url.href;};
const plainLink=e=>{
 const a=e.target.closest?.('a[href]');
 return a&&!a.hasAttribute('download')&&!['_blank','_top','_parent'].includes(a.target)&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&!e.altKey&&(e.type!=='click'||e.button===0)?a:null;
};
if(embedded){
 document.documentElement.classList.add('detail-window-embedded');
 document.addEventListener('keydown',e=>{if(e.key==='Escape')window.parent.postMessage({type:'detail-close'},location.origin);});
 document.addEventListener('click',e=>{const a=plainLink(e);if(!a)return;const url=new URL(a.href);if(url.origin!==location.origin)return;if(url.pathname==='/'||isDetail(url)){e.preventDefault();e.stopImmediatePropagation();window.parent.postMessage({type:url.pathname==='/'?'detail-close':'detail-open',url:url.href},location.origin);}},true);
 // Reveal once the first artwork is decoded; lower panels load on scroll.
 const ready=async()=>{
  const first=document.querySelector('main img');
  if(first){
   if(!first.complete)await new Promise(resolve=>{first.addEventListener('load',resolve,{once:true});first.addEventListener('error',resolve,{once:true});});
   try{await first.decode();}catch{}
  }
  window.parent.postMessage({type:'detail-ready',url:location.href},location.origin);
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
}else{
 const dialog=document.createElement('dialog');dialog.className='detail-window';dialog.setAttribute('aria-label','页面详情');dialog.setAttribute('data-lenis-prevent','');
 dialog.innerHTML='<div class="detail-window-bar"><span>Project</span><button type="button" aria-label="关闭详情窗口"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button></div><div class="detail-window-content"><div class="detail-window-loading" role="status"><span class="detail-window-spinner" aria-hidden="true"></span><span>正在打开作品…</span><a class="detail-window-fallback" target="_blank" rel="noopener" hidden>在新页面打开</a></div><iframe title="页面详情" class="detail-window-frame"></iframe></div>';
 document.body.append(dialog);
 const frame=dialog.querySelector('iframe'),fallback=dialog.querySelector('.detail-window-fallback');
 let opener=null,previousOverflow='',currentUrl='',loaded=false,slowTimer,pausedVideos=[];
 function syncTheme(){try{frame.contentDocument.documentElement.dataset.theme=document.documentElement.dataset.theme;frame.contentDocument.documentElement.style.colorScheme=document.documentElement.dataset.theme;}catch{}}
 new MutationObserver(syncTheme).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
 function reveal(){loaded=true;clearTimeout(slowTimer);dialog.dataset.loading='false';dialog.setAttribute('aria-busy','false');syncTheme();}
 frame.addEventListener('load',()=>{
  syncTheme();
  // Also support older pages that do not send a ready message.
  try{const href=canonical(frame.contentWindow.location.href);if(href!==currentUrl)return;const first=frame.contentDocument.querySelector('main img');if(!first||first.complete){if(first?.decode)first.decode().catch(()=>{}).then(()=>{if(href===currentUrl)reveal();});else reveal();}}catch{}
 });
 function close(){
  if(!dialog.open)return;
  dialog.close();document.documentElement.style.overflow=previousOverflow;
  // Retain only the latest document, its decoded artwork and scroll position.
  try{frame.contentDocument.querySelectorAll('video,audio').forEach(media=>media.pause());}catch{}
  for(const video of pausedVideos){const r=video.getBoundingClientRect();if(video.isConnected&&!document.hidden&&r.bottom>0&&r.top<innerHeight&&!matchMedia('(prefers-reduced-motion: reduce)').matches)video.play().catch(()=>{});}
  pausedVideos=[];opener?.focus({preventScroll:true});
 }
 function open(url,link){
  url=canonical(url);
  if(!dialog.open){
   opener=link||document.activeElement;previousOverflow=document.documentElement.style.overflow;document.documentElement.style.overflow='hidden';
   pausedVideos=[...document.querySelectorAll('video')].filter(video=>!video.paused);pausedVideos.forEach(video=>video.pause());dialog.showModal();
  }
  if(currentUrl!==url){
   currentUrl=url;loaded=false;dialog.dataset.loading='true';dialog.setAttribute('aria-busy','true');fallback.hidden=true;fallback.href=url;
   clearTimeout(slowTimer);slowTimer=setTimeout(()=>{if(!loaded)fallback.hidden=false;},8000);
   frame.src=url;
  }else if(loaded){syncTheme();}
  dialog.querySelector('button').focus();
 }
 // Warm only links the visitor points at or focuses, rather than every project.
 const warmed=new Set();let hints;
 async function warm(e){
  const a=plainLink(e);if(!a)return;const url=new URL(a.href),connection=navigator.connection;
  if(!isDetail(url)||!url.pathname.startsWith('/project/')||connection?.saveData||/^(slow-)?2g$/.test(connection?.effectiveType||'')||warmed.has(url.pathname)||warmed.size>=4)return;
  warmed.add(url.pathname);
  const prefetch=document.createElement('link');prefetch.rel='prefetch';prefetch.as='document';prefetch.href=url.href;document.head.append(prefetch);
  try{
   hints??=import('./detail-image-hints.mjs');const hint=(await hints).default[url.pathname];if(!hint)return;
   const image=new Image();image.decoding='async';image.fetchPriority='low';
   const modalWidth=Math.min(1180,innerWidth-(innerWidth<=600?20:64))-2;
   image.sizes=`${modalWidth}px`;image.srcset=hint.srcset;image.src=hint.src;
  }catch{}
 }
 document.addEventListener('pointerover',warm,{passive:true});document.addEventListener('focusin',warm);document.addEventListener('touchstart',warm,{passive:true});
 document.addEventListener('click',e=>{const a=plainLink(e);if(!a)return;const url=new URL(a.href);if(isDetail(url)){e.preventDefault();e.stopImmediatePropagation();open(url.href,a);}},true);
 dialog.querySelector('button').addEventListener('click',close);
 document.addEventListener('keydown',e=>{if(dialog.open&&e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();close();}},true);
 dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();}});
 window.addEventListener('popstate',close);
 window.addEventListener('message',e=>{
  if(e.origin!==location.origin||e.source!==frame.contentWindow)return;
  if(e.data?.type==='detail-ready'&&canonical(e.data.url)===currentUrl)reveal();
  if(e.data?.type==='detail-close')close();
  if(e.data?.type==='detail-open'){try{const url=new URL(e.data.url);if(isDetail(url))open(url.href);}catch{}}
 });
}
