import DriftWall from './DriftWall.mjs';
import {I as useState,P as useEffect} from './react.DylLBTGY.mjs';
const items=[{"title": "天猫KV_光效增强版", "image": "/assets/selected-artwork/work-0.webp", "aspect": "landscape"}, {"title": "Clipboard - 2026-10-07 14.43.19", "image": "/assets/selected-artwork/work-1.webp", "aspect": "portrait"}, {"title": "天猫kv无排版", "image": "/assets/selected-artwork/work-2.webp", "aspect": "landscape"}, {"title": "秋季", "image": "/assets/selected-artwork/work-3.webp", "aspect": "portrait"}, {"title": "瑞幸咖啡毛毡kv", "image": "/assets/selected-artwork/work-4.webp", "aspect": "landscape"}, {"title": "第三周渲染图", "image": "/assets/selected-artwork/work-5.webp", "aspect": "portrait"}, {"title": "恐爪龙", "image": "/assets/selected-artwork/work-6.webp", "aspect": "portrait"}, {"title": "冬季-牧羊曲", "image": "/assets/selected-artwork/work-7.webp", "aspect": "portrait"}, {"title": "三角龙", "image": "/assets/selected-artwork/work-8.webp", "aspect": "portrait"}, {"title": "Clipboard - 2026-10-07 14.43.06", "image": "/assets/selected-artwork/work-9.webp", "aspect": "portrait"}, {"title": "美团骑手_春日校园轮滑_3D写实风格_版本2", "image": "/assets/selected-artwork/work-10.webp", "aspect": "landscape"}, {"title": "Image 3", "image": "/assets/selected-artwork/work-11.webp", "aspect": "portrait"}, {"title": "Mask group", "image": "/assets/selected-artwork/work-12.webp", "aspect": "portrait"}, {"title": "羊族少女夜晚海报", "image": "/assets/selected-artwork/work-13.webp", "aspect": "portrait"}, {"title": "美团骑手_夏日海滩冲浪送单_3D写实风格 (1)", "image": "/assets/selected-artwork/work-14.webp", "aspect": "landscape"}, {"title": "美团骑手_飞檐走壁_3D写实风格_版本2 (1)", "image": "/assets/selected-artwork/work-15.webp", "aspect": "landscape"}, {"title": "抖音电竞jpg", "image": "/assets/selected-artwork/work-16.webp", "aspect": "portrait"}, {"title": "羊族少女_夜晚海报 2", "image": "/assets/selected-artwork/work-17.webp", "aspect": "portrait"}, {"title": "春季", "image": "/assets/selected-artwork/work-18.webp", "aspect": "portrait"}, {"title": "夏季", "image": "/assets/selected-artwork/work-19.webp", "aspect": "portrait"}];
export function ExactProjectsShowcase({render:h}){
  const [width,setWidth]=useState(()=>typeof window!=='undefined'?window.innerWidth:1389);
  useEffect(()=>{const change=()=>setWidth(window.innerWidth);window.addEventListener('resize',change,{passive:true});return()=>window.removeEventListener('resize',change);},[]);
  const [randomItems,setRandomItems]=useState(items);
  useEffect(()=>{const shuffled=[...items];for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}setRandomItems(shuffled);},[]);
  const mobile=width<600;
  const tileWidth=mobile?180:width<1100?200:270;
  return h('div',{className:'projects-exact-showcase',children:[
    h('h2',{className:'projects-exact-title',children:'Selected Project'}),
    h('div',{className:'projects-exact-frame',children:h(DriftWall,{
      items:randomItems,columns:mobile?2:4,tileWidth,tileHeight:Math.round(tileWidth*.8),gap:14,
      tilt:0,turn:0,perspective:1200,depth:180,speed:40,direction:'up',variance:.4,
      parallax:.8,lift:64,fade:.4,dim:.65,overlayColor:'#060010'
    })})
  ]});
}
