const CART_KEY='smash-burger-cart';
const cartContent=document.querySelector('#cart-content');
const cart=()=>JSON.parse(localStorage.getItem(CART_KEY)||'[]');
const save=items=>localStorage.setItem(CART_KEY,JSON.stringify(items));
const money=value=>`${value} EGP`;

function cartMessage(items,total){
  return 'طلب جديد من SMASH Menu\n\n'+items.map(item=>[
    `- ${item.name}`,
    `  الحجم: ${item.size}`,
    `  الإضافات: ${item.addons.length?item.addons.map(addon=>addon.name).join('، '):'لا يوجد'}`,
    `  الكمية: ${item.quantity}`,
    `  الإجمالي: ${money(item.unitPrice*item.quantity)}`
  ].join('\n')).join('\n\n')+`\n\nإجمالي الطلب: ${money(total)}`;
}

function render(){
  const items=cart();
  document.querySelector('#clear-cart').hidden=!items.length;
  if(!items.length){
    cartContent.className='empty-state';
    cartContent.innerHTML='<div class="empty-icon">🛍</div><h2>سلتك فارغة حاليًا</h2><p>قم بطلب وجبتك المفضلة واستمتع بخصومات المنيو المميزة اليومية</p><a class="browse-menu" href="index.html">تصفح المنيو</a>';
    return;
  }
  const subtotal=items.reduce((sum,item)=>sum+item.unitPrice*item.quantity,0);
  cartContent.className='cart-content';
  cartContent.innerHTML=`<div class="cart-items">${items.map((item,index)=>`<article class="cart-row"><img src="${item.image}" alt="${item.name}"><div class="cart-info"><h2>${item.name}</h2><p>${item.quantity} قطع${item.size?' · '+item.size:''}</p></div><b class="cart-price">${money(item.unitPrice*item.quantity)}</b><div class="qty-control"><button data-action="minus" data-index="${index}" aria-label="تقليل الكمية">-</button><span>${item.quantity}</span><button data-action="plus" data-index="${index}" aria-label="زيادة الكمية">+</button></div><button class="remove" data-action="remove" data-index="${index}" aria-label="حذف المنتج">×</button></article>`).join('')}</div><section class="cart-summary"><div class="summary-line"><span>المجموع الفرعي</span><span>${money(subtotal)}</span></div><div class="summary-line"><span>رسوم التوصيل</span><span>تتغير حسب المنطقة</span></div><div class="summary-total"><span>الإجمالي</span><strong>${money(subtotal)}</strong></div><a class="checkout" href="#" id="checkout">أرسل الطلب عبر واتساب (${money(subtotal)})</a></section>`;
  document.querySelectorAll('[data-action]').forEach(button=>button.onclick=()=>{
    const updated=cart();
    const index=Number(button.dataset.index);
    if(button.dataset.action==='plus')updated[index].quantity++;
    if(button.dataset.action==='minus')updated[index].quantity>1?updated[index].quantity--:updated.splice(index,1);
    if(button.dataset.action==='remove')updated.splice(index,1);
    save(updated);render();
  });
  document.querySelector('#checkout').onclick=event=>{
    event.preventDefault();
    location.href=`https://wa.me/201080678293?text=${encodeURIComponent(cartMessage(items,subtotal))}`;
  };
}

document.querySelector('#clear-cart').onclick=()=>{save([]);render()};
render();
