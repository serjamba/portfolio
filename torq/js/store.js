TQ.storageKey='torq-demo-v1';
TQ.defaults=()=>({cart:[],favorites:[],garage:[],activeCar:null,viewed:[],orders:[],requests:[],city:'Москва',search:'',promo:false});
TQ.load=()=>{try{const v=JSON.parse(localStorage.getItem(TQ.storageKey));if(!v||typeof v!=='object')return TQ.defaults();const s={...TQ.defaults(),...v};s.cart=Array.isArray(s.cart)?s.cart.filter(x=>TQ.product(x.id)&&Number.isInteger(x.qty)&&x.qty>0).map(x=>({id:x.id,qty:Math.min(x.qty,99)})):[];for(const key of ['favorites','viewed'])s[key]=Array.isArray(s[key])?s[key].filter(id=>TQ.product(id)):[];s.garage=Array.isArray(s.garage)?s.garage.filter(id=>TQ.cars.some(c=>c.id===id)):[];if(!s.garage.includes(s.activeCar))s.activeCar=null;for(const key of ['orders','requests'])if(!Array.isArray(s[key]))s[key]=[];s.city=['Москва','Санкт-Петербург','Казань','Екатеринбург'].includes(s.city)?s.city:'Москва';return s;}catch{return TQ.defaults();}};
TQ.state=TQ.load();
// Preserve existing private legacy fields, but do not persist new form input.
TQ.legacyPrivate={profile:TQ.state.profile,requests:structuredClone(TQ.state.requests)};
TQ.save=()=>{try{localStorage.setItem(TQ.storageKey,JSON.stringify({...TQ.state,profile:TQ.legacyPrivate.profile,requests:TQ.legacyPrivate.requests}));}catch{if(!TQ.storageWarned){TQ.storageWarned=true;TQ.toast?.('Браузер ограничил сохранение. Данные доступны до закрытия страницы.');}}};
TQ.car=()=>TQ.cars.find(c=>c.id===TQ.state.activeCar);
TQ.compat=p=>!TQ.car()?'unknown':!p.cars?'check':p.cars.includes(TQ.car().id)?'match':'mismatch';
TQ.cartCount=()=>TQ.state.cart.reduce((n,x)=>n+x.qty,0);
TQ.subtotal=()=>TQ.state.cart.reduce((n,x)=>n+TQ.product(x.id).price*x.qty,0);
TQ.discount=()=>TQ.state.promo?Math.round(TQ.subtotal()*.05):0;
TQ.total=(delivery=0)=>TQ.subtotal()-TQ.discount()+delivery;
TQ.moneyFormatter=new Intl.NumberFormat('ru-RU');
TQ.money=n=>TQ.moneyFormatter.format(n)+' ₽';
TQ.esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
TQ.route=(path,params={})=>'#/'+path+(Object.keys(params).length?'?'+new URLSearchParams(params).toString():'');
TQ.navigate=(path,params={})=>{const hash=TQ.route(path,params);if(location.hash===hash)TQ.render();else location.hash=hash;};
TQ.toggleFavorite=id=>{id=Number(id);TQ.state.favorites=TQ.state.favorites.includes(id)?TQ.state.favorites.filter(x=>x!==id):[...TQ.state.favorites,id];TQ.save();TQ.refreshHeader();document.querySelectorAll(`[data-action="favorite"][data-id="${id}"]`).forEach(b=>{b.classList.toggle('active',TQ.state.favorites.includes(id));b.setAttribute('aria-pressed',TQ.state.favorites.includes(id));});if(TQ.current?.page==='garage'&&TQ.current.params.get('tab')==='favorites')TQ.render();};
