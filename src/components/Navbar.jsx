import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

export default function Navbar({
  cartCount = 0,
  total = 0,
  phone1 = "8600010942",
  phone2 = "8600010944",
  whatsappLink1 = "",
  whatsappLink2 = "",
  searchValue = "",
  onSearchChange = () => {},
}) {
  const { pathname } = useLocation();
  const isShop = pathname.startsWith("/shop") || pathname === "/";

  const wa1 = whatsappLink1 || `https://wa.me/91${phone1}`;
  const wa2 = whatsappLink2 || `https://wa.me/91${phone2}`;

  return (
    <header className="siteHeader">
      <div className="navShell">
        {/* Brand */}
        <Link to="/" className="brand" aria-label="KoliFish Home">
          <span className="brandMark">K</span>
          <span className="brandText">KoliFish</span>
        </Link>

        {/* Search (LIVE) */}
        <div className="navSearch" role="search">
          <input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search fish... (Surmai, Pomfret...)"
            aria-label="Search products"
          />
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => onSearchChange("")}
            title="Clear"
            style={{ cursor: "pointer" }}
          >
            {searchValue ? "✕" : "🔍"}
          </button>
        </div>

        {/* Right actions */}
        <div className="navRight">
          {/* WhatsApp (two numbers inside one premium pill) */}
          <div className="pill pillGreen" aria-label="WhatsApp order numbers">
            <span style={{ fontWeight: 950 }}>WhatsApp</span>
            <span style={{ opacity: 0.92, marginLeft: 8 }}>:</span>

            <a
              href={wa1}
              target="_blank"
              rel="noreferrer"
              style={pillLinkStyle}
              title={`WhatsApp ${formatIndianPhone(phone1)}`}
            >
              {formatIndianPhone(phone1)}
            </a>

            <span style={{ opacity: 0.9, margin: "0 8px" }}>/</span>

            <a
              href={wa2}
              target="_blank"
              rel="noreferrer"
              style={pillLinkStyle}
              title={`WhatsApp ${formatIndianPhone(phone2)}`}
            >
              {formatIndianPhone(phone2)}
            </a>
          </div>

          {/* Call (two numbers inside one pill) */}
          <div className="pill pillBlue" aria-label="Call numbers">
            <span style={{ fontWeight: 950 }}>Call</span>
            <span style={{ opacity: 0.92, marginLeft: 8 }}>:</span>

            <a
              href={`tel:+91${phone1}`}
              style={pillLinkStyle}
              title={`Call ${formatIndianPhone(phone1)}`}
            >
              {formatIndianPhone(phone1)}
            </a>

            <span style={{ opacity: 0.9, margin: "0 8px" }}>/</span>

            <a
              href={`tel:+91${phone2}`}
              style={pillLinkStyle}
              title={`Call ${formatIndianPhone(phone2)}`}
            >
              {formatIndianPhone(phone2)}
            </a>
          </div>

          {/* Cart (badge) */}
          <div className="cartMini">
            <span className="cartText">
              Cart: <b>{cartCount}</b> • Total: <b>₹{Number(total || 0)}</b>
            </span>

            <Link
              to="/cart"
              className="cartIcon"
              aria-label={`Cart (${cartCount} items)`}
              style={{ position: "relative" }}
            >
              🛒

              {cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                    minWidth: 18,
                    height: 18,
                    padding: "0 6px",
                    borderRadius: 999,
                    background: "rgba(28, 191, 106, 0.95)",
                    color: "white",
                    fontSize: 11,
                    fontWeight: 900,
                    display: "grid",
                    placeItems: "center",
                    border: "1px solid rgba(255,255,255,0.55)",
                    boxShadow: "0 10px 18px rgba(0,0,0,0.18)",
                  }}
                >
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Secondary nav links */}
      <nav className="navLinks" aria-label="Primary">
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
          <span className="navHint">
            90-minute delivery • Free delivery • COD/UPI available
          </span>
        )}
      </nav>
    </header>
  );
}

const pillLinkStyle = {
  color: "inherit",
  textDecoration: "none",
  marginLeft: 8,
  fontWeight: 950,
};

function formatIndianPhone(num) {
  const s = String(num || "").replace(/\D/g, "");
  if (s.length === 10) return `${s.slice(0, 5)} ${s.slice(5)}`;
  return num;
}