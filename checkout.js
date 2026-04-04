function showMessage(text, type) {
  const messageEl = document.getElementById("message");
  messageEl.textContent = text;
  messageEl.className = "message " + (type || "info");
}

function loadCheckoutSummary() {
  const cart = getCart();
  const products = getProducts();
  const itemsContainer = document.getElementById("checkoutItems");
  
  if (!cart.items || cart.items.length === 0) {
    itemsContainer.innerHTML = '<p style="color: var(--muted);">No items in cart</p>';
    return;
  }

  let total = 0;
  itemsContainer.innerHTML = '';

  cart.items.forEach((item) => {
    const product = products.find((p) => p.id === item.product_id);
    if (!product) return;
    
    const lineTotal = Number(product.price) * Number(item.quantity);
    total += lineTotal;

    const itemDiv = document.createElement('div');
    itemDiv.className = 'checkout-item-row';
    itemDiv.innerHTML = `
      <div class="checkout-item-info">
        <p class="checkout-item-name">${product.name}</p>
        <p class="checkout-item-qty">Qty: ${item.quantity}</p>
      </div>
      <p class="checkout-item-price">₹${lineTotal}</p>
    `;
    itemsContainer.appendChild(itemDiv);
  });

  document.getElementById("checkoutSubtotal").innerText = "₹" + total;
  document.getElementById("checkoutTotal").innerText = "Total: ₹" + total;
  document.getElementById("checkoutTax").innerText = "₹0";
}

function placeOrder() {
  const cart = getCart();
  if (!cart.items || cart.items.length === 0) {
    showMessage("Your cart is empty. Add items before placing an order.", "error");
    return;
  }

  const deliveryAddress = {
    name: document.getElementById("name").value,
    address: document.getElementById("address").value,
    city: document.getElementById("city").value,
    state: document.getElementById("state").value,
    zip: document.getElementById("zip").value,
    phone: document.getElementById("phone").value
  };
  const paymentMethod = document.getElementById("paymentMethod").value;

  const order = placeOrderLocal(deliveryAddress, paymentMethod);
  
  // Show success modal
  const modal = document.getElementById("successModal");
  modal.classList.add("show");

  // remove fake browser notification popup (not used)
  // Play success sound after modal appears
  const playConfirmationSound = () => {
    const preferredAudioUrl = "google_pay.mp3";
    const fallbackAudioUrl = "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg";
    const bonusAudioUrl = "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3"; // new pleasant additional tone

    const play = (url) => {
      const audio = new Audio(url);
      audio.volume = 1.0;
      return audio.play();
    };

    play(preferredAudioUrl)
      .then(() => play(bonusAudioUrl).catch(err => console.warn("Bonus audio failed", err)))
      .catch(e => {
        console.warn("Preferred audio failed, falling back:", e);
        play(fallbackAudioUrl)
          .then(() => play(bonusAudioUrl).catch(err => console.warn("Bonus audio failed", err)))
          .catch(err2 => {
            console.error("Fallback audio failed:", err2);
            play(bonusAudioUrl).catch(err3 => console.error("Bonus audio failed", err3));
          });
      });
  };

  setTimeout(playConfirmationSound, 500);

  if (paymentMethod === "upi") {
    const upiId = "7708930459@fam";
    const qrData = encodeURIComponent(`upi://pay?pa=${upiId}&pn=Harshan%20Seliyan.B.S&cu=INR&am=${order.total}`);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrData}`;
    const qrContainer = document.getElementById("upiQrContainer");
    qrContainer.innerHTML = `
      <div class="qr-box">
        <p class="qr-label">Scan this UPI QR code with any UPI app</p>
        <img src="${qrUrl}" alt="UPI QR Code" />
        <p class="qr-id">UPI ID: ${upiId}</p>
      </div>
    `;
    qrContainer.classList.remove("hidden");
    showMessage("Scan the QR code now. Redirecting to thank you page in 5 seconds.", "success");
    setTimeout(() => {
      window.location.href = 'thank-you.html';
    }, 5000);
  } else {
    setTimeout(() => {
      window.location.href = 'thank-you.html';
    }, 3000);
  }
}

function logout() {
  logoutLocal();
  window.location.href = "login.html";
}

requireAuth();
loadCheckoutSummary();

document.getElementById("checkoutForm").addEventListener("submit", (e) => {
  e.preventDefault();
  placeOrder();
});