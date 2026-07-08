import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { ImageWithFallback } from "../utils/imageUtils";
import { ProductCardSkeleton, ProductListSkeleton } from "../components/LoadingSpinner";
import {
  Gem, SlidersHorizontal, Layers, Star as StarIcon, Tag,
  LayoutGrid, List as ListIcon, ArrowUpDown, X, ChevronDown,
  Search, Heart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";

/* ─── Pill Select for Sort ─── */
const SortSelect = ({ value, onChange, options }) => {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.value === value);
  return (
    <div className="relative" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); }} tabIndex={-1}>
      <button
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-2 rounded-lg border border-brand-off/20 bg-brand-tealDark px-3 py-2 text-sm text-brand-off/90 hover:border-brand-gold/30 transition"
      >
        <ArrowUpDown className="w-3.5 h-3.5 text-brand-gold" />
        <span>{selected?.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute right-0 z-30 mt-1 min-w-[180px] overflow-hidden rounded-xl border border-brand-off/20 bg-brand-tealDark shadow-xl"
          >
            {options.map(opt => (
              <button
                key={opt.value}
                onMouseDown={e => e.preventDefault()}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`block w-full px-4 py-2.5 text-left text-sm transition ${
                  opt.value === value
                    ? 'bg-brand-gold/15 text-brand-gold font-medium'
                    : 'text-brand-off/80 hover:bg-brand-teal/20'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProductsPage = ({ products, onAddToCart, onToggleFavorite, favorites = [], loading = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  // Filter states
  const initialCategory = location.state?.selectedCategory || "All";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState("newest");
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);

  const [apiCategories, setApiCategories] = useState([]);
  const [inputMin, setInputMin] = useState("0");
  const [inputMax, setInputMax] = useState("100000");

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const list = await api.getCategories();
        if (Array.isArray(list)) {
          const clean = list.filter(cat => typeof cat === 'string' && cat.trim() !== '');
          setApiCategories(clean);
        }
      } catch (e) {}
    };
    fetchCats();
  }, []);

  const categories = useMemo(() => {
    return ["All", ...apiCategories];
  }, [apiCategories]);

  const materials = useMemo(() => {
    const mats = new Set(products.map(p => p.material).filter(Boolean));
    return Array.from(mats).sort();
  }, [products]);

  const colors = useMemo(() => {
    const cls = new Set(products.map(p => p.color).filter(Boolean));
    return Array.from(cls).sort();
  }, [products]);

  const maxPrice = useMemo(() => {
    if (products.length === 0) return 100000;
    const maxVal = Math.max(...products.map(p => p.price || 0));
    return maxVal > 0 ? Math.ceil(maxVal / 5000) * 5000 : 100000;
  }, [products]);

  useEffect(() => {
    setPriceRange(prev => [prev[0], maxPrice]);
    setInputMax(maxPrice.toString());
  }, [maxPrice]);

  useEffect(() => {
    setInputMin(priceRange[0].toString());
    setInputMax(priceRange[1].toString());
  }, [priceRange]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategory !== "All") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (selectedMaterials.length > 0) {
      filtered = filtered.filter(p =>
        selectedMaterials.some(m =>
          (p.material && p.material.toLowerCase() === m.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(m.toLowerCase())) ||
          p.name.toLowerCase().includes(m.toLowerCase())
        )
      );
    }
    
    if (selectedColors.length > 0) {
      filtered = filtered.filter(p =>
        selectedColors.some(c =>
          p.color && p.color.toLowerCase() === c.toLowerCase()
        )
      );
    }
    if (selectedRatings.length > 0) {
      filtered = filtered.filter(p => selectedRatings.some(r => (p.rating || 0) >= r));
    }

    // Sort
    switch (sortBy) {
      case "price-low": filtered.sort((a, b) => a.price - b.price); break;
      case "price-high": filtered.sort((a, b) => b.price - a.price); break;
      case "rating": filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      case "name": filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "newest":
      default: filtered.reverse(); break;
    }
    return filtered;
  }, [products, selectedCategory, searchQuery, priceRange, sortBy, selectedMaterials, selectedColors, selectedRatings]);

  const handleClearFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setPriceRange([0, maxPrice]);
    setSortBy("newest");
    setSelectedMaterials([]);
    setSelectedColors([]);
    setSelectedRatings([]);
  };

  const activeFilterCount = [
    selectedCategory !== "All",
    searchQuery,
    selectedMaterials.length > 0,
    selectedColors.length > 0,
    selectedRatings.length > 0,
    priceRange[0] > 0 || priceRange[1] < maxPrice,
  ].filter(Boolean).length;

  const handleMaterialToggle = (m) => setSelectedMaterials(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
  const handleColorToggle = (c) => setSelectedColors(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  const handleRatingToggle = (r) => setSelectedRatings(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);

  /* ─── Filter Sidebar Content ─── */
  const FilterContent = ({ onClose }) => (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-lg">
          <SlidersHorizontal className="w-5 h-5 text-brand-gold" />
          Filters
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button onClick={handleClearFilters} className="text-xs text-brand-gold hover:underline">
              Clear All
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-brand-teal/20 md:hidden">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="h-px bg-brand-off/10" />

      {/* Category */}
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold mb-3">
          <Layers className="w-4 h-4 text-brand-gold" /> Category
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-gold text-brand-tealDark border-brand-gold shadow-sm'
                  : 'border-brand-off/15 text-brand-off/70 hover:border-brand-gold/30 hover:text-brand-off'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold mb-3">
          <Tag className="w-4 h-4 text-brand-gold" /> Price Range
        </div>
        <div className="space-y-4 px-1">
          {/* Clean Custom Dual Range Slider */}
          <div className="pt-2 pb-4 px-1">
            <div className="relative w-full h-1.5 bg-brand-off/10 rounded-full mt-2">
              <div 
                className="absolute h-full bg-brand-gold rounded-full"
                style={{
                  left: `${(priceRange[0] / maxPrice) * 100}%`,
                  width: `${((priceRange[1] - priceRange[0]) / maxPrice) * 100}%`
                }}
              />
              <input
                type="range"
                min={0}
                max={maxPrice}
                step={1}
                value={priceRange[0]}
                onChange={e => {
                  const val = Math.min(parseInt(e.target.value), priceRange[1]);
                  setPriceRange([val, priceRange[1]]);
                }}
                className="custom-range-slider"
              />
              <input
                type="range"
                min={0}
                max={maxPrice}
                step={1}
                value={priceRange[1]}
                onChange={e => {
                  const val = Math.max(parseInt(e.target.value), priceRange[0]);
                  setPriceRange([priceRange[0], val]);
                }}
                className="custom-range-slider"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-off/40 text-xs">₹</span>
              <input
                type="number"
                value={inputMin}
                onChange={e => setInputMin(e.target.value)}
                onBlur={() => {
                  let val = parseInt(inputMin);
                  if (isNaN(val) || val < 0) val = 0;
                  if (val > priceRange[1]) val = priceRange[1];
                  setPriceRange([val, priceRange[1]]);
                  setInputMin(val.toString());
                }}
                onKeyDown={e => e.key === 'Enter' && e.target.blur()}
                className="w-full rounded-lg border border-brand-off/15 bg-transparent pl-6 pr-2 py-2 text-sm focus:border-brand-gold/40 focus:outline-none"
                placeholder="Min"
              />
            </div>
            <span className="text-brand-off/30">—</span>
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-off/40 text-xs">₹</span>
              <input
                type="number"
                value={inputMax}
                onChange={e => setInputMax(e.target.value)}
                onBlur={() => {
                  let val = parseInt(inputMax);
                  if (isNaN(val) || val > maxPrice) val = maxPrice;
                  if (val < priceRange[0]) val = priceRange[0];
                  setPriceRange([priceRange[0], val]);
                  setInputMax(val.toString());
                }}
                onKeyDown={e => e.key === 'Enter' && e.target.blur()}
                className="w-full rounded-lg border border-brand-off/15 bg-transparent pl-6 pr-2 py-2 text-sm focus:border-brand-gold/40 focus:outline-none"
                placeholder="Max"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Material */}
      {materials.length > 0 && (
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold mb-3">
            <Gem className="w-4 h-4 text-brand-gold" /> Material
          </div>
          <div className="flex flex-wrap gap-2">
            {materials.map(m => (
              <button
                key={m}
                onClick={() => handleMaterialToggle(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  selectedMaterials.includes(m)
                    ? 'bg-brand-gold/15 text-brand-gold border-brand-gold/30'
                    : 'border-brand-off/15 text-brand-off/60 hover:border-brand-gold/20'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color */}
      {colors.length > 0 && (
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold mb-3">
            <LayoutGrid className="w-4 h-4 text-brand-gold" /> Color
          </div>
          <div className="flex flex-wrap gap-2">
            {colors.map(c => (
              <button
                key={c}
                onClick={() => handleColorToggle(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  selectedColors.includes(c)
                    ? 'bg-brand-gold/15 text-brand-gold border-brand-gold/30'
                    : 'border-brand-off/15 text-brand-off/60 hover:border-brand-gold/20'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Rating */}
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold mb-3">
          <StarIcon className="w-4 h-4 text-brand-gold" /> Rating
        </div>
        <div className="space-y-1.5">
          {[5, 4, 3, 2, 1].map(r => (
            <button
              key={r}
              onClick={() => handleRatingToggle(r)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                selectedRatings.includes(r)
                  ? 'bg-brand-gold/10 border border-brand-gold/20'
                  : 'hover:bg-brand-teal/10 border border-transparent'
              }`}
            >
              <span className="flex text-yellow-500 text-xs">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>{i < r ? '★' : '☆'}</span>
                ))}
              </span>
              <span className="text-xs text-brand-off/50">& up</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* ── Page Header ── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-brand-off/50 mb-3">
          <button onClick={() => navigate("/")} className="hover:text-brand-gold transition">Home</button>
          <span>/</span>
          <span className="text-brand-off/80">Products</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-1">Our Collection</h1>
            <p className="text-brand-off/60 text-sm">
              {loading ? 'Loading...' : `Showing ${filteredAndSortedProducts.length} of ${products.length} products`}
            </p>
          </div>

          {/* Search + Sort + View */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[180px] md:min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-off/40" />
              <input
                placeholder="Search products..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-brand-off/15 bg-brand-tealDark pl-9 pr-3 py-2 text-sm placeholder-brand-off/40 focus:outline-none focus:border-brand-gold/40 transition"
              />
            </div>

            {/* Sort */}
            <SortSelect
              value={sortBy}
              onChange={v => setSortBy(v)}
              options={[
                { value: 'newest', label: 'Newest' },
                { value: 'price-low', label: 'Price: Low → High' },
                { value: 'price-high', label: 'Price: High → Low' },
                { value: 'rating', label: 'Top Rated' },
                { value: 'name', label: 'Name A-Z' },
              ]}
            />

            {/* View mode */}
            <div className="hidden md:flex items-center rounded-lg border border-brand-off/15 overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition ${viewMode === 'grid' ? 'bg-brand-gold/15 text-brand-gold' : 'text-brand-off/50 hover:text-brand-off'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition ${viewMode === 'list' ? 'bg-brand-gold/15 text-brand-gold' : 'text-brand-off/50 hover:text-brand-off'}`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden inline-flex items-center gap-2 rounded-lg border border-brand-off/15 bg-brand-tealDark px-3 py-2 text-sm transition hover:border-brand-gold/30"
            >
              <SlidersHorizontal className="w-4 h-4 text-brand-gold" />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-brand-gold text-brand-tealDark text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Active Filter Tags */}
        {activeFilterCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex flex-wrap gap-2"
          >
            {selectedCategory !== "All" && (
              <button onClick={() => setSelectedCategory("All")} className="inline-flex items-center gap-1 rounded-full bg-brand-gold/10 text-brand-gold px-3 py-1 text-xs border border-brand-gold/20 hover:bg-brand-gold/20 transition">
                {selectedCategory} <X className="w-3 h-3" />
              </button>
            )}
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="inline-flex items-center gap-1 rounded-full bg-brand-gold/10 text-brand-gold px-3 py-1 text-xs border border-brand-gold/20 hover:bg-brand-gold/20 transition">
                "{searchQuery}" <X className="w-3 h-3" />
              </button>
            )}
            {selectedMaterials.map(m => (
              <button key={m} onClick={() => handleMaterialToggle(m)} className="inline-flex items-center gap-1 rounded-full bg-brand-gold/10 text-brand-gold px-3 py-1 text-xs border border-brand-gold/20 hover:bg-brand-gold/20 transition">
                {m} <X className="w-3 h-3" />
              </button>
            ))}
            {selectedRatings.map(r => (
              <button key={r} onClick={() => handleRatingToggle(r)} className="inline-flex items-center gap-1 rounded-full bg-brand-gold/10 text-brand-gold px-3 py-1 text-xs border border-brand-gold/20 hover:bg-brand-gold/20 transition">
                {r}★ & up <X className="w-3 h-3" />
              </button>
            ))}
            <button onClick={handleClearFilters} className="inline-flex items-center gap-1 rounded-full text-brand-off/50 px-3 py-1 text-xs border border-brand-off/10 hover:border-brand-off/30 transition">
              Clear All <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Desktop Sidebar */}
        <div className="hidden md:block md:col-span-3">
          <div className="sticky top-20 rounded-xl bg-brand-tealDark p-5 border border-brand-gold/10">
            {FilterContent({})}
          </div>
        </div>

        {/* Products */}
        <div className="md:col-span-9">
          {loading ? (
            <div className={viewMode === 'grid' ? "grid grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
              {Array.from({ length: 6 }).map((_, i) =>
                viewMode === 'grid' ? <ProductCardSkeleton key={i} /> : <ProductListSkeleton key={i} />
              )}
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-16 text-center rounded-2xl bg-brand-tealDark/50 border border-brand-gold/10"
            >
              <Gem className="w-16 h-16 text-brand-gold/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No Products Found</h3>
              <p className="text-brand-off/50 text-sm mb-4 max-w-sm mx-auto">
                We couldn't find any products matching your filters. Try adjusting your search or clearing the filters.
              </p>
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-gold text-brand-tealDark px-5 py-2.5 font-semibold text-sm hover:bg-brand-gold/90 transition"
              >
                <X className="w-4 h-4" /> Clear All Filters
              </button>
            </motion.div>
          ) : (
            <div className={viewMode === 'grid' ? "grid grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
              {filteredAndSortedProducts.map((product, i) =>
                viewMode === 'grid' ? (
                  <motion.div
                    key={product._id || product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: Math.min(i * 0.04, 0.3) }}
                    whileHover={{ y: -6, boxShadow: '0 12px 32px rgba(0,0,0,0.3)' }}
                  >
                    <ProductCard
                      product={product}
                      onAddToCart={onAddToCart}
                      onToggleFavorite={onToggleFavorite}
                      isFavorite={favorites.includes(product._id || product.id)}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key={product._id || product.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-brand-tealDark border border-brand-gold/10 hover:border-brand-gold/30 transition-all cursor-pointer"
                    onClick={() => navigate(`/product/${product._id || product.id}`)}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: Math.min(i * 0.04, 0.3) }}
                    whileHover={{ x: 4 }}
                  >
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold mb-1 truncate">{product.name}</div>
                      <div className="text-sm text-brand-off/60 mb-1 line-clamp-1">{product.description}</div>
                      <div className="flex items-center gap-3">
                        <span className="text-brand-gold font-bold">₹{product.price?.toLocaleString('en-IN')}</span>
                        <span className="flex text-yellow-500 text-xs">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i}>{i < Math.round(product.rating || 0) ? '★' : '☆'}</span>
                          ))}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={e => { e.stopPropagation(); onToggleFavorite(product._id || product.id); }}
                        className="p-2 rounded-lg border border-brand-off/15 hover:border-brand-gold/30 transition"
                      >
                        <Heart className={`w-4 h-4 ${favorites.includes(product._id || product.id) ? 'fill-red-500 text-red-500' : 'text-brand-off/50'}`} />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); onAddToCart(product); }}
                        className="px-4 py-2 rounded-lg bg-brand-gold text-brand-tealDark text-sm font-semibold hover:bg-brand-gold/90 transition"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </motion.div>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile Filter Drawer ── */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileFilterOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute bottom-0 left-0 right-0 max-h-[85vh] bg-brand-tealDark rounded-t-2xl p-5 overflow-y-auto border-t border-brand-gold/20"
            >
              <div className="w-10 h-1 rounded-full bg-brand-off/20 mx-auto mb-4" />
              {FilterContent({ onClose: () => setMobileFilterOpen(false) })}
              <div className="mt-6 sticky bottom-0 pt-4 bg-brand-tealDark border-t border-brand-off/10">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-3 rounded-xl bg-brand-gold text-brand-tealDark font-semibold text-sm"
                >
                  Show {filteredAndSortedProducts.length} Results
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsPage;
