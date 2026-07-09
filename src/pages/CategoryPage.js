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
      <section className="bg-white rounded-[2rem] p-10 md:p-14 mb-10 border border-brand-gold/15 shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-brand-gold/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center relative z-10">
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }} className="text-4xl sm:text-5xl font-heading font-bold mb-4 text-brand-dark">
            {normalized}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="text-brand-dark/70 font-medium max-w-2xl mx-auto mb-8 text-lg">
            Discover our curated selection of {normalized.toLowerCase()} crafted with timeless elegance.
          </motion.p>
          <div>
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.98 }} 
              transition={{ type: 'spring', stiffness: 300, damping: 20 }} 
              onClick={() => navigate("/products")} 
              className="rounded-2xl bg-brand-gold text-white px-8 py-3.5 font-bold uppercase tracking-widest text-sm shadow-[0_8px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_12px_25px_rgba(212,175,55,0.35)]"
            >
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-brand-dark/80 bg-brand-light rounded-lg p-8">
          No products found in this category.
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryProducts.map((product) => (
            <motion.div key={product._id || product.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
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
