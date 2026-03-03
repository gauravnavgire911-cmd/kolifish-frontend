import React from "react";

function Footer() {
  return (
    <footer className="siteFooter">
      <div className="footerInner">

        <div className="footerBrand">
          <div className="footerLogo">KoliFish</div>
          <p className="footerTag">
            Fresh. Clean-Cut. Delivered.
            <br />
            Pune • Same-Day Delivery • COD / UPI / Card
          </p>
        </div>

        <div className="footerCols">

          <div>
            <h4>Quick Links</h4>
            <a href="/">Home</a>
            <a href="/shop">Shop</a>
            <a href="/track">Track Order</a>
            <a href="/contact">Contact</a>
          </div>

          <div>
            <h4>Customer</h4>
            <a href="/cart">Cart</a>
            <a href="/checkout">Checkout</a>
            <a href="/contact">Support</a>
          </div>

          <div>
            <h4>Order Now</h4>
            <a href="tel:8600010942">86000 10942</a>
            <a href="tel:8600010944">86000 10944</a>
            <a
              href="https://wa.me/918600010942"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp Order
            </a>
          </div>

        </div>
      </div>

      <div className="footerBottom">
        © {new Date().getFullYear()} KoliFish. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;