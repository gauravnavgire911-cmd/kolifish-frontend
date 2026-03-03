import React from "react";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="product-card">

      {/* Premium Ribbon */}
      <div className="ribbon">Fresh Today</div>

      <img src={product.image} alt={product.name} />

      <div className="card-content">
        <h3>{product.name}</h3>
        <p className="price">₹{product.price}/kg</p>

        <button onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>

    </div>
  );
};

export default ProductCard;