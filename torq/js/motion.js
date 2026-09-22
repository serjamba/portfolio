/* Small, cancellable UI effects. State changes are synchronous; animation never gates input. */
TQ.motionQuery=matchMedia('(prefers-reduced-motion: reduce)');
TQ.effect=(node,keyframes,duration=220)=>{
 if(!node||TQ.motionQuery.matches||TQ.diagnostics?.domMotion===false||!node.animate)return null;
 return node.animate(keyframes,{duration,easing:'cubic-bezier(.2,.65,.3,1)'});
};
// A suspended compositor must not postpone completion of a stateful UI action.
TQ.afterEffect=(effect,callback,duration)=>{
 if(!effect){callback();return;}let done=false;
 const finish=()=>{if(done)return;done=true;clearTimeout(timer);callback();};
 const timer=setTimeout(finish,duration+30);
 effect.finished.then(finish,()=>{done=true;clearTimeout(timer);});
};
TQ.moneyMotion=(node,amount)=>{
 if(!node)return;const next=TQ.money(amount);if(node.textContent===next)return;
 node.getAnimations().forEach(a=>a.cancel());node.textContent=next;
 TQ.effect(node,[{opacity:.45,transform:'translateY(2px)'},{opacity:1,transform:'translateY(0)'}],180);
};
TQ.updateBadge=(link,count)=>{
 let badge=link.querySelector('.badge');if(!count){badge?.remove();return;}
 if(!badge){badge=document.createElement('b');badge.className='badge';link.append(badge);}
 const changed=badge.textContent!==String(count);badge.textContent=count;
 if(changed)TQ.effect(badge,[{opacity:.5,transform:'scale(.9)'},{opacity:1,transform:'scale(1)'}],180);
};
TQ.cartFeedback=b=>{
 clearTimeout(b.feedbackTimer);b.classList.add('added');b.textContent='Добавлено ✓';
 b.setAttribute('aria-label','Товар добавлен. Добавить ещё одну позицию');
 TQ.effect(b,[{boxShadow:'0 0 0 3px #2f6bff25'},{boxShadow:'0 0 0 0px #2f6bff00'}],280);
 b.feedbackTimer=setTimeout(()=>{if(b.isConnected){b.textContent='В корзине · ещё';b.setAttribute('aria-label','В корзине. Добавить ещё');}},1200);
 const cart=document.querySelector('.header-action.cart');TQ.effect(cart,[{background:'#eef3ff'},{background:'transparent'}],280);
};
TQ.favoriteFeedback=b=>TQ.effect(b.querySelector('.icon'),[{transform:'scale(1)'},{transform:'scale(1.15)',offset:.4},{transform:'scale(1)'}],200);
TQ.updateCartTotals=()=>{
 TQ.refreshHeader();const count=document.getElementById('summary-count');if(count)count.textContent='Товары · '+TQ.cartCount()+' шт.';
 const title=document.querySelector('.page-title .count');if(title)title.textContent=TQ.cartCount()+' шт.';
 TQ.moneyMotion(document.getElementById('summary-subtotal'),TQ.subtotal());TQ.moneyMotion(document.getElementById('summary-total'),TQ.total());
 const discount=document.getElementById('summary-discount');if(discount){discount.textContent=(TQ.discount()?'- ':'')+TQ.money(TQ.discount());}
 const warning=document.querySelector('.order-layout>section>.notice');if(warning)warning.hidden=!TQ.state.cart.some(x=>TQ.compat(TQ.product(x.id))!=='match');
};
TQ.collapseRow=(line,done)=>{
 if(!line||TQ.motionQuery.matches){done();return;}
 line.style.pointerEvents='none';line.querySelectorAll('button').forEach(b=>b.disabled=true);
 const effect=TQ.effect(line,[{height:line.getBoundingClientRect().height+'px',opacity:1,paddingTop:'26px',paddingBottom:'26px'},{height:0,opacity:0,paddingTop:0,paddingBottom:0}],220);
 line.style.overflow='hidden';TQ.afterEffect(effect,done,220);
};
TQ.removeChip=b=>{
 const chip=b.closest('.chip'),stamp=TQ.renderStamp,apply=()=>{if(!b.isConnected||stamp!==TQ.renderStamp)return;b.dataset.action='remove-filter-now';b.click();};
 if(chip?.dataset.removing)return;if(chip)chip.dataset.removing='true';
 const effect=TQ.effect(chip,[{opacity:1,transform:'scale(1)'},{opacity:0,transform:'scale(.96)'}],120);
 TQ.afterEffect(effect,apply,120);
};
TQ.dismissModal=()=>{
 const d=document.getElementById('modal');if(!d.open||d.classList.contains('closing'))return;
 if(TQ.motionQuery.matches){TQ.closeModal();return;}d.classList.add('closing');
 const effect=TQ.effect(d,[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(10px)'}],180);
 TQ.afterEffect(effect,TQ.closeModal,180);
};
document.getElementById('modal').addEventListener('cancel',e=>{e.preventDefault();TQ.dismissModal();});
// Native details retains keyboard semantics. Height is measured, including padding.
document.addEventListener('click',e=>{
 const summary=e.target.closest('summary');if(!summary||!summary.closest('.filters,.faq,.promo,.search-form'))return;
 if(TQ.motionQuery.matches)return;e.preventDefault();const details=summary.parentElement;
 const start=details.getBoundingClientRect().height,wasOpen=details.dataset.animating?details.dataset.target==='open':details.open;
 details._motion?.cancel();details.style.height='';details.style.overflow='hidden';
 details.open=!wasOpen;const end=details.getBoundingClientRect().height;details.open=true;
 details.dataset.animating='true';details.dataset.target=wasOpen?'closed':'open';
 const animation=details.animate([{height:start+'px'},{height:end+'px'}],{duration:220,easing:'cubic-bezier(.2,.65,.3,1)'});
 details._motion=animation;
 TQ.afterEffect(animation,()=>{details.open=!wasOpen;details.style.overflow='';delete details.dataset.animating;delete details.dataset.target;},220);
});
TQ.motionPage=()=>{
 TQ.revealObserver?.disconnect();
 if(TQ.motionQuery.matches||TQ.current.page!=='home')return;
 TQ.revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting)return;entry.target.classList.add('revealed');TQ.effect(entry.target,[{opacity:.4,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],480);TQ.revealObserver.unobserve(entry.target);
 }),{threshold:.08});
 // Product cards and shopping forms never wait for a reveal.
 document.querySelectorAll('.home-content>.section').forEach((section,index)=>{
  if(index<2)return;
  section.classList.add('reveal-section');TQ.revealObserver.observe(section);
 });
};
TQ.motionQuery.addEventListener('change',()=>{
 if(TQ.motionQuery.matches){document.getAnimations().forEach(a=>{try{if(a.effect.getComputedTiming().iterations===Infinity)a.cancel();else a.finish();}catch{a.cancel();}});document.querySelectorAll('.reveal-section').forEach(n=>n.classList.add('revealed'));TQ.revealObserver?.disconnect();if(document.querySelector('dialog.closing'))TQ.closeModal();}
});
