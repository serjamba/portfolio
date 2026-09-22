// Metres. Capsule footprint (r=0.19), swept in <=4cm steps; no jumping or gravity.
export const R=.19;
const walls=[[-.02,.30,-.02,.91],[-.02,.30,2.035,6.62],[9.30,9.62,0,6.62],[0,9.6,-.02,.30],[0,4.727,6.30,6.61],[5.90,9.6,6.30,6.61],[2.33,2.49,.28,1.20],[2.33,2.49,2.40,2.92],[.28,2.47,2.78,2.94]];
const furniture=[[.4,1.8,.305,.855],[1.3,2,2.29,2.71],[3,9.30,.29,1.03],[5.20,7.40,2.25,3.15]];
export const obstacles=[...walls,...furniture];
export function floorAt(x,z){if(x>=-.895&&x<.30&&z>.73&&z<2.63)return -.015;if(x>=-1.278&&x<-.895&&z>.73&&z<2.63)return -.18;if(x>=.28&&x<=9.32&&z>=.28&&z<=6.63)return .015;if(x>=.75&&x<=8.85&&z>=6.30&&z<=8.84)return -.025;return -.335}
function domain(x,z){return (x>=-2.3&&x<=.5&&z>=.70&&z<=2.7)||(x>=.28+R&&x<=9.32-R&&z>=.28+R&&z<=6.6)||(x>=.75+R&&x<=8.85-R&&z>=6.28&&z<=8.84-R)}
export function allowed(x,z){return domain(x,z)&&!obstacles.some(([a,b,c,d])=>{const px=Math.max(a,Math.min(b,x)),pz=Math.max(c,Math.min(d,z));return (x-px)**2+(z-pz)**2<R*R})}
export function move(position,dx,dz){const n=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.04));let x=position.x,z=position.z;for(let i=0;i<n;i++){if(allowed(x+dx/n,z))x+=dx/n;if(allowed(x,z+dz/n))z+=dz/n;}return{x,z,y:floorAt(x,z)+1.6}}
