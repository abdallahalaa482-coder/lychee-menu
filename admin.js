const PRODUCTS_KEY = 'smash-burger-products';
const CART_KEY = 'smash-burger-cart';
const $ = selector => document.querySelector(selector);

const menuImages = [
  'images/WhatsApp Image 2026-09-07 at 1.42.01 AM.jpeg',
  'images/WhatsApp Image 2026-09-07 at 1.42.02 AM.jpeg',
  'images/WhatsApp Image 2026-09-07 at 1.42.03 AM.jpeg',
  'images/WhatsApp Image 2026-09-07 at 1.42.36 AM.jpeg',
  'images/WhatsApp Image 2026-09-07 at 1.43.05 AM.jpeg'
];

const defaultCategories = [
  'Mix Crepe',
  'Regular Crepe',
  'Smash Burger',
  'Fries Box',
  'Fries',
  'Sandwich',
  'Chicken Sandwich',
  'Pizza Roll',
  'Pizza',
  'Sauce & Extra'
];

const catalog = [
  // Mix Crepe
  ['الوحش', 130, 'Mix Crepe'],
  ['الصاروخ', 130, 'Mix Crepe'],
  ['بلو استربس', 130, 'Mix Crepe'],
  ['ميكس دجاج', 120, 'Mix Crepe'],
  ['ميكس ميت', 120, 'Mix Crepe'],
  ['كريب ليتشي', 120, 'Mix Crepe'],
  ['فيرال تيستي', 120, 'Mix Crepe'],
  ['هالبينو تشيكن رانش', 120, 'Mix Crepe'],

  // Regular Crepe
  ['زنجر سوبريم', 105, 'Regular Crepe'],
  ['ميكس جبن', 80, 'Regular Crepe'],
  ['كريب البطاطس', 60, 'Regular Crepe'],
  ['تشيكن رانش', 110, 'Regular Crepe'],
  ['كوردن بلو', 110, 'Regular Crepe'],
  ['فرايداي', 110, 'Regular Crepe'],
  ['تشيكن كرسبي', 80, 'Regular Crepe'],
  ['تشيكن باربكيو', 110, 'Regular Crepe'],
  ['شيش طاووق', 110, 'Regular Crepe'],
  ['بانيه', 80, 'Regular Crepe'],
  ['سو تشيلي', 110, 'Regular Crepe'],
  ['سوبر كرانشي', 105, 'Regular Crepe'],

  // Smash Burger
  ['سماش برجر كلاسيك', 115, 'Smash Burger'],
  ['سموكد سماش برجر', 120, 'Smash Burger'],

  // Fries Box
  ['الوحش فرايز', 80, 'Fries Box'],
  ['تشيكن فرايز', 70, 'Fries Box'],
  ['سماش فرايز', 80, 'Fries Box'],
  ['هالبينو تشيز فرايز', 75, 'Fries Box'],
  ['تيستي فرايز', 85, 'Fries Box'],

  // Fries
  ['بطاطس', 25, 'Fries'],
  ['بطاطس شيدر', 35, 'Fries'],
  ['بطاطس صوص', 35, 'Fries'],

  // Sandwich
  ['بطاطس ساندوتش', 30, 'Sandwich'],
  ['بطاطس شيدر ساندوتش', 35, 'Sandwich'],
  ['بطاطس هوت دوج', 60, 'Sandwich'],
  ['فرايداي ساندوتش', 85, 'Sandwich'],
  ['تشيكن فاهيتا', 85, 'Sandwich'],
  ['تشيكن بانيه ساندوتش', 70, 'Sandwich'],
  ['زنجر سوبريم ساندوتش', 80, 'Sandwich'],
  ['سوبر كرانشي ساندوتش', 85, 'Sandwich'],

  // Chicken Sandwich
  ['برجر دجاج مدخن', 120, 'Chicken Sandwich'],
  ['مشروم رانش', 130, 'Chicken Sandwich'],
  ['عشاق الجبن', 130, 'Chicken Sandwich'],
  ['تشيكن ليتشي', 130, 'Chicken Sandwich'],

  // Pizza Roll
  ['تشيكن رانش رول', 120, 'Pizza Roll'],
  ['تشيكن باربكيو رول', 120, 'Pizza Roll'],
  ['تشيكن & تشيز رول', 120, 'Pizza Roll'],
  ['تشيكن كرانشي رول', 120, 'Pizza Roll'],
  ['سوبر ليتشي رول', 120, 'Pizza Roll'],

  // Pizza
  ['بيتزا مارجريتا', 145, 'Pizza'],
  ['بيتزا تشيكن رانش', 160, 'Pizza'],
  ['بيتزا تشيكن باربكيو', 165, 'Pizza'],
  ['بيتزا بيبروني', 165, 'Pizza'],
  ['بيتزا لحمة مفرومة', 160, 'Pizza'],
  ['بيتزا نص ونص', 175, 'Pizza'],
  ['سوبر كرانشي بيتزا', 170, 'Pizza'],
  ['كواترو فورماجي', 175, 'Pizza'],
  ['سجق مدخن', 165, 'Pizza'],
  ['هوت دوج مدخن', 155, 'Pizza'],
  ['ميكس تشيكن بيتزا', 160, 'Pizza'],
  ['سوبر ليتشي بيتزا', 170, 'Pizza'],

  // Sauce & Extra
  ['صوص', 15, 'Sauce & Extra'],
  ['كول سلو', 15, 'Sauce & Extra'],
  ['مخلل', 15, 'Sauce & Extra'],
  ['إيجيبتين صودا', 20, 'Sauce & Extra'],
  ['كومبو', 35, 'Sauce & Extra']
];

