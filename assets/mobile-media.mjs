const phone=matchMedia('(max-width:767px)');
const asset=/\/assets\/(selected-artwork|portfolio-preview|about-atmosphere|contact-atmosphere)\/([^/]+)\.webp$/;
function updateImage(img){const current=img.getAttribute('src');if(!current||!asset.test(current))return;const original=current.replace('-mobile.webp','.webp');const next=phone.matches?original.replace('.webp','-mobile.webp'):original;if(current!==next){img.removeAttribute('srcset');img.setAttribute('src',next);}img.decoding='async';}
function update(scope){if(scope.matches?.('img'))updateImage(scope);scope.querySelectorAll?.('img').forEach(updateImage);}
update(document);phone.addEventListener('change',()=>update(document));
new MutationObserver(records=>{for(const record of records){if(record.type==='attributes'){updateImage(record.target);continue;}for(const node of record.addedNodes)if(node.nodeType===1)update(node);}}).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['src']});
