import * as T from '../assets/vendor/three/three.module.js';

// Metres. Same pavilion footprint and room organisation; exterior assemblies redesigned.
export async function buildComposition({scene,renderer,variant="light"}){
 const plastic=false; const building=new T.Group();building.name='AXIS / composition 05 / '+variant;scene.add(building);
 const geo=[],mats=[],tex=[],openings=[],parts={};
 const mat=(name,color,roughness,metalness=0)=>{const m=new T.MeshStandardMaterial({name,color,roughness,metalness});mats.push(m);return m};
 const loader=new T.TextureLoader();const [woodColor,woodNormal,woodRough]=await Promise.all(['wood-color.jpg','wood-normal.png','wood-rough.jpg'].map(f=>loader.loadAsync(new URL('assets/'+f,import.meta.url).href)));
 woodColor.colorSpace=T.SRGBColorSpace;for(const t of [woodColor,woodNormal,woodRough]){t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());tex.push(t)}
 // Submillimetre mineral relief. No painted shadow stripes or coloured procedural pattern.
 const c=document.createElement('canvas');c.width=c.height=512;const cx=c.getContext('2d'),im=cx.createImageData(512,512);let seed=92;for(let i=0;i<im.data.length;i+=4){seed=(seed*1664525+1013904223)>>>0;const a=118+(seed%23);im.data.set([a,a,a,255],i)}cx.putImageData(im,0,0);
 const mineral=new T.CanvasTexture(c);mineral.wrapS=mineral.wrapT=T.RepeatWrapping;mineral.anisotropy=8;tex.push(mineral);
 const plaster=mat('Warm mineral render','#d4d0c4',.84);plaster.bumpMap=mineral;plaster.bumpScale=.00055;
 const interior=mat('Interior lime finish','#e3dfd3',.91);interior.bumpMap=mineral;interior.bumpScale=.0003;
 const concrete=mat('Honed precast plinth','#969b97',.72);concrete.bumpMap=mineral;concrete.bumpScale=.00045;
 const stone=mat('Limestone threshold','#c8c4b8',.60);stone.bumpMap=mineral;stone.bumpScale=.0002;
 const frame=mat('Satin anodised aluminium','#686c67',.33,.82),steel=mat('Brushed stainless steel','#9b9d96',.27,.92),gasket=mat('EPDM / concealed seals','#414641',.95),membrane=mat('Recessed roof membrane','#999b95',.94);
 const wood=mat('Natural timber veneer','#cbc0af',.98);wood.map=woodColor;wood.normalMap=woodNormal;wood.normalScale=new T.Vector2(.13,.13);wood.roughnessMap=woodRough;
 const glass=new T.MeshPhysicalMaterial({name:'Clear insulating glass',color:'#f6faf7',roughness:.025,transmission:.94,thickness:.024,ior:1.5,metalness:0,envMapIntensity:1.15});mats.push(glass);
 function mesh(g,m,p=[0,0,0],parent=building,name=''){geo.push(g);const o=new T.Mesh(g,m);o.position.set(...p);o.name=name;o.castShadow=m!==glass;o.receiveShadow=true;parent.add(o);return o}
 let woodPart=0;
 function uv(o,axis='y') {const p=o.geometry.attributes.position,n=o.geometry.attributes.normal,a=o.geometry.attributes.uv,offset=woodPart++*.371;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),ny=Math.abs(n.getY(i)),nx=Math.abs(n.getX(i));let u,v;if(axis==='z'){u=ny>.6?z:y;v=nx>.6?z:x;}else if(axis==='x'){u=x;v=ny>.6?z:y;}else{u=y;v=nx>.6?z:x;}a.setXY(i,u+offset%1,v+(offset*.43)%1)}a.needsUpdate=true;return o}
 function box(w,h,d,m,p,parent=building,name='',r=.0015){let g;if(r>0&&Math.min(w,h,d)>r*4){const s=new T.Shape(),x=w/2-r,y=h/2-r;s.moveTo(-x,-y);s.lineTo(x,-y);s.lineTo(x,y);s.lineTo(-x,y);s.closePath();g=new T.ExtrudeGeometry(s,{depth:d-2*r,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:r,bevelThickness:r});g.translate(0,0,-(d-2*r)/2)}else g=new T.BoxGeometry(w,h,d);const o=mesh(g,m,p,parent,name);if(m.map===woodColor)uv(o,h>w&&h>d?'y':d>w?'z':'x');else{const a=g.attributes.uv,ps=g.attributes.position,ns=g.attributes.normal;for(let i=0;i<ps.count;i++)a.setXY(i,Math.abs(ns.getX(i))>.6?ps.getZ(i):ps.getX(i),Math.abs(ns.getY(i))>.6?ps.getZ(i):ps.getY(i));}return o}
 function wall(length,height,thickness,holes,axis,origin,m=plaster){const s=new T.Shape();s.moveTo(0,0);s.lineTo(length,0);s.lineTo(length,height);s.lineTo(0,height);s.closePath();for(const h of holes){const p=new T.Path();p.moveTo(h.a,h.bottom);p.lineTo(h.a,h.top);p.lineTo(h.b,h.top);p.lineTo(h.b,h.bottom);p.closePath();s.holes.push(p);openings.push({axis,origin,...h})}const g=new T.ExtrudeGeometry(s,{depth:thickness,bevelEnabled:false,steps:1});g.userData.wall={length,height,holes};const o=mesh(g,m,origin);if(axis==='z')o.rotation.y=-Math.PI/2;return o}
 function roofRing(w,d,inset,h,y,m,name){const s=new T.Shape(),a=w/2,b=d/2;s.moveTo(-a,-b);s.lineTo(a,-b);s.lineTo(a,b);s.lineTo(-a,b);s.closePath();const hole=new T.Path();hole.moveTo(-a+inset,-b+inset);hole.lineTo(-a+inset,b-inset);hole.lineTo(a-inset,b-inset);hole.lineTo(a-inset,-b+inset);hole.closePath();s.holes.push(hole);const g=new T.ExtrudeGeometry(s,{depth:h,steps:1,bevelEnabled:true,bevelSegments:2,bevelSize:.001,bevelThickness:.001});const o=mesh(g,m,[4.8,y,3.5],parts.roof,name);o.rotation.x=-Math.PI/2;return o;}
 // Same north kitchen wall and hall. The two alternatives change only the exterior living-room edge.
 wall(9.6,2.82,.28,[{a:3.6,b:7.8,bottom:1.15,top:2.35}],'x',[0,0,0]);
 wall(2.52,2.8,.12,[{a:.92,b:2.12,bottom:.005,top:2.45}],'z',[2.47,0,.28],interior);
 box(2.19,2.8,.12,interior,[1.375,1.4,2.86]);
 if(!plastic){
  wall(9.6,2.82,.28,[{a:.15,b:8.85,bottom:.025,top:2.625}],'x',[0,0,6.32]);
  wall(6.04,2.82,.28,[{a:.62,b:2.18,bottom:.02,top:2.54},{a:3.32,b:5.99,bottom:.025,top:2.625}],'z',[.28,0,.28]);
  wall(6.04,2.82,.28,[{a:1.72,b:5.02,bottom:.45,top:2.55}],'z',[9.6,0,.28]);
 }else{
  // Solid west bar / actual enclosed reading alcove, open to the living room from the north.
  wall(6.04,3.20,.28,[{a:.62,b:2.18,bottom:.02,top:2.54}],'z',[.28,0,.28]);
  box(2.98,3.20,.28,plaster,[1.49,1.60,6.46],building,'West bar / solid south wall');
  box(.28,2.82,1.44,plaster,[2.84,1.41,5.74],building,'Loggia west return');
  wall(6.62,2.82,.28,[{a:0.15,b:6.13,bottom:.025,top:2.625}],'x',[2.98,0,4.88]);
  wall(6.04,2.82,.28,[{a:1.72,b:4.20,bottom:.45,top:2.55}],'z',[9.6,0,.28]);
  box(.28,2.82,1.44,plaster,[9.46,1.41,5.74],building,'Loggia east return');
  // Wood lines the sheltered recess, rather than forming decorative strips on the facade.
  for(let i=0;i<8;i++)box(.026,2.69,.174,wood,[9.307,1.395,5.12+i*.177],building,'Timber lining / sheltered loggia',.001);
 }
 parts.roof=new T.Group();parts.roof.name='Roof / '+variant;building.add(parts.roof);
 box(9.54,plastic?.31:.35,6.54,concrete,[4.8,plastic?-.215:-.195,3.3],building,'Recessed concrete base',.003);
 function heatedSlab(y,depth,material,name){const shape=new T.Shape();shape.moveTo(0,0);for(const p of [[9.6,0],[9.6,5.14],[2.98,5.14],[2.98,6.6],[0,6.6]])shape.lineTo(...p);shape.closePath();const o=mesh(new T.ExtrudeGeometry(shape,{depth,bevelEnabled:false}),material,[0,y,0],building,name);o.rotation.x=Math.PI/2;return o;}
 if(plastic)heatedSlab(.0025,.035,stone,'L-shaped floor slab / open loggia');else box(9.60,.035,6.60,stone,[4.8,-.015,3.3],building,'Floor / slab edge',.002);
 box(9.58,.07,6.58,frame,[4.8,2.855,3.3],parts.roof,'Recessed structural roof closure',.001);
 if(!plastic){
  // Thin cantilever edge, with the deeper roof build-up set back from the perimeter.
  box(10.64,.11,7.62,plaster,[4.68,2.945,3.50],parts.roof,'Thin perimeter roof edge',.002);
  box(10.68,.023,7.66,frame,[4.68,3.012,3.50],parts.roof,'Continuous metal roof edge',.001);
  box(8.72,.18,5.58,plaster,[4.80,3.09,3.22],parts.roof,'Recessed roof build-up',.002);
  box(8.73,.018,5.59,membrane,[4.80,3.185,3.22],parts.roof,'Recessed waterproofing',.001);
  box(9.04,.105,6.04,interior,[4.8,2.8375,3.3],parts.roof,'Bearing slab inside facade',.001);
  // Continuous timber portal around the actual entrance aperture.
  const portal=wall(1.95,2.70,.022,[{a:.195,b:1.755,bottom:.02,top:2.54}],'z',[-.001,0,.705],wood);portal.name='Timber entrance portal';uv(portal,'y');
 }else{
  // Two volumetric heights: west enclosed bar and a lower roof over the recessed terrace.
  box(6.90,.20,7.13,plaster,[6.31,2.96,3.345],parts.roof,'Loggia roof / deep horizontal opening',.002);
  box(6.94,.022,7.17,frame,[6.31,3.073,3.345],parts.roof,'Loggia coping',.001);
  box(3.22,.15,7.03,plaster,[1.43,3.265,3.285],parts.roof,'West bar roof edge',.002);
  box(3.25,.022,7.06,frame,[1.43,3.352,3.285],parts.roof,'West bar coping',.001);
  box(.28,.38,6.04,plaster,[2.84,3.01,3.3],parts.roof,'West bar height return',.002);
  box(2.98,.38,.28,plaster,[1.49,3.01,.14],parts.roof,'West bar north wall extension',.002);
  box(6.27,.025,1.60,wood,[6.12,2.846,5.88],parts.roof,'Sheltered timber soffit',.001);
 }
 parts.ceiling=plastic?heatedSlab(2.7945,.025,interior,'L-shaped ceiling'):box(9.04,.025,6.04,interior,[4.8,2.782,3.3],building,'Ceiling',.001);
 // Window profiles: structural outer frame, recessed bead, seal and clear glass; all dimensions in metres.
 function windowUnit(w,h,pos,rot,spans){const g=new T.Group();g.name='Recessed window assembly';g.position.set(...pos);g.rotation.y=rot;building.add(g);
  for(const x of [-w/2+.028,w/2-.028])box(.056,h,.138,frame,[x,h/2,0],g,'Outer frame',.002);
  for(const y of [.028,h-.028])box(w,.056,.138,frame,[0,y,0],g,'Outer frame',.002);
  let left=-w/2+.056;
  for(let i=0;i<spans.length;i++){const span=spans[i],right=left+span;
   box(span-.014,h-.128,.024,glass,[(left+right)/2,h/2,-.011],g,'Insulating glass',0);
   for(const x of [left+.004,right-.004]){box(.009,h-.11,.016,gasket,[x,h/2,.008],g,'3 mm exposed gasket',.001);box(.018,h-.10,.031,frame,[x,h/2,.028],g,'Glazing bead',.001);}
   for(const y of [.064,h-.064]){box(span,.010,.016,gasket,[(left+right)/2,y,.007],g,'Horizontal seal',.001);box(span,.018,.032,frame,[(left+right)/2,y,.027],g,'Horizontal glazing bead',.001);}
   if(i<spans.length-1){box(.054,h-.08,.138,frame,[right+.027,h/2,0],g,'Mullion',.002);left=right+.054;}
  }
  // Sloped sill with an actual projecting nose and underside drip; separate from the plaster reveal.
  const sill=box(w+.045,.028,.255,stone,[0,-.016,.02],g,'Stone sill',.002);sill.rotation.x=.045;
  box(w+.055,.026,.016,frame,[0,-.034,.14],g,'Sill drip nose',.001);
  return g;
 }
 // Window assemblies are retained; only aperture positions and clear pane widths change.
 const front=plastic?{w:5.98,x:6.12,z:5.045,spans:[1.5,1.153,1.153,1.90]}:{w:8.70,x:4.50,z:6.385,spans:[3.24,1.173,1.173,2.84]};
 parts.south=windowUnit(front.w,2.60,[front.x,.025,front.z],0,front.spans);
 parts.east=plastic?windowUnit(2.48,2.10,[9.395,.45,3.24],Math.PI/2,[1.157,1.157]):windowUnit(3.30,2.10,[9.395,.45,3.65],Math.PI/2,[1.567,1.567]);
 if(!plastic)parts.west=windowUnit(2.67,2.60,[.205,.025,4.935],-Math.PI/2,[2.558]);
 parts.north=windowUnit(4.20,1.20,[5.7,1.15,.205],Math.PI,[1.3266667,1.3266667,1.3266666]);
 const interlock=plastic?5.920:4.70;
 box(.035,2.45,.04,frame,[interlock,1.325,front.z+.040],building,'Slider interlock',.002);
 for(const y of [.99,1.23])box(.018,.025,.047,frame,[interlock+.045,y,front.z+.040],building,'Pull mount',.002);
 box(.02,.28,.021,frame,[interlock+.045,1.11,front.z+.078],building,'Recessed pull',.004);
 for(const z of [front.z+.005,front.z+.070])box(front.w-.15,.012,.013,steel,[front.x,.042,z],building,'Threshold guide',.001);
 box(front.w+.04,.028,.072,concrete,[front.x,-.015,front.z+.190],building,'Recessed drainage channel',.002);
 for(let i=0;i<Math.floor(front.w/.08);i++)box(.002,.003,.061,steel,[front.x-front.w/2+.02+i*.08,.002,front.z+.190],building,'Drain grate crosspiece',0);
 // Entry pocket. Existing hall retained; doorway widened with one sidelight within the hall's length.
 parts.entry=new T.Group();parts.entry.name='Entrance assembly';parts.entry.position.set(.185,.02,1.68);parts.entry.rotation.y=-Math.PI/2;building.add(parts.entry);
 const e=parts.entry;
 for(const x of [-.76,.76])box(.04,2.52,.14,frame,[x,1.26,0],e,'Entry perimeter frame',.0015);
 box(1.56,.04,.14,frame,[0,2.50,0],e,'Entry head frame',.0015);
 const door=box(1.075,2.43,.065,wood,[-.183,1.247,-.025],e,'Timber entry leaf',.003);uv(door,'y');
 box(.044,2.48,.12,frame,[.383,1.26,0],e,'Sidelight mullion',.002);
 box(.328,2.416,.024,glass,[.569,1.26,-.025],e,'Entry sidelight',0);
 for(const x of [.414,.725])box(.012,2.44,.032,frame,[x,1.26,.025],e,'Sidelight glazing bead',.001);
 // Timber linings show real opening depth, rather than an applied striped facade.
 for(const x of [-.79,.79])box(.022,2.54,.20,wood,[x,1.26,.042],e,'Oak reveal lining',.001);
 box(1.59,.024,.20,wood,[0,2.546,.042],e,'Oak head lining',.001);
 for(const y of [.99,1.26])box(.023,.025,.043,steel,[.244,y,.032],e,'Door pull fixing',.003);
 box(.018,.31,.018,steel,[.244,1.125,.054],e,'Brushed door pull',.006);
 for(const y of [.27,1.24,2.18])box(.016,.075,.023,frame,[-.703,y,.014],e,'Door hinge',.003);
 box(1.56,.025,.27,stone,[0,.008,.034],e,'Entry threshold',.002);
 // Two continuous entrance treads, aligned with the door pocket and the concrete base.
 box(.91,.325,1.90,stone,[-.44,-.1775,1.68],building,'Upper entrance tread',.004);
 box(.39,.17,1.90,concrete,[-1.083,-.265,1.68],building,'Lower entrance tread',.003);
 // Timber floor and terrace keep the useful scanned material, with restrained joints and real support.
 for(let i=0;i<48;i++){const m=wood.clone();m.color.set('#d3c4ac').multiplyScalar(.98+(i%5)*.009);mats.push(m);const shortened=plastic&&(.37+i*.188)>2.70;const o=box(.1872,.024,shortened?4.73:6.03,m,[.37+i*.188,.003,shortened?2.65:3.3],building,'Interior board',.0005);uv(o,'z');}
 parts.terrace=new T.Group();parts.terrace.name='Terrace assembly';building.add(parts.terrace);
 box(8.57,.16,2.43,concrete,[4.8,-.28,7.84],parts.terrace,'Terrace support slab',.003);
 for(let i=0;i<7;i++)for(const x of [1.1,4.8,8.5])box(.10,.025,.10,gasket,[x,-.1875,6.75+i*.355],parts.terrace,'Bearing pad',.001);
 for(let i=0;i<7;i++)box(8.42,.12,.052,wood,[4.8,-.115,6.75+i*.355],parts.terrace,'Timber joist',.001);
 for(let i=0;i<55;i++){const m=wood.clone();m.color.set('#b9af9d').multiplyScalar(.98+(i%7)*.006);mats.push(m);const o=box(.151,.03,2.39,m,[.637+i*.154,-.040,7.825],parts.terrace,'Deck board / 3 mm joint',.001);uv(o,'z');}
 for(const x of [.55,9.04])box(.023,.14,2.40,wood,[x,-.12,7.83],parts.terrace,'Deck perimeter fascia',.001);
 box(8.57,.14,.023,wood,[4.8,-.12,9.035],parts.terrace,'Deck end fascia',.001);
 box(8.66,.16,.43,concrete,[4.8,-.26,9.26],parts.terrace,'Broad terrace step',.004);

 if(plastic){
  box(6.32,.16,1.47,concrete,[6.15,-.28,5.895],parts.terrace,'Loggia support slab',.003);
  for(let i=0;i<41;i++){const o=box(.151,.03,1.45,wood,[3.07+i*.154,-.040,5.895],parts.terrace,'Sheltered deck extension',.001);uv(o,'z');}
  for(const z of [5.3,5.85,6.4])box(6.25,.12,.052,wood,[6.15,-.115,z],parts.terrace,'Loggia joist',.001);
 }
 // Existing fitted kitchen retained, with its bevelled joinery and genuine sink opening.
 const oak=wood,black=gasket,rubber=gasket;
 const kitchen=new T.Group();kitchen.name='Existing fitted kitchen';building.add(kitchen);
 for(let i=0;i<9;i++){const x=3.32+i*.65;box(.643,.71,.62,oak,[x,.46,.64],kitchen,'Kitchen cabinet',.003);box(.59,.016,.015,frame,[x,.79,.958],kitchen,'Recessed pull',.002);}
 box(5.9,.1,.51,black,[5.95,.065,.59],kitchen,'Recessed toe kick');
 const counter=new T.Shape();counter.moveTo(3,0);counter.lineTo(8.9,0);counter.lineTo(8.9,.72);counter.lineTo(3,.72);counter.closePath();const sh=new T.Path();sh.moveTo(5.27,.14);sh.lineTo(5.27,.58);sh.lineTo(5.94,.58);sh.lineTo(5.94,.14);sh.closePath();counter.holes.push(sh);const cg=new T.ExtrudeGeometry(counter,{depth:.035,bevelEnabled:false});const ct=mesh(cg,stone,[0,.93,.29],kitchen);ct.rotation.x=Math.PI/2;
 box(.66,.025,.43,steel,[5.605,.76,.65],kitchen);for(const x of [5.275,5.935])box(.015,.17,.43,steel,[x,.835,.65],kitchen);for(const z of [.435,.865])box(.66,.17,.015,steel,[5.605,.835,z],kitchen);
 const curve=new T.CatmullRomCurve3([new T.Vector3(5.63,.94,.35),new T.Vector3(5.63,1.2,.35),new T.Vector3(5.63,1.27,.5),new T.Vector3(5.63,1.12,.62)]);mesh(new T.TubeGeometry(curve,40,.014,12,false),steel,[0,0,0],kitchen);
 box(.67,.012,.5,black,[7.7,.95,.66],kitchen);for(const x of [7.52,7.87])for(const z of [.51,.8]){const ring=mesh(new T.TorusGeometry(.095,.002,8,48),steel,[x,.959,z],kitchen);ring.rotation.x=-Math.PI/2;}
 box(.72,2.35,.66,oak,[8.94,1.2,.65],kitchen,'Tall cabinet',.003);for(const y of [.6,1.78])box(.014,.35,.025,frame,[8.68,y,1],kitchen);box(.59,.56,.025,black,[8.94,1.1,.99],kitchen);
 box(2.12,.8,.84,oak,[6.3,.45,2.7],kitchen,'Island',.004);box(2.2,.045,.9,stone,[6.3,.88,2.7],kitchen,'Island stone top',.003);for(let i=0;i<4;i++)box(.003,.71,.009,rubber,[5.5+i*.53,.45,3.125],kitchen);
 box(1.4,2.5,.55,oak,[1.1,1.27,.58],kitchen,'Hall wardrobe',.003);box(.7,.065,.42,oak,[1.65,.45,2.5],kitchen,'Hall bench',.003);
 return {building,geo,mats,tex,glass,openings,parts};
}
