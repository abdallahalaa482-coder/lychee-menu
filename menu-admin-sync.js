(() => {
  const PRODUCTS_KEY='smash-burger-products';
  const CART_KEY='smash-burger-cart';
  const products=JSON.parse(localStorage.getItem(PRODUCTS_KEY)||'[]');
  if(!products.length)return;

  const categoryMap={برجر:'smash',وجبات:'regular',جانبية:'fries',بيتزا:'pizza',كريب:'regular'};
  const money=value=>`${value} جنيه`;
  const readCart=()=>JSON.parse(localStorage.getItem(CART_KEY)||'[]');
  const saveCart=cart=>localStorage.setItem(CART_KEY,JSON.stringify(cart));
  const escape=value=>String(value||'').replace(/[&<>"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char]));

  function updateCount(){const count=readCart().reduce((sum,item)=>sum+item.quantity,0);document.querySelectorAll('.cart-count').forEach(el=>el.textContent=count);document.querySelector('.view-cart')?.classList.toggle('show',count>0)}
  function showToast(){const toast=document.querySelector('.toast');toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2200)}
  function close(){document.querySelector('.sheet-overlay').classList.remove('open');document.querySelector('.product-sheet').classList.remove('open')}
  function openProduct(item){
    const sizes=item.sizes?.length?item.sizes:[{name:'الحجم العادي',price:item.price}];
    const addons=item.addons||[];let size=sizes[0],quantity=1,chosen=[];
    const draw=()=>{const unit=Number(size.price)+chosen.reduce((sum,addon)=>sum+Number(addon.price),0);document.querySelector('.sheet-content').innerHTML=`<div class="sheet-product"><img src="${escape(item.image)}" alt="${escape(item.name)}"><div><h2>${escape(item.name)}</h2><p>${escape(item.description||'وجبة محضرة طازجة.')}</p></div></div><div class="sheet-block"><h3>اختر الحجم</h3><div class="choice-grid">${sizes.map((entry,index)=>`<button class="choice ${entry===size?'selected':''}" data-managed-size="${index}">${escape(entry.name)} · ${money(entry.price)}</button>`).join('')}</div></div><div class="sheet-block"><h3>إضافات اختيارية</h3>${addons.map((entry,index)=>`<div class="addon"><label><input type="checkbox" data-managed-addon="${index}" ${chosen.includes(entry)?'checked':''}> ${escape(entry.name)}</label><b>+${money(entry.price)}</b></div>`).join('')}</div><div class="sheet-footer"><div class="qty-control"><button data-managed-qty="plus">+</button><span>${quantity}</span><button data-managed-qty="minus">−</button></div><button class="add-order" id="managed-add">أضف للطلب · ${money(unit*quantity)}</button></div>`;
      document.querySelectorAll('[data-managed-size]').forEach(button=>button.onclick=()=>{size=sizes[Number(button.dataset.managedSize)];draw()});
      document.querySelectorAll('[data-managed-addon]').forEach(box=>box.onchange=()=>{const addon=addons[Number(box.dataset.managedAddon)];chosen=box.checked?[...chosen,addon]:chosen.filter(entry=>entry!==addon);draw()});
      document.querySelectorAll('[data-managed-qty]').forEach(button=>button.onclick=()=>{quantity=button.dataset.managedQty==='plus'?quantity+1:Math.max(1,quantity-1);draw()});
      document.querySelector('#managed-add').onclick=()=>{const cart=readCart(),id=`managed-${item.id}-${size.name}-${chosen.map(addon=>addon.name).join('-')}`,existing=cart.find(entry=>entry.id===id),entry={id,name:item.name,image:item.image,size:size.name,addons:chosen,unitPrice:unit,quantity};existing?existing.quantity+=quantity:cart.push(entry);saveCart(cart);updateCount();close();showToast()};
    };draw();document.querySelector('.sheet-overlay').classList.add('open');document.querySelector('.product-sheet').classList.add('open');
  }
  products.forEach(item=>{document.querySelectorAll('.card:not(.managed-card) h3').forEach(title=>{if(title.textContent.trim()===item.name)title.closest('.card')?.remove()});const section=document.querySelector(`.section[data-section="${categoryMap[item.category]||'regular'}"]`);const grid=section?.querySelector('.grid');if(!grid)return;const card=document.createElement('article');card.className='card managed-card';card.dataset.search=`${item.name} ${item.description||''}`;card.innerHTML=`<img class="card-img" src="${escape(item.image)}" alt="${escape(item.name)}"><div class="card-body"><div class="name"><div><h3>${escape(item.name)}</h3><span class="en">${escape(item.category)}</span></div><span class="price">${escape(item.price)}</span></div><p class="desc">${escape(item.description||'وجبة مضافة من إدارة المنيو.')}</p><div class="card-actions"><span class="product-price">${money(item.price)}</span><span><button class="favorite" aria-label="مفضلة">♡</button><button class="add-product" aria-label="إضافة">+</button></span></div></div>`;card.querySelector('.favorite').onclick=event=>{event.currentTarget.classList.toggle('is-favorite');event.currentTarget.textContent=event.currentTarget.classList.contains('is-favorite')?'♥':'♡'};card.querySelector('.add-product').onclick=()=>openProduct(item);grid.prepend(card)});
  document.querySelector('#search')?.addEventListener('input',event=>document.querySelectorAll('.managed-card').forEach(card=>card.style.display=card.dataset.search.toLowerCase().includes(event.target.value.trim().toLowerCase())?'block':'none'));
  updateCount();
})();
