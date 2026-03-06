import React, { useEffect, useMemo, useState } from "react";
import { useCart } from "../context/CartContext";

const FALLBACK_IMG = "https://via.placeholder.com/600x450?text=KoliFish";

const ProductCard = ({ product, onOpen }) => {
  const { addToCart } = useCart();
  const [hover, setHover] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const imageList = useMemo(() => {
    const list = [];

    if (Array.isArray(product?.images) && product.images.length) {
      list.push(...product.images.filter(Boolean));
    }

    if (product?.image) {
      list.unshift(product.image);
    }

    const cleaned = Array.from(new Set(list.filter(Boolean)));
    return cleaned.length ? cleaned : [FALLBACK_IMG];
  }, [product]);

  useEffect(() => {
    setCurrentIndex(0);

    if (imageList.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % imageList.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [imageList]);

  const displayedImage = hover
    ? imageList[1] || imageList[0]
    : imageList[currentIndex] || FALLBACK_IMG;

  const price = product?.pricePerKg ?? product?.price ?? 0;

  const handleAddToCart = (e) => {
    e?.stopPropagation?.();
    addToCart(product);
  };

  const handleOpen = () => {
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
      <div className="ribbon">Fresh Today</div>

      <img
        src={displayedImage}
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