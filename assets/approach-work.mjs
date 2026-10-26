import {P as useEffect,k as useRef} from './react.DylLBTGY.mjs';

const works=[
  {title:'香港金融视觉设计',category:'UI/UX DESIGN',project:'hong-kong-finance'},
  {title:'蚂蚁基金视觉设计',category:'UI/UX DESIGN',project:'ant-fund'},
  {title:'淘宝大促视觉设计',category:'UI/UX DESIGN',project:'taobao-sale'},
  {title:'香港电竞嘉年华视觉设计',category:'UI/UX DESIGN',project:'hong-kong-esports'}
];

export function ApproachWork({render:h}) {
  const ref=useRef(null);
  useEffect(()=>{
    const root=ref.current;
    if(!root) return;
    const rows=[...root.querySelectorAll('.approach-work-row')];
    const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame=0;
    const update=()=>{
      frame=0;
      rows.forEach(row=>{
        const top=row.getBoundingClientRect().top;
        const progress=Math.max(0,Math.min(1,(window.innerHeight-top)/(window.innerHeight*.72)));
        const distance=motion.matches?0:Math.min(180,window.innerWidth*.16)*Math.pow(1-progress,2);
        row.style.setProperty('--approach-offset',distance+'px');
      });
    };
    const schedule=()=>{if(!frame) frame=requestAnimationFrame(update);};
    update();
    window.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',schedule,{passive:true});
    motion.addEventListener('change',schedule);
    const observer=new ResizeObserver(schedule);
    observer.observe(root);
    return()=>{
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll',schedule);
      window.removeEventListener('resize',schedule);
      motion.removeEventListener('change',schedule);
    };
  },[]);
  return h('div',{className:'approach-work',id:'project-gallery',ref,'aria-label':'Project gallery',children:[0,1].map(row=>h('div',{
    className:'approach-work-row',children:works.slice(row*2,row*2+2).map((work,column)=>h('figure',{
      className:'approach-work-card approach-work-'+(column?'right':'left'),children:[
        h(work.project?'a':'div',{className:'approach-work-image',...(work.project?{href:'/project/'+work.project+'/', 'aria-label':'查看'+work.title+'完整作品'}:{}),children:h('img',{src:work.project?'/assets/'+work.project+'-project/'+(work.project==='taobao-sale'?'updated-cover.webp':'cover.webp'):'/assets/approach-work-'+(row*2+column)+'.jpg',alt:work.title,loading:'lazy',decoding:'async',width:1200,height:900})}),
        h('figcaption',{children:[h('span',{className:'approach-work-title',children:work.title}),h('span',{className:'approach-work-category',children:'('+work.category+')'})]})
      ]
    },work.title))
  },row))});
}
