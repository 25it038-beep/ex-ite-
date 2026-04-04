function showMessage(text, type) {
  const messageEl = document.getElementById("message");
  messageEl.textContent = text;
  messageEl.className = "message " + (type || "info");
}

let activeType = "All";
let searchQuery = "";

function goToCart() {
  window.location.href = "cart.html";
}

function onSearchInput(event) {
  searchQuery = event.target.value.trim().toLowerCase();
  loadProducts();
}

function logout() {
  logoutLocal();
  window.location.href = "login.html";
}

function addToCart(productId) {
  addToCartLocal(productId, 1);
  showMessage("Added to cart successfully.", "success");
  
  // Play add-to-cart sound
  const audio = new Audio("file.mp3");
  audio.volume = 0.8;
  audio.play().catch(err => console.warn("Add-to-cart audio failed", err));
}

function renderTypeNav(types) {
  const nav = document.getElementById("typeNav");
  if (!nav) {
    return;
  }

  const allTypes = ["All", ...types];
  nav.innerHTML = "";

  allTypes.forEach((type) => {
    const btn = document.createElement("button");
    btn.className = "type-chip" + (type === activeType ? " active" : "");
    btn.textContent = type;
    btn.onclick = () => {
      activeType = type;
      renderTypeNav(types);
      loadProducts();
    };
    nav.appendChild(btn);
  });
}

function loadProducts() {
  const container = document.getElementById("products");
  container.innerHTML = "";

  const rawData = getProducts();
  const types = [...new Set(rawData.map((p) => p.type).filter(Boolean))].sort();
  renderTypeNav(types);

  let data = activeType === "All" ? rawData : rawData.filter((p) => p.type === activeType);
  if (searchQuery) {
    data = data.filter((p) => {
      const text = `${p.name} ${p.type}`.toLowerCase();
      return text.includes(searchQuery);
    });
  }

  if (!Array.isArray(data) || data.length === 0) {
    container.innerHTML = "<p class='subtext'>No matching products were found. Try a different search or category.</p>";
    return;
  }

  data.forEach((p) => {
    const div = document.createElement("article");
    div.className = "card";

    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p class="subtext">${p.type || "General"}</p>
      <p class="price">₹${Number(p.price)}</p>
      <button class="primary-btn" onclick="addToCart('${p.id}')">Add to Cart</button>
    `;

    container.appendChild(div);
  });
}

requireAuth();
loadProducts();