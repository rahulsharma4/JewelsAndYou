import React from "react";
import { motion } from "framer-motion";

const CheckoutReview = ({ onPlaceOrder, onBack, cart = [], shippingInfo = {}, paymentInfo = {} }) => {
  const total = cart.reduce((t, i) => t + i.price * i.quantity, 0);
  const shippingCost = shippingInfo.method === "express" ? 15 : 0;
  const finalTotal = total + shippingCost;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Review Your Order</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Summary */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-brand-tealDark text-brand-off p-6 rounded-lg border border-brand-gold/20">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded bg-brand-teal/10">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-sm text-brand-off/70">Qty: {item.quantity}</div>
                </div>
                <div className="text-brand-gold font-semibold">${(item.price * item.quantity).toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-brand-off/20">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>${total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping:</span>
              <span>${shippingCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-brand-gold">${finalTotal.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>

        {/* Shipping & Payment Info */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="bg-brand-tealDark text-brand-off p-6 rounded-lg border border-brand-gold/20">
            <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
            <div className="text-brand-off/80">
              <div>{shippingInfo.name}</div>
              <div>{shippingInfo.address}</div>
              <div>{shippingInfo.city}, {shippingInfo.country} {shippingInfo.zip}</div>
            </div>
          </div>

          <div className="bg-brand-tealDark text-brand-off p-6 rounded-lg border border-brand-gold/20">
            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
            <div className="text-brand-off/80">
              {paymentInfo.method === "card" ? (
                <div>
                  <div>**** **** **** {paymentInfo.cardNumber?.slice(-4)}</div>
                  <div>{paymentInfo.name}</div>
                </div>
              ) : (
                <div>PayPal</div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-6 flex gap-3 justify-end">
        <motion.button onClick={onBack} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="px-6 py-2 rounded border border-brand-off/30 text-brand-off hover:bg-brand-teal/20">Back</motion.button>
        <motion.button onClick={onPlaceOrder} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="px-6 py-2 rounded-md bg-brand-gold text-brand-tealDark font-semibold">Place Order</motion.button>
      </div>
    </div>
  );
};

export default CheckoutReview;
