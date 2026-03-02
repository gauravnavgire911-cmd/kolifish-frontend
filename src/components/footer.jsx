import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const Footer = () => (
  <footer style={{ background: '#00695c', color: 'white', padding: '20px', textAlign: 'center' }}>
    <p>&copy; 2023 Koli Fish. Fresh Fish Delivered.</p>
    <p>Contact: info@kolifish.com | Phone: +91-1234567890</p>
    <a href="https://wa.me/911234567890?text=Hi, I'd like to order fresh fish!" style={{ color: 'white', textDecoration: 'none' }}>
      <FaWhatsapp style={{ marginRight: '5px' }} /> Order via WhatsApp
    </a>
  </footer>
);

export default Footer;