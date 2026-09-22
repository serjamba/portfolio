import * as T from '../../assets/vendor/three/three.module.js';
// Rebuilt identically for GLB and source geometry; no remote texture dependency.
export function dressArchitecture(model){
 const textures=[],materials=new Set();
 function texture(wood){const c=document.createElement('canvas');c.width=c.height=512;const g=c.getContext('2d'),im=g.createImageData(512,512);let seed=99;for(let y=0;y<512;y++)for(let x=0;x<512;x++){seed=(seed*1664525+1013904223)>>>0;const n=seed/4294967296;const v=wood?180+18*Math.sin(x*.31+Math.sin(y*.023)*2)+12*Math.sin(x*1.5)+n*20:208+n*24+6*Math.sin(x*.027)*Math.sin(y*.035);const i=(y*512+x)*4;im.data[i]=im.data[i+1]=im.data[i+2]=v;im.data[i+3]=255;}g.putImageData(im,0,0);const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.colorSpace=T.SRGBColorSpace;t.anisotropy=4;textures.push(t);return t;}
 const concrete=texture(false),timber=texture(true);
 model.traverse(o=>{if(!o.isMesh)return;const m=o.material,k=m.name;materials.add(m);if(k==='glass'){m.transparent=true;m.opacity=.32;m.roughness=.1;m.metalness=.4;m.side=T.DoubleSide;o.castShadow=false;}
 if(!['mineral','timber','paving','gravel'].includes(k))return;
 const p=o.geometry.attributes.position,n=o.geometry.attributes.normal,uv=new Float32Array(p.count*2);
 for(let i=0;i<p.count;i++){const ax=Math.abs(n.getX(i)),ay=Math.abs(n.getY(i)),az=Math.abs(n.getZ(i));const u=ax>ay&&ax>az?p.getZ(i):p.getX(i),v=ay>ax&&ay>az?p.getZ(i):p.getY(i);uv[i*2]=u/(k==='timber'?.45:2);uv[i*2+1]=v/(k==='timber'?3:2);}
 o.geometry.setAttribute('uv',new T.BufferAttribute(uv,2));m.map=k==='timber'?timber:concrete;m.bumpMap=m.map;m.bumpScale=k==='timber'?.008:.012;m.roughness=.88;
 });
 return ()=>textures.forEach(t=>t.dispose());
}
