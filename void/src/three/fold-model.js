import * as THREE from '../../assets/vendor/three/three.module.js';
export function createFold(){
 const group=new THREE.Group(),hinges={},textures=[],materials=[],geometries=[];
 const paper=new THREE.MeshStandardMaterial({color:0xe6e3d7,roughness:.95});materials.push(paper);
 function print(w,d,label,inside=false){
  const c=document.createElement('canvas');c.width=768;c.height=Math.min(1024,Math.round(768*d/w));const x=c.getContext('2d');x.fillStyle=inside?'#e4e0d2':'#f3f1e6';x.fillRect(0,0,c.width,c.height);
  let seed=71;for(let i=0;i<14000;i++){seed=(seed*16807)%2147483647;const a=seed/2147483647;seed=(seed*16807)%2147483647;x.fillStyle='rgba(70,60,35,.025)';x.fillRect(a*c.width,seed/2147483647*c.height,1.5,1.5);}
  x.fillStyle='#161616';x.textBaseline='top';const m=70;
  x.font='500 '+Math.min(c.height*.12,55)+'px Inter';x.fillText(inside?'A moment to unfold.':label==='base'?'TEA COLLECTION':'01 / GREEN TEA',m,Math.min(40,c.height*.12));
  if(!inside){x.font='500 '+Math.min(c.height*.5,c.width*.3)+'px Inter';x.fillText('FOLD',m,c.height*.29);x.lineWidth=2;x.beginPath();x.moveTo(c.width*.72,0);x.lineTo(c.width*.72,c.height);x.stroke();x.font='400 '+Math.min(c.height*.06,29)+'px Inter';x.fillText('LOOSE LEAF  /  80 g',m,c.height-60);x.fillStyle='#c8ff00';x.fillRect(c.width-150,c.height-67,80,26);}
  if(label==='flap'){x.fillStyle=inside?'#e4e0d2':'#f3f1e6';x.fillRect(0,0,c.width,c.height);x.fillStyle='#c8ff00';x.fillRect(c.width-150,c.height*.35,80,c.height*.3);}
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;textures.push(t);return t;
 }
 const panel=(w,d,label)=>{const g=new THREE.BoxGeometry(w,.018,d);const indices=[...g.index.array];g.setIndex([0,1,4,5,2,3].flatMap(face=>indices.slice(face*6,face*6+6)));g.clearGroups();g.addGroup(0,24,0);g.addGroup(24,6,1);g.addGroup(30,6,2);geometries.push(g);const outer=new THREE.MeshStandardMaterial({map:print(w,d,label),roughness:.93}),inner=new THREE.MeshStandardMaterial({map:print(w,d,label,true),roughness:1});materials.push(outer,inner);const mesh=new THREE.Mesh(g,[paper,inner,outer]);mesh.castShadow=true;mesh.receiveShadow=true;return mesh;};
 group.add(panel(2.6,1.6,'base'));
 function hinge(name,parent,x,z,w,d,px,pz){const h=new THREE.Group();h.name=name;h.position.set(x,0,z);const p=panel(w,d,name);p.position.set(px,name==='flap'?-.022:0,pz);h.add(p);parent.add(h);hinges[name]=h;return h;}
 hinge('front',group,0,.8,2.6,1,0,.5);
 hinge('left',group,-1.3,0,1,1.6,-.5,0);hinge('right',group,1.3,0,1,1.6,.5,0);
 const back=hinge('back',group,0,-.8,2.6,1,0,-.5);
 const lid=hinge('lid',back,0,-1,2.6,1.6,0,-.8);hinge('flap',lid,0,-1.6,2.6,.32,0,-.16);
 const smooth=(p,a,b)=>{const t=THREE.MathUtils.clamp((p-a)/(b-a),0,1);return t*t*(3-2*t);};
 function pose(p){hinges.left.rotation.z=-Math.PI/2*smooth(p,.1,.35);hinges.right.rotation.z=Math.PI/2*smooth(p,.1,.35);hinges.front.rotation.x=-Math.PI/2*smooth(p,.275,.50);hinges.back.rotation.x=Math.PI/2*smooth(p,.275,.50);hinges.lid.rotation.x=Math.PI/2*smooth(p,.50,.725);hinges.flap.rotation.x=Math.PI/2*smooth(p,.65,.775);}
 pose(1);
 return {group,hinges,pose,dispose(){geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());}};
}
export function createScene(canvas,{capture=false}={}){
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,preserveDrawingBuffer:capture});renderer.setClearColor(0xe4e3dc);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(33,1,.1,60),model=createFold();scene.add(model.group);scene.add(new THREE.HemisphereLight(0xffffff,0xaaaa99,2.4));
 const key=new THREE.DirectionalLight(0xffffff,3.2);key.position.set(-3,7,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-6;key.shadow.camera.right=6;key.shadow.camera.top=6;key.shadow.camera.bottom=-6;key.shadow.bias=-.001;key.shadow.normalBias=.025;scene.add(key);
 const fill=new THREE.DirectionalLight(0xffffff,1);fill.position.set(3,-5,2);scene.add(fill);
 const floorGeometry=new THREE.PlaneGeometry(60,60),floorMaterial=new THREE.MeshStandardMaterial({color:0xe4e3dc,roughness:1}),floor=new THREE.Mesh(floorGeometry,floorMaterial);floor.rotation.x=-Math.PI/2;floor.position.y=-.04;floor.receiveShadow=true;scene.add(floor);
 function pose(p,view=0){model.pose(p);const t=THREE.MathUtils.smoothstep(p,0,.27),final=THREE.MathUtils.smoothstep(p,.775,1),radius=11-1.726*final,elevation=-Math.PI/2+(Math.PI/2+.569313)*t,azimuth=.694738*t,horizontal=radius*Math.cos(elevation);floor.visible=p>.95;camera.up.set(0,t,1-t).normalize();camera.position.set(horizontal*Math.sin(azimuth),radius*Math.sin(elevation),horizontal*Math.cos(azimuth)+.001);camera.lookAt(0,.35*t+.75*Math.sin(Math.PI*p)*t,-1*(1-t));model.group.rotation.set(0,view,0);}
 function resize(w,h,dpr=1.5){renderer.setPixelRatio(Math.min(dpr,1.5));renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
 function render(){renderer.render(scene,camera);}
 function dispose(){model.dispose();floorGeometry.dispose();floorMaterial.dispose();key.shadow.dispose();renderer.dispose();}
 return {renderer,scene,camera,model,pose,resize,render,dispose};
}
