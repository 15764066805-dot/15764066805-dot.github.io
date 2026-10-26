// Text follows the actual vertical position within the hero gradient.
const stops=[[0,[7,100,232]],[.22,[8,123,255]],[.52,[100,181,255]],[.78,[198,230,255]],[1,[237,248,255]]];
const dark=[16,24,32],light=[255,255,255];
function luminance(rgb){return rgb.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);}
function gradientAt(position){const t=Math.max(0,Math.min(1,position));let i=1;while(i<stops.length-1&&t>stops[i][0])i++;const a=stops[i-1],b=stops[i],f=(t-a[0])/(b[0]-a[0]);return a[1].map((v,j)=>v+(b[1][j]-v)*f);}
function contrast(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
function inkFor(backgrounds){const white=Math.min(...backgrounds.map(bg=>contrast(light,bg))),black=Math.min(...backgrounds.map(bg=>contrast(dark,bg)));return white>=4.5||white>black?'#ffffff':'#101820';}
let scheduled=false;
function update(){
  scheduled=false;
  const hero=document.querySelector('.framer-105fjnj');
  const rect=hero?.getBoundingClientRect();
  if(rect?.height){
    hero.querySelectorAll('.framer-text').forEach(element=>{
      const r=element.getBoundingClientRect();
      if(!r.width||!r.height)return;
      const samples=[r.top,r.top+r.height/2,r.bottom].map(y=>gradientAt((y-rect.top)/rect.height));
      element.style.setProperty('--hero-adaptive-ink',inkFor(samples));
    });
  }
  const header=document.querySelector('#main header');
  if(header){
    const r=header.getBoundingClientRect(),y=r.top+r.height/2;
    let bg=rect&&y>=rect.top&&y<=rect.bottom?gradientAt((y-rect.top)/rect.height):light;
    const nav=header.querySelector('nav');
    const surface=nav&&getComputedStyle(nav).backgroundColor;
    if(surface&&surface!=='rgba(0, 0, 0, 0)') {
      const channels=surface.match(/[\d.]+/g)?.map(Number);
      if(channels&&channels.length>=3&&(channels.length===3||channels[3]>=.95))bg=channels.slice(0,3);
    }
    const ink=inkFor([bg]);header.style.setProperty('--nav-adaptive-ink',ink);
    header.querySelectorAll('img[alt="Logo"]').forEach(img=>{img.style.filter=ink==='#ffffff'?'brightness(0) invert(1)':'brightness(0)';});
  }
}
function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(update);}}
function start(){
  schedule();
  new MutationObserver(schedule).observe(document.querySelector('#main')||document.body,{childList:true,subtree:true});
  new ResizeObserver(schedule).observe(document.documentElement);
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  document.addEventListener('animationend',schedule,true);
  document.addEventListener('load',schedule,true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
