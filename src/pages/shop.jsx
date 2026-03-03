import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard.jsx";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(`${API_BASE}/api/products`);

        // backend returns an array
        const data = res.data;
        const list = Array.isArray(data) ? data : data?.products ?? [];

        setProducts(list);
      } catch (e) {
        setError(
          e?.response?.data?.message || e?.message || "Failed to fetch products"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="productsGrid">
        {products.map((p) => (
          <ProductCard key={p._id || p.id} product={p} />
        ))}
      </div>
    </div>
  );
}