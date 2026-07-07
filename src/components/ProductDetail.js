import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, Shield, RefreshCw, Heart, ShoppingBag, Plus, Minus, ArrowLeft, Scale, Gem } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { getImageUrl, ImageWithFallback } from "../utils/imageUtils";
import api from "../services/api";

const ProductDetail = ({ products, onAddToCart, onToggleFavorite, favorites = [], user, loadProducts }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "", images: [] });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [metalRates, setMetalRates] = useState(null);
  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedImageColor, setSelectedImageColor] = useState('');

  // Extract unique colors mapped to images
  const uniqueImageColors = useMemo(() => {
    if (!product || !product.imageColors || !product.images) return [];
    const colors = product.images.map((_, idx) => 
      product.imageColors[idx] ? product.imageColors[idx].trim() : ''
    ).filter(Boolean);
    return Array.from(new Set(colors));
  }, [product]);

  useEffect(() => {
    if (product) {
      setSelectedImageIdx(0);
      if (product.imageColors && product.imageColors[0]) {
        setSelectedImageColor(product.imageColors[0].trim());
      } else {
        setSelectedImageColor('');
      }
    }
  }, [product]);
  
  // Use cart context
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoadingProduct(true);
        const data = await api.getProduct(id);
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoadingProduct(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      loadRelatedProducts();
      loadMetalRates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?._id]);

  const loadRelatedProducts = async () => {
    try {
      const data = await api.getRelatedProducts(product._id || product.id);
      setRelatedProducts(data || []);
    } catch (error) {
      console.error('Error loading related products:', error);
    }
  };

  const loadMetalRates = async () => {
    try {
      const settings = await api.getSettings();
      if (settings && settings.metalRates) {
        setMetalRates(settings.metalRates);
      }
    } catch (error) {
      console.error('Error loading settings/metal rates:', error);
    }
  };

  if (loadingProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-brand-off/60 min-h-[60vh] flex flex-col justify-center items-center">
        <div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Gem className="w-12 h-12 text-brand-gold/40 mx-auto mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold font-heading mb-2">Product Not Found</h2>
        <p className="text-brand-off/60 text-sm mb-6">The product you are looking for does not exist or has been removed.</p>
        <button onClick={() => navigate('/products')} className="bg-brand-gold text-brand-tealDark px-6 py-2.5 rounded-lg font-semibold text-sm">
          Browse Catalog
        </button>
      </div>
    );
  }

  const isFavorite = favorites.includes(product._id || product.id);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) setQuantity(newQuantity);
  };

  const showToast = (message, type = 'success', Icon = null) => {
    setToastMessage({ message, type, Icon });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(product, quantity, selectedImageColor);
      showToast(`Success! ${quantity} × ${product.name} ${selectedImageColor ? `(${selectedImageColor})` : ''} added to cart.`, 'success', ShoppingBag);
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast(error.message || "Error adding to cart", 'error');
    }
  };

  const handleToggleFavorite = () => {
    if (!user) {
      showToast("Please login to add to wishlist.", "error");
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    onToggleFavorite(product._id || product.id);
    showToast(!isFavorite ? "Added to wishlist!" : "Removed from wishlist!", "success", Heart);
  };

  const handleThumbnailClick = (idx) => {
    setSelectedImageIdx(idx);
    if (product.imageColors && product.imageColors[idx]) {
      setSelectedImageColor(product.imageColors[idx].trim());
    } else {
      setSelectedImageColor('');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast("Please login to submit a review.", "error");
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    setIsSubmittingReview(true);
    try {
      const updatedProduct = await api.addProductReview(product._id || product.id, reviewForm);
      setProduct(updatedProduct);
      setReviewForm({ rating: 5, comment: "", images: [] });
      showToast("Review submitted successfully!", "success");
      if (loadProducts) {
        loadProducts();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      showToast("Failed to submit review.", "error");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setReviewForm(prev => ({ ...prev, images: files }));
  };

  // Live Metal Rate per gram computation details
  const metalRatePerGram = (() => {
    if (product.priceType !== 'weight-based' || !metalRates) return 0;
    switch (product.metalType) {
      case 'Gold 24K': return metalRates.gold24k;
      case 'Gold 22K': return metalRates.gold22k;
      case 'Gold 18K': return metalRates.gold18k;
      case 'Silver': return metalRates.silver;
      case 'Platinum': return metalRates.platinum;
      default: return 0;
    }
  })();

  const specifications = [
    { label: "Material Type", value: product.material || (product.priceType === 'weight-based' ? product.metalType : (product.specifications?.material || "Premium Alloy")) },
    { label: "Product Weight", value: product.priceType === 'weight-based' ? `${product.weight} grams` : (product.specifications?.weight || "Standard Weight") },
    { label: "Color Option", value: product.color || "Standard" },
    { label: "Stone Type", value: product.specifications?.stoneType || (product.name.includes("Diamond") ? "Natural Diamond" : "Semi-Precious Stone") },
    { label: "Clarity Grade", value: product.specifications?.clarity || "VS1-VS2 Quality" },
    { label: "Color Grading", value: product.specifications?.color || "D-F Colorless" },
    { label: "Cut Precision", value: product.specifications?.cut || "Excellent Precision" },
    { label: "Setting Style", value: product.specifications?.setting || "Prong Setting" },
    { label: "Certification", value: product.specifications?.certification || "JewelsNY Certified" },
  ];

  const productReviews = product.reviews || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Dynamic Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-white/10 text-white ${
              toastMessage.type === 'error' ? 'bg-rose-600' : 'bg-emerald-600'
            }`}
          >
            {toastMessage.Icon && <toastMessage.Icon className="w-4 h-4" />}
            <span>{toastMessage.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumbs */}
      <div className="text-xs text-brand-off/50 mb-6 flex items-center gap-2">
        <button className="hover:text-brand-gold transition" onClick={() => navigate("/")}>Home</button>
        <span>/</span>
        <button className="hover:text-brand-gold transition" onClick={() => navigate("/products")}>Products</button>
        <span>/</span>
        <span className="text-brand-off/80 truncate max-w-[200px]">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-12">
        {/* Left Side: Premium Image Container */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="rounded-2xl overflow-hidden bg-brand-tealDark border border-brand-gold/10 relative group">
            <div className="relative aspect-[4/3] sm:aspect-square md:max-h-[500px] w-full overflow-hidden bg-brand-teal/20">
              {product.images && product.images.length > 0 ? (
                <ImageWithFallback
                  src={product.images[selectedImageIdx]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              {/* Category tag */}
              <span className="absolute top-4 left-4 inline-flex items-center rounded-lg bg-brand-tealDark/80 text-brand-gold text-xs font-bold px-3 py-1 border border-brand-gold/20 backdrop-blur-sm">
                {product.category}
              </span>
              
              {/* Favorite button */}
              <button
                onClick={handleToggleFavorite}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-brand-tealDark/80 border border-brand-off/10 hover:bg-brand-tealDark transition"
                aria-label="Toggle favorite"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500 scale-110" : "text-brand-off/70"}`} />
              </button>
            </div>
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-brand-gold/20 scrollbar-track-transparent">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => handleThumbnailClick(idx)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImageIdx === idx ? 'border-brand-gold scale-105 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <ImageWithFallback
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Right Side: Information Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          <div>
            <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-xs text-brand-off/60 hover:text-brand-gold transition mb-3">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to listings
            </button>
            <h1 className="text-3xl md:text-4xl font-heading font-bold leading-tight mb-2">{product.name}</h1>
            
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-500 text-sm">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>{i < Math.round(product.rating || 5) ? '★' : '☆'}</span>
                ))}
              </div>
              <span className="text-xs text-brand-off/50">({product.rating.toFixed(1)} rating) • {productReviews.length} client reviews</span>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-brand-tealDark border border-brand-gold/15 text-brand-gold">
                Category: {product.category}
              </span>
              {product.material && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-brand-tealDark border border-brand-gold/15 text-brand-gold">
                  Material: {product.material}
                </span>
              )}
              {product.color && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-brand-tealDark border border-brand-gold/15 text-brand-gold">
                  Color: {product.color}
                </span>
              )}
            </div>
          </div>

          <div className="h-px bg-brand-gold/10" />

          {/* Pricing Box */}
          <div>
            <div className="text-3xl font-bold text-brand-gold mb-2">₹{(product.price * quantity).toLocaleString('en-IN')}</div>
            <p className="text-sm text-brand-off/70 leading-relaxed max-w-lg">{product.description}</p>
          </div>

          {/* Dynamic Weight Pricing Breakdown Card */}
          {product.priceType === 'weight-based' && metalRates && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-brand-tealDark p-4 border border-brand-gold/15 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-brand-gold/10 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-gold flex items-center gap-1.5">
                  <Scale className="w-4 h-4" /> Live Pricing Calculator
                </span>
                <span className="text-[10px] text-brand-off/40 bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/20">Verified Gold Rate</span>
              </div>
              
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-brand-off/70">
                  <span>Metal Weight ({product.metalType})</span>
                  <span>{product.weight} grams</span>
                </div>
                <div className="flex justify-between text-brand-off/70">
                  <span>Current Live Rate</span>
                  <span>₹{metalRatePerGram.toLocaleString('en-IN')} / gram</span>
                </div>
                <div className="flex justify-between text-brand-off/70 border-b border-brand-off/5 pb-1.5">
                  <span>Crafting/Making Charges</span>
                  <span>+ ₹{product.makingCharge?.toLocaleString('en-IN')}</span>
                </div>
                
                <div className="flex justify-between text-sm font-bold text-brand-gold pt-1">
                  <span>Final Dynamic Sum</span>
                  <span>₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Color Mapped Image Selector (Only if colors are mapped to images) */}
          {uniqueImageColors.length > 0 && (
            <div className="space-y-2.5">
              <span className="text-xs font-semibold uppercase text-brand-off/60 block">Selected Option Color: <span className="text-brand-gold font-bold">{selectedImageColor || 'Default'}</span></span>
              <div className="flex flex-wrap gap-2.5">
                {uniqueImageColors.map((color) => {
                  const isSelected = selectedImageColor === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        setSelectedImageColor(color);
                        // Find index of the first image that has this color
                        const matchedIdx = product.imageColors.findIndex(c => c && c.trim() === color);
                        if (matchedIdx !== -1) {
                          setSelectedImageIdx(matchedIdx);
                        }
                      }}
                      className={`px-3.5 py-1.5 rounded-lg border text-xs font-bold transition-all duration-200 ${
                        isSelected 
                          ? 'border-brand-gold bg-brand-gold/15 text-brand-gold shadow-lg shadow-brand-gold/5 scale-105' 
                          : 'border-brand-off/15 hover:border-brand-gold/40 text-brand-off/70 bg-brand-tealDark/30 hover:text-brand-off'
                      }`}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Purchase Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-lg border border-brand-off/20 overflow-hidden bg-brand-tealDark">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="p-2.5 hover:bg-brand-teal/20 transition disabled:opacity-30"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="p-2.5 hover:bg-brand-teal/20 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-gold text-brand-tealDark py-3 px-6 rounded-lg font-bold shadow-lg shadow-brand-gold/10 hover:bg-brand-gold/90 transition"
              >
                <ShoppingBag className="w-4.5 h-4.5" /> Add to Shopping Bag
              </motion.button>
            </div>
          </div>



        </motion.div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <div className="flex border-b border-brand-gold/10">
          {["Specifications", `Reviews (${productReviews.length})`, "Delivery & Assurances"].map((label, idx) => (
            <button
              key={label}
              onClick={() => setSelectedTab(idx)}
              className={`px-5 py-3 border-b-2 text-sm font-semibold tracking-wide transition ${
                selectedTab === idx 
                  ? 'border-brand-gold text-brand-gold font-bold' 
                  : 'border-transparent text-brand-off/50 hover:text-brand-off/80'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab 1: Specs */}
        {selectedTab === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
          >
            {specifications.map((spec) => (
              <div key={spec.label} className="p-4 rounded-xl bg-brand-tealDark border border-brand-gold/5 flex flex-col justify-between">
                <span className="text-[10px] uppercase tracking-wider text-brand-off/40 mb-1">{spec.label}</span>
                <span className="font-semibold text-sm text-brand-off">{spec.value}</span>
              </div>
            ))}
          </motion.div>
        )}

        {/* Tab 2: Reviews */}
        {selectedTab === 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-6"
          >
            {/* Review form */}
            {user ? (
              <form onSubmit={handleReviewSubmit} className="p-6 rounded-xl bg-brand-tealDark border border-brand-gold/10 space-y-4 max-w-xl">
                <h3 className="font-heading font-semibold text-lg text-brand-gold">Share Your Experience</h3>
                
                <div>
                  <label className="block text-xs font-semibold uppercase text-brand-off/60 mb-2">Rating</label>
                  <div className="flex gap-1.5 text-2xl text-yellow-500">
                    {[1, 2, 3, 4, 5].map(num => (
                      <button 
                        key={num} 
                        type="button" 
                        onClick={() => setReviewForm(prev => ({ ...prev, rating: num }))}
                        className="hover:scale-115 transition"
                      >
                        {num <= reviewForm.rating ? '★' : '☆'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-brand-off/60 mb-2">Detailed Feedback</label>
                  <textarea 
                    className="w-full rounded-lg border border-brand-off/15 bg-brand-teal/30 px-3.5 py-2 text-sm focus:border-brand-gold/40 focus:outline-none h-20 resize-none"
                    value={reviewForm.comment}
                    onChange={e => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-brand-off/60 mb-2">Upload Images</label>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="text-xs text-brand-off/60 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-brand-gold/15 file:text-brand-gold"
                  />
                  {reviewForm.images && reviewForm.images.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {reviewForm.images.map((file, idx) => (
                        <div key={idx} className="relative w-16 h-16 rounded-md overflow-hidden border border-brand-gold/20">
                          <img src={URL.createObjectURL(file)} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmittingReview}
                  className="bg-brand-gold text-brand-tealDark px-6 py-2 rounded-lg text-sm font-bold shadow hover:bg-brand-gold/90 transition disabled:opacity-50"
                >
                  {isSubmittingReview ? "Submitting Review..." : "Submit Review"}
                </button>
              </form>
            ) : (
              <div className="p-6 rounded-xl bg-brand-tealDark border border-brand-gold/10 text-center max-w-xl space-y-3">
                <p className="text-brand-off/60 text-sm">Please log in to share your experience with this masterpiece.</p>
                <button 
                  type="button"
                  onClick={() => navigate('/login')}
                  className="px-5 py-2 bg-brand-gold text-brand-tealDark font-bold text-xs rounded-lg shadow-lg hover:bg-brand-gold/90 transition"
                >
                  Log In
                </button>
              </div>
            )}

            {/* List */}
            {productReviews.length === 0 ? (
              <p className="text-brand-off/50 text-sm">No reviews yet for this masterpiece. Be the first to express your thoughts!</p>
            ) : (
              <div className="space-y-4">
                {productReviews.map((rev, idx) => (
                  <motion.div 
                    key={idx} 
                    className="p-5 rounded-xl bg-brand-tealDark border border-brand-gold/5 space-y-2"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">{rev.user}</span>
                      <div className="flex text-yellow-500 text-xs">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i}>{i < rev.rating ? '★' : '☆'}</span>
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] text-brand-off/40 block">{new Date(rev.date).toLocaleDateString()}</span>
                    <p className="text-sm text-brand-off/80 leading-relaxed italic">"{rev.comment}"</p>
                    
                    {rev.images && rev.images.length > 0 && (
                      <div className="flex gap-2 flex-wrap pt-2">
                        {rev.images.map((img, i) => (
                          <img 
                            key={i} 
                            src={getImageUrl(img)} 
                            alt="Client Review" 
                            className="w-16 h-16 object-cover rounded-lg border border-brand-gold/10" 
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Tab 3: Assurances */}
        {selectedTab === 2 && (
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="p-5 rounded-xl bg-brand-tealDark border border-brand-gold/5 space-y-2">
              <h4 className="font-semibold text-brand-gold">Shipping & Insured Delivery</h4>
              <p className="text-sm text-brand-off/70 leading-relaxed">
                All ordered products are dispatched in tamper-proof boxes and fully covered by insurance until it reaches your doorstep. Standard shipping takes 3-5 business days. Express shipping options available at checkout.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-brand-tealDark border border-brand-gold/5 space-y-2">
              <h4 className="font-semibold text-brand-gold">30-Day Exchange Guarantee</h4>
              <p className="text-sm text-brand-off/70 leading-relaxed">
                We offer a hassle-free, 30-day exchange and return policy for all unworn articles in their original certification covers. Standard deductions may apply for weight-based articles if returned customized.
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold font-heading mb-6 border-b border-brand-gold/10 pb-2">Complete The Look</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map(rel => (
              <motion.div 
                key={rel._id}
                whileHover={{ y: -5 }}
                onClick={() => { navigate(`/product/${rel._id}`); window.scrollTo(0, 0); }}
                className="bg-brand-tealDark rounded-xl overflow-hidden border border-brand-gold/10 hover:border-brand-gold/30 cursor-pointer transition-all shadow-md group"
              >
                <div className="aspect-square relative overflow-hidden">
                  <ImageWithFallback src={rel.image} alt={rel.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-xs truncate mb-1">{rel.name}</h3>
                  <p className="text-brand-gold font-bold text-sm">₹{rel.price?.toLocaleString('en-IN')}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Sticky Mobile Add to Cart Bar */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 bg-brand-tealDark/90 backdrop-blur border-t border-brand-gold/15 p-3.5 z-40 flex items-center justify-between shadow-[0_-6px_20px_rgba(0,0,0,0.4)]">
        <div className="max-w-[50%]">
          <div className="text-xs font-semibold truncate text-brand-off/70">{product.name}</div>
          <div className="text-brand-gold font-bold text-sm">₹{product.price.toLocaleString('en-IN')}</div>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCart}
          className="rounded-lg bg-brand-gold text-brand-tealDark px-6 py-2.5 font-bold shadow-lg shadow-brand-gold/10 text-xs"
        >
          Add to bag
        </motion.button>
      </div>
    </div>
  );
};

export default ProductDetail;
