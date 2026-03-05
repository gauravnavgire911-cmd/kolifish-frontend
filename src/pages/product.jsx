import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ProductGallery from "../components/ProductGallery.jsx";
import { useCart } from "../context/CartContext";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOne = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(`${API_BASE}/api/products/${id}`);
        setProduct(res.data);
      } catch (e) {
        setError(e?.response?.data?.message || e?.message || "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetchOne();
  }, [id]);

  if (loading) return <div style={{ padding: 16 }}>Loading...</div>;
  if (error) return <div style={{ padding: 16, color: "red" }}>{error}</div>;
  if (!product) return null;

  const price = product?.pricePerKg ?? product?.price ?? 0;

  return (
    <div style={{ padding: 16, maxWidth: 1100, margin: "0 auto" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 12 }}>
        ← Back
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <ProductGallery product={product} />

        <div>
          <h1 style={{ marginTop: 0 }}>{product.name}</h1>
          <p className="price" style={{ fontSize: 18, fontWeight: 700 }}>
            ₹{price}/kg
          </p>
          <p style={{ opacity: 0.9 }}>{product.description}</p>

          <button onClick={() => addToCart(product)} style={{ marginTop: 12 }}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}