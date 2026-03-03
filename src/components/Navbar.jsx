import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Cart from './Cart';

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartCount } = useCart();

  return (
  <>
    <nav className="navbar">
      <Link to="/" className="logo">
        <img src="/logo.png" alt="Koli Fish" />
      </Link>

      <div className="navLinks">
        <Link to="/" className="navLink">Home</Link>
        <Link to="/products" className="navLink">Products</Link>

        <button
          className="cartButton"
          onClick={() => setIsCartOpen(true)}
        >
          🛒 Cart ({cartCount})
        </button>
      </div>
    </nav>

    <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
  </>
);

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: '#007bff',
    color: '#fff',
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
  },
  logoImg: {
    height: 42,
    width: 'auto',
    display: 'block',
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