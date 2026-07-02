import React, { useState, useMemo } from "react";
import ProductCard from "../components/ProductCard";
import { ImageWithFallback } from "../utils/imageUtils";
import LoadingSpinner, { ProductCardSkeleton, ProductListSkeleton } from "../components/LoadingSpinner";
import { Gem, SlidersHorizontal, DollarSign, Layers, Star as StarIcon, Tag, LayoutGrid, List as ListIcon, ArrowUpDown } from "lucide-react";
import { motion } from "framer-motion";

const ProductsPage = ({ products, onAddToCart, onToggleFavorite, favorites = [], loading = false }) => {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'

  const ThemedSelect = ({ value, onChange, options, minWidth = 'min-w-[140px]' }) => {
    const [open, setOpen] = useState(false);
    const selected = options.find((o) => o.value === value);
    return (
      <div
        className={`relative ${minWidth}`}
        tabIndex={-1}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
        }}
      >
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="inline-flex w-full items-center justify-between rounded-md border border-brand-off/30 bg-transparent px-3 py-2 text-sm text-brand-off/90 hover:bg-brand-teal/20"
        >
          <span>{selected?.label}</span>
          <svg className="w-4 h-4 text-brand-off/70" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </button>
        {open && (
          <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-md border border-brand-off/30 bg-brand-tealDark shadow-lg">
            {options.map((opt) => (
              <button
                key={opt.value}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`block w-full px-3 py-2 text-left text-sm ${
                  opt.value === value ? 'bg-brand-teal/40 text-brand-off' : 'text-brand-off/90 hover:bg-brand-teal/30'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [showOnSale, setShowOnSale] = useState(false);

  const categories = ["All", "Rings", "Necklaces", "Earrings", "Bracelets", "Pendants", "Watches"];
  const materials = ["Gold", "Silver", "Platinum", "Diamond", "Pearl", "Sapphire", "Emerald", "Ruby"];
  const ratings = [5, 4, 3, 2, 1];

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered = filtered.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1]);

    if (selectedMaterials.length > 0) {
      filtered = filtered.filter((product) =>
        selectedMaterials.some(
          (material) =>
            product.description.toLowerCase().includes(material.toLowerCase()) ||
            product.name.toLowerCase().includes(material.toLowerCase())
        )
      );
    }

    if (selectedRatings.length > 0) {
      filtered = filtered.filter((product) => selectedRatings.some((rating) => product.rating >= rating));
    }

    if (showOnSale) {
      filtered = filtered.filter((product) => product.id % 3 === 0);
    }

    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "price":
          aValue = a.price;
          bValue = b.price;
          break;
        case "rating":
          aValue = a.rating;
          bValue = b.rating;
          break;
        case "name":
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
      }
      if (sortOrder === "asc") return aValue > bValue ? 1 : -1;
        return aValue < bValue ? 1 : -1;
    });

    return filtered;
  }, [products, selectedCategory, searchQuery, priceRange, sortBy, sortOrder, selectedMaterials, selectedRatings, showOnSale]);

  const handleClearFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setPriceRange([0, 2000]);
    setSortBy("name");
    setSortOrder("asc");
    setSelectedMaterials([]);
    setSelectedRatings([]);
    setShowOnSale(false);
  };

  const handleMaterialChange = (material) => {
    setSelectedMaterials((prev) => (prev.includes(material) ? prev.filter((m) => m !== material) : [...prev, material]));
  };

  const handleRatingChange = (rating) => {
    setSelectedRatings((prev) => (prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]));
  };

  const FilterSection = () => (
    <div className="p-4 bg-brand-tealDark rounded-lg shadow-sm border border-brand-gold/20">
      <div className="flex items-center justify-between mb-3">
        <div className="text-lg font-bold flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-brand-gold" />
          <span>Filters</span>
        </div>
        <button className="text-xs rounded-full border border-brand-off/30 px-2 py-1 hover:bg-brand-teal/20" onClick={handleClearFilters}>
          Clear All
        </button>
      </div>

      <div className="h-px bg-brand-off/20 mb-4" />

      {/* Category */}
      <details open className="mb-3">
        <summary className="cursor-pointer text-sm font-semibold flex items-center gap-2 text-brand-off">
          <Layers className="w-4 h-4 text-brand-gold" />
            Category
        </summary>
        <div className="mt-2 flex flex-col gap-1">
            {categories.map((category) => (
            <label key={category} className="inline-flex items-center gap-2 text-sm text-brand-off/90">
              <input
                type="checkbox"
                    checked={selectedCategory === category}
                    onChange={() => setSelectedCategory(category)}
                className="rounded border-brand-off/30 accent-brand-gold"
              />
              {category}
            </label>
          ))}
        </div>
      </details>

      {/* Price Range */}
      <details open className="mb-3">
        <summary className="cursor-pointer text-sm font-semibold flex items-center gap-2 text-brand-off">
          <DollarSign className="w-4 h-4 text-brand-gold" />
            Price Range
        </summary>
        <div className="mt-2">
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
              className="w-full accent-brand-gold"
            />
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 2000])}
              className="w-full accent-brand-gold"
            />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="number"
              className="w-1/2 rounded border border-brand-off/30 bg-transparent px-2 py-1 text-sm text-brand-off"
                value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
            />
            <input
              type="number"
              className="w-1/2 rounded border border-brand-off/30 bg-transparent px-2 py-1 text-sm text-brand-off"
                value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 2000])}
            />
          </div>
        </div>
      </details>

      {/* Material */}
      <details open className="mb-3">
        <summary className="cursor-pointer text-sm font-semibold flex items-center gap-2 text-brand-off">
          <Tag className="w-4 h-4 text-brand-gold" />
            Material
        </summary>
        <div className="mt-2 flex flex-col gap-1">
            {materials.map((material) => (
            <label key={material} className="inline-flex items-center gap-2 text-sm text-brand-off/90">
              <input
                type="checkbox"
                    checked={selectedMaterials.includes(material)}
                    onChange={() => handleMaterialChange(material)}
                className="rounded border-brand-off/30 accent-brand-gold"
              />
              {material}
            </label>
          ))}
        </div>
      </details>

      {/* Rating */}
      <details open className="mb-3">
        <summary className="cursor-pointer text-sm font-semibold flex items-center gap-2 text-brand-off">
          <StarIcon className="w-4 h-4 text-brand-gold" />
            Rating
        </summary>
        <div className="mt-2 flex flex-col gap-1">
            {ratings.map((rating) => (
            <label key={rating} className="inline-flex items-center gap-2 text-sm text-brand-off/90">
              <input
                type="checkbox"
                    checked={selectedRatings.includes(rating)}
                    onChange={() => handleRatingChange(rating)}
                className="rounded border-brand-off/30 accent-brand-gold"
              />
              <span className="text-brand-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>{i + 1 <= rating ? '★' : '☆'}</span>
                ))}
              </span>
              <span className="text-xs text-brand-off/70">&nbsp;& up</span>
            </label>
          ))}
        </div>
      </details>

      {/* On Sale */}
      <details open>
        <summary className="cursor-pointer text-sm font-semibold flex items-center gap-2 text-brand-off">
          <Tag className="w-4 h-4 text-brand-gold" />
            Special Offers
        </summary>
        <label className="mt-2 inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
                checked={showOnSale}
                onChange={(e) => setShowOnSale(e.target.checked)}
            className="rounded border-brand-off/30 accent-brand-gold"
          />
          On Sale
        </label>
      </details>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Our Collection</h1>
        <p className="text-brand-off/80">Discover our exquisite jewelry collection featuring timeless designs and premium materials</p>

        {/* Search and sort */}
        <div className="mt-4 flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-brand-off/30 bg-transparent px-3 py-2 pr-9 text-sm placeholder-brand-off/60"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-brand-off/60">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 4.243 11.957l3.775 3.775a.75.75 0 1 0 1.06-1.06l-3.775-3.775A6.75 6.75 0 0 0 10.5 3.75Zm-5.25 6.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
          <ThemedSelect
            value={sortBy}
            onChange={(v) => setSortBy(v)}
            options={[
              { value: 'name', label: 'Name' },
              { value: 'price', label: 'Price' },
              { value: 'rating', label: 'Rating' },
            ]}
          />
          <ThemedSelect
            value={sortOrder}
            onChange={(v) => setSortOrder(v)}
            options={[
              { value: 'asc', label: 'Ascending' },
              { value: 'desc', label: 'Descending' },
            ]}
            minWidth="min-w-[160px]"
          />
          <span className="inline-flex items-center text-brand-off/70"><ArrowUpDown className="w-4 h-4" /></span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm ${viewMode === 'grid' ? 'border-brand-gold text-brand-gold' : 'border-brand-off/30'}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" /> Grid
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm ${viewMode === 'list' ? 'border-brand-gold text-brand-gold' : 'border-brand-off/30'}`}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <ListIcon className="w-4 h-4" /> List
            </motion.button>
          </div>

          <button
            className="md:hidden inline-flex items-center gap-2 rounded-md border border-brand-off/30 px-3 py-2 text-sm"
              onClick={() => setMobileFilterOpen(true)}
            >
              Filters
          </button>
        </div>

        {/* Active Filters */}
        {(selectedCategory !== "All" || searchQuery || selectedMaterials.length > 0 || selectedRatings.length > 0 || showOnSale) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedCategory !== "All" && (
              <button className="inline-flex items-center gap-1 rounded-full bg-brand-gold/15 text-brand-gold px-3 py-1 text-xs" onClick={() => setSelectedCategory("All")}>
                Category: {selectedCategory}
                <span className="ml-1">×</span>
              </button>
            )}
            {searchQuery && (
              <button className="inline-flex items-center gap-1 rounded-full bg-brand-gold/15 text-brand-gold px-3 py-1 text-xs" onClick={() => setSearchQuery("")}>
                Search: {searchQuery}
                <span className="ml-1">×</span>
              </button>
            )}
            {selectedMaterials.map((material) => (
              <button key={material} className="inline-flex items-center gap-1 rounded-full bg-brand-gold/15 text-brand-gold px-3 py-1 text-xs" onClick={() => handleMaterialChange(material)}>
                Material: {material}
                <span className="ml-1">×</span>
              </button>
            ))}
            {selectedRatings.map((rating) => (
              <button key={rating} className="inline-flex items-center gap-1 rounded-full bg-brand-gold/15 text-brand-gold px-3 py-1 text-xs" onClick={() => handleRatingChange(rating)}>
                Rating: {rating}+
                <span className="ml-1">×</span>
              </button>
            ))}
            {showOnSale && (
              <button className="inline-flex items-center gap-1 rounded-full bg-brand-gold/15 text-brand-gold px-3 py-1 text-xs" onClick={() => setShowOnSale(false)}>
                On Sale
                <span className="ml-1">×</span>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="hidden md:block md:col-span-3">
          <div className="sticky top-20">
            <FilterSection />
          </div>
        </div>

        {/* Products */}
        <div className="md:col-span-9">
          {loading ? (
            <div className="space-y-4">
              <div className="text-sm text-brand-off/80 mb-2">
                <LoadingSpinner size="sm" text="Loading products..." />
              </div>
              <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
                {Array.from({ length: 6 }).map((_, index) => (
                  viewMode === 'grid' ? (
                    <ProductCardSkeleton key={index} />
                  ) : (
                    <ProductListSkeleton key={index} />
                  )
                ))}
              </div>
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <div className="p-6 text-center bg-brand-tealDark/90 backdrop-blur rounded-lg shadow-sm border border-brand-gold/20">
              <div className="flex justify-center mb-2"><Gem className="w-12 h-12 text-brand-gold" /></div>
              <div className="font-semibold mb-1">No products found</div>
              <div className="text-sm text-brand-off/80 mb-3">Try adjusting your filters or search terms</div>
              <button className="inline-flex items-center rounded-md border border-brand-off/30 px-3 py-2 text-sm" onClick={handleClearFilters}>
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="text-sm text-brand-off/80 mb-2">
                Showing {filteredAndSortedProducts.length} of {products.length} products
              </div>
              <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
                {filteredAndSortedProducts.map((product) => (
                  viewMode === 'grid' ? (
                    <motion.div key={product._id || product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} whileHover={{ y: -8, boxShadow: '0 10px 30px rgba(0,0,0,0.35)' }}>
                      <ProductCard
                        product={product}
                        onAddToCart={onAddToCart}
                        onToggleFavorite={onToggleFavorite}
                        isFavorite={favorites.includes(product._id || product.id)}
                      />
                    </motion.div>
                  ) : (
                    <motion.div key={product._id || product.id} className="flex items-center gap-4 p-4 bg-brand-tealDark rounded-lg shadow-sm border border-brand-gold/20" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} whileHover={{ y: -6 }}>
                      <ImageWithFallback src={product.image} alt={product.name} className="w-28 h-28 object-cover rounded" />
                      <div className="flex-1">
                        <div className="font-semibold mb-1">{product.name}</div>
                        <div className="text-sm text-brand-off/80 mb-2 line-clamp-2">{product.description}</div>
                        <div className="flex items-center gap-3">
                          <div className="text-brand-gold font-bold">₹{product.price.toLocaleString('en-IN')}</div>
                          <div className="text-brand-off/70 text-sm">Rating: {product.rating}</div>
                        </div>
                      </div>
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="rounded-md bg-brand-gold text-brand-tealDark px-3 py-2 text-sm" onClick={() => onAddToCart(product)}>Add to Cart</motion.button>
                    </motion.div>
                  )
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFilterOpen(false)} />
          <motion.div initial={{ x: '-100%', scale: 0.98, opacity: 0.9 }} animate={{ x: 0, scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 28 }} id="mobile-filter-panel" className="absolute left-0 top-0 h-full w-80 max-w-[85%] bg-brand-tealDark text-brand-off shadow-2xl p-4 overflow-y-auto border-r border-brand-gold/20">
            <div className="flex items-center justify-between mb-3">
              <div className="font-bold">Filters</div>
              <button className="rounded-md p-2 hover:bg-brand-teal/20" onClick={() => setMobileFilterOpen(false)}>
                ×
              </button>
            </div>
          <FilterSection />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
