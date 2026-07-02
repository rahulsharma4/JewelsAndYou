import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import StripePayment from "../components/StripePayment";
import api from "../services/api";

const CheckoutPayment = () => {
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart } = useCart();
  
  const totalAmount = getTotalPrice();
  const orderId = `order_${Date.now()}`;
  const items = cart.map(item => ({
    product: item.product._id || item.product.id,
    name: item.product.name,
    quantity: item.quantity,
    price: item.product.price
  }));

  const handleStripeSuccess = async (paymentIntent) => {
    try {
      setLoading(true);
      
      // Create order with payment info
      const orderData = {
        items: items,
        shippingAddress: JSON.parse(localStorage.getItem('shippingAddress') || '{}'),
        paymentMethod: 'stripe',
        paymentInfo: {
          paymentIntentId: paymentIntent.id,
          status: paymentIntent.status
        },
        shippingMethod: localStorage.getItem('shippingMethod') || 'standard',
        subtotal: totalAmount,
        total: totalAmount
      };

      const order = await api.createOrder(orderData);
      
      // Clear cart and redirect to success
      await clearCart();
      localStorage.removeItem('shippingAddress');
      localStorage.removeItem('shippingMethod');
      
      navigate('/checkout/success', { 
        state: { 
          orderId: order._id,
          paymentIntentId: paymentIntent.id 
        } 
      });
    } catch (err) {
      setError('Order creation failed. Please contact support.');
      console.error('Order creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStripeError = (error) => {
    setError(error);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Payment Information</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-brand-tealDark text-brand-off p-6 rounded-lg border border-brand-gold/20 space-y-4"
      >
        <div>
          <label className="block font-semibold mb-2">Payment Method</label>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 rounded border border-brand-off/30">
              <input 
                type="radio" 
                name="method" 
                value="stripe" 
                checked={paymentMethod === "stripe"} 
                onChange={(e) => setPaymentMethod(e.target.value)} 
                className="accent-brand-gold" 
              />
              <div className="font-medium">Credit/Debit Card (Stripe)</div>
            </label>
          </div>
        </div>

        {paymentMethod === "stripe" && (
          <StripePayment
            amount={totalAmount}
            orderId={orderId}
            items={items}
            onSuccess={handleStripeSuccess}
            onError={handleStripeError}
          />
        )}

        <div className="flex gap-3 justify-between">
          <motion.button 
            type="button" 
            onClick={() => navigate('/checkout/shipping')} 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.98 }} 
            className="px-6 py-2 rounded border border-brand-off/30 text-brand-off hover:bg-brand-teal/20"
          >
            Back
          </motion.button>
          
          <div className="text-right">
            <div className="text-lg font-semibold mb-2">
              Total: ${totalAmount.toFixed(2)}
            </div>
            <div className="text-sm text-brand-off/80">
              Secure payment powered by Stripe
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckoutPayment;
