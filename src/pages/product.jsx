import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ProductGallery from "../components/ProductGallery.jsx";
import { useCart } from "../context/CartContext";

const API_BASE = import.meta.env.VITE_API_BASE;

const WEIGHTS = [
  { label: "250g", kg: 0.25 },
  { label: "500g", kg: 0.5 },
  { label: "1kg", kg: 1 },
  { label: "2kg", kg: 2 },
];

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [weightKg, setWeightKg] = useState(0.5);
  const [cutStyle, setCutStyle] = useState("");

  useEffect(() => {
    const fetchOne = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(`${API_BASE}/api/products/${id}`);
        const data = res?.data?.product || res?.data || null;

        setProduct(data);

        const cuts =
          Array.isArray(data?.cuttingOptions) && data.cuttingOptions.length
            ? data.cuttingOptions
            : ["Standard Cut"];

        setCutStyle(cuts[0]);
      } catch (e) {
        setError(
          e?.response?.data?.message || e?.message || "Failed to fetch product"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOne();
  }, [id]);

  const pricePerKg = product?.pricePerKg ?? product?.price ?? 0;
  const totalPrice = Math.round(pricePerKg * weightKg);

  const cutOptions = useMemo(() => {
    if (Array.isArray(product?.cuttingOptions) && product.cuttingOptions.length) {
      return product.cuttingOptions;
    }
    return ["Standard Cut"];
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      ...product,
      productId: product._id || product.id,
      pricePerKg,
      weightKg,
      cutStyle,
      qty: 1,
      lineTotal: totalPrice,
    });
  };

  if (loading) return <div style={{ padding: 16 }}>Loading...</div>;
  if (error) return <div style={{ padding: 16, color: "red" }}>{error}</div>;
  if (!product) return null;

  return (
    <div style={{ padding: 16, maxWidth: 1180, margin: "0 auto" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
        ← Back
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.05fr 1fr",
          gap: 24,
          alignItems: "start",
        }}
      >
        <div>
          <ProductGallery product={product} />
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 18,
            padding: 20,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <p style={{ margin: 0, opacity: 0.7, fontWeight: 600 }}>
            {product.category || "Seafood"}
          </p>

          <h1 style={{ marginTop: 8, marginBottom: 8 }}>
            {product.name}
            {product.altName ? ` (${product.altName})` : ""}
          </h1>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginBottom: 14,
            }}
          >
            <span
              style={{
                background: "#eef8ff",
                padding: "6px 10px",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {product.freshness || "Fresh"}
            </span>

            <span
              style={{
                background: "#eef8ff",
                padding: "6px 10px",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {product.availability === "in_stock" ? "In Stock" : product.availability}
            </span>

            {product.origin ? (
              <span
                style={{
                  background: "#eef8ff",
                  padding: "6px 10px",
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                Origin: {product.origin}
              </span>
            ) : null}
          </div>

          <p
            className="price"
            style={{ fontSize: 26, fontWeight: 800, margin: "8px 0 4px" }}
          >
            ₹{totalPrice}
          </p>

          <p style={{ marginTop: 0, opacity: 0.75, fontWeight: 600 }}>
            ₹{pricePerKg}/kg
          </p>

          <p style={{ opacity: 0.92, lineHeight: 1.6 }}>
            {product.description || "Freshly sourced and hygienically packed seafood."}
          </p>

          <div
            style={{
              display: "grid",
              gap: 14,
              marginTop: 18,
              marginBottom: 18,
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 700,
                }}
              >
                Select Weight
              </label>
              <select
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: "1px solid #d7dce3",
                  fontSize: 16,
                }}
              >
                {WEIGHTS.map((w) => (
                  <option key={w.kg} value={w.kg}>
                    {w.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: 700,
                }}
              >
                Select Cutting Style
              </label>
              <select
                value={cutStyle}
                onChange={(e) => setCutStyle(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: "1px solid #d7dce3",
                  fontSize: 16,
                }}
              >
                {cutOptions.map((cut) => (
                  <option key={cut} value={cut}>
                    {cut}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            style={{
              marginTop: 4,
              width: "100%",
              padding: "15px 18px",
              border: "none",
              borderRadius: 14,
              fontSize: 18,
              fontWeight: 800,
              cursor: "pointer",
              background:
                "linear-gradient(90deg, rgb(6, 70, 136), rgb(24, 170, 212))",
              color: "#fff",
            }}
          >
            Add to Cart
          </button>

          <div
            style={{
              marginTop: 24,
              background: "#f8fbff",
              borderRadius: 16,
              padding: 18,
              border: "1px solid #e8eef5",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: 12 }}>Nutritional Values</h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 10,
              }}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: 12,
                  border: "1px solid #edf2f7",
                }}
              >
                <strong>Protein</strong>
                <div>{product?.nutrition?.protein || "N/A"}</div>
              </div>

              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: 12,
                  border: "1px solid #edf2f7",
                }}
              >
                <strong>Fat</strong>
                <div>{product?.nutrition?.fat || "N/A"}</div>
              </div>

              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: 12,
                  border: "1px solid #edf2f7",
                }}
              >
                <strong>Calories</strong>
                <div>{product?.nutrition?.calories || "N/A"}</div>
              </div>

              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: 12,
                  border: "1px solid #edf2f7",
                }}
              >
                <strong>Carbs</strong>
                <div>{product?.nutrition?.carbs || "N/A"}</div>
              </div>
            </div>

            <p style={{ marginTop: 12, marginBottom: 0, fontSize: 13, opacity: 0.7 }}>
              {product?.nutritionNote || "Approximate values per 100g."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}