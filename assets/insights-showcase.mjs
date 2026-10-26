import {P as useEffect,I as useState} from './react.DylLBTGY.mjs';
const works=[{"title": "孙悟空kv图", "image": "/assets/portfolio-preview/work-0.webp", "href": "/project/monkey-king/", "width": 1345, "height": 751}, {"title": "天猫海鲜", "image": "/assets/portfolio-preview/work-1.webp", "href": "/project/tmall-fresh/", "width": 1570, "height": 877}, {"title": "天猫蔬菜", "image": "/assets/portfolio-preview/work-2.webp", "href": "/project/tmall-fresh/", "width": 1589, "height": 887}, {"title": "天猫水果", "image": "/assets/portfolio-preview/work-3.webp", "href": "/project/tmall-fresh/", "width": 1589, "height": 887}, {"title": "Mask group", "image": "/assets/portfolio-preview/work-4.webp", "href": "/project/ip-matrix/", "width": 1600, "height": 893}, {"title": "Mask group2", "image": "/assets/portfolio-preview/work-5.webp", "href": "/project/ip-matrix/", "width": 1600, "height": 893}, {"title": "春季", "image": "/assets/portfolio-preview/work-6.webp", "href": "/project/shepherd-ip/", "width": 1600, "height": 893}, {"title": "冬季羊 1", "image": "/assets/portfolio-preview/work-7.webp", "href": "/project/shepherd-ip/", "width": 1600, "height": 893}, {"title": "秋季1", "image": "/assets/portfolio-preview/work-8.webp", "href": "/project/shepherd-ip/", "width": 1600, "height": 893}, {"title": "剪纸", "image": "/assets/portfolio-preview/work-9.webp", "href": null, "width": 1600, "height": 900}, {"title": "蓝染", "image": "/assets/portfolio-preview/work-10.webp", "href": null, "width": 1600, "height": 890}];
const indices=works.map((_,i)=>i);
function shuffle(){const order=[...indices];for(let i=order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}return order;}
export function InsightsShowcase({render:h}) {
  const [orders,setOrders]=useState([indices,indices]);
  useEffect(()=>{setOrders([shuffle(),shuffle()]);},[]);
  const row=(order,index)=>h('div',{className:'insights-marquee-row',children:h('div',{
    className:'insights-marquee-track'+(index===1?' insights-marquee-track-reverse':''),
    children:Array.from({length:4},(_,copy)=>h('div',{className:'insights-marquee-group','aria-hidden':copy>0?true:undefined,
      children:order.map(i=>{const work=works[i];return h(work.href?'a':'div',{
        className:'insights-showcase-card',...(work.href?{href:work.href,tabIndex:copy>0?-1:0}:{}),'aria-label':work.title,
        children:h('img',{src:matchMedia('(max-width:767px)').matches?work.image.replace('.webp','-mobile.webp'):work.image,alt:work.title,width:work.width,height:work.height,loading:'lazy',decoding:'async',draggable:false})
      },i);})},copy))})},index);
  return h('div',{className:'insights-showcase',id:'portfolio-preview',children:[
    h('div',{className:'insights-showcase-heading',children:h('h2',{children:'Portfolio Preview'})}),
    h('div',{className:'insights-marquee-wall','aria-label':'作品图片预览',children:orders.map(row)})
  ]});
}
