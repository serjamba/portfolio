import {timeline,enabled,subscribe} from './controller.js';
export function initStage(){
 const stage=document.querySelector('[data-stage]');if(!stage)return()=>{};
 const kind=stage.dataset.stage;if(kind==='fold')return initFold(stage);
 const play=stage.querySelector('[data-play]'),status=stage.querySelector('.stage-status'),buttons=[...stage.querySelectorAll('[data-step]')];let mode=0;
 const segments=[...stage.querySelectorAll('.segment')],grid=stage.querySelector('.grid'),word=stage.querySelector('.lumen-word'),letters=[...stage.querySelectorAll('.rift-letters span')],art=stage.querySelector('.rift-art');
 const clamp=(n)=>Math.min(1,Math.max(0,n)),ease=n=>{const t=clamp(n);return t*t*(3-2*t);};
 const draw=p=>{
  if(kind==='lumen'){
   const assemble=ease((p-.35)/.29),appear=clamp((p-.10)/.12),typ=clamp((p-.64)/.20);
   segments.forEach((s,i)=>{const a=i*2.094;s.style.opacity=appear;s.style.transform='translate('+Math.cos(a)*58*(1-assemble)+'px,'+Math.sin(a)*58*(1-assemble)+'px) rotate('+(i-1)*18*(1-assemble)+'deg)';});
   grid.style.opacity=.18*(1-clamp((p-.86)/.14));word.style.opacity=typ;word.style.letterSpacing=(26-9*typ)+'px';
  }else{
   art.classList.remove('horizontal');art.classList.toggle('rhythm',mode===1);const q=ease(p);art.querySelector('.rift-letters').style.transform=mode===2?'translateX('+(-18*q)+'%) scale('+(1-.3*q)+')':'';art.querySelector('.rift-bottom').style.opacity=mode===2?1-q:1;const side=art.querySelector('.rift-sidecopy');side.style.opacity=mode===2?q:0;side.style.transform='translateY('+(8*(1-q))+'px)';
   letters.forEach((l,i)=>{const q=clamp((p-i*.055)/.68);let x=0,y=0,sx=1;if(mode===0)y=32*(1-ease(q));if(mode===1)x=Math.sin(p*Math.PI*2)*(i-1.5)*14;if(mode===2){y=Math.sin(p*Math.PI)*(-16+i*5);sx=1-.06*Math.sin(p*Math.PI);}l.style.transform='translate('+x+'px,'+y+'px) scaleX('+sx+')';l.style.opacity=mode===0?clamp(q*3):1;});
  }
 };
 const t=timeline(stage,kind==='lumen'?3200:2800,draw,(p,playing)=>{play.textContent=playing?'Пауза':p>=1?(kind==='lumen'?'Повторить сборку':'Воспроизвести'):p>0?'Продолжить':kind==='lumen'?'Собрать знак':'Воспроизвести';const step=kind==='lumen'?p<.11?0:p<.36?1:p<.65?2:p<.86?3:4:mode;buttons.forEach((b,i)=>b.setAttribute('aria-pressed',i===step));status.textContent=(playing?'Воспроизведение · ':!enabled()?'Без движения · ':'')+buttons[step].textContent;});
 const click=e=>{if(e.target.closest('[data-play]'))t.play();if(e.target.closest('[data-final]'))t.seek(1);const b=e.target.closest('[data-step]');if(b){if(kind==='lumen')t.seek([.06,.29,.63,.84,1][+b.dataset.step]);else{mode=+b.dataset.step;t.seek(1);}}};
 stage.addEventListener('click',click);t.seek(1);stage._debug={get progress(){return t.progress},get playing(){return t.playing},get active(){return t.active}};
 return()=>{t.dispose();stage.removeEventListener('click',click);};
}
function initFold(stage){
 const visual=stage.querySelector('.stage-visual'),poster=visual.querySelector('img'),status=stage.querySelector('.stage-status'),play=stage.querySelector('[data-play]'),exit=stage.querySelector('[data-exit]'),steps=[...stage.querySelectorAll('[data-step]')],paths=['fold-flat','fold-step-1','fold-step-2','fold-step-3','fold-cover'],poses=[0,.35,.5,.72,1];
 let compilation=null,scene=null,t=null,disposed=false,loading=false,generation=0,resizeObserver,view=0,tilt=0,drag=null,frames=0;
 const showPoster=(step=4,msg='Статичный этап')=>{poster.src='assets/images/'+paths[step]+'.webp';poster.hidden=false;status.textContent=msg+' · '+steps[step].textContent;steps.forEach((b,i)=>b.setAttribute('aria-pressed',i===step));};
 const render=()=>{if(!scene)return;scene.pose(t?.progress??1,view);scene.model.group.rotation.x=tilt;scene.render();frames++;};
 const release=()=>{generation++;compilation?.abort();compilation=null;t?.dispose();t=null;resizeObserver?.disconnect();if(scene){const c=scene.renderer.domElement;scene.dispose();c.remove();scene=null;}loading=false;exit.hidden=true;play.disabled=false;play.textContent=enabled()?'Собрать упаковку':'Итог без движения';};
 async function load(){
  if(scene||loading||disposed)return !!scene;if(!enabled()){showPoster(4,'Движение отключено');return false;}loading=true;play.disabled=true;status.textContent='Загрузка 3D…';const gen=++generation;
  try{const [{createScene},{compileCancellable}]=await Promise.all([import('../three/fold-model.js'),import('../three/compile.js')]);if(disposed||gen!==generation)return false;await document.fonts.ready;const canvas=document.createElement('canvas');canvas.style.opacity='0';canvas.setAttribute('aria-label','Коробка FOLD с шарнирными панелями');const local=createScene(canvas);scene=local;visual.append(canvas);const size=()=>{if(!scene)return;scene.resize(visual.clientWidth,visual.clientHeight,devicePixelRatio);render();};
   t=timeline(stage,4000,p=>{local.pose(p,view);local.model.group.rotation.x=tilt;local.render();frames++;},(p,playing)=>{play.textContent=playing?'Пауза':p>=1?'Повторить сборку':p>0?'Продолжить':'Собрать упаковку';status.textContent=playing?'Складывание панелей':p>=1?'Готово · потяните в пределах ракурса':'Сборка остановлена';steps.forEach((b,i)=>b.setAttribute('aria-pressed',i=== (p<.1?0:p<.4?1:p<.55?2:p<.8?3:4)));});
   local.resize(visual.clientWidth,visual.clientHeight,devicePixelRatio);local.pose(1,0);compilation=new AbortController();await compileCancellable(local.renderer,local.scene,local.camera,compilation.signal);if(disposed||gen!==generation){if(scene===local)release();return false;}t.seek(1);resizeObserver=new ResizeObserver(size);resizeObserver.observe(visual);canvas.style.opacity='1';render();poster.hidden=true;exit.hidden=false;loading=false;play.disabled=false;
   canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();release();showPoster(4,'WebGL недоступен. Статичные этапы сохранены');});
   canvas.addEventListener('pointerdown',e=>{if(t?.progress<1||!enabled())return;drag={x:e.clientX,y:e.clientY,view,tilt};canvas.setPointerCapture(e.pointerId);});
   canvas.addEventListener('pointermove',e=>{if(!drag)return;view=Math.max(-.61,Math.min(.61,drag.view+(e.clientX-drag.x)*.004));tilt=Math.max(-.21,Math.min(.21,drag.tilt+(e.clientY-drag.y)*.002));render();});
   canvas.addEventListener('pointerup',()=>drag=null);canvas.addEventListener('pointercancel',()=>drag=null);return true;
  }catch(err){if(disposed||gen!==generation)return false;release();showPoster(4,'3D не загрузился. Доступны статичные этапы');return false;}
 }
 const click=async e=>{
  if(e.target.closest('[data-play]')){if(!enabled()){showPoster(4,'Движение отключено');return;}if(await load()){view=tilt=0;t.play();}}
  if(e.target.closest('[data-flat]')){view=tilt=0;if(t)t.seek(0);else showPoster(0);}
  const b=e.target.closest('[data-step]');if(b){view=tilt=0;if(t)t.seek(poses[+b.dataset.step]);else showPoster(+b.dataset.step);}
  const v=e.target.closest('[data-view]');if(v){view=Number(v.dataset.view);tilt=0;if(scene)render();else showPoster(4,'Ракурсы доступны после включения 3D');}
  if(e.target.closest('[data-exit]')){release();showPoster(4,'3D выключен');}
 };
 stage.addEventListener('click',click);const unsub=subscribe(on=>{if(!on){release();showPoster(4,'Движение отключено');}});
 showPoster(4,enabled()?'Постер · включите сборку':'Движение отключено');play.textContent=enabled()?'Собрать упаковку':'Итог без движения';
 stage._debug={get scene(){return scene},get progress(){return t?.progress??1},get frames(){return frames},get active(){return t?.active??false},get playing(){return t?.playing??false}};
 return()=>{disposed=true;release();unsub();stage.removeEventListener('click',click);};
}
