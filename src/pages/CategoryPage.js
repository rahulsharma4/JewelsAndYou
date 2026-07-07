import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion";
import api from "../services/api";

const CategoryPage = ({ onAddToCart, onToggleFavorite, favorites = [] }) => {
  const { name } = useParams();
  const navigate = useNavigate();
  const decoded = decodeURIComponent(name || "");
  const normalized = decoded.trim();
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const data = await api.getProducts({ category: normalized, limit: 100 });
        setCategoryProducts(data.products || []);
      } catch (err) {
        console.error("Error loading products for category:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryProducts();
  }, [normalized]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero */}
      <section className="bg-brand-tealDark text-brand-off rounded-lg p-8 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }} className="text-3xl sm:text-4xl font-extrabold mb-2">
            {normalized}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="opacity-90">
            Discover our curated selection of {normalized.toLowerCase()} crafted with timeless elegance.
          </motion.p>
          <div className="mt-4">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} onClick={() => navigate("/products")} className="rounded-md bg-brand-gold text-brand-tealDark px-6 py-2 font-semibold">
              View All Products
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-gold"></div>
        </div>
      ) : categoryProducts.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-brand-off/80 bg-brand-tealDark rounded-lg p-8">
          No products found in this category.
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryProducts.map((product) => (
            <motion.div key={product._id || product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} whileHover={{ y: -8, boxShadow: '0 10px 30px rgba(0,0,0,0.35)' }}>
              <ProductCard
                product={product}
                onAddToCart={onAddToCart}
                onToggleFavorite={onToggleFavorite}
                isFavorite={favorites.includes(product._id || product.id)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
