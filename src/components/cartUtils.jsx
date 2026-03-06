const CART_KEY = "kolifish_cart_v1";

export const WEIGHTS = [
  { label: "250g", kg: 0.25 },
  { label: "500g", kg: 0.5 },
  { label: "1kg", kg: 1 },
];

/* ================================
   Load cart from localStorage
================================ */
export function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/* ================================
   Save cart + notify React app
================================ */
export function saveCart(cart) {
  const safeCart = Array.isArray(cart) ? cart : [];

  try {
    localStorage.setItem(CART_KEY, JSON.stringify(safeCart));
  } catch (err) {
    console.error("Cart save failed:", err);
  }

  // notify UI
  window.dispatchEvent(new Event("cart-updated"));

  return safeCart;
}

/* ================================
   Add item to cart
================================ */
export function addToCart(item) {
  if (!item || !item.productId) return loadCart();

  const cart = loadCart();
  const key = `${item.productId}_${item.weightKg}`;

  const index = cart.findIndex(
    (x) => `${x.productId}_${x.weightKg}` === key
  );

  const qty = Math.max(1, Number(item.qty || 1));

  if (index >= 0) {
    const newQty = Number(cart[index].qty || 0) + qty;

    cart[index] = {
      ...cart[index],
      qty: newQty,
      lineTotal: calcItemTotal(
        cart[index].pricePerKg,
        cart[index].weightKg,
        newQty
      ),
    };
  } else {
    cart.push({
      ...item,
      qty,
      lineTotal: calcItemTotal(item.pricePerKg, item.weightKg, qty),
    });
  }

  return saveCart(cart);
}

/* ================================
   Update quantity
================================ */
export function updateQty(productId, weightKg, qty) {
  const nextQty = Math.max(0, Number(qty || 0));

  const cart = loadCart()
    .map((item) => {
      if (item.productId === productId && item.weightKg === weightKg) {
        return {
          ...item,
          qty: nextQty,
          lineTotal: calcItemTotal(item.pricePerKg, item.weightKg, nextQty),
        };
      }
      return item;
    })
    .filter((item) => item.qty > 0);

  return saveCart(cart);
}

/* ================================
   Remove item
================================ */
export function removeFromCart(productId, weightKg) {
  const cart = loadCart().filter(
    (item) => !(item.productId === productId && item.weightKg === weightKg)
  );

  return saveCart(cart);
}

/* ================================
   Clear cart
================================ */
export function clearCart() {
  return saveCart([]);
}

/* ================================
   Calculate item total
================================ */
export function calcItemTotal(pricePerKg, weightKg, qty) {
  const price = Number(pricePerKg || 0);
  const weight = Number(weightKg || 0);
  const quantity = Number(qty || 0);

  return Math.round(price * weight * quantity);
}

/* ================================
   Calculate cart totals
================================ */
export function calcCartTotals(cart) {
  const subtotal = (cart || []).reduce(
    (sum, item) => sum + Number(item.lineTotal || 0),
    0
  );

  const deliveryFee = 0; // Free delivery
  const total = subtotal + deliveryFee;

  return {
    subtotal,
    deliveryFee,
    total,
  };
}