import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, Truck, Plus, Minus, Gem } from "lucide-react";
import { ImageWithFallback } from "../utils/imageUtils";
import api from "../services/api";

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, loading, updateCartItem, removeFromCart, getTotalPrice } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(JSON.parse(localStorage.getItem('appliedCoupon')) || null);
  const [isApplying, setIsApplying] = useState(false);

  const baseTotal = getTotalPrice();
  const total = appliedCoupon ? Math.max(0, baseTotal - appliedCoupon.discountAmount) : baseTotal;

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    try {
      setIsApplying(true);
      setCouponError('');
      const data = await api.applyCoupon(couponCode, baseTotal);
      if (data.success) {
        setAppliedCoupon(data);
        localStorage.setItem('appliedCoupon', JSON.stringify(data));
      } else {
        setCouponError(data.message || 'Invalid coupon');
      }
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Failed to apply coupon');
    } finally {
      setIsApplying(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    localStorage.removeItem('appliedCoupon');
  };


  const getCartItemImage = (item) => {
    if (item.color && item.product.images && item.product.imageColors) {
      const idx = item.product.imageColors.findIndex(c => c && c.trim().toLowerCase() === item.color.toLowerCase());
      if (idx !== -1 && item.product.images[idx]) {
        return item.product.images[idx];
      }
    }
    return item.product.image || (item.product.images && item.product.images.length > 0 ? item.product.images[0] : null);
  };

  // Free shipping progress tracker details
  const freeShippingThreshold = 49999;
  const progressPercent = Math.min((total / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = freeShippingThreshold - total;

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-brand-cream text-brand-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Gem className="w-8 h-8 animate-spin text-brand-gold" />
          <span>Refreshing cart items...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 md:pb-10">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-1">Shopping Bag</h1>
        <p className="text-brand-dark/60 text-sm">
          Review your selection before checking out
        </p>
      </div>

      {cart.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 rounded-3xl bg-white shadow-xl shadow-brand-gold/5 border border-transparent max-w-xl mx-auto"
        >
          <ShoppingBag className="w-16 h-16 text-brand-gold/30 mx-auto mb-4" />
          <h2 className="text-xl font-bold font-heading mb-2 text-brand-dark">Your Shopping Bag is Empty</h2>
          <p className="text-brand-dark/50 text-sm mb-6 max-w-xs mx-auto">
            Explore our curated collections of diamonds, gold, and fine silver jewelry.
          </p>
          <button 
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-gold text-white rounded-xl text-sm font-bold tracking-widest uppercase shadow-lg shadow-brand-gold/20 hover:bg-brand-gold/90 transition-all"
          >
            Start Shopping <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Cart items list */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Free Shipping Tracker */}
            <div className="p-5 rounded-2xl bg-white border border-brand-dark/5 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="inline-flex items-center gap-1.5 text-brand-gold">
                  <Truck className="w-4 h-4" />
                  {remainingForFreeShipping > 0 
                    ? `Add ₹${remainingForFreeShipping.toLocaleString('en-IN')} more for FREE shipping!`
                    : "You've unlocked FREE Insured Shipping!"
                  }
                </span>
                <span className="text-brand-dark/50">{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full h-1.5 bg-brand-cream rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-brand-gold"
                />
              </div>
            </div>

            {/* Items list */}
            <div className="space-y-3">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div 
                    key={`${item.product._id || item.product.id}-${item.color || ''}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-5 rounded-2xl bg-white border border-brand-dark/5 shadow-sm hover:shadow-lg hover:shadow-brand-gold/10 hover:border-brand-gold/20 transition-all duration-300 relative group"
                  >
                    {/* Thumbnail */}
                    <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-[#FBF9F6]">
                      <ImageWithFallback 
                        src={getCartItemImage(item)} 
                        alt={item.product.name} 
                        className="w-full h-full object-contain mix-blend-multiply p-2 transition-transform duration-500 group-hover:scale-110" 
                      />
                    </div>
                    
                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate text-brand-dark group-hover:text-brand-gold transition duration-200">{item.product.name}</h3>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <span className="text-[10px] text-brand-gold/70 font-semibold px-2 py-0.5 rounded bg-brand-gold/10 border border-brand-gold/20 inline-block">
                          {item.product.category}
                        </span>
                        {item.color && (
                          <span className="text-[10px] text-sky-300 font-semibold px-2 py-0.5 rounded bg-sky-300/10 border border-sky-300/20 inline-block">
                            Color: {item.color}
                          </span>
                        )}
                      </div>
                      {item.product.priceType === 'weight-based' && (
                        <div className="text-[10px] text-brand-dark/40 mt-1">
                          Metal: {item.product.metalType} • Weight: {item.product.weight}g
                        </div>
                      )}
                      <div className="text-sm font-bold text-brand-gold mt-2">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t border-brand-dark/5 sm:border-0 pt-3 sm:pt-0 mt-2 sm:mt-0">
                      {/* Quantity */}
                      <div className="flex items-center rounded-lg border border-brand-dark/15 bg-brand-cream/20 overflow-hidden">
                        <button 
                          onClick={() => updateCartItem(item.product._id || item.product.id, item.quantity - 1, item.color)}
                          className="p-2 hover:bg-brand-cream/30 text-brand-dark/60 hover:text-brand-dark transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold">{item.quantity}</span>
                        <button 
                          onClick={() => updateCartItem(item.product._id || item.product.id, item.quantity + 1, item.color)}
                          className="p-2 hover:bg-brand-cream/30 text-brand-dark/60 hover:text-brand-dark transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Remove */}
                      <button 
                        onClick={() => removeFromCart(item.product._id || item.product.id, item.color)}
                        className="p-2.5 text-brand-dark/40 hover:text-red-500 bg-white shadow-sm border border-brand-dark/5 rounded-xl hover:border-red-400/30 hover:bg-red-50 transition-all duration-300"
                        title="Remove from bag"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Side: Order Summary Card */}
          <div className="lg:col-span-4">
            <div className="rounded-3xl bg-white p-7 border border-brand-gold/15 space-y-6 shadow-xl shadow-brand-gold/10 sticky top-24">
              <h2 className="text-lg font-bold font-heading text-brand-dark border-b border-brand-dark/5 pb-4">
                Order Summary
              </h2>
              
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between text-brand-dark/70">
                  <span>Bag Subtotal</span>
                  <span>₹{baseTotal.toLocaleString('en-IN')}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount ({appliedCoupon.code || 'Coupon'})</span>
                    <span>- ₹{appliedCoupon.discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-brand-dark/70">
                  <span>Insured Delivery</span>
                  <span className="text-brand-gold">
                    {baseTotal >= freeShippingThreshold ? "FREE" : "₹150"}
                  </span>
                </div>
                
                <div className="h-px bg-brand-dark/10 my-2" />
                
                <div className="flex justify-between text-sm font-bold text-brand-dark">
                  <span>Total Sum</span>
                  <span className="text-brand-gold">
                    ₹{(total + (baseTotal >= freeShippingThreshold ? 0 : 150)).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Coupon Code Section */}
              <div className="space-y-2 mt-4">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60">Promo Code</label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                    <span className="text-xs font-bold text-emerald-700">{appliedCoupon.code || 'COUPON APPLIED'}</span>
                    <button onClick={removeCoupon} className="text-emerald-700/60 hover:text-emerald-700">
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter code"
                        className="flex-1 bg-brand-cream/30 border border-brand-dark/10 rounded-xl px-3 py-2 text-xs uppercase focus:outline-none focus:border-brand-gold/50 transition"
                      />
                      <button 
                        onClick={handleApplyCoupon}
                        disabled={isApplying || !couponCode}
                        className="px-4 bg-brand-dark text-white rounded-xl text-[10px] font-bold tracking-wider uppercase hover:bg-brand-gold transition disabled:opacity-50"
                      >
                        {isApplying ? '...' : 'Apply'}
                      </button>
                    </div>
                    {couponError && <p className="text-red-500 text-[10px] mt-1">{couponError}</p>}
                  </div>
                )}
              </div>

              {/* Secure Checkout Banner */}
              <div className="rounded-lg bg-brand-cream/40 p-3 border border-brand-gold/5 flex gap-2.5">
                <ShieldCheck className="w-5 h-5 text-brand-gold flex-shrink-0" />
                <div className="text-[10px] text-brand-dark/60 leading-relaxed">
                  <span className="font-bold text-brand-dark block">Secure Checkout Guaranteed</span>
                  SSL Encryption protects your financial credentials.
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                onClick={() => navigate('/checkout/address')}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-gold text-white py-4 font-bold text-[11px] uppercase tracking-widest shadow-xl shadow-brand-gold/20 hover:bg-brand-gold/90 transition-all"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </motion.button>
              
              <button 
                onClick={() => navigate('/products')}
                className="w-full text-center text-xs text-brand-dark/50 hover:text-brand-gold transition duration-200"
              >
                Continue Browsing Collection
              </button>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default CartPage;
