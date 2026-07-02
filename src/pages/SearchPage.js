import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import api from "../services/api";

const SearchPage = ({ onAddToCart, onToggleFavorite, favorites = [] }) => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query, sortBy, category]);

  const performSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.searchProducts(query, {
        sort: sortBy === 'newest' ? '' : sortBy,
        category: category
      });
      setSearchResults(response.products || []);
    } catch (err) {
      setError('Failed to search products');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  const categories = ['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Watches', 'Pendants'];

  return (
    <div className="min-h-screen bg-brand-teal pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-brand-gold mb-2">
            Search Results for "{query}"
          </h1>
          <p className="text-brand-off">
            {loading ? 'Searching...' : `${searchResults.length} products found`}
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          {/* Category Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-brand-off mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-gold"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-brand-off mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-gold"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8"
          >
            {error}
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center py-12"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold"></div>
          </motion.div>
        )}

        {/* No Results */}
        {!loading && !error && searchResults.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-brand-gold mb-2">
              No products found
            </h3>
            <p className="text-brand-off">
              Try adjusting your search terms or filters
            </p>
          </motion.div>
        )}

        {/* Search Results */}
        {!loading && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {searchResults.map((product, index) => (
              <motion.div
                key={product.id || product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  onToggleFavorite={onToggleFavorite}
                  isFavorite={favorites.includes(product.id || product._id)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;

