import {projects} from './data.js';
import {header,footer} from './components.js';
import * as pages from './pages.js';
import {capture,initForm,getDraft} from './form.js';
import {initMotion,syncMotion,pointerEffects,enabled} from './motion/controller.js';
import {initStage} from './motion/stages.js';
import {initKinetic} from './motion/kinetic.js';
let cleanup=()=>{},pointerCleanup=()=>{},current='',filter='Все',positions=new Map();
const main=document.querySelector('main');
function render(){
 capture();if(current)positions.set(current,scrollY);cleanup();pointerCleanup();document.querySelector('#preview').classList.remove('visible');
 const raw=(location.hash.slice(1)||'/'),[path,query='']=raw.split('?'),route=path.replace(/^\//,'').replace(/\/$/,''),params=new URLSearchParams(query),p=projects.find(p=>'projects/'+p.id===route);
 document.body.classList.toggle('light',['services','studio'].includes(route));
 document.querySelector('#header').innerHTML=header(route);document.querySelector('#footer').innerHTML=footer();
 const title=p?p.name:({'':'Независимая дизайн-студия',projects:'Работы',services:'Услуги',studio:'Студия',contact:'Контакты'}[route]||'Страница не найдена');document.title=title+' — VOID';
 main.innerHTML=p?pages.casePage(p):({'':pages.home,projects:pages.works,services:pages.servicesPage,studio:pages.studio,contact:pages.contact}[route]||pages.notFound)();
 if(route==='projects')updateWorks();else pointerCleanup=pointerEffects();
 if(route==='contact')initForm(params);
 cleanup=document.querySelector('[data-kinetic]')?initKinetic():initStage();syncMotion();
 current=route;
 // Native Back returns to the work list's stored position; other destinations start at the top.
 scrollTo(0,route==='projects'?(positions.get(route)||0):0);
 if(document.readyState!=='loading')main.focus({preventScroll:true});
}
function updateWorks(){document.querySelector('#work-list').innerHTML=pages.projectRows(filter);document.querySelector('.work-count').textContent='Показано '+projects.filter(p=>filter==='Все'||p.type.includes(filter)).length+' из 3 проектов';document.querySelectorAll('.filter').forEach(b=>b.setAttribute('aria-pressed',b.dataset.filter===filter));pointerCleanup();pointerCleanup=pointerEffects();}
document.addEventListener('click',e=>{
 const menu=e.target.closest('.menu-toggle');if(menu){const on=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',on);document.querySelector('#navigation').classList.toggle('open',on);}
 const f=e.target.closest('[data-filter]');if(f){filter=f.dataset.filter;updateWorks();}
 const g=e.target.closest('[data-gallery]');if(g){const track=document.querySelector('.gallery-track');track.scrollBy({left:Number(g.dataset.gallery)*(track.firstElementChild.getBoundingClientRect().width+24),behavior:enabled()?'smooth':'instant'});}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const menu=document.querySelector('.menu-toggle');if(menu?.getAttribute('aria-expanded')==='true'){menu.setAttribute('aria-expanded','false');document.querySelector('#navigation').classList.remove('open');menu.focus();}}});
document.addEventListener('scroll',e=>{if(e.target.matches?.('.gallery-track')){const t=e.target,n=Math.round(t.scrollLeft/(t.firstElementChild.getBoundingClientRect().width+24))+1;document.querySelector('.gallery-controls output').textContent=String(Math.min(4,n)).padStart(2,'0')+' / 04';}},{capture:true,passive:true});
window.addEventListener('hashchange',render);history.scrollRestoration='manual';
initMotion();render();
window.VOID={get motion(){return enabled()},get draft(){return getDraft()},get filter(){return filter},get stage(){return document.querySelector('[data-kinetic],[data-stage]')?._debug},get kinetic(){return document.querySelector('[data-kinetic]')?._debug},routes:['/','/projects','/projects/lumen','/projects/fold','/projects/rift','/services','/studio','/contact']};
