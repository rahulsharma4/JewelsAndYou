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
  const [categories, setCategories] = useState(['All']);
  const [prevQuery, setPrevQuery] = useState(query);

  useEffect(() => {
    if (query) {
      if (query !== prevQuery) {
        setPrevQuery(query);
        setCategory('All');
        return;
      }
      performSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, sortBy, category, prevQuery]);

  const performSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      // Always fetch all to build accurate category facets
      const response = await api.searchProducts(query, {
        sort: sortBy === 'newest' ? '' : sortBy,
        category: 'All',
        limit: 100
      });
      
      const matches = response.products || [];
      
      // Build facets from actual results
      const uniqueCats = new Set(
        matches
          .map(p => p.category)
          .filter(cat => typeof cat === 'string' && cat.trim() !== '' && /[a-zA-Z0-9]/.test(cat))
      );
      setCategories(['All', ...Array.from(uniqueCats).sort()]);

      // Filter locally based on selected category
      if (category && category !== 'All') {
        setSearchResults(matches.filter(p => p.category === category));
      } else {
        setSearchResults(matches);
      }
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

  return (
    <div className="min-h-screen bg-brand-teal pt-4 md:pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-brand-off mb-1">
            {query ? <>Results for <span className="text-brand-gold">"{query}"</span></> : 'Search Products'}
          </h1>
          <p className="text-brand-off/60 text-sm">
            {loading ? 'Searching...' : `${searchResults.length} product${searchResults.length !== 1 ? 's' : ''} found`}
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3 mb-8"
        >
          {/* Category Filter */}
          <div className="flex-1">
            <label className="block text-xs font-semibold text-brand-off/50 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-brand-off/15 bg-brand-tealDark text-brand-off text-sm focus:outline-none focus:border-brand-gold/50 transition"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-brand-tealDark">{cat}</option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
          <div className="flex-1">
            <label className="block text-xs font-semibold text-brand-off/50 uppercase tracking-wider mb-1.5">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-brand-off/15 bg-brand-tealDark text-brand-off text-sm focus:outline-none focus:border-brand-gold/50 transition"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-brand-tealDark">
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Category Pills (dynamic facets) */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  category === cat
                    ? 'bg-brand-gold text-brand-tealDark border-brand-gold shadow-md shadow-brand-gold/20'
                    : 'border-brand-off/20 text-brand-off/70 hover:border-brand-gold/40 hover:text-brand-off bg-brand-tealDark/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-900/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-8"
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
        {!loading && !error && searchResults.length === 0 && query && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 rounded-2xl bg-brand-tealDark/50 border border-brand-gold/10"
          >
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-heading font-semibold text-brand-off mb-2">
              No products found for "{query}"
            </h3>
            <p className="text-brand-off/50 text-sm">
              Try a different word or remove the category filter
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

