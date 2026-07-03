import React from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, Receipt, ArrowRight, Home } from "lucide-react";

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, paymentIntentId } = location.state || {};

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 pb-24 md:pb-16 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-brand-tealDark p-8 md:p-10 rounded-2xl border border-brand-gold/15 shadow-2xl space-y-6"
      >
        {/* Animated Check circle */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          className="w-20 h-20 bg-brand-gold/10 border border-brand-gold/30 rounded-full flex items-center justify-center mx-auto"
        >
          <CheckCircle className="w-10 h-10 text-brand-gold" />
        </motion.div>
        
        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-heading text-brand-gold">Order Placed Successfully!</h1>
          <p className="text-brand-off/60 text-sm max-w-sm mx-auto">
            Thank you for purchasing with Jewels & You. Your order is confirmed and is currently being processed.
          </p>
        </div>

        {/* Invoice Summary Box */}
        {orderId && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-brand-teal/20 p-5 rounded-xl border border-brand-gold/10 text-left space-y-3"
          >
            <div className="flex items-center gap-2 border-b border-brand-gold/10 pb-2 mb-1">
              <Receipt className="w-4 h-4 text-brand-gold" />
              <h3 className="text-sm font-bold text-brand-gold font-heading">Receipt Summary</h3>
            </div>
            
            <div className="space-y-1.5 text-xs text-brand-off/80">
              <div className="flex justify-between">
                <span className="text-brand-off/50">Order ID:</span>
                <span className="font-mono font-semibold">{orderId}</span>
              </div>
              {paymentIntentId && (
                <div className="flex justify-between">
                  <span className="text-brand-off/50">Payment Transaction ID:</span>
                  <span className="font-mono font-semibold">{paymentIntentId}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-brand-off/50">Delivery Status:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  Processing
                </span>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Helper Note */}
        <p className="text-xs text-brand-off/40 max-w-xs mx-auto">
          An email confirmation has been sent to your registered address with tracking information.
        </p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 justify-center pt-4"
        >
          <motion.button
            onClick={() => navigate('/products')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-lg bg-brand-gold text-brand-tealDark font-bold text-sm shadow-lg shadow-brand-gold/10 hover:bg-brand-gold/90 transition"
          >
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </motion.button>
          <motion.button
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-lg border border-brand-off/20 hover:bg-brand-off/5 text-sm font-semibold transition"
          >
            <Home className="w-4 h-4" /> Back to Home
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CheckoutSuccess;
