import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/footer.jsx";

import AdminLogin from "./pages/adminlogin.jsx";
import CartPage from "./pages/cartpage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import Contact from "./pages/contact.jsx";
import OrderTracking from "./pages/ordertracking.jsx";
import ShopPage from "./pages/shop.jsx";
// If you have home.jsx page, import it and use it for "/"
import Home from "./components/home.jsx";

export default function App() {
  return (
    <div style={styles.app}>
      <Navbar />

      <main style={styles.main}>
        <Routes>
          {/* Use your real Home page */}
          <Route path="/" element={<Home />} />

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
    </div>
  );
}

const styles = {
  app: {
    fontFamily: "system-ui",
    background: "#f7fafc",
    minHeight: "100vh",
  },
  main: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: 20,
  },
};