const categoryMigration = {
  'كريب': 'Mix Crepe',
  'برجر': 'Smash Burger',
  'وجبات': 'Regular Crepe',
  'جانبية': 'Fries',
  'بيتزا': 'Pizza'
};

const defaultOffers = [
  {
    id: 'offer-1',
    name: 'عرض سوبر ليتشي كومبو',
    price: 145,
    category: 'Mix Crepe',
    isOffer: true,
    description: 'كريب ميكس لحوم ولتشي + فرايز شيدر لارج + بيبسي مثلج',
    image: 'images/WhatsApp Image 2026-09-07 at 1.42.01 AM.jpeg',
    sizes: [],
    addons: [
      { name: 'صوص رانش إضافي', price: 15 },
      { name: 'هالبينو حار', price: 10 }
    ]
  },
  {
    id: 'offer-2',
    name: 'عرض ميكس الصحاب',
    price: 235,
    category: 'Mix Crepe',
    isOffer: true,
    description: '2 كريب ميكس فراخ وميت + بطاطس عائلية تشيز + 2 صوص خاص',
    image: 'images/WhatsApp Image 2026-09-07 at 1.42.02 AM.jpeg',
    sizes: [],
    addons: [
      { name: 'جبنة موتزاريلا دبل', price: 20 },
      { name: 'صوص تيستي', price: 15 }
    ]
  },
  {
    id: 'offer-3',
    name: 'عرض سماش & كرانشي',
    price: 175,
    category: 'Smash Burger',
    isOffer: true,
    description: 'ساندوتش سماش برجر دبل + ساندوتش سوبر كرانشي + بطاطس وبيبسي',
    image: 'images/WhatsApp Image 2026-09-07 at 1.42.03 AM.jpeg',
    sizes: [],
    addons: [
      { name: 'بيكون لحم بقري مدخن', price: 20 },
      { name: 'شيدر صوص', price: 15 }
    ]
  }
];

const initialProducts = [
  ...defaultOffers,
  ...catalog.map(([name, price, category], index) => ({
    id: `menu-${index}`,
    name,
    price,
    category,
    isOffer: false,
    description: '',
    image: menuImages[index % menuImages.length],
    sizes: [],
    addons: [
      { name: 'جبنة إضافية', price: 15 },
      { name: 'صوص إضافي', price: 10 }
    ]
  }))
];

const getProducts = () => {
  const raw = localStorage.getItem(PRODUCTS_KEY);
  if (!raw) return initialProducts;
  try {
    const list = JSON.parse(raw);
    if (!Array.isArray(list) || !list.length) return initialProducts;
    // Migrate old category names if any
    let changed = false;
    list.forEach(p => {
      if (categoryMigration[p.category]) {
        p.category = categoryMigration[p.category];
        changed = true;
      }
      if (typeof p.isOffer === 'undefined') {
        p.isOffer = false;
      }
    });
    // If the list has no offer products at all, add default offers so admin can manage them
    const hasAnyOffer = list.some(p => p.isOffer);
    if (!hasAnyOffer) {
      list.unshift(...defaultOffers);
      changed = true;
    }
    if (changed) saveProducts(list);
    return list;
  } catch (e) {
    return initialProducts;
  }
};

const saveProducts = products => localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));

let previewImage = '';
let activeCategory = 'الكل';
let searchTerm = '';

const sectionCategories = {
  mix: 'Mix Crepe',
  regular: 'Regular Crepe',
  smash: 'Smash Burger',
  box: 'Fries Box',
  fries: 'Fries',
  sandwich: 'Sandwich',
  'chicken-sandwich': 'Chicken Sandwich',
  'pizza-roll': 'Pizza Roll',
  pizza: 'Pizza',
  extra: 'Sauce & Extra'
};

