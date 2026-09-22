import * as THREE from '../assets/vendor/three/three.module.js';
import {GLTFLoader} from '../assets/vendor/three/GLTFLoader.js';

const partLinks={
 strut:['Амортизаторы','#/category?cat=suspension&sub=Амортизаторы'],
 spring:['Пружины подвески','#/category?cat=suspension&sub=Пружины'],
 arm:['Рычаги подвески','#/category?cat=suspension&sub=Рычаги+подвески'],
 hub:['Ступичные узлы','#/category?cat=suspension&sub=Опоры+и+подшипники'],
 brakes:['Тормозная система','#/category?cat=brakes']
};
// One bounded CPU-side environment cache; GPU textures belong to each mount.
let studioData;
async function loadStudio(){
 if(!studioData)studioData=Promise.all([
  fetch(new URL('../assets/models/studio-environment.json',import.meta.url),{signal:AbortSignal.timeout(12000)}).then(r=>{if(!r.ok)throw Error('Studio metadata unavailable');return r.json();}),
  fetch(new URL('../assets/models/studio-environment.bin.gz',import.meta.url),{signal:AbortSignal.timeout(12000)}).then(r=>{if(!r.ok)throw Error('Studio lighting unavailable');return new Response(r.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();})
 ]).catch(e=>{studioData=null;throw e;});
 return studioData;
}
export async function mountSuspension(host,canvas,context,signal){
 const light=host.dataset.quality==='light';
 let renderer,environment,model,observer,resizeObserver,frame=0,paintFrame=0,dead=false,visible=true,paused=false,last=0,elapsed=0,selected=null;
 const events=new AbortController();
 const media=matchMedia('(prefers-reduced-motion: reduce)');
 const pointer=new THREE.Vector2(5,5),target=new THREE.Vector2(),rotation=new THREE.Vector2(),raycaster=new THREE.Raycaster();
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(33,1,.1,30);
 camera.position.set(-3.4,.95,5.8);camera.lookAt(-.05,.18,0);
 const geometries=new Set(),materials=new Set(),textures=new Set(),meshes=[];
 const tooltip=host.querySelector('.scene-tooltip'),pause=host.querySelector('.scene-pause');
 let timer,moveFrame=0,lastPointer=null,slowSamples=[],startedAt=0,slowDraws=0;
 function cleanup(){
  if(dead)return;dead=true;events.abort();clearTimeout(timer);cancelAnimationFrame(frame);cancelAnimationFrame(paintFrame);cancelAnimationFrame(moveFrame);observer?.disconnect();resizeObserver?.disconnect();
  media.removeEventListener('change',motionChange);document.removeEventListener('visibilitychange',visibilityChange);
  geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());environment?.dispose();
  renderer?.dispose();if(!context.isContextLost())context.getExtension('WEBGL_lose_context')?.loseContext();canvas.remove();
 }
 function fallback(){
  host.classList.remove('scene-ready');host.dataset.scene='fallback';host.querySelector('.scene-loading')?.remove();tooltip.hidden=true;cleanup();
 }
 signal.addEventListener('abort',cleanup,{once:true});
 try{
  renderer=new THREE.WebGLRenderer({canvas,context,alpha:true,antialias:true,powerPreference:'low-power'});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();fallback();},{signal:events.signal});
  renderer.setPixelRatio(Math.min(devicePixelRatio,light?1:(window.TQ?.diagnostics?.dpr||1.5)));renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.9;renderer.setClearColor(0x111315,0);
  const [studioMeta,studioBuffer]=await loadStudio();if(dead||signal.aborted)return cleanup;
  environment=new THREE.DataTexture(new Uint16Array(studioBuffer),studioMeta.width,studioMeta.height,THREE.RGBAFormat,THREE.HalfFloatType);
  environment.mapping=THREE.CubeUVReflectionMapping;environment.minFilter=environment.magFilter=THREE.LinearFilter;
  environment.colorSpace=THREE.LinearSRGBColorSpace;environment.needsUpdate=true;scene.environment=environment;
  scene.add(new THREE.HemisphereLight(0xf3f6ff,0x222329,.35));
  const key=new THREE.DirectionalLight(0xffffff,2.4);key.position.set(-3,4,5);scene.add(key);
  const rim=new THREE.DirectionalLight(0xe5eeff,1.0);rim.position.set(4,2,-2);scene.add(rim);
  const fetchController=new AbortController();
  signal.addEventListener('abort',()=>fetchController.abort(),{once:true});
  events.signal.addEventListener('abort',()=>fetchController.abort(),{once:true});
  timer=setTimeout(()=>fetchController.abort(),12000);
  const response=await fetch(new URL('../assets/models/suspension.glb',import.meta.url),{signal:fetchController.signal});
  if(!response.ok)throw Error('Model unavailable');
  const buffer=await response.arrayBuffer();clearTimeout(timer);
  if(dead||signal.aborted)return cleanup;
  const gltf=await new GLTFLoader().parseAsync(buffer,'');
  model=gltf.scene;
  if(dead||signal.aborted){model.traverse(o=>{if(o.isMesh){o.geometry.dispose();o.material.dispose();}});return cleanup;}
  // Tiny locally generated machining map; no image download or large texture atlas.
  const pixels=new Uint8Array(128*512*4);let seed=71;
  for(let y=0;y<512;y++)for(let x=0;x<128;x++){seed=(seed*1664525+1013904223)>>>0;const n=202+Math.sin(y*2.7)*12+(seed%31);const i=(y*128+x)*4;pixels[i]=pixels[i+1]=pixels[i+2]=n;pixels[i+3]=255;}
  const machining=new THREE.DataTexture(pixels,128,512);machining.wrapS=machining.wrapT=THREE.RepeatWrapping;machining.magFilter=THREE.LinearFilter;machining.needsUpdate=true;textures.add(machining);
  model.traverse(o=>{if(o.isMesh){geometries.add(o.geometry);o.material=o.material.clone();materials.add(o.material);o.material.envMapIntensity=1.0;meshes.push(o);
   if(!light&&o.material.name==='Machined steel'){
    const p=o.geometry.attributes.position,uv=new Float32Array(p.count*2);
    for(let i=0;i<p.count;i++){const x=p.getX(i)-.31,y=p.getY(i)+.43;uv[i*2]=Math.atan2(y,x)/(Math.PI*2)+.5;uv[i*2+1]=Math.hypot(x,y)*1.5;}
    o.geometry.setAttribute('uv',new THREE.BufferAttribute(uv,2));o.material.bumpMap=machining;o.material.bumpScale=.0003;o.material.roughnessMap=machining;
   }
  }});
  if(signal.aborted){geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());return cleanup;}
  model.rotation.z=-.09;model.scale.setScalar(1.13);scene.add(model);
  await renderer.compileAsync(scene,camera);if(dead||signal.aborted)return cleanup;
  canvas.setAttribute('aria-hidden','true');canvas.className='suspension-canvas';host.prepend(canvas);
  const resize=()=>{if(dead)return;const {width,height}=host.getBoundingClientRect();renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();draw();};
  resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);resize();
  host.classList.add('scene-ready');host.dataset.scene='ready';host.querySelector('.scene-loading')?.remove();
  host.dataset.triangles=String(renderer.info.render.triangles);
  // An inspectable, read-only performance snapshot, useful for local QA.
  host.sceneInfo=()=>({triangles:renderer.info.render.triangles,drawCalls:renderer.info.render.calls,frames:Number(host.dataset.frames||0),paused,reducedMotion:media.matches,visible,quality:light?'light':'standard',selected,rotation:{x:model.rotation.x,y:model.rotation.y}});
  host.addEventListener('pointermove',e=>{
   if(dead||!visible||document.hidden||e.target.closest('a,button,details,select'))return;
   lastPointer={clientX:e.clientX,clientY:e.clientY};if(moveFrame)return;
   moveFrame=requestAnimationFrame(()=>{moveFrame=0;if(dead||!visible||document.hidden||!lastPointer)return;const e=lastPointer;
   const r=host.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
   pointer.set(x/r.width*2-1,-(y/r.height)*2+1);target.set(pointer.x*.065,-pointer.y*.04);
   raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(meshes,false)[0];select(hit?.object.userData.part||null);
   tooltip.style.left=Math.min(r.width-210,Math.max(12,x+15))+'px';tooltip.style.top=Math.max(18,Math.min(r.height-85,y-45))+'px';
   if(media.matches||paused)requestDraw();
   });
  },{signal:events.signal});
  host.addEventListener('pointerleave',()=>{lastPointer=null;target.set(0,0);select(null);if(media.matches||paused)requestDraw();},{signal:events.signal});
  canvas.addEventListener('click',()=>{if(selected)location.hash=partLinks[selected][1];},{signal:events.signal});
  host.querySelectorAll('[data-scene-part]').forEach(link=>{
   link.addEventListener('focus',()=>{select(link.dataset.scenePart);draw();},{signal:events.signal});
   link.addEventListener('blur',()=>{select(null);draw();},{signal:events.signal});
  });
  pause.addEventListener('click',()=>{
   paused=!paused;pause.setAttribute('aria-pressed',String(paused));pause.setAttribute('aria-label',paused?'Продолжить движение модели':'Остановить движение модели');pause.textContent=paused?'▷':'Ⅱ';schedule();
  },{signal:events.signal});
  observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;visibilityChange();},{threshold:.1});observer.observe(host);
  media.addEventListener('change',motionChange);document.addEventListener('visibilitychange',visibilityChange);
  startedAt=performance.now();motionChange();return cleanup;
 }catch(error){fallback();if(!signal.aborted)console.info('TORQ suspension fallback:',error.message);return cleanup;}
 function select(part){
  if(selected===part)return;selected=part;
  for(const mesh of meshes){mesh.material.emissive.setHex(mesh.userData.part===part?0x2f6bff:0);mesh.material.emissiveIntensity=mesh.userData.part===part?.13:0;}
  canvas.style.cursor=part?'pointer':'default';tooltip.hidden=!part;
  if(part)tooltip.textContent=partLinks[part][0]+' ↗';
 }
 function requestDraw(){if(!paintFrame)paintFrame=requestAnimationFrame(()=>{paintFrame=0;draw();});}
 function draw(){
  if(dead||!model||!visible||document.hidden)return;
  const begin=performance.now();renderer.render(scene,camera);host.dataset.frames=String(Number(host.dataset.frames||0)+1);
  if(paused&&performance.now()-begin>100&&++slowDraws>=8)host.dispatchEvent(new Event('scene-slow'));
 }
 function tick(time){
  frame=0;if(dead||!visible||document.hidden||paused||media.matches)return;
  if(time-last>=(light?48:32)){const gap=time-last,dt=Math.min(gap/1000,.05);elapsed+=dt;last=time;
   if(time-startedAt>2500){slowSamples.push(gap);if(slowSamples.length===45){const bad=slowSamples.filter(x=>x>90).length;slowSamples=[];if(bad>30){if(!light){host.dispatchEvent(new Event('scene-slow'));return;}paused=true;pause.textContent='▷';pause.setAttribute('aria-pressed','true');pause.setAttribute('aria-label','Продолжить движение модели');return;}}}
   rotation.lerp(target,1-Math.exp(-dt*4));
   model.rotation.y=Math.sin(elapsed*.20)*.038+rotation.x;model.rotation.x=Math.sin(elapsed*.13)*.012+rotation.y;
   draw();
  }
  frame=requestAnimationFrame(tick);
 }
 function schedule(){cancelAnimationFrame(frame);frame=0;if(!dead&&visible&&!document.hidden&&!paused&&!media.matches){last=performance.now();frame=requestAnimationFrame(tick);}else draw();}
 function visibilityChange(){schedule();}
 function motionChange(){if(media.matches&&model){target.set(0,0);rotation.set(0,0);model.rotation.x=0;model.rotation.y=0;}pause.hidden=media.matches;schedule();}
}
