import {P as useEffect,k as useRef} from './react.DylLBTGY.mjs';

const toolNames = ['Adobe Photoshop','Adobe Illustrator','Figma','Cinema 4D','Blender','AIGC'];
const toolImages = ['photoshop','illustrator','figma','cinema4d','blender','aigc'];
const skills = [
  {title:'Figma',icon:2,text:'Expert-level UI/UX design, prototyping, auto-layout, component libraries and design systems.'},
  {title:'Adobe Photoshop',icon:0,text:'Illustrator for branding, Photoshop for editing, After Effects for motion and micro-interactions.'},
  {title:'Adobe Illustrator',icon:1,text:'Web design and development. Landing pages, Saas sites, portfolio templates, CMS, animations.'}
];

export function NuanceTools({render:h}) {
  const ref = useRef(null);
  useEffect(() => {
    const element=ref.current;
    if(!element) return;
    const observer=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting)) {
        element.classList.add('nuance-tools-visible');
        observer.disconnect();
      }
    },{threshold:0.08});
    observer.observe(element);
    return()=>observer.disconnect();
  },[]);
  return h('div',{className:'nuance-tools',ref,children:[
    h('div',{className:'nuance-tools-heading',children:[
      h('p',{className:'nuance-tools-eyebrow',children:'EXPERTISE'}),
      h('div',{className:'nuance-tools-heading-row',children:[
        h('h2',{children:'Software Skills'}),
        h('div',{className:'nuance-tools-marquee',role:'group','aria-label':'Design tools',children:
          h('div',{className:'nuance-tools-track',children:[0,1,2].map(copy=>h('div',{
            className:'nuance-tools-group','aria-hidden':copy>0?true:undefined,
            children:toolNames.map((name,index)=>h('img',{src:'/assets/software-icons/'+toolImages[index]+'.lossless.webp',alt:name,width:90,height:90,draggable:false},name))
          },copy))})
        })
      ]})
    ]}),
    h('div',{className:'nuance-tools-cards',children:skills.map((skill,index)=>h('article',{
      className:'nuance-tools-card',tabIndex:0,style:{'--nuance-order':index},children:[
        h('img',{className:'nuance-tools-icon',src:'/assets/software-icons/'+toolImages[skill.icon]+'.lossless.webp',alt:'',width:64,height:64}),
        h('h3',{children:skill.title}),h('p',{children:skill.text})
      ]
    },skill.title))})
  ]});
}
