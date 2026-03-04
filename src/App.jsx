import { useEffect, useMemo, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { getProducts } from "./api";

import { WEIGHTS, addToCart, calcItemTotal, loadCart, calcCartTotals } from "./components/cartUtils";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/footer.jsx";

import AdminLogin from "./pages/adminlogin.jsx";
import CartPage from "./pages/cartpage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import Contact from "./pages/contact.jsx";
import OrderTracking from "./pages/ordertracking.jsx";
import ShopPage from "./pages/shop.jsx";

const WHATSAPP_NUMBER = "8600010944";

/* =========================
   Utility Functions
========================= */
const formatINR = (n) => `₹${Number(n || 0)}`;

const createWhatsAppLink = (cart) => {
  const lines = cart.map((item) => {
    const grams = Math.round(item.weightKg * 1000);
    return `• ${item.name} — ${grams}g × ${item.qty} = ₹${item.lineTotal}`;
  });

  const total = cart.reduce((sum, item) => sum + (item.lineTotal || 0), 0);

  const message =
    `Hi KoliFish! I want to place an order ✅\n\n` +
    `Order:\n${lines.length ? lines.join("\n") : "Cart is empty"}\n\n` +
    `Total: ₹${total}\n` +
    `Delivery: 90 minutes • Free delivery\n` +
    `Payment: COD / UPI / Card\n\n` +
    `Name:\nPhone:\nAddress:\nLandmark:`;

  return `https://wa.me/91${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

/* =========================
   MAIN APP
========================= */
export default function App() {
  const [cart, setCart] = useState(() => loadCart());
  const [search, setSearch] = useState("");

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + (item.qty || 0), 0),
    [cart]
  );

  const totals = useMemo(() => calcCartTotals(cart), [cart]);

  return (
    <>
      <Navbar
        cartCount={cartCount}
        total={totals.total}
        phone1="8600010942"
        phone2="8600010944"
        whatsappLink1={createWhatsAppLink(cart)}
        whatsappLink2={createWhatsAppLink(cart)}
        searchValue={search}
        onSearchChange={setSearch}
      />

      {/* ✅ NO inline styles here (lets premium body background show) */}
      <main className="container">
        <Routes>
          <Route
            path="/"
            element={<ShopHome cart={cart} setCart={setCart} search={search} />}
          />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/track" element={<OrderTracking />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

/* =========================
   SHOP HOME PAGE
========================= */
function ShopHome({ setCart, search = "" }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    getProducts()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.products ?? [];
        const normalized = list.map((p) => ({
          ...p,
          pricePerKg: p.pricePerKg ?? p.price ?? 0,
        }));
        setProducts(normalized);
      })
      .catch((err) => setError(err?.message || "Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  // ✅ SEARCH FILTER (case-insensitive)
  const query = search.trim().toLowerCase();
  const filteredProducts = query
    ? products.filter((p) => (p.name || "").toLowerCase().includes(query))
    : products;

  return (
    <>
      <HeroSection />

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading...</p>}

      {!loading && !error && filteredProducts.length === 0 && (
        <p className="muted" style={{ marginTop: 12 }}>
          No results for <b>{search}</b>. Try “Surmai”, “Pomfret”, “Rohu”.
        </p>
      )}

      <div className="productsGrid">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product._id || product.id}
            product={product}
            onAdd={(weightKg) => {
              const newCart = addToCart({
                productId: product._id || product.id,
                name: product.name,
                image: product.image,
                pricePerKg: product.pricePerKg,
                weightKg,
                qty: 1,
                lineTotal: 0,
              });

              const updatedCart = newCart.map((item) => ({
                ...item,
                lineTotal: calcItemTotal(item.pricePerKg, item.weightKg, item.qty),
              }));

              localStorage.setItem("kolifish_cart_v1", JSON.stringify(updatedCart));
              setCart(updatedCart);
            }}
          />
        ))}
      </div>
    </>
  );
}

/* =========================
   HERO SECTION
========================= */
function HeroSection() {
  return (
    <div className="hero">
      <h1>Fresh. Clean-Cut. Delivered.</h1>
      <p>90-minute delivery • Free delivery • COD / UPI / Card</p>

      <div className="badgeRow">
        <span className="badge">✔ FSSAI Certified</span>
        <span className="badge">✔ 100% Fresh Guarantee</span>
        <span className="badge">✔ Same Day Delivery</span>
        <span className="badge">✔ Hygienic Processing Unit</span>
      </div>
    </div>
  );
}

/* =========================
   PRODUCT CARD
========================= */
function ProductCard({ product, onAdd }) {
  const [weightKg, setWeightKg] = useState(0.5);
  const price = Math.round((product.pricePerKg || 0) * weightKg);

  return (
    <div className="productCard">
      <div className="ribbon">Fresh Today</div>

      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      )}

      <div className="content">
        <h3>{product.name}</h3>

        <div className="meta">
          <span className="price">{formatINR(price)}</span>
          <span className="subPrice">{formatINR(product.pricePerKg)}/kg</span>
        </div>

        <select value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value))}>
          {WEIGHTS.map((w) => (
            <option key={w.kg} value={w.kg}>
              {w.label}
            </option>
          ))}
        </select>

        <button onClick={() => onAdd(weightKg)}>Add to Cart</button>
      </div>
    </div>
  );
}

/* =========================
   NOTE
========================= */
/**
 * ✅ Removed old inline "styles" object entirely.
 * Reason: inline background was overriding your premium CSS background.
 * Keep all styling inside src/styles.css (premium theme).
 */