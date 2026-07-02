import React, { useState } from "react";
import { motion } from "framer-motion";
import { Truck, Shield, RefreshCw } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { getImageUrl, ImageWithFallback } from "../utils/imageUtils";
import api from "../services/api";

const ProductDetail = ({ products, onAddToCart, onToggleFavorite, favorites = [] }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "", images: [] });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  
  // Use cart context
  const { addToCart } = useCart();

  const product = products.find((p) => p._id === id || p.id === parseInt(id));

  React.useEffect(() => {
    if (product) {
      loadRelatedProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const loadRelatedProducts = async () => {
    try {
      const data = await api.getRelatedProducts(product._id || product.id);
      setRelatedProducts(data || []);
    } catch (error) {
      console.error('Error loading related products:', error);
    }
  };

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-2xl font-bold text-brand-gold">Product not found</div>
        <div className="text-brand-off/70 mt-2">Looking for ID: {id}</div>
      </div>
    );
  }

  const isFavorite = favorites.includes(product._id || product.id);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) setQuantity(newQuantity);
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(product, quantity);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleToggleFavorite = () => onToggleFavorite(product._id || product.id);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    try {
      await api.addProductReview(product._id || product.id, reviewForm);
      setReviewForm({ rating: 5, comment: "", images: [] });
      alert("Review submitted successfully!");
      // Ideally reload product data here
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setReviewForm(prev => ({ ...prev, images: files }));
  };

  const specifications = [
    { label: "Material", value: product.specifications?.material || "18k Gold / Sterling Silver" },
    { label: "Stone Type", value: product.specifications?.stoneType || (product.name.includes("Diamond") ? "Natural Diamond" : "Precious Stone") },
    { label: "Clarity", value: product.specifications?.clarity || "VS1-VS2" },
    { label: "Color", value: product.specifications?.color || "D-F" },
    { label: "Cut", value: product.specifications?.cut || "Excellent" },
    { label: "Weight", value: product.specifications?.weight || "2.5-3.0 carats" },
    { label: "Setting", value: product.specifications?.setting || "Prong Setting" },
    { label: "Certification", value: product.specifications?.certification || "GIA Certified" },
  ];

  const productReviews = product.reviews || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Alert */}
      {showAlert && (
        <div className="mb-3 px-4 py-3 rounded-md bg-brand-tealDark text-brand-off border border-brand-gold/30">
          {quantity} {quantity === 1 ? "item" : "items"} added to cart!
        </div>
      )}

      {/* Breadcrumbs */}
      <div className="text-sm text-brand-off/80 mb-4 flex items-center gap-2">
        <button className="hover:underline" onClick={() => navigate("/")}>Home</button>
        <span>/</span>
        <button className="hover:underline" onClick={() => navigate("/products")}>Products</button>
        <span>/</span>
        <span className="">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image card */}
        <motion.div className="rounded-lg overflow-hidden shadow-sm  bg-brand-tealDark border border-brand-gold/20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="relative h-[420px]">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <button
              onClick={handleToggleFavorite}
              className="absolute top-4 right-4 inline-flex items-center justify-center rounded-full p-2  bg-brand-tealDark/90 hover: bg-brand-tealDark"
              aria-label="Toggle favorite"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFavorite ? "#e91e63" : "currentColor"} className="w-5 h-5">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.227 3 12.973 3 10.5 3 7.462 5.462 5 8.5 5a5.49 5.49 0 0 1 3.5 1.236A5.49 5.49 0 0 1 15.5 5C18.538 5 21 7.462 21 10.5c0 2.473-1.688 4.727-3.989 7.007a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.218l-.022.012-.007.003a.75.75 0 0 1-.666 0z" />
              </svg>
            </button>
            <span className="absolute top-4 left-4 inline-flex items-center rounded-md bg-brand-gold/20 text-brand-off text-xs font-semibold px-2 py-1 border border-brand-gold/30">
              {product.category}
            </span>
          </div>
        </motion.div>

        {/* Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <button onClick={() => navigate(-1)} className="mb-3 inline-flex items-center gap-2 text-brand-off/80 hover:underline">
            ← Back to Products
          </button>

          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center mb-2">
            <span className="text-yellow-500 mr-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>{i + 1 <= Math.round(product.rating) ? '★' : '☆'}</span>
              ))}
            </span>
            <span className="text-sm text-brand-off/60">({product.rating.toFixed(1)}) - {productReviews.length} reviews</span>
          </div>
          <div className="text-3xl font-bold text-brand-gold mb-3">₹{product.price.toLocaleString('en-IN')}</div>
          <p className="text-brand-off/80 mb-4">{product.description}</p>

          {/* Quantity */}
          <div className="flex items-center mb-4">
            <div className="font-semibold mr-3">Quantity:</div>
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="px-3 py-1 rounded border border-brand-off/30 hover:bg-brand-teal/10 disabled:opacity-50"
            >
              -
            </button>
              <input
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              type="number"
              min={1}
              className="mx-2 w-20 text-center rounded border border-brand-off/30 bg-transparent px-2 py-1"
            />
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="px-3 py-1 rounded border border-brand-off/30 hover:bg-brand-teal/10"
            >
              +
            </button>
          </div>

          <div className="flex gap-3 mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              onClick={handleAddToCart}
              className="inline-flex items-center gap-2 rounded-md bg-brand-gold text-brand-tealDark px-6 py-3 font-semibold"
            >
              Add to Cart
            </motion.button>
          </div>

          {/* Features */}
          <motion.div className="p-3 rounded-lg  bg-brand-tealDark shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 border border-brand-gold/20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-brand-gold" /><span className="text-sm">Free Shipping</span></div>
            <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-brand-gold" /><span className="text-sm">Secure Payment</span></div>
            <div className="flex items-center gap-2"><RefreshCw className="w-4 h-4 text-brand-gold" /><span className="text-sm">30-Day Returns</span></div>
          </motion.div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="mt-8">
        <div className="flex border-b">
          {["Specifications", "Reviews", "Shipping & Returns"].map((label, i) => (
            <button
              key={label}
              onClick={() => setSelectedTab(i)}
              className={`px-4 py-2 -mb-px border-b-2 ${selectedTab === i ? 'border-brand-gold text-brand-gold' : 'border-transparent text-brand-off/70'} mr-2`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Specifications */}
        {selectedTab === 0 && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {specifications.map((spec) => (
              <div key={spec.label} className="p-3 rounded-lg  bg-brand-tealDark shadow-sm border border-brand-gold/20">
                <div className="text-xs uppercase tracking-wide text-brand-off/70">{spec.label}</div>
                <div className="font-medium text-brand-off">{spec.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Reviews */}
        {selectedTab === 1 && (
          <div className="mt-4">
            {/* Add Review Form */}
            <form onSubmit={handleReviewSubmit} className="mb-8 p-6 rounded-lg bg-brand-tealDark border border-brand-gold/20">
              <h3 className="text-xl font-bold mb-4">Add a Review</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Rating</label>
                <div className="flex gap-2 text-2xl text-yellow-500">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button 
                      key={num} 
                      type="button" 
                      onClick={() => setReviewForm(prev => ({ ...prev, rating: num }))}
                    >
                      {num <= reviewForm.rating ? '★' : '☆'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Comment</label>
                <textarea 
                  className="w-full rounded border border-brand-off/30 bg-transparent px-3 py-2 h-24"
                  value={reviewForm.comment}
                  onChange={e => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Images (optional)</label>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="w-full text-sm"
                />
              </div>
              <button 
                type="submit" 
                disabled={isSubmittingReview}
                className="bg-brand-gold text-brand-tealDark px-6 py-2 rounded font-semibold disabled:opacity-50"
              >
                {isSubmittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>

            {productReviews.length === 0 ? (
              <p className="text-brand-off/60">No reviews yet. Be the first to review!</p>
            ) : (
              productReviews.map((review, index) => (
                <motion.div key={index} className="p-4 mb-3 rounded-lg  bg-brand-tealDark shadow-sm border border-brand-gold/20" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-semibold">{review.user}</div>
                    <div className="text-brand-gold text-sm">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>{i + 1 <= review.rating ? '★' : '☆'}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-brand-off/70 mb-2">{new Date(review.date).toLocaleDateString()}</div>
                  <div className="mb-3">{review.comment}</div>
                  
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {review.images.map((img, i) => (
                        <img 
                          key={i} 
                          src={getImageUrl(img)} 
                          alt="Review" 
                          className="w-20 h-20 object-cover rounded border border-brand-gold/10" 
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Shipping & Returns */}
        {selectedTab === 2 && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg  bg-brand-tealDark shadow-sm border border-brand-gold/20">
              <div className="text-lg font-bold mb-2">Shipping Information</div>
              <ul className="list-disc list-inside text-sm text-brand-off/70 space-y-1">
                <li>Free standard shipping on orders over ₹49,999</li>
                <li>Express shipping available (2-3 business days)</li>
                <li>Secure insured delivery for all jewelry</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg  bg-brand-tealDark shadow-sm border border-brand-gold/20">
              <div className="text-lg font-bold mb-2">Return Policy</div>
              <ul className="list-disc list-inside text-sm text-brand-off/70 space-y-1">
                <li>30-day easy return policy</li>
                <li>Full refund for unused items in original packaging</li>
                <li>Exchange available for different sizes</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map(rel => (
              <motion.div 
                key={rel._id}
                whileHover={{ y: -5 }}
                onClick={() => { navigate(`/product/${rel._id}`); window.scrollTo(0, 0); }}
                className="bg-brand-tealDark rounded-lg overflow-hidden border border-brand-gold/10 cursor-pointer shadow-sm"
              >
                <div className="h-48 relative">
                  <ImageWithFallback src={rel.image} alt={rel.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm truncate">{rel.name}</h3>
                  <p className="text-brand-gold font-bold">₹{rel.price.toLocaleString('en-IN')}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
