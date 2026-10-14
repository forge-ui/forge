/* Prototype-wide text conformance. Values come from Forge's installed token contract. */
(()=>{
 let pending=false;
 function scan(){
  pending=false;const base=getComputedStyle(document.documentElement);
  const values=pattern=>Array.from(base).filter(k=>pattern.test(k)).map(k=>parseFloat(base.getPropertyValue(k))).filter(Number.isFinite);
  const sizes=values(/^--forge-text-.*-size$/),weights=values(/^--forge-font-.*-weight$/);
  const nearest=(n,list)=>list.reduce((a,b)=>Math.abs(b-n)<Math.abs(a-n)?b:a,list[0]);
  const mono=/monospace/;
  const probe=document.createElement('span');document.documentElement.append(probe);
  const colors=['--foreground','--text-secondary','--text-muted','--accent','--accent-foreground','--accent-soft-foreground','--fg-red','--fg-green-500','--fg-green-700','--fg-yellow-700','--fg-white'].map(token=>{probe.style.color='var('+token+')';return {token,color:getComputedStyle(probe).color};});probe.remove();
  const rgb=s=>(s.match(/[\d.]+/g)||[]).slice(0,3).map(Number);
  const distance=(a,b)=>rgb(a).reduce((sum,n,i)=>sum+(n-rgb(b)[i])**2,0);
  for(const el of document.body.querySelectorAll('*')){
   if(el.closest('script,style,svg,pre,code,[data-typography-exempt]'))continue;
   const hasText=Array.from(el.childNodes).some(n=>n.nodeType===3&&n.textContent.trim());
   if(!hasText&&!el.matches('input,textarea,select,button'))continue;
   const css=getComputedStyle(el);if(css.display==='none')continue;
   const set=(key,value)=>{if(el.style[key]!==value)el.style[key]=value;};
   const family=el.matches('h1,h2,h3,h4,h5,h6')?'var(--forge-font-display-family), "PingFang SC", sans-serif':'var(--forge-font-sans-family), "PingFang SC", sans-serif';
   if(!mono.test(css.fontFamily))set('fontFamily',family);
   set('fontSize',nearest(parseFloat(css.fontSize),sizes)+'px');
   set('fontWeight',String(nearest(parseFloat(css.fontWeight)||400,weights)));
   const match=colors.find(c=>c.color===css.color);
   if(!match){const best=colors.reduce((a,b)=>distance(css.color,b.color)<distance(css.color,a.color)?b:a);set('color','var('+best.token+')');}
  }
 }
 function schedule(){if(!pending){pending=true;queueMicrotask(scan);}}
 window.addEventListener('DOMContentLoaded',()=>{scan();new MutationObserver(schedule).observe(document.body,{subtree:true,childList:true,characterData:true});new MutationObserver(schedule).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme','data-accent','data-locale']});});
 window.forgeAuditTypography=()=>{
  const root=getComputedStyle(document.documentElement);const sizes=Array.from(root).filter(k=>/^--forge-text-.*-size$/.test(k)).map(k=>parseFloat(root.getPropertyValue(k)));const weights=[400,500,600,700];
  return [...document.body.querySelectorAll('*')].filter(e=>!e.closest('script,style,svg,pre,code')&&getComputedStyle(e).display!=='none'&&[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())).map(e=>{const s=getComputedStyle(e);return {text:e.textContent.trim().slice(0,60),font:s.fontFamily,size:parseFloat(s.fontSize),weight:Number(s.fontWeight),color:s.color,valid:sizes.includes(parseFloat(s.fontSize))&&weights.includes(Number(s.fontWeight))&&/Manrope|Plus Jakarta|monospace/.test(s.fontFamily)}});
 };
})();
