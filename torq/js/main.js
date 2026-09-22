/* Hash routes work both from file:// and from a basic static server. */
TQ.renderStamp=0;
TQ.render=(scroll=false)=>{
 TQ.unmountScene?.();TQ.unmountScene=null;
 TQ.renderStamp++;clearTimeout(TQ.searchTimer);
 const [path,query='']=(location.hash.replace(/^#\/?/,'')||'').split('?');
 TQ.current={page:path||'home',params:new URLSearchParams(query)};
 const pages={home:TQ.homePage,catalog:TQ.catalogPage,category:TQ.listingPage,product:TQ.productPage,search:TQ.searchPage,cart:TQ.cartPage,checkout:TQ.checkoutPage,success:TQ.successPage,garage:TQ.garagePage,brands:TQ.brandsPage,delivery:()=>TQ.infoPage('delivery'),warranty:()=>TQ.infoPage('warranty'),about:()=>TQ.infoPage('about'),contacts:()=>TQ.infoPage('contacts')};
 TQ.closeModal();
 const main=document.getElementById('main');
 main.innerHTML=(pages[TQ.current.page]||(()=>`<div class="container page">${TQ.empty('Страница не найдена','Такого раздела в TORQ нет. Вернитесь в каталог.')}</div>`))();
 TQ.renderHeader();TQ.renderFooter();TQ.mountScene();TQ.motionPage();
 if(TQ.current.page==='category')TQ.updateListing();
 const titles={home:'Запчасти для вашего автомобиля',catalog:'Каталог автозапчастей',category:TQ.listingTitle(),product:'Карточка товара',search:'Поиск запчастей',cart:'Корзина',checkout:'Оформление заказа',success:'Заказ оформлен',garage:'Мой гараж',brands:'Бренды',delivery:'Доставка и оплата',warranty:'Гарантия и возврат',about:'О компании',contacts:'Контакты'};
 document.title=`${titles[TQ.current.page]||'Страница не найдена'} — TORQ`;
 if(scroll){window.scrollTo(0,0);main.focus({preventScroll:true});}
};
TQ.closeMenu=()=>{
 const menu=document.getElementById('mega-menu');document.querySelector('[data-action="catalog-menu"]')?.setAttribute('aria-expanded','false');
 if(!menu||menu.hidden||menu.dataset.closing)return;
 if(TQ.motionQuery.matches){menu.hidden=true;return;}
 menu.dataset.closing='true';menu.inert=true;menu.style.pointerEvents='none';
 const animation=TQ.effect(menu,[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-5px)'}],180);
 const finish=()=>{menu.hidden=true;delete menu.dataset.closing;menu.style.pointerEvents='';menu.inert=false;};
 TQ.afterEffect(animation,finish,180);
};
TQ.supportSuccess=form=>{const f=new FormData(form);TQ.state.requests.unshift({subject:String(f.get('subject')),message:String(f.get('message')),date:new Date().toLocaleDateString('ru-RU')});TQ.save();form.innerHTML=`<div class="notice"><h3>Данные проверены</h3><p>Отправка не выполнялась. Демозапрос доступен до перезагрузки вкладки; контакты не сохраняются.</p><a href="#/garage?tab=requests" class="link">Открыть обращения →</a></div>`;};
document.addEventListener('click',async e=>{
 if(e.target.closest('.skip-link')){e.preventDefault();document.getElementById('main').focus();return;}
 const b=e.target.closest('[data-action]');
 if(!b){if(!e.target.closest('#mega-menu'))TQ.closeMenu();if(!e.target.closest('.global-search')){const s=document.getElementById('suggestions');if(s)s.hidden=true;}return;}
 const a=b.dataset.action,id=b.dataset.id;
 if(a==='catalog-menu'){const m=document.getElementById('mega-menu');if(m.hidden||m.dataset.closing){m.getAnimations().forEach(a=>a.cancel());delete m.dataset.closing;m.style.pointerEvents='';m.inert=false;TQ.mega();m.hidden=false;TQ.effect(m,[{opacity:0,transform:'translateY(-5px)'},{opacity:1,transform:'translateY(0)'}],200);b.setAttribute('aria-expanded','true');}else TQ.closeMenu();}
 else if(a==='mega-group')TQ.mega(b.dataset.cat);
 else if(a==='close-modal')TQ.dismissModal();
 else if(a==='favorite'){TQ.toggleFavorite(id);TQ.favoriteFeedback(b);}
 else if(a==='add-cart')TQ.addCart(id,b.dataset.source==='product'?Number(document.getElementById('product-qty').textContent):1);
 else if(a==='confirm-add'){TQ.closeModal();TQ.addCart(id,Number(b.dataset.qty),true);}
 else if(a==='cart-qty')TQ.changeQty(id,Number(b.dataset.delta));
 else if(a==='remove-cart')TQ.removeCart(id);
 else if(a==='undo-cart'){if(TQ.undoCart){const row=TQ.state.cart.find(x=>x.id===TQ.undoCart.id);if(row)row.qty=Math.min(99,row.qty+TQ.undoCart.qty);else TQ.state.cart.push(TQ.undoCart);TQ.undoCart=null;TQ.save();TQ.render();TQ.toast('Товар восстановлен');}}
 else if(a==='move-favorite'){if(!TQ.state.favorites.includes(Number(id)))TQ.state.favorites.push(Number(id));TQ.removeCart(id);TQ.toast('Товар перенесён в избранное','<button data-action="undo-cart">Вернуть в корзину</button>');}
 else if(a==='demo-cart'){TQ.state.cart=[{id:1,qty:2},{id:4,qty:1}];TQ.saveVehicle(TQ.cars[0]);TQ.render();}
 else if(a==='car-modal')TQ.carModal();
 else if(a==='focus-vehicle'){const f=document.querySelector('main .vehicle-form');if(f){document.getElementById('vehicle-picker').scrollIntoView({block:'center'});f.elements.make.focus({preventScroll:true});}else TQ.carModal();}
 else if(a==='reset-car'){TQ.state.activeCar=null;TQ.save();TQ.render();}
 else if(a==='edit-car')TQ.carModal(id);
 else if(a==='select-car'){TQ.state.activeCar=id;TQ.save();TQ.render();}
 else if(a==='car-parts'){TQ.state.activeCar=id;TQ.save();TQ.navigate('category',{compatible:'1'});}
 else if(a==='delete-car'){const c=TQ.cars.find(c=>c.id===id);TQ.modal('Удалить автомобиль?',`<p class="modal-copy">${c.make} ${c.badge} будет удалён из гаража. Товары в корзине останутся.</p><div class="row"><button class="btn" data-action="confirm-delete-car" data-id="${id}">Удалить</button><button class="btn secondary" data-action="close-modal">Оставить</button></div>`);}
 else if(a==='confirm-delete-car'){TQ.state.garage=TQ.state.garage.filter(x=>x!==id);if(TQ.state.activeCar===id)TQ.state.activeCar=TQ.state.garage[0]||null;TQ.save();TQ.render();TQ.toast('Автомобиль удалён. Его можно добавить снова.');}
 else if(a==='vin-example'){document.getElementById('vin-input').value=b.dataset.value;document.getElementById('vin-length').textContent='17 / 17';document.getElementById('vin-input').focus();}
 else if(a==='vin-save'||a==='vin-catalog'){TQ.saveVehicle(TQ.cars.find(c=>c.id===id));TQ.navigate(a==='vin-save'?'garage':'catalog');TQ.toast('Автомобиль сохранён');}
 else if(a==='load-more'){TQ.filters.limit+=6;TQ.updateListing();}
 else if(a==='reset-filters'){TQ.filters={brands:[],min:'',max:'',stock:false,days:'',axis:'',side:'',type:'',compatible:false,sort:'default',limit:6};document.querySelector('.filters').innerHTML=TQ.filtersMarkup();document.getElementById('sort').value='default';document.getElementById('only-compatible').checked=false;TQ.updateListing();}
 else if(a==='remove-filter'){TQ.removeChip(b);return;}
 else if(a==='remove-filter-now'){const key=b.dataset.key;if(key==='brand')TQ.filters.brands=TQ.filters.brands.filter(x=>x!==b.dataset.value);else if(key==='price'){TQ.filters.min='';TQ.filters.max='';}else TQ.filters[key]=['stock','compatible'].includes(key)?false:'';document.querySelector('.filters').innerHTML=TQ.filtersMarkup();document.getElementById('only-compatible').checked=TQ.filters.compatible;TQ.updateListing();}
 else if(a==='product-qty'){const span=document.getElementById('product-qty');span.textContent=Math.max(1,Math.min(99,Number(span.textContent)+Number(b.dataset.delta)));document.getElementById('product-line-total').textContent='Сумма: '+TQ.money(TQ.product(TQ.current.params.get('id')||1).price*Number(span.textContent));}
 else if(a==='product-tab'){document.querySelectorAll('[data-action="product-tab"]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-selected',x===b);});document.getElementById('product-tab-content').innerHTML=TQ.productTab(TQ.product(id),b.dataset.tab);}
 else if(a==='gallery')TQ.selectGallery(b);
 else if(a==='zoom')TQ.zoomGallery(TQ.product(id));
 else if(a==='copy-sku'){try{await navigator.clipboard.writeText(TQ.product(id).sku);TQ.toast('Артикул скопирован');}catch{TQ.modal('Артикул',`<label class="field">Выделите и скопируйте<input readonly value="${TQ.product(id).sku}"></label>`);document.querySelector('dialog input').select();}}
 else if(a==='request-stock'||a==='question')TQ.modal(a==='question'?'Вопрос о товаре':'Уточнить срок поставки',TQ.supportForm('contacts',TQ.product(id).sku));
 else if(a==='brand-letter'){TQ.brandLetter=b.dataset.letter;document.querySelectorAll('[data-action="brand-letter"]').forEach(x=>x.classList.toggle('active',x===b));document.getElementById('brand-results').innerHTML=TQ.brandResults(document.getElementById('brand-search').value,TQ.brandLetter);}
 else if(a==='reset-brands'){document.getElementById('brand-search').value='';TQ.brandLetter='';document.querySelector('[data-action="brand-letter"][data-letter=""]').click();}
 else if(a==='city')TQ.modal('Ваш город',`<p class="modal-copy">Город влияет на демонстрационные сроки получения.</p><div class="stack">${['Москва','Санкт-Петербург','Казань','Екатеринбург'].map(c=>`<button class="btn ${c===TQ.state.city?'':'secondary'}" data-action="set-city" data-city="${c}">${c}</button>`).join('')}</div>`);
 else if(a==='set-city'){TQ.state.city=b.dataset.city;TQ.save();TQ.closeModal();if(TQ.current.page==='checkout'){TQ.refreshHeader();document.querySelector('.checkout-form [data-action="city"]').textContent=TQ.state.city+' ⌄';TQ.checkoutDelivery();}else TQ.render();}
 else if(a==='fill-checkout'){const f=document.getElementById('checkout-form');f.elements.name.value='Демо Покупатель';f.elements.phone.value='+7 (000) 000-00-00';f.elements.email.value='demo@example.com';if(f.elements.address)f.elements.address.value='Тестовая улица, дом 1';if(f.elements.point)f.elements.point.value='demo-center';TQ.toast('Заполнены вымышленные данные');}
 else if(a==='confirm-checkout')TQ.submitCheckout(document.getElementById('checkout-form'),true);
 else if(a==='privacy')TQ.modal('Данные демонстрационного проекта','<p class="modal-copy">TORQ хранит гараж, корзину, избранное и демозаказы в localStorage этого браузера. Новые контакты профиля и обращения доступны только до перезагрузки вкладки. Ранее сохранённые данные не удаляются. Данные не отправляются на сервер. Для показа используйте вымышленные сведения. Очистить их можно через настройки данных сайта в браузере.</p>');
 else if(a==='messenger')TQ.modal('Мессенджер — демонстрация','<p class="modal-copy">Настоящий канал поддержки не подключён. Используйте форму ниже на странице: запрос останется в памяти до перезагрузки вкладки.</p><button class="btn" data-action="close-modal">Понятно</button>');
});
document.addEventListener('change',e=>{
 const el=e.target,vehicle=el.closest('.vehicle-form');if(vehicle){TQ.vehicleChange(vehicle,el.name);return;}
 if(el.closest('#filters')){if(el.name==='min'||el.name==='max')return;if(el.name==='brand')TQ.filters.brands=[...document.querySelectorAll('#filters [name=brand]:checked')].map(x=>x.value);else if(el.name==='stock')TQ.filters.stock=el.checked;else TQ.filters[el.name]=el.value;TQ.filters.limit=6;TQ.updateListing();}
 if(el.id==='sort'){TQ.filters.sort=el.value;TQ.updateListing();}
 if(el.id==='only-compatible'){TQ.filters.compatible=el.checked;TQ.updateListing();}
 if(el.id==='vin-modification')document.querySelectorAll('[data-action="vin-save"],[data-action="vin-catalog"]').forEach(b=>b.disabled=!el.value);
 if(el.name==='delivery'&&el.closest('#checkout-form'))TQ.checkoutDelivery();
 if(el.name==='other'&&el.closest('#checkout-form')){const fields=document.getElementById('recipient-fields');fields.hidden=!el.checked;fields.querySelectorAll('input').forEach(x=>{x.disabled=!el.checked;x.required=el.checked;});}
 if(el.name==='subject'&&el.closest('.support-form'))el.closest('form').querySelector('.order-reference').hidden=!/заказ|Гарантий|Возврат/.test(el.value);
});
document.addEventListener('input',e=>{
 if(e.target.id==='global-query'){const q=e.target.value.trim(),s=document.getElementById('suggestions');s.hidden=!q;if(q){const matches=TQ.searchProducts(q).slice(0,4);s.innerHTML=matches.map(p=>`<a href="#/product?id=${p.id}"><img src="assets/products/${p.image}.webp" alt=""><span><strong>${p.brand} · ${p.name}</strong><span class="muted">${p.sku} · ${TQ.money(p.price)}</span></span></a>`).join('')+`<a class="link" href="${TQ.route('search',{q})}">${matches.length?'Все результаты':'Поискать в каталоге'} →</a>`;}}
 if(e.target.id==='vin-input'){e.target.value=e.target.value.toUpperCase();document.getElementById('vin-length').textContent=e.target.value.length+' / 17';document.getElementById('vin-error').hidden=true;}
 if(e.target.id==='brand-search')document.getElementById('brand-results').innerHTML=TQ.brandResults(e.target.value,TQ.brandLetter||'');
});
document.addEventListener('submit',e=>{
 const f=e.target;e.preventDefault();
 if(f.id==='global-search'){const q=f.querySelector('input').value.trim();if(!q){f.querySelector('input').focus();return;}TQ.state.search=q;TQ.save();TQ.navigate('search',{q});}
 else if(f.dataset.form==='search'){const q=f.elements.q.value.trim();if(!q)return;TQ.state.search=q;TQ.save();const mode=TQ.current.params.get('mode')||'oem';TQ.navigate('search',{mode,q});}
 else if(f.dataset.form==='vehicle')TQ.submitVehicle(f);
 else if(f.dataset.form==='vin')TQ.submitVIN(f);
 else if(f.id==='filters'){const min=f.elements.min.value,max=f.elements.max.value;if(min!==''&&max!==''&&Number(min)>Number(max)){document.getElementById('price-error').textContent='Минимальная цена выше максимальной.';document.getElementById('price-error').hidden=false;return;}document.getElementById('price-error').hidden=true;TQ.filters.min=min;TQ.filters.max=max;TQ.filters.limit=6;TQ.updateListing();}
 else if(f.dataset.form==='promo'){if(f.elements.promo.value.trim().toUpperCase()==='TORQ5'){TQ.state.promo=true;TQ.save();TQ.render();TQ.toast('Скидка 5% применена');}else document.getElementById('promo-status').textContent='Промокод не найден. Попробуйте TORQ5.';}
 else if(f.id==='checkout-form')TQ.submitCheckout(f);
 else if(f.dataset.form==='support')TQ.supportSuccess(f);
 else if(f.dataset.form==='profile'){TQ.state.profile={name:f.elements.name.value.trim(),email:f.elements.email.value.trim()};TQ.save();TQ.toast('Пример сохранён до перезагрузки вкладки');}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){TQ.closeMenu();const s=document.getElementById('suggestions');if(s)s.hidden=true;}});
document.getElementById('modal').addEventListener('click',e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)TQ.dismissModal();}});
window.addEventListener('hashchange',()=>{TQ.brandLetter='';TQ.render(true);});
window.addEventListener('storage',e=>{if(e.key===TQ.storageKey){TQ.state=TQ.load();if(TQ.current.page==='checkout')TQ.refreshHeader();else TQ.render();}});
TQ.render();
