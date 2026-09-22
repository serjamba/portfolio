import * as THREE from '../assets/vendor/three/three.module.js';
export function concreteTexture(){
 const c=document.createElement('canvas');c.width=c.height=1024;const g=c.getContext('2d'),data=g.createImageData(1024,1024);let seed=84;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 for(let y=0;y<1024;y++)for(let x=0;x<1024;x++){const n=164+random()*19+3*Math.sin(x*.016+Math.sin(y*.009))*Math.cos(y*.021)+3*Math.sin(x*.071+y*.081),i=(y*1024+x)*4;data.data[i]=n+3;data.data[i+1]=n+2;data.data[i+2]=n-3;data.data[i+3]=255;}g.putImageData(data,0,0);
 // Aggregate, laitance and casting pores at distinct, believable scales.
 for(let i=0;i<6500;i++){const x=random()*1024,y=random()*1024,r=.4+random()*2;g.fillStyle=i%3?'rgba(78,77,70,.18)':'rgba(221,216,203,.35)';g.beginPath();g.ellipse(x,y,r,r*.66,random()*3,0,7);g.fill();}
 for(let i=0;i<420;i++){const x=random()*1024,y=random()*1024,r=1+Math.pow(random(),3)*7;g.fillStyle='rgba(225,219,204,.5)';g.beginPath();g.ellipse(x,y+.9,r*1.15,r*.78,0,0,7);g.fill();const p=g.createRadialGradient(x-.4,y-.7,.2,x,y,r);p.addColorStop(0,'#55554b');p.addColorStop(.55,'#7e7e72');p.addColorStop(1,'#a9a99b');g.fillStyle=p;g.beginPath();g.ellipse(x,y,r,r*.65,0,0,7);g.fill();}
 return c;
}
export async function mountCube(host,signal,{poster=false}={}){
 let renderer,frame=0,dead=false,visible=true,ready=false,frames=0;const ev=new AbortController(),geos=[],mats=[],textures=[];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),target=new THREE.Vector2(),rotation=new THREE.Vector2();
 const clean=()=>{if(dead)return;dead=true;ev.abort();cancelAnimationFrame(frame);observer?.disconnect();resize?.disconnect();geos.forEach(g=>g.dispose());mats.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());renderer?.dispose();renderer?.forceContextLoss();renderer?.domElement.remove();host.querySelector('img')?.style.removeProperty('opacity');host.dataset.scene='poster';};
 let observer,resize;signal?.addEventListener('abort',clean,{once:true});
 try{
  renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power',preserveDrawingBuffer:poster});renderer.setPixelRatio(Math.min(devicePixelRatio,poster?1:1.5));renderer.setClearColor(0xefefea,1);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.domElement.setAttribute('aria-hidden','true');renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();clean();},{signal:ev.signal});
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(31,1,.1,20);camera.position.set(2.7,1.95,3.5);camera.lookAt(0,-.08,0);renderer.toneMappingExposure=.95;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  scene.add(new THREE.HemisphereLight(0xf5f2e9,0x4a4841,.85));const key=new THREE.DirectionalLight(0xfffaf1,3.2);key.position.set(-3,4,3);key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-3,right:3,top:3,bottom:-3,near:.1,far:15});key.shadow.normalBias=.015;scene.add(key);const fill=new THREE.DirectionalLight(0xe1e8ed,.45);fill.position.set(4,1,-2);scene.add(fill);ev.signal.addEventListener('abort',()=>key.shadow.dispose(),{once:true});
  const tex=new THREE.CanvasTexture(concreteTexture());tex.colorSpace=THREE.SRGBColorSpace;textures.push(tex);
  const geometry=new THREE.BoxGeometry(1.5,1.5,1.5,32,32,32);const pos=geometry.attributes.position,normal=new THREE.Vector3(),inner=new THREE.Vector3();for(let i=0;i<pos.count;i++){const p=new THREE.Vector3().fromBufferAttribute(pos,i);inner.copy(p).clampScalar(-.727,.727);normal.copy(p).sub(inner).normalize();const edges=[Math.abs(p.x),Math.abs(p.y),Math.abs(p.z)].sort((a,b)=>b-a),chip=edges[1]>.70?Math.max(0,Math.sin(p.x*34+p.y*43+p.z*27)-.45)*.006:0;p.copy(inner).addScaledVector(normal,.023-chip);pos.setXYZ(i,p.x,p.y,p.z);}geometry.computeVertexNormals();geos.push(geometry);
  const material=new THREE.MeshStandardMaterial({map:tex,bumpMap:tex,bumpScale:.009,roughnessMap:tex,roughness:1,color:0xf2eee5});mats.push(material);const cube=new THREE.Mesh(geometry,material);cube.castShadow=cube.receiveShadow=true;scene.add(cube);
  const floorGeo=new THREE.PlaneGeometry(200,200),floorMat=new THREE.MeshStandardMaterial({color:0xefefea,roughness:1});geos.push(floorGeo);mats.push(floorMat);const floor=new THREE.Mesh(floorGeo,floorMat);floor.rotation.x=-Math.PI/2;floor.position.y=-.78;floor.receiveShadow=true;scene.add(floor);
  // Soft baked contact shadow: one transparent plane, no realtime shadow map.
  const sc=document.createElement('canvas');sc.width=sc.height=128;const sg=sc.getContext('2d'),gradient=sg.createRadialGradient(64,64,8,64,64,64);gradient.addColorStop(0,'rgba(20,20,16,.23)');gradient.addColorStop(1,'rgba(20,20,16,0)');sg.fillStyle=gradient;sg.fillRect(0,0,128,128);const st=new THREE.CanvasTexture(sc);textures.push(st);const sm=new THREE.MeshBasicMaterial({map:st,transparent:true,depthWrite:false});mats.push(sm);const plane=new THREE.PlaneGeometry(3.1,3.1);geos.push(plane);const shadow=new THREE.Mesh(plane,sm);shadow.rotation.x=-Math.PI/2;shadow.position.y=-.77;scene.add(shadow);
  await renderer.compileAsync(scene,camera);if(dead||signal?.aborted){clean();return clean;}
  const draw=()=>{if(dead||!visible||document.hidden)return;renderer.render(scene,camera);host.dataset.frames=String(++frames);};
  const size=()=>{if(dead)return;const r=host.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();draw();};
  host.append(renderer.domElement);ready=true;size();host.querySelector('img')?.style.setProperty('opacity','0');host.dataset.scene='ready';
  host.cubeInfo=()=>({frames,triangles:renderer.info.render.triangles,calls:renderer.info.render.calls,rotation:{x:cube.rotation.x,y:cube.rotation.y},visible,dead});
  const tick=()=>{frame=0;if(dead||!visible||document.hidden)return;rotation.lerp(target,.17);cube.rotation.x=rotation.y;cube.rotation.y=rotation.x;draw();if(rotation.distanceTo(target)>.0001)frame=requestAnimationFrame(tick);};
  const request=()=>{if(!frame&&!dead&&visible&&!document.hidden)frame=requestAnimationFrame(tick);};
  host.addEventListener('pointermove',e=>{if(reduced.matches||e.pointerType==='touch'||e.target.closest('button'))return;const r=host.getBoundingClientRect();target.set(((e.clientX-r.left)/r.width-.5)*.22,((e.clientY-r.top)/r.height-.5)*.15);request();},{signal:ev.signal});
  host.addEventListener('pointerleave',()=>{target.set(0,0);request();},{signal:ev.signal});
  reduced.addEventListener('change',()=>{target.set(0,0);rotation.set(0,0);request();},{signal:ev.signal});
  observer=new IntersectionObserver(es=>{visible=es[0].isIntersecting;if(!visible){cancelAnimationFrame(frame);frame=0;}else request();});observer.observe(host);
  resize=new ResizeObserver(size);resize.observe(host);document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(frame);frame=0;if(!document.hidden)request();},{signal:ev.signal});
  return clean;
 }catch(error){clean();if(!signal?.aborted)console.info('MONOLITH static sample:',error.message);return clean;}
}
