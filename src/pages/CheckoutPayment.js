import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import StripePayment from "../components/StripePayment";
import api from "../services/api";
import { CreditCard, ShieldCheck, ArrowLeft } from "lucide-react";

const CheckoutSteps = ({ currentStep }) => {
  const steps = [
    { id: 1, name: "Address" },
    { id: 2, name: "Delivery" },
    { id: 3, name: "Payment" }
  ];
  return (
    <div className="flex items-center justify-center gap-2 mb-8 max-w-lg mx-auto">
      {steps.map((step, idx) => (
        <React.Fragment key={step.id}>
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              currentStep === step.id ? 'bg-brand-gold text-brand-tealDark font-extrabold shadow-lg shadow-brand-gold/15' :
              currentStep > step.id ? 'bg-emerald-600 text-white' : 'bg-brand-tealDark text-brand-off/40 border border-brand-off/10'
            }`}>
              {currentStep > step.id ? "✓" : step.id}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${
              currentStep === step.id ? 'text-brand-gold' : 'text-brand-off/40'
            }`}>{step.name}</span>
          </div>
          {idx < steps.length - 1 && (
            <div className={`w-12 h-px transition-all ${currentStep > step.id ? 'bg-emerald-600' : 'bg-brand-off/15'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const CheckoutPayment = () => {
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [loading, setLoading] = useState(false);
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
      
      const orderData = {
        items: items,
        shippingAddress: JSON.parse(localStorage.getItem('shippingAddress') || '{}'),
        paymentMethod: 'stripe',
        paymentInfo: {
          paymentIntentId: paymentIntent.id,
          status: paymentIntent.status
        },
        shippingMethod: JSON.parse(localStorage.getItem('shippingMethod') || '{}').method || 'standard',
        subtotal: totalAmount,
        total: totalAmount
      };

      const order = await api.createOrder(orderData);
      
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

  const handleStripeError = (errorMsg) => {
    setError(errorMsg);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 pb-24 md:pb-10">
      {/* Steps */}
      <CheckoutSteps currentStep={3} />

      {loading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-brand-tealDark p-8 rounded-2xl border border-brand-gold/20 text-center space-y-4 max-w-xs mx-auto shadow-2xl">
            <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto" />
            <h3 className="text-brand-gold font-bold font-heading">Processing Order</h3>
            <p className="text-brand-off/60 text-xs">Please do not refresh the page or press back.</p>
          </div>
        </div>
      )}

      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-brand-tealDark p-6 md:p-8 rounded-2xl border border-brand-gold/15 shadow-xl space-y-6"
      >
        <div className="flex items-center justify-between border-b border-brand-gold/10 pb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-brand-gold" />
            <h2 className="text-xl font-bold font-heading text-brand-gold">Payment Details</h2>
          </div>
          <span className="text-lg font-bold text-brand-gold">Total: ₹{totalAmount.toLocaleString('en-IN')}</span>
        </div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-lg"
          >
            {error}
          </motion.div>
        )}

        <div className="space-y-6">
          {/* Method choice */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase text-brand-off/60">Choose Payment Method</label>
            <div className="p-4 rounded-xl border border-brand-gold bg-brand-gold/5 flex items-center gap-3">
              <input 
                type="radio" 
                name="method" 
                value="stripe" 
                checked={paymentMethod === "stripe"} 
                onChange={(e) => setPaymentMethod(e.target.value)} 
                className="accent-brand-gold w-4.5 h-4.5" 
              />
              <div>
                <div className="text-sm font-bold">Credit/Debit Card</div>
                <div className="text-xs text-brand-off/50 mt-0.5">Secure payment via international card networks</div>
              </div>
            </div>
          </div>

          {/* Stripe Card Field Container */}
          {paymentMethod === "stripe" && (
            <div className="bg-brand-teal/20 p-5 rounded-xl border border-brand-off/10">
              <StripePayment
                amount={totalAmount}
                orderId={orderId}
                items={items}
                onSuccess={handleStripeSuccess}
                onError={handleStripeError}
              />
            </div>
          )}

          {/* Guarantee Assurances */}
          <div className="bg-brand-teal/20 rounded-xl p-3 border border-brand-gold/5 flex gap-2.5 items-center mt-3">
            <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <span className="text-[10px] text-brand-off/60">Payment transactions are protected by Stripe 256-bit SSL encrypted connection.</span>
          </div>

          {/* Navigation */}
          <div className="border-t border-brand-gold/10 pt-4 mt-2 flex justify-between items-center">
            <button 
              type="button" 
              onClick={() => navigate('/checkout/shipping')} 
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-brand-off/20 hover:bg-brand-off/5 rounded-lg text-xs font-semibold transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="text-right text-[10px] text-brand-off/40">
              Powered by Stripe.
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckoutPayment;
