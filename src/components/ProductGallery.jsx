import React, { useEffect, useMemo, useState } from "react";

export default function ProductGallery({ product }) {
  const images = useMemo(() => {
    const list = [];
    if (product?.images?.length) list.push(...product.images);
    if (product?.image) list.unshift(product.image);
    // remove duplicates + empty
    return Array.from(new Set(list)).filter(Boolean);
  }, [product]);

  const [active, setActive] = useState(images[0] || "");

  useEffect(() => {
    setActive(images[0] || "");
  }, [images]);

  if (!images.length) {
    return (
      <div className="gallery">
        <div className="galleryMain">
          <img
            src="https://via.placeholder.com/900x650?text=KoliFish"
            alt="KoliFish"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="gallery">
      <div className="galleryMain">
        <img src={active} alt={product?.name || "Product"} loading="lazy" />
      </div>

      <div className="galleryThumbs">
        {images.slice(0, 8).map((src, idx) => (
          <button
            key={`${src}-${idx}`}
            type="button"
            className={`thumb ${src === active ? "active" : ""}`}
            onClick={() => setActive(src)}
            aria-label={`View image ${idx + 1}`}
          >
            <img src={src} alt={`thumb-${idx + 1}`} loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
}