// Cancellable counterpart of Three r170 compileAsync.
// r170's built-in poll has no cancellation and dereferences renderer properties
// after dispose. This isolated adapter intentionally targets the pinned r170 API.
// Source behavior: https://github.com/mrdoob/three.js/blob/r170/src/renderers/WebGLRenderer.js
export function compileCancellable(renderer,scene,camera,signal){
 const materials=renderer.compile(scene,camera);
 const programs=new Set([...materials].map(m=>renderer.properties.get(m).currentProgram).filter(Boolean));
 return new Promise((resolve,reject)=>{
  let timer=0,finished=false;const started=performance.now();
  const finish=error=>{if(finished)return;finished=true;clearTimeout(timer);signal.removeEventListener('abort',abort);error?reject(error):resolve();};
  const abort=()=>finish(new DOMException('Compilation cancelled','AbortError'));
  const poll=()=>{if(signal.aborted)return abort();if(renderer.getContext().isContextLost())return finish(Error('WebGL context lost'));if(performance.now()-started>8000)return finish(Error('Shader compilation timeout'));try{for(const program of programs)if(program.isReady())programs.delete(program);if(!programs.size)return finish();timer=setTimeout(poll,10);}catch(error){finish(error);}};
  signal.addEventListener('abort',abort,{once:true});poll();
 });
}
