import * as T from '../../assets/vendor/three/three.module.js';
import {mergeGeometries} from '../../assets/vendor/three/BufferGeometryUtils.js';

// One coherent 16 x 12 m courtyard house; all published views use this model.
export function buildCourtyard(){
 const root=new T.Group();root.name='courtyard';const buckets=new Map(),groups={},mats={};
 const palette={mineral:0xc4bbaa,roof:0x96958c,frame:0x272b28,glass:0x91aaa8,timber:0x85613f,paving:0xb1aca0,grass:0x777b52,leaf:0x4e603d,leaf2:0x7b8250,bark:0x544c3b,interior:0xd4c7af,gravel:0xa29c8d};
 for(const [k,color]of Object.entries(palette)){mats[k]=new T.MeshStandardMaterial({color,roughness:k==='glass'?.12:k==='frame'?.35:.88,metalness:k==='frame'?.65:k==='glass'?.25:0,transparent:k==='glass',opacity:k==='glass'?.36:1,side:k==='glass'?T.DoubleSide:T.FrontSide});mats[k].name=k;}
 for(const n of ['site','foundation','shell','roof','glazing','timber','landscape','furniture']){groups[n]=new T.Group();groups[n].name=n;root.add(groups[n]);}
 function add(g,k,geo,x,y,z,rx=0,ry=0,rz=0){let q=geo.index?geo.toNonIndexed():geo;const m=new T.Matrix4().compose(new T.Vector3(x,y,z),new T.Quaternion().setFromEuler(new T.Euler(rx,ry,rz)),new T.Vector3(1,1,1));q.applyMatrix4(m);if(q!==geo)geo.dispose();const key=g+'|'+k;if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(q);}
 const box=(g,k,x,y,z,w,h,d)=>add(g,k,new T.BoxGeometry(w,h,d),x,y,z);
 const cyl=(g,k,x,y,z,r,h)=>add(g,k,new T.CylinderGeometry(r*.8,r,h,12),x,y,z);
 // Slabs follow the U-shaped plan; the planted court remains open to the sky.
 box('site','gravel',0,-.25,0,42,.25,36);
 for(const [x,z,w,d]of [[0,-4,16,4],[-5.5,2,5,8],[5.5,2,5,8]]){
  box('foundation','mineral',x,.03,z,w+.15,.30,d+.15);
  box('foundation','interior',x,.205,z,w-.1,.05,d-.1);
  box('roof','mineral',x,3.24,z,w+.48,.22,d+.48);
  box('roof','roof',x,3.37,z,w-.12,.035,d-.12);
 }
 // Back wall and side walls with actual openings, lintels, sills and deep reveals.
 box('shell','mineral',0,1.64,-5.86,16,3,.28);
 for(const x of [-7.86,7.86]){
  box('shell','mineral',x,.48,0,.28,.58,12);box('shell','mineral',x,2.93,0,.28,.4,12);
  for(const [z,d]of [[-4.5,3],[0,1.4],[4.8,2.4]])box('shell','mineral',x,1.74,z,.28,1.9,d);
 }
 function windowWall(x,z,len,axis='x',base=.23,height=2.86){
  const along=axis==='x';const parts=Math.ceil(len/1.45),step=len/parts;
  for(let i=0;i<parts;i++){const p=-len/2+step*(i+.5);box('glazing','glass',x+(along?p:0),base+height/2,z+(along?0:p),along?step-.055:.025,height-.08,along?.025:step-.055);}
  for(let i=0;i<=parts;i++){const p=-len/2+step*i;box('glazing','frame',x+(along?p:0),base+height/2,z+(along?0:p),along?.045:.09,height,along?.09:.045);}
  for(const y of [base,base+height])box('glazing','frame',x,y,z,along?len:.095,.045,along?.095:len);
  box('glazing','mineral',x,base-.045,z,along?len+.1:.32,.07,along?.32:len+.1);
 }
 windowWall(0,-1.88,5.85);windowWall(-3.1,2,7.8,'z');windowWall(3.1,2,7.8,'z');
 for(const x of [-7.86,7.86]){windowWall(x,-1.7,2,'z',.79,1.92);windowWall(x,2.15,2.85,'z',.79,1.92);}
 windowWall(-5.5,5.86,4.7);windowWall(5.5,5.86,4.7);
 // Cedar screens have depth and independent slats, never a flat facade decal.
 for(let x=3.35;x<7.7;x+=.14)box('timber','timber',x,1.69,6.08,.055,2.94,.11);
 for(const x of [-7.72,-3.28,3.28,7.72])box('shell','mineral',x,1.65,5.9,.18,3,.28);
 // Thin coping, rainwater downpipes and cast-in-place formwork joints.
 for(const x of [-8.08,8.08,-2.92,2.92])box('roof','frame',x,3.38,x*x>60?0:2,.03,.06,x*x>60?12.2:8.1);
 for(const x of [-7.64,7.64])cyl('shell','frame',x,1.65,-5.66,.038,2.98);
 for(let x=-7.5;x<8;x+=1.22)box('shell','roof',x,1.65,-6.005,.006,2.98,.004);
 // Furnished living wing, dining area and a rear kitchen give glazing real depth.
 box('furniture','interior',-5.7,.58,-4,1.15,.62,3);box('furniture','interior',-6.15,1.0,-4,.25,.6,3);
 for(const z of [-5.05,-4,-2.95])box('furniture','interior',-5.6,.93,z,.9,.16,.94);
 box('furniture','timber',-4.1,.48,-4,.8,.08,1.8);for(const z of [-4.7,-3.3])box('furniture','frame',-4.1,.33,z,.5,.26,.055);
 box('furniture','timber',0,1.02,-3.9,2.5,.12,1.05);
 for(const x of [-.95,.95])for(const z of [-4.28,-3.53])box('furniture','frame',x,.61,z,.06,.75,.06);
 for(const x of [-.85,0,.85])for(const z of [-4.85,-2.95]){box('furniture','timber',x,.66,z,.5,.09,.48);box('furniture','timber',x,.97,z+(z<-4?-.2:.2),.5,.62,.07);for(const dx of [-.2,.2])for(const dz of [-.18,.18])box('furniture','frame',x+dx,.43,z+dz,.025,.46,.025);}
 box('furniture','timber',0,.74,-5.38,5.1,1.03,.62);box('furniture','mineral',0,1.28,-5.38,5.2,.08,.7);
 for(const z of [.15,4.15]){box('furniture','interior',-5.5,.55,z,2.4,.65,2);box('furniture','timber',-5.5,1.1,z-1.03,2.6,1.25,.13);}
 box('shell','interior',-6.1,1.65,2,3.5,2.9,.12);
 box('furniture','timber',7.3,1.5,1.5,.65,2.55,4);box('furniture','timber',5.5,.52,4,2.4,.65,.6);
 // Courtyard deck and recessed planting bed.
 for(let z=-1.7;z<6;z+=.145)for(const [x,w]of [[-1.85,2.25],[1.85,2.25]])box('timber','timber',x,.23,z,w,.08,.135);
 box('landscape','gravel',0,.13,2,.9,.04,7.5);
 for(let x=-7.9;x<8;x+=1.05)for(let z=6.4;z<9;z+=1.05)box('site','paving',x,.02,z,1.02,.09,1.02);
 let seed=713;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 function branch(a,b,r){const delta=b.clone().sub(a),geo=new T.CylinderGeometry(r*.35,r,delta.length(),7);geo.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),delta.clone().normalize()));const mid=a.clone().add(b).multiplyScalar(.5);add('landscape','bark',geo,mid.x,mid.y,mid.z);}
 function leaves(x,y,z,s,count){for(let i=0;i<count;i++){const a=rand()*6.28,r=Math.sqrt(rand())*s,yy=(rand()-.5)*s;const shape=new T.CircleGeometry(.045+rand()*.07,5);shape.scale(.6,1,1);add('landscape',i%3?'leaf':'leaf2',shape,x+Math.cos(a)*r,y+yy,z+Math.sin(a)*r,rand()*3,rand()*6,rand()*3);}}
 mats.leaf.side=mats.leaf2.side=T.DoubleSide;
 function tree(x,z,s=1){const start=new T.Vector3(x,0,z),fork=new T.Vector3(x+.15*s,2.1*s,z);branch(start,fork,.075*s);for(let j=0;j<9;j++){const a=j*2.4,tip=new T.Vector3(x+Math.cos(a)*(1+rand()*.5)*s,(3+rand()*1.5)*s,z+Math.sin(a)*(1+rand()*.5)*s);branch(fork,tip,.024*s);leaves(tip.x,tip.y,tip.z,.85*s,400);}}
 tree(0,2.5,.72);for(const [x,z,s]of [[-10,-3,1.5],[-11,6,1.2],[10,-5,1.7],[12,4,1.4],[-5,-9,1.4],[5,-10,1.7]])tree(x,z,s);
 // Low planting clusters soften the site without obscuring the architecture.
 for(let i=0;i<200;i++){const x=(rand()-.5)*28,z=(rand()-.5)*25;if(Math.abs(x)<8.6&&z>-6.8&&z<9.5)continue;leaves(x,.17,z,.25,24);}
 for(const [key,list]of buckets){const[g,k]=key.split('|');const geo=mergeGeometries(list);list.forEach(q=>q.dispose());const mesh=new T.Mesh(geo,mats[k]);mesh.name=g+'_'+k;mesh.userData.materialKey=k;mesh.castShadow=k!=='glass';mesh.receiveShadow=true;groups[g].add(mesh);}
 return root;
}