function menuProduct(card, index) {
  const name = card.querySelector('h3')?.textContent.trim();
  if (!name) return null;
  const section = card.closest('.section')?.dataset.section;
  const sizes = [...card.querySelectorAll('.pill')].map(pill => ({
    name: pill.textContent.replace(/[0-9]/g, '').trim(),
    price: Number(pill.querySelector('b')?.textContent || 0)
  })).filter(size => size.price);
  const price = Number((card.querySelector('.price')?.textContent || sizes[0]?.price || 0).replace(/\D/g, ''));
  return {
    id: `menu-${index}`,
    name,
    price,
    category: sectionCategories[section] || 'Regular Crepe',
    isOffer: false,
    description: card.querySelector('.desc')?.textContent.trim() || '',
    image: menuImages[index % menuImages.length],
    sizes,
    addons: [
      { name: 'جبنة إضافية', price: 15 },
      { name: 'صوص إضافي', price: 10 }
    ]
  };
}

async function importMenuProducts() {
  const saved = getProducts();
  const known = new Set(saved.map(product => product.name));
  initialProducts.forEach(product => {
    if (!known.has(product.name)) {
      saved.push(product);
      known.add(product.name);
    }
  });
  try {
    const response = await fetch('index.html', { cache: 'no-store' });
    if (response.ok) {
      const documentSource = new DOMParser().parseFromString(await response.text(), 'text/html');
      [...documentSource.querySelectorAll('.section .card')].map(menuProduct).filter(Boolean).forEach(product => {
        if (!known.has(product.name)) {
          saved.push(product);
          known.add(product.name);
        }
      });
    }
  } catch (error) {
    console.warn('Using bundled menu catalog.', error);
  }
  saveProducts(saved);
}

function row(kind, item = { name: '', price: '' }) {
  return `<div class="repeat-row">
    <input data-${kind}-name placeholder="الاسم" value="${item.name}">
    <input data-${kind}-price type="number" min="0" placeholder="السعر" value="${item.price}">
    <button type="button" class="tiny-button remove-row">×</button>
  </div>`;
}

function bindRows() {
  document.querySelectorAll('.remove-row').forEach(button => button.onclick = () => button.parentElement.remove());
}

function addRow(kind, item) {
  document.querySelector(`#${kind}s`).insertAdjacentHTML('beforeend', row(kind, item));
  bindRows();
}

function resetForm() {
  $('#product-form').reset();
  $('#product-id').value = '';
  $('#is-offer').checked = false;
  $('#sizes').innerHTML = '';
  $('#addons').innerHTML = '';
  $('#image-preview').style.display = 'none';
  previewImage = '';
  $('#form-title').textContent = 'إضافة صنف جديد';
  $('#cancel-edit').hidden = true;
}

function fields(kind) {
  return [...document.querySelectorAll(`[data-${kind}-name]`)].map((input, index) => ({
    name: input.value.trim(),
    price: Number(document.querySelectorAll(`[data-${kind}-price]`)[index].value)
  })).filter(item => item.name && Number.isFinite(item.price));
}

