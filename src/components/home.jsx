import React from 'react';
import { motion } from 'framer-motion';

const Home = () => (
  <div className="home">
    <motion.section className="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <img src="/assets/hero-fish.jpg" alt="Fresh Fish" />
      <h1>Fresh Fish Delivered to Your Doorstep</h1>
      <button>Shop Now</button>
    </motion.section>
    <section className="featured">
      {/* Fetch and display products */}
    </section>
    <section className="reviews">
      <p>Great service! - Customer</p>
    </section>
  </div>
);

export default Home;