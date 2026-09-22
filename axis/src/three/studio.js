import * as T from '../../assets/vendor/three/three.module.js';
import {dressArchitecture} from './surfaces.js';
export const presets={
 courtyard:{perspective:{position:[16,6.5,24],target:[0,1.5,0]},top:{position:[0,32,.01],target:[0,0,0]},facade:{position:[-.5,3.2,25],target:[0,1.5,0]},detail:{position:[1.4,2.4,9.8],target:[-2,1.5,.6]}},
 atrium:{perspective:{position:[23,19,26],target:[0,5,0]},top:{position:[0,37,.01],target:[0,4,0]},facade:{position:[.2,8,32],target:[0,5,0]},detail:{position:[12,14,17],target:[0,6,0]}},
 park:{perspective:{position:[28,26,32],target:[0,0,0]},top:{position:[0,45,.01],target:[0,0,0]},facade:{position:[-24,4.2,0],target:[10,1,0]},detail:{position:[7,4,11],target:[14,1.5,0]}}
};
export function createStudio(canvas,model,id,{capture=false}={}){
 const disposeSurfaces=dressArchitecture(model);
 const renderer=new T.WebGLRenderer({canvas,antialias:true,preserveDrawingBuffer:capture});renderer.setClearColor(0xe4e2da);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.85;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
 const scene=new T.Scene();scene.add(model);scene.add(new T.HemisphereLight(0xeaf0f3,0x6c695e,.7));const sun=new T.DirectionalLight(0xffedd1,3.6);sun.position.set(-16,18,18);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-22,right:22,top:22,bottom:-22,near:1,far:90});sun.shadow.bias=-.00015;sun.shadow.normalBias=.015;scene.add(sun);const fill=new T.DirectionalLight(0xffffff,.25);fill.position.set(15,12,-10);scene.add(fill);
 const groundGeo=new T.PlaneGeometry(300,300),groundMat=new T.MeshStandardMaterial({color:0xe4e2da,roughness:1}),ground=new T.Mesh(groundGeo,groundMat);ground.rotation.x=-Math.PI/2;ground.position.y=-.37;ground.receiveShadow=true;scene.add(ground);
 const camera=id==='atrium'?new T.OrthographicCamera(-18,18,12,-12,.1,150):new T.PerspectiveCamera(39,1,.1,180);
 const original=new Map(),white=new Map(),edges=[];model.traverse(o=>{if(!o.isMesh)return;o.castShadow=o.receiveShadow=true;original.set(o,o.material);const key=o.material.name;if(!white.has(key))white.set(key,new T.MeshStandardMaterial({color:key==='glass'?0xcbd0cb:key==='frame'?0xaaaead:0xecebe5,roughness:.96}));if(!['landscape','site'].includes(o.parent.name)){const edge=new T.LineSegments(new T.EdgesGeometry(o.geometry,28),new T.LineBasicMaterial({color:0x565953,transparent:true,opacity:.6}));edge.visible=false;o.add(edge);edges.push(edge);}});
 function stage(value){original.forEach((mat,obj)=>{obj.material=value==='render'?mat:white.get(mat.name);});edges.forEach(e=>e.visible=value==='sketch');}
 function view(name='perspective'){const p=presets[id][name];camera.position.fromArray(p.position);camera.up.set(0,1,0);camera.lookAt(new T.Vector3(...p.target));}
 function explode(p){if(id!=='atrium')return;for(const[name,delta]of [['level_02',1.7],['level_03',3.4],['roof',5.44]]){const g=model.getObjectByName(name);if(g){if(g.userData.baseY===undefined)g.userData.baseY=g.position.y;g.position.y=g.userData.baseY+delta*p;}}}
 function highlight(name){edges.forEach(e=>{const active=e.parent.parent.name===name;e.visible=active;e.material.color.set(active?0x9b6750:0x565953);e.material.opacity=active?.9:.6;});}
 function resize(w,h,dpr=1.5){renderer.setPixelRatio(Math.min(dpr,1.5));renderer.setSize(w,h,false);const ratio=w/h;if(camera.isOrthographicCamera){camera.left=-16*ratio;camera.right=16*ratio;camera.top=16;camera.bottom=-16;}else camera.aspect=ratio;camera.updateProjectionMatrix();}
 function render(){renderer.render(scene,camera);}
 function dispose(){const mats=new Set();model.traverse(o=>{o.geometry?.dispose();if(o.material)mats.add(o.material)});original.forEach(m=>mats.add(m));white.forEach(m=>mats.add(m));mats.forEach(m=>m.dispose());groundGeo.dispose();groundMat.dispose();sun.shadow.dispose();renderer.dispose();}
 // Sky reflection gives glazing a readable surface while retaining interior depth.
 const envScene=new T.Scene();envScene.background=new T.Color(0xbfcbd0);const lightPanel=new T.Mesh(new T.PlaneGeometry(30,30),new T.MeshBasicMaterial({color:0xffffff,side:T.DoubleSide}));lightPanel.position.set(-5,12,8);lightPanel.lookAt(0,0,0);envScene.add(lightPanel);const pmrem=new T.PMREMGenerator(renderer),environment=pmrem.fromScene(envScene,.1);scene.environment=environment.texture;pmrem.dispose();lightPanel.geometry.dispose();lightPanel.material.dispose();
 model.traverse(o=>{if(!o.isMesh)return;if(o.material.name==='glass')o.castShadow=false;if(['leaf','leaf2'].includes(o.material.name))o.material.side=T.DoubleSide;});
 view();stage('render');return{renderer,scene,camera,model,stage,view,explode,highlight,resize,render,dispose:()=>{disposeSurfaces();environment.dispose();dispose();}};
}
