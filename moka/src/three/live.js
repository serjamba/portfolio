import{createCupStudio,loadFoam}from'./cup-model.js';import{compileCancellable}from'./compile.js';
export async function createLiveCup(canvas,{light=false,signal,onError}){
 let studio,disposed=false,paused=false,raf=0,resizeObserver,rect,target={x:0,y:0},drag=false,frames=0,poor=0,quality=light?'light':'standard',last=0;
 const foam=await loadFoam();if(signal.aborted){foam.dispose();throw new DOMException('Aborted','AbortError');}
 try{studio=createCupStudio(canvas,{light,foam});}catch(e){foam.dispose();throw e;}
 const metrics=window.__mokaScene;const update=()=>{metrics.frames=frames;metrics.triangles=studio.renderer.info.render.triangles;metrics.calls=studio.renderer.info.render.calls;metrics.quality=quality;metrics.rotation=[studio.cup.rotation.x,studio.cup.rotation.y];metrics.buffer=[canvas.width,canvas.height];};
 function render(){studio.render();frames++;update();}
 function tick(time){raf=0;if(disposed||paused||signal.aborted)return;const dt=last?Math.min(50,time-last):16.7;last=time;const k=1-Math.exp(-dt/125),rot=studio.cup.rotation;rot.x+=(target.x-rot.x)*k;rot.y+=(target.y-rot.y)*k;const begin=performance.now();render();const cost=performance.now()-begin;if(cost>35)poor++;else poor=Math.max(0,poor-1);if(poor>15){if(quality==='standard'){quality='light';studio.renderer.setPixelRatio(1);poor=0;}else{onError();return;}}
 if(Math.abs(rot.x-target.x)+Math.abs(rot.y-target.y)>.00015)raf=requestAnimationFrame(tick);}
 function request(){if(!raf&&!paused&&!disposed&&!signal.aborted){last=0;raf=requestAnimationFrame(tick);}}
 function reset(){target={x:0,y:0};request();}
 function resize(draw=true){if(disposed)return;rect=canvas.getBoundingClientRect();if(rect.width&&rect.height){studio.resize(rect.width,rect.height,quality==='light'?1:Math.min(devicePixelRatio,1.5));if(draw&&!paused)render();}}
 function move(e){if(e.pointerType!=='mouse'&&!drag)return;if(!rect)return;target={x:Math.max(-.065,Math.min(.065,(e.clientY-rect.top)/rect.height*.13-.065)),y:Math.max(-.12,Math.min(.12,(e.clientX-rect.left)/rect.width*.24-.12))};request();}
 function down(e){rect=canvas.getBoundingClientRect();if(e.pointerType!=='mouse'){drag=true;canvas.setPointerCapture(e.pointerId);}}
 function up(){drag=false;reset();}function enter(){rect=canvas.getBoundingClientRect();}
 function loss(e){e.preventDefault();if(!disposed)onError();}
 function dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(raf);resizeObserver?.disconnect();canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointerup',up);canvas.removeEventListener('pointercancel',up);canvas.removeEventListener('pointerleave',reset);canvas.removeEventListener('pointerenter',enter);canvas.removeEventListener('webglcontextlost',loss);signal.removeEventListener('abort',dispose);studio.dispose();metrics.state='poster';}
 signal.addEventListener('abort',dispose,{once:true});canvas.addEventListener('webglcontextlost',loss);resize(false);
 try{await compileCancellable(studio.renderer,studio.scene,studio.camera,signal);if(signal.aborted)throw new DOMException('Aborted','AbortError');render();}catch(e){dispose();throw e;}
 canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);canvas.addEventListener('pointerleave',reset);canvas.addEventListener('pointerenter',enter);resizeObserver=new ResizeObserver(resize);resizeObserver.observe(canvas.parentElement);
 return{dispose,reset,turn(value){target={x:0,y:value*.12};request();},pause(value){paused=value;cancelAnimationFrame(raf);raf=0;last=0;if(!value){resize();request();}},};
}
