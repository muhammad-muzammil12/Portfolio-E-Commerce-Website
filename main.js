const PRODUCTS = [
  {
    id: 1,
    name: "The Classic Blazer",
    category: "Clothing",
    price: 8500,
    description: "A refined wardrobe essential with a timeless silhouette and effortless sophistication.",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 2,
    name: "Minimalist Handbag",
    category: "Bags",
    price: 6900,
    description: "An elegant everyday handbag designed to complement your most-loved looks.",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 3,
    name: "Everyday Knitwear",
    category: "Clothing",
    price: 5200,
    description: "Soft, versatile knitwear for comfortable and considered everyday styling.",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 4,
    name: "Statement Sunglasses",
    category: "Accessories",
    price: 3500,
    description: "A modern finishing touch with a clean and confident design.",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 5,
    name: "Structured Tote",
    category: "Bags",
    price: 7800,
    description: "A spacious and polished tote for days that call for both style and function.",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 6,
    name: "Essential White Shirt",
    category: "Clothing",
    price: 4200,
    description: "A versatile classic that brings effortless elegance to any wardrobe.",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 7,
    name: "Classic Timepiece",
    category: "Accessories",
    price: 9500,
    description: "A sophisticated accessory with a clean, understated aesthetic.",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 8,
    name: "Evening Shoulder Bag",
    category: "Bags",
    price: 6200,
    description: "A refined finishing piece for evenings and special occasions.",
    image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=900&q=85"
  }
];

const CURRENCY = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  maximumFractionDigits: 0
});

const money = amount => CURRENCY.format(amount);

function getCart() {
  try {
    return JSON.parse(localStorage.getItem("elora-cart")) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("elora-cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = getCart().reduce((total, item) => total + item.quantity, 0);

  document.querySelectorAll(".cart-count").forEach(element => {
    element.textContent = count;
  });
}

function addToCart(id, quantity = 1) {
  const product = PRODUCTS.find(item => item.id === Number(id));
  if (!product) return;

  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id: product.id, quantity });
  }

  saveCart(cart);
  alert(`${product.name} added to your bag.`);
}

function productCard(product) {
  return `
    <article class="product-card">
      <a class="product-image" href="product.html?id=${product.id}">
        <img src="${product.image}" alt="${product.name}" loading="lazy"
          onerror="this.onerror=null;this.src='https://placehold.co/600x750/f2eee8/5b5148?text=ELORA'">
      </a>
      <div class="product-card-info">
        <div>
          <p class="product-category">${product.category}</p>
          <a class="product-name" href="product.html?id=${product.id}">${product.name}</a>
          <p class="product-price">${money(product.price)}</p>
        </div>
        <button class="quick-add" data-add="${product.id}" aria-label="Add ${product.name} to bag">+</button>
      </div>
    </article>
  `;
}

function renderFeatured() {
  const container = document.getElementById("featured-products");
  if (container) {
    container.innerHTML = PRODUCTS.slice(0, 4).map(productCard).join("");
  }
}

function renderShop() {
  const container = document.getElementById("shop-products");
  if (!container) return;

  const search = document.getElementById("shop-search");
  const category = document.getElementById("category-filter");
  const sort = document.getElementById("sort-products");
  const count = document.getElementById("product-result-count");

  function update() {
    const term = search.value.trim().toLowerCase();
    const selectedCategory = category.value;

    let filtered = PRODUCTS.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term);

      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    if (sort.value === "low") filtered.sort((a, b) => a.price - b.price);
    if (sort.value === "high") filtered.sort((a, b) => b.price - a.price);
    if (sort.value === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));

    count.textContent = `${filtered.length} products`;
    container.innerHTML = filtered.length
      ? filtered.map(productCard).join("")
      : `<div class="empty-state"><h2>No products found</h2><p>Try another search or category.</p></div>`;
  }

  search.addEventListener("input", update);
  category.addEventListener("change", update);
  sort.addEventListener("change", update);
  update();
}

