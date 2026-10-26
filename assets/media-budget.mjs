const tracks=new Map();
const observer=new IntersectionObserver(entries=>{for(const entry of entries){tracks.set(entry.target,entry.isIntersecting);apply(entry.target);}},{rootMargin:'150px'});
function apply(section){section.querySelectorAll('.insights-marquee-track,.nuance-tools-track').forEach(el=>el.style.animationPlayState=tracks.get(section)&&!document.hidden?'running':'paused');}
function scan(){document.querySelectorAll('.insights-showcase,.nuance-tools').forEach(el=>{if(!tracks.has(el)){tracks.set(el,false);apply(el);observer.observe(el);}});}
scan();new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});document.addEventListener('visibilitychange',()=>{for(const section of tracks.keys())apply(section);});