function render() {
  const products = getProducts();
  const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  const offersCount = products.filter(p => p.isOffer).length;

  $('#products-count').textContent = products.length;
  $('#offers-count').textContent = offersCount;
  $('#categories-count').textContent = new Set(products.map(p => p.category).filter(Boolean)).size;
  $('#cart-count').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Categories filter list with 'الكل' and '🔥 العروض'
  const availableCats = Array.from(new Set([...defaultCategories, ...products.map(p => p.category).filter(Boolean)]));
  const filterList = ['الكل', '🔥 العروض', ...availableCats];

  $('#product-filters').innerHTML = filterList.map(cat => `
    <button class="filter-button ${cat === activeCategory ? 'active' : ''}" data-category="${cat}">
      ${cat}
    </button>
  `).join('');

  // Filter products
  const visible = products.filter(product => {
    let matchesCategory = true;
    if (activeCategory === '🔥 العروض') {
      matchesCategory = Boolean(product.isOffer);
    } else if (activeCategory !== 'الكل') {
      matchesCategory = product.category === activeCategory;
    }
    const matchesSearch = `${product.name} ${product.description || ''} ${product.category || ''}`.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  $('#product-list').innerHTML = visible.length ? visible.map(product => `
    <article class="admin-product ${product.isOffer ? 'is-offer-item' : ''}">
      <img src="${product.image || 'assets/lychee-logo-cutout.png'}" alt="${product.name}">
      <div>
        <h3>
          ${product.name}
          ${product.isOffer ? '<span class="offer-badge">🔥 عرض خاص</span>' : ''}
        </h3>
        <p>${product.category || 'عام'} · ${product.description || 'بدون وصف'}</p>
        <strong>${product.price} جنيه</strong>
      </div>
      <div class="row-actions">
        <button class="edit" data-edit="${product.id}">تعديل</button>
        <button class="delete" data-delete="${product.id}">حذف</button>
      </div>
    </article>
  `).join('') : '<p class="no-products">لا توجد أصناف أو عروض مطابقة.</p>';

  document.querySelectorAll('[data-category]').forEach(button => {
    button.onclick = () => {
      activeCategory = button.dataset.category;
      render();
    };
  });

  document.querySelectorAll('[data-edit]').forEach(button => {
    button.onclick = () => editProduct(button.dataset.edit);
  });

  document.querySelectorAll('[data-delete]').forEach(button => {
    button.onclick = () => {
      if (confirm('هل أنت متأكد من حذف هذا الصنف/العرض؟')) {
        saveProducts(getProducts().filter(product => product.id !== button.dataset.delete));
        render();
      }
    };
  });
}

function editProduct(id) {
  const product = getProducts().find(item => item.id === id);
  if (!product) return;
  $('#product-id').value = product.id;
  $('#name').value = product.name;
  $('#price').value = product.price;
  $('#category').value = product.category || 'Mix Crepe';
  $('#description').value = product.description || '';
  $('#is-offer').checked = Boolean(product.isOffer);

  previewImage = product.image || '';
  if (previewImage) {
    $('#image-preview').src = previewImage;
    $('#image-preview').style.display = 'block';
  } else {
    $('#image-preview').style.display = 'none';
  }

  $('#sizes').innerHTML = '';
  $('#addons').innerHTML = '';
  (product.sizes || []).forEach(item => addRow('size', item));
  (product.addons || []).forEach(item => addRow('addon', item));

  $('#form-title').textContent = product.isOffer ? 'تعديل العرض' : 'تعديل الصنف';
  $('#cancel-edit').hidden = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

$('#add-size').onclick = () => addRow('size');
$('#add-addon').onclick = () => addRow('addon');
$('#cancel-edit').onclick = resetForm;

$('#image').onchange = event => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    previewImage = reader.result;
    $('#image-preview').src = previewImage;
    $('#image-preview').style.display = 'block';
  };
  reader.readAsDataURL(file);
};

$('#product-form').onsubmit = event => {
  event.preventDefault();
  const id = $('#product-id').value || `product-${Date.now()}`;
  const products = getProducts();
  const existing = products.findIndex(product => product.id === id);
  const current = existing > -1 ? products[existing] : {};

  const product = {
    ...current,
    id,
    name: $('#name').value.trim(),
    price: Number($('#price').value),
    category: $('#category').value,
    isOffer: $('#is-offer').checked,
    description: $('#description').value.trim(),
    image: previewImage || current.image || '',
    sizes: fields('size'),
    addons: fields('addon')
  };

  if (existing > -1) {
    products[existing] = product;
  } else {
    products.unshift(product);
  }

  saveProducts(products);
  resetForm();
  render();
};

$('#logout').onclick = () => {
  sessionStorage.removeItem('smash-burger-admin-access');
  location.href = 'staff-access.html';
};

$('#product-list').insertAdjacentHTML('beforebegin', `
  <div class="product-tools">
    <div id="product-filters" class="product-filters"></div>
    <div class="product-search">
      <input id="product-search" type="search" placeholder="ابحث باسم الصنف أو العرض...">
      <button id="run-search" type="button" aria-label="بحث">⌕</button>
    </div>
  </div>
`);

document.head.insertAdjacentHTML('beforeend', `
  <style>
    .product-tools {
      display: grid;
      gap: 11px;
      margin: -5px 0 14px;
    }
    .product-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
    }
    .filter-button {
      border: 1px solid #eadfd8;
      background: #fff;
      border-radius: 8px;
      padding: 7px 11px;
      color: #554940;
      font: 700 11px Alexandria;
      cursor: pointer;
      transition: all 0.2s;
    }
    .filter-button.active {
      background: var(--red);
      border-color: var(--red);
      color: #fff;
    }
    .product-search {
      display: flex;
      gap: 7px;
    }
    .product-search input {
      flex: 1;
      border: 1px solid #eadfd8;
      border-radius: 8px;
      padding: 10px;
      font: 12px Alexandria;
      outline-color: var(--red);
    }
    .product-search button {
      width: 42px;
      border: 0;
      border-radius: 8px;
      background: #fff1eb;
      color: var(--red);
      font: 800 20px Arial;
      cursor: pointer;
    }
    .no-products {
      text-align: center;
      color: #806f65;
      padding: 22px;
    }
  </style>
`);

$('#product-search').addEventListener('input', event => {
  searchTerm = event.target.value.trim().toLowerCase();
  render();
});

$('#run-search').onclick = () => {
  $('#product-search').focus();
  render();
};

(async () => {
  await importMenuProducts();
  render();
})();
