// Two independently buffered layers make theme changes a crossfade, not a source reload.
const root=document.documentElement;
const motion=matchMedia('(prefers-reduced-motion: reduce)');
let instance;
const sceneForTheme=()=>root.dataset.theme==='dark'?'night':'day';

function attach(hero){
 const layer=document.createElement('div');
 layer.className='hero-atmosphere';layer.dataset.scene=sceneForTheme();layer.setAttribute('aria-hidden','true');
 const videos={};
 for(const scene of ['day','night']){
  const frame=document.createElement('div');frame.className=`hero-atmosphere-scene hero-atmosphere-${scene}`;
  frame.style.backgroundImage=`url('/assets/hero-atmosphere/${scene}.jpg')`;
  const video=document.createElement('video');video.className='hero-atmosphere-video';
  video.muted=true;video.defaultMuted=true;video.loop=true;video.playsInline=true;video.preload='none';video.tabIndex=-1;
  video.setAttribute('muted','');video.setAttribute('playsinline','');
  video.poster=`/assets/hero-atmosphere/${scene}.jpg`;video.dataset.src=`/assets/hero-atmosphere/${scene}${matchMedia('(max-width:767px)').matches?'-mobile':''}.mp4`;
  video.addEventListener('loadeddata',()=>{video.dataset.ready='true';});
  frame.append(video);layer.append(frame);videos[scene]=video;
 }
 hero.prepend(layer);hero.classList.add('has-atmosphere-video');
 let visible=true,sequence=0,pauseTimer,disposed=false;
 const canPlay=()=>visible&&!document.hidden&&!motion.matches&&!disposed;
 function pauseAll(){Object.values(videos).forEach(video=>video.pause());}
 async function show(){
  const request=++sequence,scene=sceneForTheme(),target=videos[scene],previous=videos[layer.dataset.scene];
  clearTimeout(pauseTimer);
  if(!canPlay()){
   pauseAll();layer.dataset.scene=scene;return;
  }
  if(previous!==target&&target.readyState>=2&&previous.readyState>=2){
   try{target.currentTime=previous.currentTime%target.duration;}catch{}
  }
  try{
   if(!target.getAttribute('src'))target.src=target.dataset.src;
   await target.play();
   // Wait for a decoded target frame, with a fallback for browsers that throttle video callbacks.
   if(target.requestVideoFrameCallback)await new Promise(resolve=>{target.requestVideoFrameCallback(resolve);setTimeout(resolve,250);});
  }catch{/* The poster remains visible when autoplay is unavailable. */}
  if(request!==sequence||disposed)return;
  if(!canPlay()){pauseAll();return;}
  layer.dataset.scene=scene;
  pauseTimer=setTimeout(()=>{if(request===sequence)Object.entries(videos).forEach(([name,video])=>{if(name!==scene)video.pause();});},850);
 }
 const intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)show();else{sequence++;clearTimeout(pauseTimer);pauseAll();}},{threshold:0});
 intersection.observe(hero);
 const themeObserver=new MutationObserver(show);themeObserver.observe(root,{attributes:true,attributeFilter:['data-theme']});
 const visibility=()=>{if(document.hidden){sequence++;clearTimeout(pauseTimer);pauseAll();}else show();};
 document.addEventListener('visibilitychange',visibility);motion.addEventListener('change',show);
 show();
 return {hero,layer,destroy(){disposed=true;sequence++;clearTimeout(pauseTimer);pauseAll();intersection.disconnect();themeObserver.disconnect();document.removeEventListener('visibilitychange',visibility);motion.removeEventListener('change',show);}};
}

function mount(){
 const hero=document.querySelector('#main .framer-cWMmA .framer-105fjnj');
 if(instance?.hero===hero&&instance.layer.isConnected)return;
 instance?.destroy();instance=hero?attach(hero):undefined;
}
mount();
// Framer may replace the server-rendered hero during hydration or page navigation.
new MutationObserver(mount).observe(document.querySelector('#main')||document.body,{childList:true,subtree:true});
