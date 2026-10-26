import './media-budget.mjs';
import './mobile-media.mjs';
import './detail-window.mjs';
import './hero-atmosphere.mjs';
const root=document.documentElement;
const preference=window.matchMedia('(prefers-color-scheme: dark)');
let explicit=false;
try {explicit=['light','dark'].includes(localStorage.getItem('xxun-atmosphere'));} catch {}
const links=[['HOME','/?preview=colors'],['PROJECT','/?preview=colors#project-gallery'],['ABOUT','/about/'],['CONTAC','/contact/']];
const header=document.createElement('nav');
header.className='atmosphere-header';header.setAttribute('aria-label','主导航');
header.innerHTML=`<button class="atmosphere-round atmosphere-theme" type="button"><span class="atmosphere-disc"><svg class="atmosphere-moon" viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M26 22.8A13 13 0 0 1 12.4 3.1 13.2 13.2 0 1 0 26 22.8Z"/></svg><svg class="atmosphere-sun" viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="16" cy="16" r="6"/><path d="M16 2v3m0 22v3M2 16h3m22 0h3M6 6l2 2m16 16 2 2M6 26l2-2M24 8l2-2"/></svg></span></button><a class="atmosphere-logo" href="/?preview=colors" aria-label="Project 首页">Project</a><div class="atmosphere-links">${links.map(([label,url])=>`<a href="${url}">${label}</a>`).join('')}</div><button class="atmosphere-round atmosphere-menu-button" type="button" aria-label="打开导航菜单" aria-expanded="false" aria-controls="atmosphere-menu"><div aria-hidden="true"><span></span><span></span><span></span></div></button>`;
const menu=document.createElement('div');menu.className='atmosphere-menu';menu.id='atmosphere-menu';menu.hidden=true;menu.setAttribute('aria-label','导航菜单');
menu.innerHTML=links.map(([label,url])=>`<a href="${url}">${label}</a>`).join('');
document.body.append(header,menu);
const toggle=header.querySelector('.atmosphere-theme');
const menuButton=header.querySelector('.atmosphere-menu-button');
function apply(theme,remember=false){
 root.dataset.theme=theme;root.style.colorScheme=theme;
 const dark=theme==='dark';toggle.setAttribute('aria-label',dark?'切换为浅色氛围':'切换为深色氛围');toggle.setAttribute('aria-pressed',String(dark));toggle.title=dark?'Light · 浅色氛围':'Dark · 深色氛围';
 if(remember){explicit=true;try{localStorage.setItem('xxun-atmosphere',theme);}catch{}}
}
toggle.addEventListener('click',()=>apply(root.dataset.theme==='dark'?'light':'dark',true));
apply(root.dataset.theme||'light');root.classList.add('atmosphere-ready');
preference.addEventListener('change',e=>{if(!explicit)apply(e.matches?'dark':'light');});
window.addEventListener('storage',e=>{if(e.key==='xxun-atmosphere'){explicit=['light','dark'].includes(e.newValue);apply(explicit?e.newValue:preference.matches?'dark':'light');}});
function closeMenu(returnFocus=false){menu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','打开导航菜单');if(returnFocus)menuButton.focus();}
menuButton.addEventListener('click',()=>{if(!menu.hidden){closeMenu();return;}menu.hidden=false;menuButton.setAttribute('aria-expanded','true');menuButton.setAttribute('aria-label','关闭导航菜单');menu.querySelector('a').focus();});
menu.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('click',e=>{if(!menu.hidden&&!menu.contains(e.target)&&!header.contains(e.target))closeMenu();});
document.addEventListener('keydown',e=>{if(menu.hidden)return;if(e.key==='Escape'){e.preventDefault();closeMenu(true);}if(e.key==='Tab'){const controls=[menuButton,...menu.querySelectorAll('a')];const index=controls.indexOf(document.activeElement);if(e.shiftKey&&index===0){e.preventDefault();controls.at(-1).focus();}else if(!e.shiftKey&&index===controls.length-1){e.preventDefault();controls[0].focus();}}});
// Theme neutral Framer surfaces only; artwork and colored icon surfaces retain their colors.
function classify(scope){
 const nodes=[...(scope.matches?.('#main div,#main section,#main footer')?[scope]:[]),...(scope.querySelectorAll?.('#main div,#main section,#main footer')||[])];
 for(const node of nodes){if(node.dataset.atmosphereSurface||node.closest('[data-framer-background-image-wrapper]')||node.classList.contains('framer-105fjnj'))continue;const color=getComputedStyle(node).backgroundColor;
 if(color==='rgb(255, 255, 255)')node.dataset.atmosphereSurface='paper';
 else if(['rgb(237, 248, 255)','rgb(244, 250, 255)'].includes(color))node.dataset.atmosphereSurface='soft';
 }
}
classify(document);
const observer=new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes)if(node.nodeType===1&&!header.contains(node)&&!menu.contains(node))classify(node);});
observer.observe(document.body,{childList:true,subtree:true});
function current(){for(const a of header.querySelectorAll('.atmosphere-links a')){if(new URL(a.href).pathname===location.pathname&&!new URL(a.href).hash)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');}}
current();window.addEventListener('popstate',()=>{current();closeMenu();});window.addEventListener('hashchange',()=>{current();closeMenu();});
