const system=matchMedia('(prefers-reduced-motion: reduce)');
let preference;try{preference=localStorage.getItem('void-motion-v1')!=='off';}catch{preference=true;}
const subscribers=new Set();export const enabled=()=>preference&&!system.matches;
function apply(){document.body.classList.toggle('no-motion',!enabled());document.querySelectorAll('[data-motion]').forEach(b=>{b.textContent='Анимация: '+(enabled()?'вкл.':'выкл.');b.setAttribute('aria-pressed',enabled());b.title=system.matches?'Системное предпочтение уменьшенного движения включено':'Управление всеми эффектами сайта';});subscribers.forEach(f=>f(enabled()));}
export const subscribe=f=>{subscribers.add(f);return()=>subscribers.delete(f);};
export function initMotion(){document.addEventListener('click',e=>{if(e.target.closest('[data-motion]')){preference=!enabled();try{localStorage.setItem('void-motion-v1',preference?'on':'off');}catch{}apply();}});system.addEventListener('change',apply);apply();}
export const syncMotion=apply;
export function timeline(stage,duration,draw,changed=()=>{}){
 let progress=1,playing=false,frame=0,last=0,visible=true;
 const paint=()=>{draw(progress);changed(progress,playing);};
 const tick=now=>{frame=0;if(!playing||!visible||document.hidden||!enabled())return;if(last)progress=Math.min(1,progress+(now-last)/duration);last=now;if(progress===1)playing=false;paint();schedule();};
 const schedule=()=>{if(playing&&visible&&!document.hidden&&enabled()&&!frame)frame=requestAnimationFrame(tick);};
 const suspend=()=>{cancelAnimationFrame(frame);frame=0;last=0;};
 const visibility=()=>{suspend();schedule();};document.addEventListener('visibilitychange',visibility);
 const observer=new IntersectionObserver(([e])=>{visible=e.isIntersecting;suspend();schedule();},{threshold:.01});observer.observe(stage);
 const unsubscribe=subscribe(on=>{if(!on){playing=false;suspend();progress=1;paint();}});
 return {get progress(){return progress},get playing(){return playing},get active(){return !!frame},play(){if(!enabled()){this.seek(1);return;}if(playing){playing=false;suspend();}else{if(progress>=1)progress=0;playing=true;last=0;schedule();}paint();},seek(p){playing=false;suspend();progress=p;paint();},pause(){playing=false;suspend();paint();},dispose(){suspend();observer.disconnect();unsubscribe();document.removeEventListener('visibilitychange',visibility);}};
}
export function pointerEffects(){
 const clean=[],fine=matchMedia('(hover:hover) and (pointer:fine)');
 const listen=(el,type,fn)=>{el.addEventListener(type,fn);clean.push(()=>el.removeEventListener(type,fn));};
 const hero=document.querySelector('.hero'),letters=[...document.querySelectorAll('.hero-word .letter')];let bounds=[];
 const reset=()=>{letters.forEach(l=>l.style.transform='');document.querySelectorAll('.magnetic>span').forEach(s=>s.style.transform='');};
 if(hero){listen(hero,'pointerenter',()=>{bounds=letters.map(l=>l.getBoundingClientRect());});listen(hero,'pointermove',e=>{if(!enabled()||!fine.matches||e.pointerType==='touch')return;letters.forEach((l,i)=>{const b=bounds[i];if(!b)return;const strength=Math.max(0,1-Math.abs(e.clientX-(b.x+b.width/2))/230);l.style.transform='translateY('+(-4*strength)+'px) scale('+(1+.035*strength)+','+(1+.016*strength)+')';});});listen(hero,'pointerleave',reset);}
 document.querySelectorAll('.magnetic').forEach(el=>{let r;listen(el,'pointerenter',()=>{r=el.getBoundingClientRect();});listen(el,'pointermove',e=>{if(!enabled()||!fine.matches||el.matches(':focus-visible')||!r)return;el.firstElementChild.style.transform='translate('+((e.clientX-r.x-r.width/2)/r.width*8)+'px,'+((e.clientY-r.y-r.height/2)/r.height*8)+'px)';});listen(el,'pointerleave',()=>el.firstElementChild.style.transform='');});
 const preview=document.querySelector('#preview');let timer=0,active=null;
 const hide=()=>{clearTimeout(timer);preview.classList.remove('visible');active=null;};
 const place=(x,y)=>{const w=360,h=250;let left=Math.min(innerWidth-w-16,Math.max(innerWidth*.57,x+28));preview.style.transform='translate('+Math.max(16,left)+'px,'+Math.max(16,Math.min(innerHeight-h-16,y-h/2))+'px)';};
 document.querySelectorAll('[data-preview]').forEach(row=>{
  const show=(keyboard,x,y)=>{if(!enabled()||!fine.matches||innerWidth<1000)return;clearTimeout(timer);active=row;timer=setTimeout(()=>{if(active!==row)return;preview.replaceChildren(row.querySelector('img').cloneNode());place(keyboard?innerWidth-390:x,keyboard?innerHeight/2:y);preview.classList.add('visible');},keyboard?0:120);};
  listen(row,'pointerenter',e=>show(false,e.clientX,e.clientY));listen(row,'pointermove',e=>{if(active===row)place(e.clientX,e.clientY);});listen(row,'pointerleave',hide);listen(row,'focus',()=>show(true));listen(row,'blur',hide);
 });listen(document,'keydown',e=>{if(e.key==='Escape')hide();});listen(window,'scroll',hide);
 const mediaObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){if(enabled())e.target.classList.add('media-ready');mediaObserver.unobserve(e.target);}}),{threshold:.1});document.querySelectorAll('.project-card .media,.studio-image').forEach(e=>mediaObserver.observe(e));const unsub=subscribe(()=>{reset();hide();});return()=>{clean.forEach(f=>f());hide();unsub();reset();mediaObserver.disconnect();};
}