function renderProductDetail() {
  const container = document.getElementById("product-detail");
  if (!container) return;

  const id = Number(new URLSearchParams(location.search).get("id"));
  const product = PRODUCTS.find(item => item.id === id);

  if (!product) {
    container.innerHTML = `
      <div class="empty-state">
        <h2>Product not found</h2>
        <a class="btn btn-dark" href="shop.html">Return to shop</a>
      </div>`;
    return;
  }

  document.title = `${product.name} | ÉLORA`;

  container.innerHTML = `
    <div class="detail-image">
      <img src="${product.image}" alt="${product.name}"
        onerror="this.onerror=null;this.src='https://placehold.co/800x1000/f2eee8/5b5148?text=ELORA'">
    </div>
    <div class="detail-info">
      <p class="eyebrow">${product.category}</p>
      <h1>${product.name}</h1>
      <p class="detail-price">${money(product.price)}</p>
      <div class="detail-divider"></div>
      <p class="detail-description">${product.description}</p>
      <p class="small-note">Prices are displayed in Pakistani Rupees (PKR).</p>
      <label class="quantity-label">Quantity
        <input type="number" id="detail-quantity" min="1" max="10" value="1">
      </label>
      <button class="btn btn-dark btn-wide" id="detail-add">Add to bag</button>
      <div class="detail-perks">
        <p>✓ Carefully curated collection</p>
        <p>✓ Delivery across Pakistan (subject to store setup)</p>
        <p>✓ Customer support available</p>
      </div>
    </div>
  `;

  document.getElementById("detail-add").addEventListener("click", () => {
    const quantity = Math.max(1, Math.min(10,
      Number(document.getElementById("detail-quantity").value) || 1
    ));
    addToCart(product.id, quantity);
  });

  const related = document.getElementById("related-products");
  if (related) {
    related.innerHTML = PRODUCTS
      .filter(item => item.id !== product.id)
      .slice(0, 4)
      .map(productCard)
      .join("");
  }
}

function renderCart() {
  const container = document.getElementById("cart-content");
  if (!container) return;

  const cart = getCart();

  const validItems = cart
    .map(item => ({
      ...item,
      product: PRODUCTS.find(product => product.id === item.id)
    }))
    .filter(item => item.product && item.quantity > 0);

  if (validItems.length !== cart.length) saveCart(validItems.map(item => ({
    id: item.id,
    quantity: item.quantity
  })));

  if (!validItems.length) {
    container.innerHTML = `
      <div class="empty-state">
        <h2>Your bag is waiting.</h2>
        <p>Discover something you will love.</p>
        <a class="btn btn-dark" href="shop.html">Continue shopping</a>
      </div>`;
    return;
  }

  const subtotal = validItems.reduce(
    (total, item) => total + item.product.price * item.quantity, 0
  );

  const shipping = subtotal >= 10000 ? 0 : 300;
  const total = subtotal + shipping;

  container.innerHTML = `
    <div class="cart-layout">
      <div class="cart-items">
        ${validItems.map(item => `
          <article class="cart-item">
            <a href="product.html?id=${item.id}">
              <img src="${item.product.image}" alt="${item.product.name}"
                onerror="this.onerror=null;this.src='https://placehold.co/300x350/f2eee8/5b5148?text=ELORA'">
            </a>
            <div class="cart-item-info">
              <p class="product-category">${item.product.category}</p>
              <a class="product-name" href="product.html?id=${item.id}">${item.product.name}</a>
              <p>${money(item.product.price)}</p>
              <div class="cart-controls">
                <button data-decrease="${item.id}" aria-label="Decrease quantity">−</button>
                <span>${item.quantity}</span>
                <button data-increase="${item.id}" aria-label="Increase quantity">+</button>
              </div>
              <button class="remove-link" data-remove="${item.id}">Remove</button>
            </div>
            <strong>${money(item.product.price * item.quantity)}</strong>
          </article>
        `).join("")}
      </div>

      <aside class="order-summary">
        <h2>Order summary</h2>
        <div class="summary-line"><span>Subtotal</span><span>${money(subtotal)}</span></div>
        <div class="summary-line"><span>Delivery</span><span>${shipping ? money(shipping) : "Free"}</span></div>
        <div class="summary-line summary-total"><strong>Total</strong><strong>${money(total)}</strong></div>
        <p class="small-note">${subtotal >= 10000 ? "You qualify for complimentary delivery." : `Add ${money(10000 - subtotal)} more for complimentary delivery.`}</p>
        <a class="btn btn-dark btn-wide" href="checkout.html">Proceed to checkout</a>
        <a class="continue-link" href="shop.html">Continue shopping</a>
      </aside>
    </div>
  `;
}

