const NS='http://www.w3.org/2000/svg';let sv,A,HAT,uid=0;
function mk(t,a,p){const e=document.createElementNS(NS,t);for(const k in a)if(a[k]!=null)e.setAttribute(k,a[k]);(p||sv).appendChild(e);return e}
function tx(x,y,s,c,a,p){const t=mk('text',Object.assign({x:x,y:y,class:c||'dt'},a||{}),p);t.textContent=s;return t}
function begin(id){sv=document.getElementById(id);sv.innerHTML='';const n=uid++;const d=mk('defs',{});const m=mk('marker',{id:'ar'+n,viewBox:'0 0 10 10',refX:10,refY:5,markerWidth:7,markerHeight:7,orient:'auto-start-reverse',markerUnits:'userSpaceOnUse'},d);mk('path',{d:'M0,1.7 L10,5 L0,8.3 z',class:'arrow'},m);
 const pt=mk('pattern',{id:'hat'+n,width:5,height:5,patternUnits:'userSpaceOnUse',patternTransform:'rotate(45)'},d);mk('line',{x1:0,y1:0,x2:0,y2:5,class:'hl'},pt);A='url(#ar'+n+')';HAT='url(#hat'+n+')';rr(20,20,1660,1020,16,'border')}

/* ---- kit ---- */
function dimH(x1,x2,y,e1,e2,l,o){o=o||{};[[x1,e1],[x2,e2]].forEach(([x,e])=>{if(e==null)return;const s=Math.sign(y-e)||1;mk('line',{x1:x,y1:e+s*3,x2:x,y2:y+s*5,class:'ext'})});
 if(x2-x1>=28)mk('line',{x1:x1,y1:y,x2:x2,y2:y,class:'dl','marker-start':A,'marker-end':A});else{mk('line',{x1:x1-13,y1:y,x2:x1,y2:y,class:'dl','marker-end':A});mk('line',{x1:x2+13,y1:y,x2:x2,y2:y,class:'dl','marker-end':A});mk('line',{x1:x1,y1:y,x2:x2,y2:y,class:'dl'})}
 tx((x1+x2)/2+(o.dx||0),(o.below?y+13:y-4)+(o.dy||0),l,o.c||'dt',{'text-anchor':'middle'})}
function dimV(y1,y2,x,e1,e2,l,o){o=o||{};[[y1,e1],[y2,e2]].forEach(([y,e])=>{if(e==null)return;const s=Math.sign(x-e)||1;mk('line',{x1:e+s*3,y1:y,x2:x+s*5,y2:y,class:'ext'})});
 if(y2-y1>=28)mk('line',{x1:x,y1:y1,x2:x,y2:y2,class:'dl','marker-start':A,'marker-end':A});else{mk('line',{x1:x,y1:y1-13,x2:x,y2:y1,class:'dl','marker-end':A});mk('line',{x1:x,y1:y2+13,x2:x,y2:y2,class:'dl','marker-end':A});mk('line',{x1:x,y1:y1,x2:x,y2:y2,class:'dl'})}
 const c=(y1+y2)/2;if(o.side){const r=o.side==='r';tx(r?x+6:x-6,c+4,l,o.c||'dt',{'text-anchor':r?'start':'end'})}else tx(x-5,c,l,o.c||'dt',{'text-anchor':'middle',transform:'rotate(-90 '+(x-5)+' '+c+')'})}
function callout(px,py,ex,ey,l,dir,c){const s=dir||(ex>=px?1:-1);mk('circle',{cx:px,cy:py,r:1.8,class:'dot'});mk('polyline',{points:px+','+py+' '+ex+','+ey+' '+(ex+s*10)+','+ey,class:'lead'});tx(ex+s*14,ey+4,l,c||'dt',{'text-anchor':s>0?'start':'end'})}
function rad(cx,cy,r,c,l,L){const sx=c.includes('l')?-1:1,sy=c.includes('t')?-1:1;const ox=cx-sx*r,oy=cy-sy*r;const px=ox+sx*r*Math.SQRT1_2,py=oy+sy*r*Math.SQRT1_2;callout(px,py,px+sx*L,py+sy*L,l,sx)}
function nb(x,y,n){mk('rect',{x:x-6,y:y-6,width:12,height:12,class:'nb'});tx(x,y+3.5,String(n),'nbt',{'text-anchor':'middle'})}
function rr(x,y,w,h,r,c){return mk('rect',{x:x,y:y,width:w,height:h,rx:r,class:c})}
function slotLabel(x,y,w,h,l,al){tx(al==='l'?x+6:x+w/2,y+h/2+3.2,l,'sl',{'text-anchor':al==='l'?'start':'middle'})}
function title(x,y,t,s){tx(x,y,t,'vt',{'text-anchor':'middle'});if(s)tx(x,y+14,s,'dts',{'text-anchor':'middle'})}
function notes(list,extra){const NX=50,NY=58;tx(NX,NY,'NOTES:','nth');tx(NX+62,NY,'(UNLESS OTHERWISE SPECIFIED)','nt');
 list.forEach(([n,t],i)=>{const y=NY+30+i*24;if(n){nb(NX+6,y-4,n);tx(NX+22,y,t,'nt')}else tx(NX,y,t,'nt')})}
function table(x,y,ttl,rows){const ws=[44,154,252],rh=25;tx(x,y-8,ttl,'vt');
 const all=[['Code','Variable','Value']].concat(rows);all.forEach((r,i)=>{let cx2=x;r.forEach((c,j)=>{mk('rect',{x:cx2,y:y+i*rh,width:ws[j],height:rh,class:'thin'});tx(cx2+(j?ws[j]/2:6),y+i*rh+17,c,i?'tc':'th',{'text-anchor':j?'middle':'start'});cx2+=ws[j]})});return y+all.length*rh+36}
function detailRef(cx,cy,r,lbl,lx,ly){mk('circle',{cx:cx,cy:cy,r:r,class:'ph'});const a=Math.atan2(ly-cy,lx-cx);mk('line',{x1:cx+r*Math.cos(a),y1:cy+r*Math.sin(a),x2:lx,y2:ly,class:'lead'});tx(lx+(lx<cx?-4:4),ly+4,lbl,'dts',{'text-anchor':lx<cx?'end':'start'})}
