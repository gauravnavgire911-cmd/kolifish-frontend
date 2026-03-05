import React, { useMemo, useState } from "react";
import { useCart } from "../context/CartContext";

const FALLBACK_IMG = "https://via.placeholder.com/600x450?text=KoliFish";

const ProductCard = ({ product, onOpen }) => {
  const { addToCart } = useCart();
  const [hover, setHover] = useState(false);

  const { mainImage, hoverImage } = useMemo(() => {
    const img0 = product?.images?.[0] || product?.image || FALLBACK_IMG;
    const img1 = product?.images?.[1] || img0;
    return { mainImage: img0, hoverImage: img1 };
  }, [product]);

  const price = product?.pricePerKg ?? product?.price ?? 0;

  const handleAddToCart = (e) => {
    // If card becomes clickable later, prevent click bubbling
    e?.stopPropagation?.();
    addToCart(product);
  };

  const handleOpen = () => {
    // optional: if you pass onOpen, it can navigate to product page
    if (typeof onOpen === "function") onOpen(product);
  };

  return (
    <div
      className="product-card"
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onClick={onOpen ? handleOpen : undefined}
      onKeyDown={
        onOpen
          ? (e) => {
              if (e.key === "Enter") handleOpen();
            }
          : undefined
      }
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Premium Ribbon */}
      <div className="ribbon">Fresh Today</div>

      <img
        src={hover ? hoverImage : mainImage}
        alt={product?.name || "Product"}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src = FALLBACK_IMG;
        }}
      />

      <div className="card-content">
        <h3>{product?.name}</h3>
        <p className="price">₹{price}/kg</p>

        <button onClick={handleAddToCart}>Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductCard;