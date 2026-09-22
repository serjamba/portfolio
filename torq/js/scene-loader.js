/* The shop and poster never depend on WebGL. One mount owns one scene. */
TQ.mountScene=()=>{
 const host=document.querySelector('.hero-scene');if(!host)return;
 host.classList.remove('scene-ready');host.dataset.scene='poster';
 const controller=new AbortController();let stop=()=>{},idle,started=false;
 const touch=matchMedia('(pointer: coarse), (max-width: 767px)').matches;
 const forced=TQ.diagnostics?.forcedScene;
 let mode=TQ.scenePreference||(forced?TQ.diagnostics.scene:((touch||navigator.connection?.saveData)?'poster':'standard'));
 const controls=document.createElement('div');controls.className='scene-controls';
 controls.innerHTML='<button type="button" class="scene-toggle">Посмотреть в 3D</button><select aria-label="Качество 3D"><option value="standard">Стандартное</option><option value="light">Облегчённое</option></select>';
 host.append(controls);const button=controls.querySelector('button'),quality=controls.querySelector('select');quality.value=mode==='light'?'light':'standard';
 const update=()=>{const live=host.dataset.scene==='ready'||host.dataset.scene==='loading';button.textContent=live?'Выключить 3D':'Посмотреть в 3D';button.setAttribute('aria-pressed',String(live));quality.hidden=!live;};
 const mutation=new MutationObserver(update);mutation.observe(host,{attributes:true,attributeFilter:['data-scene']});
 const fallback=()=>{host.dataset.scene='fallback';host.classList.remove('scene-ready');host.querySelector('.scene-loading')?.remove();update();};
 function restart(next){TQ.scenePreference=next;TQ.unmountScene?.();TQ.mountScene();}
 button.addEventListener('click',()=>restart(host.dataset.scene==='ready'||host.dataset.scene==='loading'?'poster':quality.value),{signal:controller.signal});
 quality.addEventListener('change',()=>restart(quality.value),{signal:controller.signal});
 host.addEventListener('scene-slow',()=>{if(forced)return;restart(mode==='standard'?'light':'poster');},{signal:controller.signal});
 TQ.unmountScene=()=>{controller.abort();mutation.disconnect();if(window.cancelIdleCallback)cancelIdleCallback(idle);clearTimeout(idle);stop();controls.remove();};
 const start=async()=>{
  if(controller.signal.aborted||started)return;started=true;
  if(mode==='poster'||location.protocol==='file:'){fallback();return;}
  let context;
  try{
   const canvas=document.createElement('canvas');context=canvas.getContext('webgl2',{alpha:true,antialias:mode!=='light',powerPreference:'low-power'});
   if(!context){fallback();return;}
   controller.signal.addEventListener('abort',()=>{if(!context.isContextLost())context.getExtension('WEBGL_lose_context')?.loseContext();},{once:true});
   host.dataset.scene='loading';host.dataset.quality=mode;update();
   const module=await import('./suspension-scene.js');if(controller.signal.aborted)return;
   stop=await module.mountSuspension(host,canvas,context,controller.signal);
  }catch(error){if(context&&!context.isContextLost())context.getExtension('WEBGL_lose_context')?.loseContext();if(!controller.signal.aborted){fallback();console.info('TORQ: static suspension view is active.',error.message);}}
 };
 if(mode==='poster')fallback();else idle=window.requestIdleCallback?requestIdleCallback(start,{timeout:1200}):setTimeout(start,0);
 update();
};
