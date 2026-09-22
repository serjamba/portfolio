// One advancing front. Only its last 16% fades.
(()=>{
 const active=new WeakMap(),motion=matchMedia('(prefers-reduced-motion: reduce)'),layers=new Set();
 motion.addEventListener('change',()=>{if(motion.matches){for(const layer of layers){active.get(layer)?.cancel();layer.style.visibility='hidden';}layers.clear();}});
 window.concreteTransition=(layer,{duration=800}={})=>{
  active.get(layer)?.cancel();
  if(motion.matches){layer.style.visibility='hidden';return null;}
  const front=ys=>'polygon(0 0,100% 0,'+ys.map((y,i)=>[100,86,70,55,38,20,0][i]+'% '+y+'%').join(',')+')';
  const a=layer.animate([
   {clipPath:front([0,0,0,0,0,0,0]),opacity:1,offset:0,easing:'ease-in'},
   {clipPath:front([3,5,4,8,10,7,11]),opacity:1,offset:.18,easing:'cubic-bezier(.3,.1,.45,1)'},
   {clipPath:front([30,40,37,51,57,49,61]),opacity:1,offset:.48,easing:'cubic-bezier(.35,0,.5,1)'},
   {clipPath:front([88,94,93,99,100,98,100]),opacity:1,offset:.76,easing:'ease-out'},
   {clipPath:front([100,100,100,100,100,100,100]),opacity:1,offset:.84,easing:'ease-out'},
   {clipPath:front([100,100,100,100,100,100,100]),opacity:0,offset:1}
  ],{duration:Math.min(2000,Math.max(400,duration)),easing:'linear'});
  active.set(layer,a);layers.add(layer);
  const release=()=>{if(active.get(layer)===a){active.delete(layer);layers.delete(layer);}};
  a.addEventListener('finish',release,{once:true});a.addEventListener('cancel',release,{once:true});return a;
 };
})();
