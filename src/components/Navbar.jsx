import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

export default function Navbar({
  cartCount = 0,
  total = 0,
  phone1 = "8600010942",
  phone2 = "8600010944",
}) {
  const { pathname } = useLocation();
  const isShop = pathname.includes("shop");

  return (
    <header className="siteHeader">
      <div className="navShell">
        {/* Brand */}
        <Link to="/" className="brand">
          <span className="brandMark">K</span>
          <span className="brandText">KoliFish</span>
        </Link>

        {/* Search (optional - keep if you already have search wiring) */}
        <div className="navSearch">
          <input placeholder="Search fish..." />
          <button aria-label="Search">
            🔍
          </button>
        </div>

        {/* Right actions */}
        <div className="navRight">
          <a
            className="pill pillGreen"
            href={`https://wa.me/91${phone1}`}
            target="_blank"
            rel="noreferrer"
          >
            Order on WhatsApp
          </a>

          <a className="pill pillBlue" href={`tel:${phone1}`}>
            Call Now
          </a>

          <div className="cartMini">
            <span className="cartText">
              Cart: <b>{cartCount}</b> items • Total: <b>₹{total}</b>
            </span>
            <Link to="/cart" className="cartIcon" aria-label="Cart">
              🛒
            </Link>
          </div>
        </div>
      </div>

      {/* Secondary nav links */}
      <nav className="navLinks">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
          Home
        </NavLink>
        <NavLink to="/shop" className={({ isActive }) => (isActive ? "active" : "")}>
          Shop
        </NavLink>
        <NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")}>
          Contact
        </NavLink>
        <NavLink to="/track" className={({ isActive }) => (isActive ? "active" : "")}>
          Track
        </NavLink>

        {isShop && (
          <span className="navHint">Same-day delivery • COD/UPI available</span>
        )}
      </nav>
    </header>
  );
}