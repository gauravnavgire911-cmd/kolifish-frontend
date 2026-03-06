import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";

// ============================================
// CONFIGURATION
// ============================================
const API_BASE = import.meta.env.VITE_API_BASE;

// ============================================
// COMPONENT: SHOP
// ============================================
export default function Shop() {
  const navigate = useNavigate();
  
  // --- State Management ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- Data Fetching Logic ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(`${API_BASE}/api/products`);
        
        // Handle response structure (array or object with 'products' key)
        const data = res.data;
        const list = Array.isArray(data) 
          ? data 
          : data?.products ?? [];
        
        setProducts(list);
      } catch (e) {
        setError(
          e?.response?.data?.message || 
          e?.message || 
          "Failed to fetch products"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // --- Render ---
  return (
    <div style={{ padding: 16 }}>
      {/* Loading State */}
      {loading && <p>Loading...</p>}
      
      {/* Error State */}
      {error && (
        <p style={{ color: "red", marginBottom: 16 }}>
          {error}
        </p>
      )}

      {/* Products Grid */}
      <div className="productsGrid">
        {products.map((p) => (
          <ProductCard
            key={p._id || p.id}
            product={p}
            onOpen={() => navigate(`/product/${p._id || p.id}`)}
          />
        ))}
      </div>
    </div>
  );
}