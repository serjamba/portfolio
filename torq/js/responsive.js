/* Progressive layout controls; one source of truth for cart, garage and filters. */
(()=>{
 const compact=matchMedia('(max-width:1179px)'),mobile=matchMedia('(max-width:767px)');
 let filterState=null,filterHome=null,filterNode=null,filterButton=null,applyFilters=false,brandScrollTimer=0;
 const originalClose=TQ.closeModal;
 TQ.closeModal=()=>{
  if(filterNode){
   if(!applyFilters&&TQ.current.page==='category')TQ.filters=filterState;
   filterHome?.replaceWith(filterNode);filterNode.innerHTML=TQ.filtersMarkup();
   filterNode=null;filterHome=null;filterState=null;
   document.getElementById('modal').classList.remove('filter-drawer');
   if(TQ.current.page==='category'&&document.getElementById('products-results'))TQ.updateListing();
  }
  originalClose();filterButton?.focus({preventScroll:true});filterButton=null;
 };
 function openFilters(button){
  if(!compact.matches)return;
  filterNode=document.querySelector('.listing-layout>.filters');if(!filterNode)return;
  filterState=structuredClone(TQ.filters);filterButton=button;applyFilters=false;
  filterHome=document.createComment('Filter sidebar position');filterNode.replaceWith(filterHome);
  const modal=document.getElementById('modal');
  TQ.modal('Фильтры',`<div class="filter-drawer-body"></div><div class="filter-drawer-actions"><button class="btn secondary" data-filter-cancel>Отмена</button><button class="btn" data-filter-apply>Показать товары</button></div>`);
  modal.classList.add('filter-drawer');modal.querySelector('.filter-drawer-body').append(filterNode);
  modal.querySelector('[data-filter-apply]').onclick=()=>{applyFilters=true;TQ.closeModal();};
  modal.querySelector('[data-filter-cancel]').onclick=()=>TQ.closeModal();
 }
 const listing=TQ.updateListing;
 TQ.updateListing=()=>{listing();const b=document.querySelector('.filter-open');if(b)b.textContent=`Фильтры${document.querySelectorAll('#filter-chips .chip').length?' · '+document.querySelectorAll('#filter-chips .chip').length:''}`;const apply=document.querySelector('[data-filter-apply]');if(apply)apply.textContent=`Показать · ${TQ.filteredProducts().length}`;};
 const mega=TQ.mega;
 TQ.mega=(...args)=>{mega(...args);document.querySelector('.mega-inner')?.insertAdjacentHTML('beforeend','<nav class="mobile-account-links" aria-label="Личный кабинет"><a href="#/garage">Гараж</a><a href="#/garage?tab=favorites">Избранное</a><a href="#/garage?tab=profile">Профиль</a><button class="text-btn" data-action="catalog-menu">Закрыть меню</button></nav>');};
 const oldMotion=TQ.motionPage;
 TQ.motionPage=()=>{
  oldMotion();document.body.classList.remove('mobile-menu-open');TQ.brandObserver?.disconnect();
  const layout=document.querySelector('.listing-layout');
  if(layout){const b=document.createElement('button');b.className='btn secondary filter-open';b.textContent='Фильтры';b.setAttribute('aria-haspopup','dialog');b.onclick=()=>openFilters(b);layout.before(b);}
  TQ.brandObserver=new IntersectionObserver(entries=>entries.forEach(e=>e.target.dataset.offscreen=String(!e.isIntersecting)),{rootMargin:'40px'});
  document.querySelectorAll('.brand-strip').forEach(strip=>{
   strip.dataset.paused=String(!!TQ.brandsPaused);TQ.brandObserver.observe(strip);
   const control=document.createElement('div');control.className='marquee-control';control.innerHTML=`<button class="text-btn" aria-pressed="${!!TQ.brandsPaused}">${TQ.brandsPaused?'Продолжить ленту':'Остановить ленту'}</button>`;
   control.querySelector('button').onclick=e=>{TQ.brandsPaused=!TQ.brandsPaused;strip.dataset.paused=String(TQ.brandsPaused);e.target.textContent=TQ.brandsPaused?'Продолжить ленту':'Остановить ленту';e.target.setAttribute('aria-pressed',String(TQ.brandsPaused));};strip.after(control);
  });
  document.querySelectorAll('.info-content .table').forEach(t=>{t.tabIndex=0;t.setAttribute('aria-label','Таблица условий; при необходимости прокрутите по горизонтали');t.insertAdjacentHTML('beforebegin','<p class="table-hint">Таблицу можно прокрутить по горизонтали ↔</p>');});
  document.querySelectorAll('[role=tablist]').forEach(list=>{const panel=document.getElementById('product-tab-content');if(!panel)return;list.querySelectorAll('[role=tab]').forEach((t,i)=>{t.id='product-tab-'+i;t.setAttribute('aria-controls',panel.id);t.tabIndex=t.classList.contains('active')?0:-1;});panel.setAttribute('aria-labelledby',list.querySelector('.active')?.id||'product-tab-0');});
 };
 const closeMenu=TQ.closeMenu;
 TQ.closeMenu=()=>{const inside=document.activeElement?.closest('#mega-menu');closeMenu();document.body.classList.remove('mobile-menu-open');if(inside)document.querySelector('[data-action=catalog-menu]')?.focus();};
 document.addEventListener('click',e=>{if(e.target.closest('[data-action=catalog-menu]')&&mobile.matches)document.body.classList.toggle('mobile-menu-open',document.querySelector('[data-action=catalog-menu]')?.getAttribute('aria-expanded')==='true');if(e.target.closest('[role=tab]')){const list=e.target.closest('[role=tablist]');list?.querySelectorAll('[role=tab]').forEach(t=>t.tabIndex=t===e.target?0:-1);document.getElementById('product-tab-content')?.setAttribute('aria-labelledby',e.target.id);}});
 document.addEventListener('keydown',e=>{
  const tab=e.target.closest?.('[role=tab]');if(tab&&['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){const tabs=[...tab.parentElement.querySelectorAll('[role=tab]')],i=tabs.indexOf(tab),next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;e.preventDefault();tabs[next].click();tabs[next].focus();}
  if(e.key==='Tab'&&document.body.classList.contains('mobile-menu-open')){const nodes=[document.querySelector('[data-action=catalog-menu]'),...document.querySelectorAll('#mega-menu a,#mega-menu button')].filter(n=>n.getBoundingClientRect().width),first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&e.target===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&e.target===last){e.preventDefault();first.focus();}}
 });
 compact.addEventListener('change',()=>{if(!compact.matches&&filterNode)TQ.closeModal();});
 mobile.addEventListener('change',()=>{if(!mobile.matches)document.body.classList.remove('mobile-menu-open');});
 addEventListener('scroll',()=>{
  const strips=document.querySelectorAll('.brand-strip:not([data-offscreen=true])');
  if(!strips.length)return;
  strips.forEach(strip=>strip.dataset.scrolling='true');clearTimeout(brandScrollTimer);
  brandScrollTimer=setTimeout(()=>strips.forEach(strip=>{if(strip.isConnected)strip.dataset.scrolling='false';}),160);
 },{passive:true});
 document.addEventListener('visibilitychange',()=>document.querySelectorAll('.brand-strip').forEach(s=>s.dataset.offscreen=String(document.hidden||s.getBoundingClientRect().bottom<0||s.getBoundingClientRect().top>innerHeight)));
})();