function changeQuantity(id, amount) {
  const cart = getCart();
  const item = cart.find(product => product.id === Number(id));
  if (!item) return;

  item.quantity += amount;

  const updated = cart.filter(product => product.quantity > 0);
  saveCart(updated);
  renderCart();
}

function removeFromCart(id) {
  saveCart(getCart().filter(item => item.id !== Number(id)));
  renderCart();
}

function renderCheckout() {
  const summary = document.getElementById("checkout-summary");
  if (!summary) return;

  const cart = getCart();
  const items = cart.map(item => ({
    ...item,
    product: PRODUCTS.find(product => product.id === item.id)
  })).filter(item => item.product);

  if (!items.length) {
    summary.innerHTML = `<p>Your bag is empty. <a href="shop.html">Shop now</a></p>`;
    const form = document.getElementById("checkout-form");
    if (form) form.querySelector("button[type=submit]").disabled = true;
    return;
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity, 0
  );
  const shipping = subtotal >= 10000 ? 0 : 300;

  summary.innerHTML = `
    <h2>Your order</h2>
    ${items.map(item => `
      <div class="summary-line">
        <span>${item.product.name} × ${item.quantity}</span>
        <span>${money(item.product.price * item.quantity)}</span>
      </div>
    `).join("")}
    <div class="summary-line"><span>Subtotal</span><span>${money(subtotal)}</span></div>
    <div class="summary-line"><span>Delivery</span><span>${shipping ? money(shipping) : "Free"}</span></div>
    <div class="summary-line summary-total"><strong>Total</strong><strong>${money(subtotal + shipping)}</strong></div>
  `;
}

function setupForms() {
  const contact = document.getElementById("contact-form");
  if (contact) {
    contact.addEventListener("submit", event => {
      event.preventDefault();
      alert("Thank you! This is a demo form and your message has not been sent.");
      contact.reset();
    });
  }

  const newsletter = document.getElementById("newsletter-form");
  if (newsletter) {
    newsletter.addEventListener("submit", event => {
      event.preventDefault();
      alert("Thank you for your interest in ÉLORA. Newsletter signup is demo-only.");
      newsletter.reset();
    });
  }

  const checkout = document.getElementById("checkout-form");
  if (checkout) {
    checkout.addEventListener("submit", event => {
      event.preventDefault();

      if (!checkout.reportValidity()) return;

      if (!getCart().length) {
        alert("Your shopping bag is empty.");
        return;
      }

      alert("Demo order completed. No real order was sent or payment collected.");
      saveCart([]);
      location.href = "index.html";
    });
  }
}

function setupNavigation() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", nav.classList.contains("nav-open"));
    });
  }
}

document.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add]");
  if (addButton) addToCart(addButton.dataset.add);

  const increase = event.target.closest("[data-increase]");
  if (increase) changeQuantity(increase.dataset.increase, 1);

  const decrease = event.target.closest("[data-decrease]");
  if (decrease) changeQuantity(decrease.dataset.decrease, -1);

  const remove = event.target.closest("[data-remove]");
  if (remove) removeFromCart(remove.dataset.remove);
});

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderFeatured();
  renderShop();
  renderProductDetail();
  renderCart();
  renderCheckout();
  setupForms();
  setupNavigation();
});