import React, { useEffect, useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
import { WEIGHTS } from "../components/cartUtils";

const FALLBACK_IMG = "https://via.placeholder.com/600x450?text=KoliFish";

const ProductCard = ({ product, onOpen }) => {
  const { addToCart } = useCart();

  const [hover, setHover] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState(WEIGHTS[0].kg);
  const [anim, setAnim] = useState(false);

  /* =============================
     Build image list
  ============================= */
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

  /* =============================
     Auto image slider
  ============================= */
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

  /* =============================
     Add to cart
  ============================= */
  const handleAddToCart = (e) => {
    e?.stopPropagation?.();

    const item = {
      productId: product?._id || product?.id,
      name: product?.name,
      pricePerKg: price,
      weightKg: selectedWeight,
      qty: 1,
      image: displayedImage,
    };

    addToCart(item);

    /* cart animation */
    setAnim(true);
    setTimeout(() => setAnim(false), 180);
  };

  const handleOpen = () => {
    if (typeof onOpen === "function") {
      onOpen(product?._id || product?.id);
    }
  };

  /* =============================
     UI
  ============================= */
  return (
    <div
      className={`product-card ${anim ? "cart-anim" : ""}`}
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

        {/* Weight selector */}
        <div className="weight-selector">
          {WEIGHTS.map((w) => (
            <button
              key={w.kg}
              className={`weight-btn ${
                selectedWeight === w.kg ? "active" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedWeight(w.kg);
              }}
            >
              {w.label}
            </button>
          ))}
        </div>

        <button className="add-cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;