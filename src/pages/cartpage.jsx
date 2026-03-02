import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Cart from '../components/Cart';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]); // Replace with actual cart state

  const updateQuantity = (id, qty) => {
    setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity: qty } : item));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Your Cart</h2>
      <Cart cartItems={cartItems} updateQuantity={updateQuantity} removeItem={removeItem} />
      <p>Total: ₹{total}</p>
      <Link to="/checkout"><button>Proceed to Checkout</button></Link>
    </div>
  );
};

export default CartPage;