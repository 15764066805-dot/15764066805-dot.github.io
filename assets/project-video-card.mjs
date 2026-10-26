import {P as useEffect,k as useRef} from './react.DylLBTGY.mjs';
const projectCopy={"shiqi-symbol":["品牌主视觉KV","Shiqi Symbol · Key Visual Design"],"hong-kong": ["港澳出粮/北上/新人赏商业项目", "AlipayHK / Alipay Hong Kong & Macau Projects"], "ant-forest": ["蚂蚁森林十周年证书商业项目", "Ant Forest 10th Anniversary Certificate"], "tmall-fresh": ["天猫品牌运营设计", "Tmall Brand Operation Key Visual"], "winter-arena": ["冰域跃界活动主视觉项目", "Key Visual Design for the \"Ice Realm\"  Campaign"], "monkey-king": ["金猴天马新年主视觉项目", "\"Golden Monkey & Heavenly Horse\" New Year Key Visual"], "shepherd-ip": ["《青野铃音 牧羊曲》角色IP设计", "Character IP Design for \"Qingye Lingyin: Shepherd's Song\""], "ip-matrix": ["角色IP矩阵设计", "Character IP Portfolio Design"]};
export function ProjectVideoCard({render:h,title,description,project='hong-kong',label='港澳项目'}) {
  [title,description]=projectCopy[project]??[title,description];
  const ref=useRef(null);
  useEffect(()=>{
    const video=ref.current;
    if(!video) return;
    const observer=new IntersectionObserver(entries=>{
      if(entries.some(e=>e.isIntersecting)){if(!video.getAttribute('src'))video.src=video.dataset.src;if(!matchMedia('(prefers-reduced-motion: reduce)').matches)video.play().catch(()=>{});}
      else video.pause();
    },{threshold:.05});
    observer.observe(video);
    return()=>observer.disconnect();
  },[]);
  return h('a',{className:'project-video-card',id:project+'-preview',href:'/project/'+project+'/', 'aria-label':'查看'+label+'完整作品',children:[
    h('video',{ref,'data-src':'/assets/'+project+'-project/'+(matchMedia('(max-width:767px)').matches?'preview-mobile.mp4':'preview.mp4'),poster:'/assets/'+project+'-project/poster.jpg',autoPlay:false,muted:true,loop:true,playsInline:true,preload:'none','aria-label':label+'视频预览'}),
    h('div',{className:'project-video-caption',children:[h('h3',{children:title}),h('p',{children:description})]})
  ]});
}
