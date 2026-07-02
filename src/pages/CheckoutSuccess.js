import React from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, paymentIntentId } = location.state || {};

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-brand-tealDark text-brand-off p-8 rounded-lg border border-brand-gold/20"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <svg className="w-10 h-10 text-brand-tealDark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-bold mb-4"
        >
          Order Placed Successfully!
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-brand-off/80 mb-6"
        >
          Thank you for your purchase! Your order has been confirmed and payment has been processed successfully.
          You will receive an email confirmation with tracking details.
        </motion.p>

        {orderId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-brand-teal/20 p-4 rounded-lg mb-6 text-left"
          >
            <h3 className="font-semibold mb-2">Order Details</h3>
            <p className="text-sm"><strong>Order ID:</strong> {orderId}</p>
            {paymentIntentId && (
              <p className="text-sm"><strong>Payment ID:</strong> {paymentIntentId}</p>
            )}
            <p className="text-sm"><strong>Status:</strong> Payment Successful</p>
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <motion.button
            onClick={() => navigate('/products')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 rounded-md bg-brand-gold text-brand-tealDark font-semibold"
          >
            Continue Shopping
          </motion.button>
          <motion.button
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 rounded border border-brand-off/30 text-brand-off hover:bg-brand-teal/20"
          >
            Back to Home
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CheckoutSuccess;
