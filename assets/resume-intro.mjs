export function ResumeIntro({render:h,Roll,imageBuilder}) {
  return h('div',{className:'resume-intro',role:'img','aria-label':'个人简历：实习经历、获奖经历、软件技能、联系方式与领域优势',children:['day','night'].map(scene=>h('div',{
    className:'resume-intro-scene resume-intro-'+scene,
    children:h(Roll,{
      angle:90,
      animation:{animationDelay:0,animationDuration:1.5,replay:true,startAlign:'center',triggerMode:'scroll'},
      height:'100%',width:'100%',preview:true,rollRadius:.5,rolls:8,
      style:{height:'100%',width:'100%'},
      image:imageBuilder({pixelWidth:1920,pixelHeight:1178,src:'/assets/resume-atmosphere/'+scene+'-updated.webp'},'image')
    })
  },scene))});
}
