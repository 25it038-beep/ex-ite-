function showMessage(text, type) {
  const messageEl = document.getElementById("message");
  messageEl.textContent = text;
  messageEl.className = "message " + (type || "info");
}

function increaseQty(productId) {
  const cart = getCart();
  const item = cart.items.find((x) => x.product_id === productId);
  if (!item) return;
  updateCartItemQuantity(productId, item.quantity + 1);
  loadCart();
}

function decreaseQty(productId) {
  const cart = getCart();
  const item = cart.items.find((x) => x.product_id === productId);
  if (!item) return;
  updateCartItemQuantity(productId, item.quantity - 1);
  loadCart();
}

function removeProductFromCart(productId) {
  removeFromCart(productId);
  
  // Play removal sound
  const audio = new Audio("fahhhhh.mp3");
  audio.volume = 0.8;
  audio.play().catch(err => console.warn("Removal audio failed", err));
  
  showMessage("Product removed from cart.", "success");
  loadCart();
}

function loadCart() {
  const div = document.getElementById("cart");
  const products = getProducts();
  const cart = getCart();

  let total = 0;
  let itemCount = 0;
  div.innerHTML = "";

  if (!cart.items || cart.items.length === 0) {
    div.innerHTML = `
      <div style="text-align:center; padding: 80px 40px; color: var(--muted);">
        <div style="font-size: 64px; margin-bottom: 16px; opacity: 0.4;">🛒</div>
        <h3 style="font-family: var(--font-display); font-size: 24px; margin: 0 0 12px; color: var(--text2);">Your cart is empty</h3>
        <p style="margin: 0 0 24px; font-size: 16px;">No items added yet. Start shopping now!</p>
        <button class="primary-btn" style="width: auto; padding: 12px 32px;" onclick="window.location.href='index.html'">Browse Products →</button>
      </div>`;
    document.getElementById("total").innerText = "Total: ₹0";
    document.getElementById("subtotal").innerText = "₹0";
    return;
  }

  cart.items.forEach((item, i) => {
    const p = products.find((x) => x.id === item.product_id);
    if (!p) return;

    const lineTotal = Number(p.price) * Number(item.quantity);
    total += lineTotal;
    itemCount += item.quantity;

    const article = document.createElement('article');
    article.className = 'cart-item';
    article.style.animationDelay = (i * 0.06) + 's';
    article.innerHTML = `
      <img src="${p.image}" alt="${p.name}" class="cart-item-img" />
      <div class="cart-item-details">
        <h3>${p.name}</h3>
        <p class="cart-item-type">${p.type}</p>
        <div class="cart-item-meta">
          <span class="qty-badge">Qty: ${item.quantity}</span>
          <span>₹${Number(p.price)} each</span>
        </div>
        <div style="display: flex; gap: 8px; margin-top: 10px;">
          <button class="secondary-btn" style="padding: 6px 12px; font-size: 13px;" onclick="decreaseQty('${p.id}')">−</button>
          <button class="secondary-btn" style="padding: 6px 12px; font-size: 13px;" onclick="increaseQty('${p.id}')">+</button>
          <button class="secondary-btn" style="padding: 6px 12px; font-size: 13px; color: var(--danger);" onclick="removeProductFromCart('${p.id}')">Remove</button>
        </div>
      </div>
      <div class="cart-item-total">
        <p class="price">₹${lineTotal}</p>
      </div>
    `;
    div.appendChild(article);
  });

  document.getElementById("total").innerText = "Total: ₹" + total;
  document.getElementById("subtotal").innerText = "₹" + total;
}

function checkout() {
  const cart = getCart();
  if (!cart.items || cart.items.length === 0) {
    showMessage("Add products before checkout.", "error");
    return;
  }
  window.location.href = "checkout.html";
}

function logout() {
  logoutLocal();
  window.location.href = "login.html";
}

requireAuth();
loadCart();