function openAiHelp() {
  const modal = document.getElementById("aiHelpModal");
  if (!modal) return;
  modal.classList.add("show");
  const output = document.getElementById("aiChatOutput");
  if (output && output.children.length === 0) {
    appendAiMessage("Hello! I am your AI assistant. Tell me what issue you are facing with products, cart, payment, or orders.", "assistant");
  }
}

function closeAiHelp() {
  const modal = document.getElementById("aiHelpModal");
  if (!modal) return;
  modal.classList.remove("show");
}

function appendAiMessage(message, role) {
  const output = document.getElementById("aiChatOutput");
  if (!output) return;
  const msg = document.createElement("div");
  msg.className = `ai-chat-message ${role}`;
  msg.textContent = message;
  output.appendChild(msg);
  output.scrollTop = output.scrollHeight;
}

function getAiResponse(input) {
  const text = (input || "").trim().toLowerCase();
  if (!text) {
    return "Please enter a question or issue so I can help.";
  }
  if (text.includes("add") && text.includes("cart")) {
    return "To add a product to cart, click the Add to Cart button on the product card. If that fails, refresh the page and try again.";
  }
  if (text.includes("payment") || text.includes("upi") || text.includes("card") || text.includes("pay")) {
    return "Select a payment method at checkout. For UPI, scan the QR code or use the UPI ID. For cards, choose the card option and follow the card details prompts.";
  }
  if (text.includes("address") || text.includes("delivery")) {
    return "Enter your delivery details on the checkout page. Make sure all required fields are filled before placing the order.";
  }
  if (text.includes("order") || text.includes("thank")) {
    return "Once your order is placed, you will see a confirmation message and be redirected to the thank-you page.";
  }
  if (text.includes("price") || text.includes("cost") || text.includes("total")) {
    return "Product prices are shown on product cards in INR. The cart and checkout pages calculate the total automatically.";
  }
  return "I can help with product selection, cart issues, checkout problems, and payment questions. Please describe your issue in more detail.";
}

function sendAiMessage() {
  const input = document.getElementById("aiChatInput");
  if (!input) return;
  const value = input.value.trim();
  if (!value) return;

  appendAiMessage(value, "user");
  input.value = "";
  const response = getAiResponse(value);
  setTimeout(() => appendAiMessage(response, "assistant"), 250);
}
