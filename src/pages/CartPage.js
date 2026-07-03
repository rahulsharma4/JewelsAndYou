import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, Truck, Plus, Minus, Gem } from "lucide-react";

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, loading, updateCartItem, removeFromCart, getTotalPrice } = useCart();
  const total = getTotalPrice();

  // Free shipping progress tracker details
  const freeShippingThreshold = 49999;
  const progressPercent = Math.min((total / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = freeShippingThreshold - total;

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-brand-teal text-brand-off flex items-center justify-center">
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
        <p className="text-brand-off/60 text-sm">
          Review your selection before checking out
        </p>
      </div>

      {cart.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 rounded-2xl bg-brand-tealDark/50 border border-brand-gold/10 max-w-xl mx-auto"
        >
          <ShoppingBag className="w-16 h-16 text-brand-gold/30 mx-auto mb-4" />
          <h2 className="text-xl font-bold font-heading mb-2">Your Shopping Bag is Empty</h2>
          <p className="text-brand-off/50 text-sm mb-6 max-w-xs mx-auto">
            Explore our curated collections of diamonds, gold, and fine silver jewelry.
          </p>
          <button 
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-gold text-brand-tealDark rounded-lg text-sm font-bold shadow-lg shadow-brand-gold/10 hover:bg-brand-gold/90 transition"
          >
            Start Shopping <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Cart items list */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Free Shipping Tracker */}
            <div className="p-4 rounded-xl bg-brand-tealDark border border-brand-gold/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="inline-flex items-center gap-1.5 text-brand-gold">
                  <Truck className="w-4 h-4" />
                  {remainingForFreeShipping > 0 
                    ? `Add ₹${remainingForFreeShipping.toLocaleString('en-IN')} more for FREE shipping!`
                    : "You've unlocked FREE Insured Shipping!"
                  }
                </span>
                <span className="text-brand-off/50">{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full h-1.5 bg-brand-teal rounded-full overflow-hidden">
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
                    key={item.product._id || item.product.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-brand-tealDark border border-brand-gold/10 hover:border-brand-gold/25 transition relative group"
                  >
                    {/* Thumbnail */}
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-brand-teal">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    
                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate text-brand-off group-hover:text-brand-gold transition duration-200">{item.product.name}</h3>
                      <span className="text-[10px] text-brand-gold/70 font-semibold px-2 py-0.5 rounded bg-brand-gold/10 border border-brand-gold/20 inline-block mt-1">
                        {item.product.category}
                      </span>
                      {item.product.priceType === 'weight-based' && (
                        <div className="text-[10px] text-brand-off/40 mt-1">
                          Metal: {item.product.metalType} • Weight: {item.product.weight}g
                        </div>
                      )}
                      <div className="text-sm font-bold text-brand-gold mt-2">
                        ₹{item.product.price?.toLocaleString('en-IN')}
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t border-brand-off/5 sm:border-0 pt-3 sm:pt-0 mt-2 sm:mt-0">
                      {/* Quantity */}
                      <div className="flex items-center rounded-lg border border-brand-off/15 bg-brand-teal/20 overflow-hidden">
                        <button 
                          onClick={() => updateCartItem(item.product._id || item.product.id, item.quantity - 1)}
                          className="p-2 hover:bg-brand-teal/30 text-brand-off/60 hover:text-brand-off transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold">{item.quantity}</span>
                        <button 
                          onClick={() => updateCartItem(item.product._id || item.product.id, item.quantity + 1)}
                          className="p-2 hover:bg-brand-teal/30 text-brand-off/60 hover:text-brand-off transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Remove */}
                      <button 
                        onClick={() => removeFromCart(item.product._id || item.product.id)}
                        className="p-2 text-brand-off/40 hover:text-red-400 border border-brand-off/10 rounded-lg hover:border-red-400/20 transition"
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
            <div className="rounded-xl bg-brand-tealDark p-5 border border-brand-gold/10 space-y-4 shadow-lg sticky top-24">
              <h2 className="text-base font-bold font-heading text-brand-gold border-b border-brand-gold/10 pb-2.5">
                Order Summary
              </h2>
              
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-brand-off/70">
                  <span>Bag Subtotal</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-brand-off/70">
                  <span>Insured Delivery</span>
                  <span className="text-brand-gold">
                    {total >= freeShippingThreshold ? "FREE" : "₹150"}
                  </span>
                </div>
                
                <div className="h-px bg-brand-off/10 my-2" />
                
                <div className="flex justify-between text-sm font-bold text-brand-off">
                  <span>Total Sum</span>
                  <span className="text-brand-gold">
                    ₹{(total + (total >= freeShippingThreshold ? 0 : 150)).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Secure Checkout Banner */}
              <div className="rounded-lg bg-brand-teal/40 p-3 border border-brand-gold/5 flex gap-2.5">
                <ShieldCheck className="w-5 h-5 text-brand-gold flex-shrink-0" />
                <div className="text-[10px] text-brand-off/60 leading-relaxed">
                  <span className="font-bold text-brand-off block">Secure Checkout Guaranteed</span>
                  SSL Encryption protects your financial credentials.
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                onClick={() => navigate('/checkout/address')}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand-gold text-brand-tealDark py-3 font-bold text-sm shadow-lg shadow-brand-gold/15 hover:bg-brand-gold/90 transition"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </motion.button>
              
              <button 
                onClick={() => navigate('/products')}
                className="w-full text-center text-xs text-brand-off/50 hover:text-brand-gold transition duration-200"
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
