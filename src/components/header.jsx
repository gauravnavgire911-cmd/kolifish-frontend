import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaSearch } from 'react-icons/fa';

const Header = () => {
  const [cartCount] = useState(0); // Replace with actual cart state (e.g., from context)

  return (
    <header style={{ background: '#00bcd4', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '24px' }}>Koli Fish</Link>
      <div>
        <input type="text" placeholder="Search fish..." style={{ padding: '5px' }} />
        <FaSearch style={{ marginLeft: '10px', cursor: 'pointer' }} />
      </div>
      <nav>
        <Link to="/shop" style={{ color: 'white', margin: '0 10px' }}>Shop</Link>
        <Link to="/contact" style={{ color: 'white', margin: '0 10px' }}>Contact</Link>
        <Link to="/cart" style={{ color: 'white', margin: '0 10px', position: 'relative' }}>
          <FaShoppingCart />
          {cartCount > 0 && <span style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'red', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '12px' }}>{cartCount}</span>}
        </Link>
      </nav>
    </header>
  );
};

export default Header;