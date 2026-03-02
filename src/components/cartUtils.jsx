const CART_KEY = "kolifish_cart_v1";

export const WEIGHTS = [
  { label: "250g", kg: 0.25 },
  { label: "500g", kg: 0.5 },
  { label: "1kg", kg: 1 },
];

export function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(item) {
  const cart = loadCart();
  const key = `${item.productId}_${item.weightKg}`;

  const idx = cart.findIndex((x) => `${x.productId}_${x.weightKg}` === key);

  if (idx >= 0) {
    cart[idx].qty = (cart[idx].qty || 0) + (item.qty || 0);
  } else {
    cart.push(item);
  }

  saveCart(cart);
  return cart;
}

export function updateQty(productId, weightKg, qty) {
  const cart = loadCart()
    .map((x) =>
      x.productId === productId && x.weightKg === weightKg ? { ...x, qty } : x
    )
    .filter((x) => (x.qty || 0) > 0);

  saveCart(cart);
  return cart;
}

export function clearCart() {
  saveCart([]);
}

export function calcItemTotal(pricePerKg, weightKg, qty) {
  return Math.round((pricePerKg || 0) * (weightKg || 0) * (qty || 0));
}

export function calcCartTotals(cart) {
  const subtotal = (cart || []).reduce((sum, x) => sum + (x.lineTotal || 0), 0);
  const deliveryFee = 0; // Free delivery
  const total = subtotal + deliveryFee;
  return { subtotal, deliveryFee, total };
}
