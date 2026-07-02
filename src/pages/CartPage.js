import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";


const CartPage = () => {
  const navigate = useNavigate();
  
  // Use cart context
  const { cart, loading, updateCartItem, removeFromCart, getTotalPrice } = useCart();

  const total = getTotalPrice();

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center">Loading cart...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
      {cart.length === 0 ? (
        <div className="bg-brand-tealDark text-brand-off rounded-lg p-6">Your cart is empty.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-3">
            {cart.map((item) => (
              <motion.div key={item.product._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 bg-brand-tealDark rounded-lg p-4 border border-brand-gold/20">
                <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-semibold">{item.product.name}</div>
                  <div className="text-brand-gold">₹{item.product.price.toLocaleString('en-IN')}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <button className="px-2 py-1 rounded border border-brand-off/30" onClick={() => updateCartItem(item.product._id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button className="px-2 py-1 rounded border border-brand-off/30" onClick={() => updateCartItem(item.product._id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <button className="text-rose-400" onClick={() => removeFromCart(item.product._id)}>Remove</button>
              </motion.div>
            ))}
          </div>
          <div className="bg-brand-tealDark text-brand-off rounded-lg p-4 h-fit border border-brand-gold/20">
            <div className="flex items-center justify-between font-bold mb-3">
              <span>Total</span>
              <span className="text-brand-gold">₹{total.toLocaleString('en-IN')}</span>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={{ type:'spring', stiffness:300, damping:20 }} className="w-full rounded-md bg-brand-gold text-brand-tealDark py-2 font-semibold" onClick={() => navigate('/checkout/address')}>Checkout</motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;


