const CART_KEY = 'smash-burger-cart';
const money = v => `${v} جنيه`;
const readCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '[]');
const saveCart = x => localStorage.setItem(CART_KEY, JSON.stringify(x));

function updateCartCount() {
  let count = readCart().reduce((s, i) => s + i.quantity, 0);
  document.querySelectorAll('.cart-count').forEach(x => {
    x.textContent = count;
    x.style.display = count > 0 ? 'flex' : 'none';
  });
  document.querySelector('.view-cart')?.classList.toggle('show', count > 0);
}

function closeSheet() {
  document.querySelector('.sheet-overlay')?.classList.remove('open');
  document.querySelector('.product-sheet')?.classList.remove('open');
}

function toast() {
  let x = document.querySelector('.toast');
  if (!x) return;
  x.classList.add('show');
  setTimeout(() => x.classList.remove('show'), 2200);
}

// Ensure elements exist
if (!document.querySelector('.open-cart')) {
  document.querySelector('.search')?.insertAdjacentHTML('beforeend', `
    <button class="icon-button open-cart" type="button" aria-label="سلة التسوق">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f76502" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
      <b class="cart-count">0</b>
    </button>
  `);
}

if (!document.querySelector('.product-sheet')) {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="sheet-overlay"></div>
    <section class="product-sheet" aria-modal="true" role="dialog">
      <div class="sheet-inner">
        <div class="sheet-handle"></div>
        <div class="sheet-content"></div>
      </div>
    </section>
    <div class="toast">تمت الإضافة إلى السلة</div>
    <button type="button" class="view-cart open-cart">
      <span>عرض السلة</span>
      <b class="cart-count">0</b>
    </button>
    <section class="cart-overlay" aria-hidden="true">
      <main class="cart-page">
        <header class="cart-header">
          <button class="back-button close-cart" type="button" aria-label="العودة للمنيو">›</button>
          <h1>سلة الطلبات</h1>
          <button id="clear-cart" class="clear-cart" type="button">مسح الكل</button>
        </header>
        <section id="cart-content" class="cart-content"></section>
      </main>
    </section>
  `);
}

let product, size, quantity, addons;

function renderSheet() {
  let p = product;
  if (!p) return;
  let unit = size.price + addons.reduce((s, a) => s + a.price, 0);
  let total = unit * quantity;

  let hasSizes = p.sizes && p.sizes.length > 1;
  let hasAddons = p.addons && p.addons.length > 0;

  let html = `
    ${p.image ? `<div class="sheet-product-banner"><img src="${p.image}" alt="${p.name}"></div>` : ''}
    <div class="sheet-product-info">
      <h2>${p.name}</h2>
      <p>${p.description || 'وجبة محضرة بطعم ليتشي المميز وبأعلى جودة.'}</p>
    </div>
  `;

  if (hasSizes) {
    html += `
      <div class="sheet-block">
        <h3>اختر الحجم</h3>
        <div class="sheet-options-list">
          ${p.sizes.map((s, i) => `
            <div class="sheet-option-card ${size === s ? 'selected' : ''}" data-size="${i}">
              <div class="option-info">
                <span class="option-name">${s.name}</span>
                <span class="option-price">${money(s.price)}</span>
              </div>
              <div class="radio-indicator">
                <span class="radio-dot"></span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (hasAddons) {
    html += `
      <div class="sheet-block">
        <h3>إضافات اختيارية</h3>
        <div class="sheet-options-list">
          ${p.addons.map((a, i) => {
            let isSelected = addons.includes(a);
            return `
              <div class="sheet-option-card ${isSelected ? 'selected' : ''}" data-addon="${i}">
                <div class="option-info">
                  <span class="option-name">${a.name}</span>
                  <span class="option-price">+${money(a.price)}</span>
                </div>
                <div class="radio-indicator">
                  <span class="radio-dot"></span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // Quantity row and bottom action button - matching Image 2
  html += `
    <div class="sheet-qty-row">
      <span class="qty-label">الكمية</span>
      <div class="qty-stepper">
        <button type="button" class="qty-circle-btn minus" data-qty="minus" aria-label="تقليل الكمية">−</button>
        <span class="qty-value">${quantity}</span>
        <button type="button" class="qty-circle-btn plus" data-qty="plus" aria-label="زيادة الكمية">+</button>
      </div>
    </div>
    <button type="button" class="sheet-submit-btn add-order">
      <span class="submit-price">${money(total)}</span>
      <span class="submit-action">أضف الي السله</span>
    </button>
  `;

  document.querySelector('.sheet-content').innerHTML = html;

  // Bind size selection
  document.querySelectorAll('[data-size]').forEach(b => {
    b.onclick = () => {
      size = p.sizes[+b.dataset.size];
      renderSheet();
    };
  });

  // Bind addon toggle
  document.querySelectorAll('[data-addon]').forEach(b => {
    b.onclick = () => {
      let a = p.addons[+b.dataset.addon];
      addons = addons.includes(a) ? addons.filter(x => x !== a) : [...addons, a];
      renderSheet();
    };
  });

  // Bind quantity buttons
  document.querySelectorAll('[data-qty]').forEach(b => {
    b.onclick = () => {
      quantity = b.dataset.qty === 'plus' ? quantity + 1 : Math.max(1, quantity - 1);
      renderSheet();
    };
  });

  // Bind add to cart order button
  document.querySelector('.add-order').onclick = () => {
    let item = {
      id: `${p.name}-${size.name}-${addons.map(a => a.name).join('-')}`,
      name: p.name,
      image: p.image,
      size: size.name,
      addons,
      unitPrice: unit,
      quantity
    };
    let cart = readCart();
    let old = cart.find(x => x.id === item.id);
    if (old) {
      old.quantity += quantity;
    } else {
      cart.push(item);
    }
    saveCart(cart);
    updateCartCount();
    closeSheet();
    toast();
  };
}

// Bind cards - matching Image 1
function initCards() {
  document.querySelectorAll('.card:not(.managed-card)').forEach(card => {
    let name = card.querySelector('h3')?.textContent.trim();
    if (!name) return;

    let base = Number((card.querySelector('.price,.pill b')?.textContent || '0').replace(/\D/g, ''));
    let pills = [...card.querySelectorAll('.pill')];
    let sizes = pills.length
      ? pills.map(x => ({ name: x.textContent.replace(/[0-9]/g, '').trim(), price: Number(x.querySelector('b').textContent) }))
      : [{ name: 'الحجم العادي', price: base }];

    let p = {
      name,
      image: card.querySelector('img')?.src || '',
      description: card.querySelector('.desc')?.textContent.trim() || '',
      sizes,
      addons: [
        { name: 'إضافة كومبو (بطاطس + كانز)', price: 30 },
        { name: 'جبنة إضافية', price: 15 },
        { name: 'صوص ليتشي', price: 10 }
      ]
    };

    let body = card.querySelector('.card-body');
    if (!body) return;

    // Remove any previous actions
    body.querySelector('.card-actions')?.remove();
    body.querySelector('.add-to-cart-btn')?.remove();

    // Inject Image 1 style button
    body.insertAdjacentHTML('beforeend', `<button class="add-to-cart-btn" type="button">أضف إلى السلة</button>`);

    const openModal = (e) => {
      e?.stopPropagation();
      product = p;
      size = p.sizes[0];
      quantity = 1;
      addons = [];
      renderSheet();
      document.querySelector('.sheet-overlay')?.classList.add('open');
      document.querySelector('.product-sheet')?.classList.add('open');
    };

    body.querySelector('.add-to-cart-btn').onclick = openModal;
    card.onclick = openModal;
  });
}

function cartMessage(items, total) {
  return 'طلب جديد من LYCHEE FOOD AND MORE\n\n' +
    items.map(item => [
      `- ${item.name}`,
      `  الحجم: ${item.size}`,
      `  الإضافات: ${item.addons.length ? item.addons.map(addon => addon.name).join('، ') : 'لا يوجد'}`,
      `  الكمية: ${item.quantity}`,
      `  الإجمالي: ${money(item.unitPrice * item.quantity)}`
    ].join('\n')).join('\n\n') +
    `\n\nإجمالي الطلب: ${money(total)}`;
}

function renderCart() {
  const cartContent = document.querySelector('#cart-content');
  const items = readCart();
  const clearBtn = document.querySelector('#clear-cart');
  if (clearBtn) clearBtn.hidden = !items.length;

  if (!items.length) {
    cartContent.className = 'empty-state';
    cartContent.innerHTML = `
      <div class="empty-icon">🛍</div>
      <h2>سلتك فارغة حاليًا</h2>
      <p>أضف وجبتك المفضلة من المنيو للبدء في الطلب.</p>
      <button class="browse-menu close-cart" type="button">تصفح المنيو</button>
    `;
    cartContent.querySelector('.close-cart').onclick = closeCart;
    return;
  }

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  cartContent.className = 'cart-content';
  cartContent.innerHTML = `
    <div class="cart-items">
      ${items.map((item, index) => `
        <article class="cart-row">
          <img src="${item.image}" alt="${item.name}">
          <div class="cart-info">
            <h2>${item.name}</h2>
            <p>${item.quantity} قطع${item.size ? ' · ' + item.size : ''}</p>
          </div>
          <b class="cart-price">${money(item.unitPrice * item.quantity)}</b>
          <div class="qty-control">
            <button data-action="minus" data-index="${index}" aria-label="تقليل الكمية">-</button>
            <span>${item.quantity}</span>
            <button data-action="plus" data-index="${index}" aria-label="زيادة الكمية">+</button>
          </div>
          <button class="remove" data-action="remove" data-index="${index}" aria-label="حذف المنتج">×</button>
        </article>
      `).join('')}
    </div>
    <section class="cart-summary">
      <h2 class="cart-summary-title">ملخص الطلب</h2>
      <div class="summary-line"><span>المجموع الفرعي</span><span>${money(subtotal)}</span></div>
      <div class="summary-line"><span>رسوم التوصيل</span><span>تتغير حسب المنطقة</span></div>
      <div class="summary-total"><span>الإجمالي</span><strong>${money(subtotal)}</strong></div>
      <button class="checkout" type="button" id="checkout"><span>إتمام الطلب عبر واتساب</span><strong>${money(subtotal)} ←</strong></button>
    </section>
  `;

  cartContent.querySelectorAll('[data-action]').forEach(button => {
    button.onclick = () => {
      const updated = readCart();
      const index = Number(button.dataset.index);
      if (button.dataset.action === 'plus') updated[index].quantity++;
      if (button.dataset.action === 'minus') {
        updated[index].quantity > 1 ? updated[index].quantity-- : updated.splice(index, 1);
      }
      if (button.dataset.action === 'remove') updated.splice(index, 1);
      saveCart(updated);
      updateCartCount();
      renderCart();
    };
  });

  document.querySelector('#checkout').onclick = () => {
    location.href = `https://wa.me/201080678293?text=${encodeURIComponent(cartMessage(items, subtotal))}`;
  };
}

function openCart() {
  closeSheet();
  renderCart();
  const overlay = document.querySelector('.cart-overlay');
  if (overlay) {
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
  }
  document.body.classList.add('cart-open');
  history.replaceState(null, '', '#cart');
}

function closeCart() {
  const overlay = document.querySelector('.cart-overlay');
  if (overlay) {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
  }
  document.body.classList.remove('cart-open');
  history.replaceState(null, '', location.pathname + location.search);
}

document.querySelectorAll('.open-cart').forEach(button => button.onclick = openCart);
document.querySelectorAll('.close-cart').forEach(button => button.onclick = closeCart);
document.querySelector('#clear-cart')?.addEventListener('click', () => {
  saveCart([]);
  updateCartCount();
  renderCart();
});
document.querySelector('.sheet-overlay')?.addEventListener('click', closeSheet);

window.addEventListener('hashchange', () => {
  if (location.hash === '#cart') openCart();
  else closeCart();
});

if (location.hash === '#cart') openCart();
updateCartCount();
initCards();
