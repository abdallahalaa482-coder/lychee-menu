(() => {
  const PRODUCTS_KEY = 'smash-burger-products';
  const CART_KEY = 'smash-burger-cart';
  const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');

  const categoryMap = {
    'Mix Crepe': 'mix',
    'Regular Crepe': 'regular',
    'Smash Burger': 'smash',
    'Fries Box': 'box',
    'Fries': 'fries',
    'Sandwich': 'sandwich',
    'Chicken Sandwich': 'chicken-sandwich',
    'Pizza Roll': 'pizza-roll',
    'Pizza': 'pizza',
    'Sauce & Extra': 'extra',
    // Backward compatibility
    'كريب': 'mix',
    'ميكس كريب': 'mix',
    'كريب عادي': 'regular',
    'برجر': 'smash',
    'سماش برجر': 'smash',
    'وجبات': 'regular',
    'جانبية': 'fries',
    'بطاطس': 'fries',
    'فرايز': 'fries',
    'ساندوتش': 'sandwich',
    'ساندوتشات': 'sandwich',
    'تشيكن ساندوتش': 'chicken-sandwich',
    'بيتزا رول': 'pizza-roll',
    'بيتزا': 'pizza',
    'إضافات': 'extra',
    'إضافات وصوصات': 'extra'
  };

  const money = value => `${value} جنيه`;
  const readCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  const saveCart = cart => localStorage.setItem(CART_KEY, JSON.stringify(cart));
  const escape = value => String(value || '').replace(/[&<>"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));

  function updateCount() {
    const count = readCart().reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
    document.querySelector('.view-cart')?.classList.toggle('show', count > 0);
  }

  function showToast() {
    const toast = document.querySelector('.toast');
    if (!toast) return;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
  }

  function close() {
    document.querySelector('.sheet-overlay')?.classList.remove('open');
    document.querySelector('.product-sheet')?.classList.remove('open');
  }

  function openProduct(item) {
    const sizes = item.sizes?.length ? item.sizes : [{ name: 'الحجم العادي', price: item.price }];
    const addons = item.addons || [];
    let size = sizes[0], quantity = 1, chosen = [];

    const draw = () => {
      const unit = Number(size.price) + chosen.reduce((sum, addon) => sum + Number(addon.price), 0);
      const total = unit * quantity;
      const hasSizes = sizes.length > 1;
      const hasAddons = addons.length > 0;

      let html = `
        ${item.image ? `<div class="sheet-product-banner"><img src="${escape(item.image)}" alt="${escape(item.name)}"></div>` : ''}
        <div class="sheet-product-info">
          <h2>${escape(item.name)}</h2>
          <p>${escape(item.description || (item.isOffer ? 'عرض خاص ومميز من ليتشي.' : 'وجبة محضرة طازجة بأعلى جودة.'))}</p>
        </div>
      `;

      if (hasSizes) {
        html += `
          <div class="sheet-block">
            <h3>اختر الحجم</h3>
            <div class="sheet-options-list">
              ${sizes.map((entry, index) => `
                <div class="sheet-option-card ${entry === size ? 'selected' : ''}" data-managed-size="${index}">
                  <div class="option-info">
                    <span class="option-name">${escape(entry.name)}</span>
                    <span class="option-price">${money(entry.price)}</span>
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
              ${addons.map((entry, index) => {
                const isSelected = chosen.includes(entry);
                return `
                  <div class="sheet-option-card ${isSelected ? 'selected' : ''}" data-managed-addon="${index}">
                    <div class="option-info">
                      <span class="option-name">${escape(entry.name)}</span>
                      <span class="option-price">+${money(entry.price)}</span>
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

      html += `
        <div class="sheet-qty-row">
          <span class="qty-label">الكمية</span>
          <div class="qty-stepper">
            <button type="button" class="qty-circle-btn minus" data-managed-qty="minus" aria-label="تقليل الكمية">−</button>
            <span class="qty-value">${quantity}</span>
            <button type="button" class="qty-circle-btn plus" data-managed-qty="plus" aria-label="زيادة الكمية">+</button>
          </div>
        </div>
        <button type="button" class="sheet-submit-btn add-order" id="managed-add">
          <span class="submit-price">${money(total)}</span>
          <span class="submit-action">أضف الي السله</span>
        </button>
      `;

      document.querySelector('.sheet-content').innerHTML = html;

      document.querySelectorAll('[data-managed-size]').forEach(button => {
        button.onclick = () => {
          size = sizes[Number(button.dataset.managedSize)];
          draw();
        };
      });

      document.querySelectorAll('[data-managed-addon]').forEach(box => {
        box.onclick = () => {
          const addon = addons[Number(box.dataset.managedAddon)];
          chosen = chosen.includes(addon) ? chosen.filter(entry => entry !== addon) : [...chosen, addon];
          draw();
        };
      });

      document.querySelectorAll('[data-managed-qty]').forEach(button => {
        button.onclick = () => {
          quantity = button.dataset.managedQty === 'plus' ? quantity + 1 : Math.max(1, quantity - 1);
          draw();
        };
      });

      document.querySelector('#managed-add').onclick = () => {
        const cart = readCart();
        const id = `managed-${item.id}-${size.name}-${chosen.map(addon => addon.name).join('-')}`;
        const existing = cart.find(entry => entry.id === id);
        const entry = {
          id,
          name: item.name,
          image: item.image,
          size: size.name,
          addons: chosen,
          unitPrice: unit,
          quantity
        };
        if (existing) {
          existing.quantity += quantity;
        } else {
          cart.push(entry);
        }
        saveCart(cart);
        updateCount();
        close();
        showToast();
      };
    };

    draw();
    document.querySelector('.sheet-overlay')?.classList.add('open');
    document.querySelector('.product-sheet')?.classList.add('open');
  }

  // Handle Offers Section (Auto-scroll every 5s)
  const offersSection = document.querySelector('#offers-section');
  const offersTrack = document.querySelector('#offers-track');
  const offersCarousel = document.querySelector('#offers-carousel');
  const offersDots = document.querySelector('#offers-dots');
  const offerPrev = document.querySelector('#offer-prev');
  const offerNext = document.querySelector('#offer-next');

  const offerItems = products.filter(p => p.isOffer);
  const regularItems = products.filter(p => !p.isOffer);

  // If there are no offers, keep section hidden / empty
  if (offersSection && offersTrack) {
    if (!offerItems.length) {
      offersSection.style.display = 'none';
      offersTrack.innerHTML = '';
      if (offersDots) offersDots.innerHTML = '';
    } else {
      offersSection.style.display = 'block';
      offersTrack.innerHTML = '';

      offerItems.forEach(item => {
        // If an offer has the same name as a static card in index.html, remove it from the menu sections
        document.querySelectorAll('.card:not(.managed-card) h3').forEach(title => {
          if (title.textContent.trim() === item.name) {
            title.closest('.card')?.remove();
          }
        });

        const card = document.createElement('article');
        card.className = 'offer-card managed-offer-card';
        card.dataset.search = `${item.name} ${item.description || ''} ${item.category || ''}`;
        card.innerHTML = `
          <span class="offer-card-tag">🔥 عرض خاص</span>
          <div class="offer-card-img-wrap">
            <img class="offer-card-img" src="${escape(item.image || 'assets/lychee-logo-cutout.png')}" alt="${escape(item.name)}">
          </div>
          <div class="offer-card-body">
            <h3 class="offer-card-name">${escape(item.name)}</h3>
            <p class="offer-card-desc">${escape(item.description || 'عرض مميز وحصري من ليتشي!')}</p>
            <div class="offer-card-footer">
              <span class="offer-card-price">${escape(item.price)} <small>جنيه</small></span>
              <button class="offer-card-btn" type="button">اطلب العرض</button>
            </div>
          </div>
        `;

        const openHandler = e => {
          e?.stopPropagation();
          openProduct(item);
        };
        card.onclick = openHandler;
        card.querySelector('.offer-card-btn').onclick = openHandler;
        offersTrack.appendChild(card);
      });

      // Setup 5-Second Auto-Scroller for Offers
      initOffersAutoScroll();
    }
  }

  function initOffersAutoScroll() {
    if (!offersCarousel || !offersTrack) return;
    const cards = offersTrack.querySelectorAll('.offer-card');
    if (!cards.length) return;

    // Setup dots
    if (offersDots) {
      offersDots.innerHTML = '';
      if (cards.length <= 1) {
        offersDots.style.display = 'none';
      } else {
        offersDots.style.display = 'flex';
        cards.forEach((_, idx) => {
          const dot = document.createElement('button');
          dot.className = `offers-dot ${idx === 0 ? 'active' : ''}`;
          dot.setAttribute('aria-label', `العرض ${idx + 1}`);
          dot.onclick = () => { goToSlide(idx); resetTimer(); };
          offersDots.appendChild(dot);
        });
      }
    }

    let currentIndex = 0;
    let timer = null;

    function updateDots(idx) {
      if (!offersDots) return;
      offersDots.querySelectorAll('.offers-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === idx);
      });
    }

    function goToSlide(idx) {
      currentIndex = ((idx % cards.length) + cards.length) % cards.length;
      offersTrack.style.transform = `translateX(${currentIndex * -100}%)`;
      updateDots(currentIndex);
    }

    if (offerNext) {
      offerNext.onclick = () => { goToSlide(currentIndex + 1); resetTimer(); };
    }
    if (offerPrev) {
      offerPrev.onclick = () => { goToSlide(currentIndex - 1); resetTimer(); };
    }

    // Swipe support
    let touchStartX = 0;
    offersCarousel.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
      stopTimer();
    }, { passive: true });
    offersCarousel.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        goToSlide(diff > 0 ? currentIndex + 1 : currentIndex - 1);
      }
      resetTimer();
    }, { passive: true });

    offersCarousel.addEventListener('mouseenter', stopTimer);
    offersCarousel.addEventListener('mouseleave', resetTimer);

    function stopTimer() {
      if (timer) { clearInterval(timer); timer = null; }
    }
    function resetTimer() {
      stopTimer();
      if (cards.length > 1) {
        timer = setInterval(() => goToSlide(currentIndex + 1), 5000);
      }
    }

    goToSlide(0);
    resetTimer();
  }


  // Handle Regular Products (Menu Categories)
  regularItems.forEach(item => {
    document.querySelectorAll('.card:not(.managed-card) h3').forEach(title => {
      if (title.textContent.trim() === item.name) {
        title.closest('.card')?.remove();
      }
    });

    const targetSection = categoryMap[item.category] || 'regular';
    const section = document.querySelector(`.section[data-section="${targetSection}"]`);
    const grid = section?.querySelector('.grid');
    if (!grid) return;

    const card = document.createElement('article');
    card.className = 'card managed-card';
    card.dataset.search = `${item.name} ${item.description || ''}`;
    card.innerHTML = `
      <img class="card-img" src="${escape(item.image || 'assets/lychee-logo-cutout.png')}" alt="${escape(item.name)}">
      <div class="card-body">
        <div class="name">
          <div>
            <h3>${escape(item.name)}</h3>
            <span class="en">${escape(item.category)}</span>
          </div>
          <span class="price">${escape(item.price)}</span>
        </div>
        <p class="desc">${escape(item.description || 'وجبة مضافة من إدارة المنيو.')}</p>
        <button class="add-to-cart-btn" type="button">أضف إلى السلة</button>
      </div>
    `;

    const openHandler = e => {
      e?.stopPropagation();
      openProduct(item);
    };

    card.querySelector('.add-to-cart-btn').onclick = openHandler;
    card.onclick = openHandler;
    grid.prepend(card);
  });

  // Search Filter Handler
  document.querySelector('#search')?.addEventListener('input', event => {
    const val = event.target.value.trim().toLowerCase();
    document.querySelectorAll('.managed-card').forEach(card => {
      card.style.display = card.dataset.search.toLowerCase().includes(val) ? 'block' : 'none';
    });
    document.querySelectorAll('.managed-offer-card').forEach(card => {
      card.style.display = card.dataset.search.toLowerCase().includes(val) ? 'flex' : 'none';
    });
  });

  updateCount();
})();
