import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../components/productcard"; // match your filename casing

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ search: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const params = {};
        if (filters.search) params.search = filters.search;
        if (filters.type) params.type = filters.type;

        const res = await axios.get("https://kolifish-backend.onrender.com/api/products", { params });

        setProducts(res.data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  return (
    <div className="shop" style={{ padding: "16px" }}>
      <input
        type="text"
        placeholder="Search by name or description"
        value={filters.search}
        onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
        style={{ marginBottom: "10px", padding: "8px", width: "100%" }}
      />

      <select
        value={filters.type}
        onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
        style={{ marginBottom: "20px", padding: "8px", width: "200px" }}
      >
        <option value="">All Types</option>
        <option value="Freshwater">Freshwater</option>
        <option value="Seawater">Seawater</option>
      </select>

      {loading && <p>Loading products...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="products" style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {products.length > 0 ? (
          products.map((p) => <ProductCard key={p._id} product={p} />)
        ) : (
          !loading && <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default Shop;