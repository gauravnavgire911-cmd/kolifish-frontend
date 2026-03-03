import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import Cart from './Cart';

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartCount } = useCart();

  return (
    <>
      <nav style={styles.navbar}>
        <div style={styles.logo}>
          <img src="/logo.png" alt="Koli Fish" style={{ height: 42 }} />
        </div>
        <div style={styles.navLinks}>
          <a href="/" style={styles.link}>Home</a>
          <a href="/products" style={styles.link}>Products</a>
          <button
            style={styles.cartButton}
            onClick={() => setIsCartOpen(true)}
          >
            🛒 Cart ({cartCount})
          </button>
        </div>
      </nav>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: '#007bff',
    color: '#fff',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '16px',
  },
  cartButton: {
    padding: '8px 15px',
    backgroundColor: '#fff',
    color: '#007bff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default Navbar;