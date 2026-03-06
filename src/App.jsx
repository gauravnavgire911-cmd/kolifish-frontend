import { useEffect, useMemo, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { getProducts } from "./api";

import {
  loadCart,
  calcCartTotals,
} from "./components/cartUtils";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/footer.jsx";
import ProductCard from "./components/ProductCard.jsx";

import ProductPage from "./pages/product.jsx";
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
const createWhatsAppLink = (cart) => {
  const lines = cart.map((item) => {
    const grams = Math.round((item.weightKg || 0) * 1000);
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
  const [cart] = useState(() => loadCart());
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

      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage search={search} />} />
          <Route path="/product/:id" element={<ProductPage />} />
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
   HOME PAGE
========================= */
function HomePage({ search = "" }) {
  const navigate = useNavigate();
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

        setProducts(normalized.slice(0, 6));
      })
      .catch((err) => setError(err?.message || "Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  const query = search.trim().toLowerCase();
  const filteredProducts = query
    ? products.filter((p) =>
        [p.name || "", p.altName || "", p.category || "", p.description || ""]
          .join(" ")
          .toLowerCase()
          .includes(query)
      )
    : products;

  return (
    <>
      <HeroSection />
      <FeaturedSection
        products={filteredProducts}
        loading={loading}
        error={error}
        onOpen={(productId) => navigate(`/product/${productId}`)}
      />
      <WhyChooseUs />
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
   FEATURED SECTION
========================= */
function FeaturedSection({ products, loading, error, onOpen }) {
  return (
    <section style={{ marginTop: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ marginBottom: 6 }}>Featured Catch</h2>
        <p className="muted" style={{ marginTop: 0 }}>
          Handpicked fresh seafood from today’s best selection.
        </p>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading...</p>}

      {!loading && !error && products.length === 0 && (
        <p className="muted">No featured products found right now.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="productsGrid">
          {products.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              onOpen={() => onOpen(product._id || product.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/* =========================
   WHY CHOOSE US
========================= */
function WhyChooseUs() {
  const items = [
    {
      title: "Freshly Sourced",
      text: "Selected seafood from trusted markets and coastal supply chains.",
    },
    {
      title: "Cleaned Your Way",
      text: "Choose preferred cutting styles depending on the fish type.",
    },
    {
      title: "Packed Hygienically",
      text: "Handled and packed carefully for freshness and clean delivery.",
    },
    {
      title: "Quick Delivery",
      text: "Fast doorstep service across your delivery area.",
    },
  ];

  return (
    <section style={{ marginTop: 36, marginBottom: 12 }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ marginBottom: 6 }}>Why KoliFish</h2>
        <p className="muted" style={{ marginTop: 0 }}>
          Fresh seafood with a cleaner, simpler buying experience.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {items.map((item) => (
          <div
            key={item.title}
            style={{
              background: "#fff",
              borderRadius: 18,
              padding: 18,
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 10px 28px rgba(0,0,0,0.05)",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>{item.title}</h3>
            <p style={{ margin: 0, opacity: 0.8, lineHeight: 1.6 }}>
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
