export const driftParameters = { columns: 4, tileWidth: 200, tileHeight: 132, gap: 14, tilt: 0, turn: 0, perspective: 1200, depth: 180, speed: 40, direction: 'up', variance: .4, parallax: .8, lift: 64, fade: .4, dim: .65, overlayColor: '#060010' };
const projects = [
  {title:'Prismico', category:'Brand Identity, Digital Design', image:'/assets/75586836ce80c7bd.lossless.webp', slug:'prismico'},
  {title:'Lumina', category:'UI/UX Design, Web Experience', image:'/assets/7d38486ffb243b58.lossless.webp', slug:'lumina'},
  {title:'Velar', category:'Creative Direction, Visual Identity', image:'/assets/da34a0572e476957.lossless.webp', slug:'velar'},
  {title:'Neura', category:'Product Design, Development', image:'/assets/d98234a105187bac.lossless.webp', slug:'neura'},
  {title:'Axion', category:'Digital Strategy, Web Design', image:'/assets/abe353af4c950f8d.lossless.webp', slug:'axion'}
];

function connectPointer(wall) {
  const plane=wall.querySelector('.drift-plane');
  let desiredX=0,desiredY=0,x=0,y=0,frame=0,visible=false;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  function tick(){
    if(!visible||reduced.matches){frame=0;return;}
    x+=(desiredX-x)*.07;y+=(desiredY-y)*.07;
    plane.style.setProperty('--pointer-x', `${(x*18*.8).toFixed(2)}px`);
    plane.style.setProperty('--pointer-y', `${(y*14*.8).toFixed(2)}px`);
    plane.style.setProperty('--pointer-turn', `${(x*5*.8).toFixed(3)}deg`);
    plane.style.setProperty('--pointer-tilt', `${(-y*4*.8).toFixed(3)}deg`);
    frame=requestAnimationFrame(tick);
  }
  const move=e=>{if(e.pointerType==='touch')return;const r=wall.getBoundingClientRect();desiredX=(e.clientX-r.left)/r.width*2-1;desiredY=(e.clientY-r.top)/r.height*2-1;};
  const leave=()=>{desiredX=desiredY=0;};
  wall.addEventListener('pointermove',move);wall.addEventListener('pointerleave',leave);
  const observer=new IntersectionObserver(entries=>{
    visible=entries[0].isIntersecting;
    wall.classList.toggle('drift-offscreen',!visible);
    if(visible&&!frame&&!reduced.matches)frame=requestAnimationFrame(tick);
  },{rootMargin:'150px'});
  observer.observe(wall);
  return ()=>{cancelAnimationFrame(frame);observer.disconnect();wall.removeEventListener('pointermove',move);wall.removeEventListener('pointerleave',leave);};
}

export function ProjectsDriftWall({render:h}){
  let cleanup;
  const ref=node=>{cleanup?.();cleanup=node?connectPointer(node):undefined;};
  const columns=Array.from({length:4},(_,column)=>{
    const speeds=[.76,1.16,.93,1.32];
    return h('div',{
      className:'drift-column',
      style:{'--column-depth':`${[-90,-30,30,90][column]}px`,'--offset':`${[-80,-220,-140,-300][column]}px`,'--duration':`${730/(40*speeds[column])}s`,'--flutter-duration':`${8+column*1.5}s`},
      children:h('div',{
        className:'drift-column-float',
        children:h('div',{
          className:'drift-track',
          children:Array.from({length:3},(_,copy)=>h('div',{
            className:'drift-group','aria-hidden':copy>0?true:undefined,
            children:projects.map((_,index)=>{
              const project=projects[(index+column*2)%projects.length];
              const depth=((index*37+column*23)%181)-90;
              return h('div',{
                className:'drift-tile-space',style:{'--tile-depth':`${depth}px`,'--float-delay':`${-(index+column)*1.4}s`},
                children:h('a',{
                  className:'drift-card',href:'/project/'+project.slug,'aria-label':project.title,tabIndex:copy>0?-1:0,
                  children:[h('img',{src:project.image,alt:'',width:200,height:132,loading:'lazy',decoding:'async',draggable:false}),h('span',{className:'drift-card-caption',children:[h('strong',{children:project.title}),h('span',{children:project.category})]})]
                })
              },project.slug);
            })
          },copy))
        })
      })
    },column);
  });
  return h('div',{
    className:'projects-drift-showcase',
    children:[h('h2',{className:'projects-drift-heading',children:'Selected Projects'}),h('div',{
      className:'drift-wall',ref,'aria-label':'Floating project gallery',
      children:h('div',{className:'drift-perspective',children:h('div',{className:'drift-plane',children:columns})})
    })]
  });
}
