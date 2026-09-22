/* Distinct side view and packaging; macro view intentionally crops the main photograph. */
TQ.galleryViews=p=>[
 {key:'main',label:'Основной вид',src:`assets/products/${p.image}.webp`},
 {key:'side',label:'Обратный ракурс',src:`assets/products/${p.image}-side.webp`},
 {key:'detail',label:'Крупный план',src:`assets/products/${p.image}.webp`},
 {key:'pack',label:'Упаковка',src:'assets/products/packaging.webp'}
];
TQ.gallery=p=>`<section class="gallery"><button class="main-product-image" data-action="zoom" data-id="${p.id}" aria-label="Увеличить изображение ${p.name}"><img id="gallery-image" src="assets/products/${p.image}.webp" alt="${p.name} — основной вид"><span>+ Увеличить</span></button><div class="gallery-thumbs" aria-label="Ракурсы товара">${TQ.galleryViews(p).map((v,i)=>`<button class="${i===0?'active':''} ${v.key==='detail'?'macro-thumb':''}" data-action="gallery" data-id="${p.id}" data-view="${v.key}" aria-label="${v.label}" aria-pressed="${i===0}"><img src="${v.src}" alt="${v.label}" loading="lazy"></button>`).join('')}<span id="gallery-caption" aria-live="polite">Основной вид<br>1 / 4</span></div></section>`;
TQ.selectGallery=b=>{
 const views=TQ.galleryViews(TQ.product(b.dataset.id)),v=views.find(v=>v.key===b.dataset.view);
 const main=document.querySelector('.main-product-image'),img=main.querySelector('img');
 img.src=v.src;img.alt=v.label;main.classList.toggle('detail',v.key==='detail');
 document.querySelectorAll('[data-action="gallery"]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});
 document.getElementById('gallery-caption').innerHTML=v.label+'<br>'+(views.indexOf(v)+1)+' / 4';
};
TQ.zoomGallery=p=>{
 const img=document.getElementById('gallery-image'),detail=document.querySelector('.main-product-image').classList.contains('detail');
 TQ.modal(p.name,`<div class="gallery-zoom ${detail?'macro':''}"><img src="${img.src}" alt="${img.alt}"></div>`);
};
