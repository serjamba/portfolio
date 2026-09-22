// Original AXIS concept geometry. Units are illustrative metres, Y up.
import * as T from '../../assets/vendor/three/three.module.js';
import {mergeGeometries} from '../../assets/vendor/three/BufferGeometryUtils.js';
import {buildCourtyard} from './courtyard.js';
export const dimensions={courtyard:{width:16,depth:12,height:3.4,courtWidth:6,courtDepth:8},atrium:{width:15,depth:11,floorHeight:3.4,levels:3,voidWidth:5,voidDepth:5},park:{length:40,width:12}};
const colors={mineral:0xd8d4c8,roof:0xbcbcb5,frame:0x303733,glass:0x667d7b,timber:0x947657,paving:0xc5c2b6,grass:0x777e62,leaf:0x677557,leaf2:0x7e8965,bark:0x655a46,water:0x809593,interior:0xb8aa90};
export function buildArchitecture(id){
 if(id==='courtyard')return buildCourtyard();
 const root=new T.Group();root.name=id;const groups={},buckets=new Map(),materials={};
 for(const[k,c]of Object.entries(colors)){materials[k]=new T.MeshStandardMaterial({color:c,roughness:k==='glass'?.25:k==='frame'?.6:.92,metalness:k==='frame'?.15:0});materials[k].name=k;}
 const group=(name,y=0)=>{const g=new T.Group();g.name=name;g.position.y=y;root.add(g);groups[name]=g;return g;};
 function add(g,key,geometry,x,y,z,rotation=null){const m=new T.Matrix4().compose(new T.Vector3(x,y,z),new T.Quaternion().setFromEuler(rotation||new T.Euler()),new T.Vector3(1,1,1));const q=geometry.index?geometry.toNonIndexed():geometry;q.applyMatrix4(m);geometry.dispose();const b=g.name+'|'+key;if(!buckets.has(b))buckets.set(b,[]);buckets.get(b).push(q);}
 const box=(g,key,x,y,z,w,h,d,rot)=>add(g,key,new T.BoxGeometry(w,h,d),x,y,z,rot);
 const cylinder=(g,key,x,y,z,r,h)=>add(g,key,new T.CylinderGeometry(r*.8,r,h,9),x,y,z);
 function tree(g,x,z,size=1,seed=0){cylinder(g,'bark',x,1.25*size,z,.1*size,2.5*size);for(let i=0;i<9;i++){const a=i*2.4+seed,r=(i%3)*.35*size,y=(2.4+(i%4)*.24)*size;const geo=new T.IcosahedronGeometry((.67+(i%3)*.1)*size,1);geo.scale(1,.85,1);add(g,i%3?'leaf':'leaf2',geo,x+Math.cos(a)*r,y,z+Math.sin(a)*r);} }
 function glassWall(g,x,z,length,axis='x',height=2.8,base=.25){const rot=axis==='z'?new T.Euler(0,Math.PI/2,0):null;box(g,'glass',x,base+height/2,z,length,height,.055,rot);const n=Math.ceil(length/1.5);for(let i=0;i<=n;i++){const t=-length/2+i*length/n;box(g,'frame',x+(axis==='x'?t:0),base+height/2,z+(axis==='z'?t:0),.05,height,.07,rot);}for(const y of [base,base+height])box(g,'frame',x,y,z,length,.055,.08,rot);}
 function bench(g,x,z,w=2.2){for(let i=0;i<5;i++)box(g,'timber',x,.57,z-.26+i*.13,w,.08,.11);for(const dx of [-w*.36,w*.36])box(g,'frame',x+dx,.30,z,.08,.48,.55);}
 const site=group('site'),foundation=group('foundation'),land=group('landscape');
 if(id==='courtyard'){
  const shell=group('shell'),roof=group('roof'),glazing=group('glazing'),timber=group('timber');
  box(site,'paving',0,-.18,0,23,.25,20);box(foundation,'mineral',0,.1,0,16.5,.3,12.5);
  box(shell,'mineral',0,1.65,-5.88,16,3.1,.24);box(shell,'mineral',-7.88,1.65,0,.24,3.1,12);box(shell,'mineral',7.88,1.65,-1.7,.24,3.1,8.6);
  // Three linked wings form the courtyard; glazing is a real opening, not a black decal.
  box(roof,'roof',0,3.3,-4,16.2,.26,4.2);for(const x of [-5.5,5.5])box(roof,'roof',x,3.3,2,5.2,.26,8.2);
  for(const x of [-7.98,7.98])box(roof,'mineral',x,3.53,0,.14,.22,12.12);box(roof,'mineral',0,3.53,-6,16,.22,.14);
  for(const x of [-3.02,3.02])box(roof,'mineral',x,3.48,2,.12,.12,8);box(roof,'mineral',0,3.48,-2,6,.12,.12);
  glassWall(glazing,0,-1.96,5.9);glassWall(glazing,-3.03,1.9,7.7,'z');glassWall(glazing,3.03,1.9,7.7,'z');
  box(shell,'mineral',-5.5,1.65,5.88,5,3.1,.24);box(shell,'mineral',6.5,1.65,5.88,3,3.1,.24);
  box(shell,'mineral',3.65,3.05,5.88,1.5,.3,.24);glassWall(glazing,3.7,5.76,1.4,'x',2.65,.22);
  glassWall(glazing,7.84,4.2,3.3,'z',2.2,.55);
  // Window reveal on private wing, with sill and head rather than a solid wall behind glass.
  box(shell,'mineral',-7.9,1.6,2,.06,3,6); // outer quiet facade
  for(let x=-7.5;x<-3.6;x+=.13)box(timber,'timber',x,1.62,6.025,.07,2.85,.065);
  for(let z=-1.8;z<5.8;z+=.15)box(timber,'timber',3.1,3.0,z,.045,.38,.055);
  box(timber,'timber',0,.28,2,5.9,.1,7.9);for(let z=-1.85;z<6;z+=.22)box(timber,'frame',0,.335,z,5.88,.005,.009);
  box(shell,'interior',-5.4,.33,1.4,4.4,.03,7);box(shell,'interior',5.4,.33,1.4,4.4,.03,7);
  // Interior silhouettes give scale through the courtyard glazing.
  box(shell,'interior',-4.4,.62,1.5,1.0,.52,2.8);box(shell,'interior',-4.7,1.0,1.5,.34,.5,2.8);box(shell,'timber',-5.5,.5,1.5,1.1,.1,1.1);
  box(shell,'interior',4.8,.55,-.3,2.8,.45,1.8);box(shell,'timber',5.6,1.6,-4.5,3.8,2.6,.5);
  box(land,'grass',0,.19,7.7,16,.04,2);box(land,'grass',-9.4,.0,-.5,2.2,.06,14);box(land,'grass',9.4,.0,-2,2.2,.06,11);
  for(let i=0;i<5;i++)box(land,'paving',3.7,.2,6.6+i*.52,1.5,.08,.46);
  box(land,'grass',-.7,.35,2.6,1.6,.15,1.6);tree(land,-.7,2.6,.72,1);bench(land,1.5,4.8,1.9);
  tree(land,-9.2,-3,1.2,3);tree(land,9.4,-4.2,1.1,2);tree(land,-8.9,5.8,.8,7);
 }else if(id==='atrium'){
  const roof=group('roof'),core=group('core');box(site,'paving',0,-.23,0,24,.25,20);box(foundation,'mineral',0,-.02,0,15.6,.25,11.6);
  for(let floor=0;floor<3;floor++){const g=group('level_0'+(floor+1),floor*3.4);
   // Ring slabs keep a genuine 5 x 5 void.
   for(const x of [-5,5])box(g,'mineral',x,.1,0,5,.25,11);for(const z of [-4,4])box(g,'mineral',0,.1,z,5,.25,3);
   for(const z of [-5.4,5.4]){glassWall(g,0,z,14.6,'x',2.75,.35);for(let x=-7.3;x<=7.4;x+=1.46)box(g,'mineral',x,1.73,z,.18,3.1,.28);box(g,'mineral',0,3.25,z,15,.30,.32);}
   for(const x of [-7.4,7.4]){glassWall(g,x,0,10.8,'z',2.75,.35);for(let z=-5.3;z<=5.4;z+=1.35)box(g,'mineral',x,1.73,z,.28,3.1,.18);box(g,'mineral',x,3.25,0,.32,.30,11);}
   for(const z of [-2.5,2.5])glassWall(g,0,z,5,'x',1,.28);for(const x of [-2.5,2.5])glassWall(g,x,0,5,'z',1,.28);
   for(const x of [-5,5])for(const z of [-2.8,0,2.8]){box(g,'timber',x,.85,z,2.3,.09,.8);for(const dx of [-.85,.85])box(g,'frame',x+dx,.45,z,.06,.75,.55);}
   if(floor===0){box(g,'timber',0,.9,3.6,3.1,1.4,.65);bench(g,-4.5,4.1);}
  }
  roof.position.y=10.2;for(const x of [-5,5])box(roof,'roof',x,.15,0,5.25,.34,11.25);for(const z of [-4,4])box(roof,'roof',0,.15,z,5,.34,3.25);glassWall(roof,0,0,5,'x',.08,.36);box(roof,'glass',0,.34,0,5,.05,5);
  for(const x of [-7.52,7.52])box(roof,'mineral',x,.48,0,.14,.35,11.14);for(const z of [-5.52,5.52])box(roof,'mineral',0,.48,z,15,.35,.14);
  // Fixed atrium circulation: visible stairs, no stretching between exploded floors.
  for(let floor=0;floor<2;floor++)for(let step=0;step<20;step++)box(core,'mineral',1.5,.25+floor*3.4+step*.17,-2.2+step*.22,1.2,.13,.24);
  for(const x of [-2.4,2.4])for(const z of [-2.4,2.4])box(core,'mineral',x,5.1,z,.18,10.2,.18);
  box(core,'timber',-4.5,1.7,-3.8,2.2,3.15,2);box(core,'frame',-4.5,1.45,-2.78,1.2,2.45,.05);
  box(land,'grass',-9.6,.0,0,2.5,.06,14);box(land,'grass',9.6,.0,-2,2.5,.06,11);for(const [x,z]of [[-9,-5],[-9,2],[9,-3],[9,4]])tree(land,x,z,1.15,x);bench(land,-4,7);bench(land,4,7);
 }else{
  const shell=group('shell'),roof=group('roof'),glazing=group('glazing');box(site,'paving',0,-.22,0,45,.25,16);
  box(land,'grass',0,-.03,-4,40,.08,4);box(land,'grass',0,-.03,4,40,.08,4);box(foundation,'paving',0,.02,0,40,.12,2.5);box(foundation,'paving',-15,.03,0,8,.14,12);
  box(foundation,'timber',14,.12,0,8,.18,7);box(shell,'timber',14,1.7,-2.5,6,3.2,.18);box(shell,'timber',17,1.7,0,.18,3.2,5);
  box(roof,'roof',14,3.36,0,6.5,.25,5.5);glassWall(glazing,14,2.46,5.8);for(const x of [11,17])box(shell,'frame',x,1.75,2.45,.14,3.2,.14);
  for(let x=-18;x<10;x+=4.6){tree(land,x,-4,1.15,x);tree(land,x+1.5,4,1.0,x+3);bench(land,x,-1.8,2.2);}
  for(let x=10.9;x<17.1;x+=.15)box(shell,'timber',x,1.7,-2.62,.055,3.1,.045);
  box(shell,'timber',13.5,1.0,-1,3.7,1.6,.7);bench(land,13.5,1.1,2.4);
  for(let i=0;i<5;i++)box(foundation,'paving',8+i*.45,.05,0,.38,.16,2);
 }
 for(const [name,list]of buckets){const [g,key]=name.split('|'),geometry=mergeGeometries(list,false);list.forEach(q=>q.dispose());const mesh=new T.Mesh(geometry,materials[key]);mesh.name=g+'_'+key;mesh.userData.materialKey=key;mesh.castShadow=true;mesh.receiveShadow=true;groups[g].add(mesh);}
 return root;
}
