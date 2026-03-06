import React, { useEffect, useMemo, useState } from "react";

const FALLBACK_IMG = "https://via.placeholder.com/900x650?text=KoliFish";

export default function ProductGallery({ product }) {
  const images = useMemo(() => {
    const list = [];

    if (product?.image) list.push(product.image);

    if (Array.isArray(product?.images) && product.images.length) {
      list.push(...product.images);
    }

    const cleaned = Array.from(
      new Set(
        list
          .map((img) => (typeof img === "string" ? img.trim() : ""))
          .filter(Boolean)
      )
    );

    return cleaned.length ? cleaned : [FALLBACK_IMG];
  }, [product]);

  const [active, setActive] = useState(images[0] || FALLBACK_IMG);
  const [brokenImages, setBrokenImages] = useState([]);

  useEffect(() => {
    setActive(images[0] || FALLBACK_IMG);
    setBrokenImages([]);
  }, [images]);

  const visibleImages = images.filter((img) => !brokenImages.includes(img));
  const finalImages = visibleImages.length ? visibleImages : [FALLBACK_IMG];
  const activeImage = finalImages.includes(active) ? active : finalImages[0];

  const handleImageError = (src) => {
    setBrokenImages((prev) => {
      if (prev.includes(src)) return prev;
      return [...prev, src];
    });
  };

  return (
    <div className="gallery">
      <div className="galleryMain">
        <img
          src={activeImage || FALLBACK_IMG}
          alt={product?.name || "Product"}
          loading="lazy"
          onError={(e) => {
            const failedSrc = e.currentTarget.src;
            handleImageError(failedSrc);
            e.currentTarget.src = FALLBACK_IMG;
          }}
        />
      </div>

      {finalImages.length > 1 && (
        <div className="galleryThumbs">
          {finalImages.slice(0, 8).map((src, idx) => (
            <button
              key={`${src}-${idx}`}
              type="button"
              className={`thumb ${src === activeImage ? "active" : ""}`}
              onClick={() => setActive(src)}
              aria-label={`View image ${idx + 1}`}
            >
              <img
                src={src}
                alt={`${product?.name || "Product"} thumbnail ${idx + 1}`}
                loading="lazy"
                onError={(e) => {
                  handleImageError(src);
                  e.currentTarget.src = FALLBACK_IMG;
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}