import React from "react";
import { motion } from "framer-motion";

const ReturnsShippingPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold mb-6">Returns & Shipping</h1>
        
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-brand-tealDark text-brand-off p-6 rounded-lg border border-brand-gold/20"
          >
            <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Standard Shipping</h3>
                <p className="text-brand-off/80">Free on orders over $500. 5-7 business days delivery.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Express Shipping</h3>
                <p className="text-brand-off/80">$15.00 for 2-3 business days delivery.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">International Shipping</h3>
                <p className="text-brand-off/80">Available to select countries. Shipping costs vary by location.</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-brand-tealDark text-brand-off p-6 rounded-lg border border-brand-gold/20"
          >
            <h2 className="text-2xl font-bold mb-4">Return Policy</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">30-Day Return Window</h3>
                <p className="text-brand-off/80">You have 30 days from delivery to return items in original condition.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Free Returns</h3>
                <p className="text-brand-off/80">We provide free return shipping labels for all returns.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Refund Process</h3>
                <p className="text-brand-off/80">Refunds are processed within 5-7 business days after we receive your return.</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-brand-tealDark text-brand-off p-6 rounded-lg border border-brand-gold/20"
          >
            <h2 className="text-2xl font-bold mb-4">How to Return</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-brand-gold rounded-full flex items-center justify-center text-brand-tealDark font-bold text-sm">1</div>
                <p className="text-brand-off/80">Contact our customer service to initiate a return.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-brand-gold rounded-full flex items-center justify-center text-brand-tealDark font-bold text-sm">2</div>
                <p className="text-brand-off/80">Package items securely in original packaging.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-brand-gold rounded-full flex items-center justify-center text-brand-tealDark font-bold text-sm">3</div>
                <p className="text-brand-off/80">Use the provided return label and drop off at any authorized location.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReturnsShippingPage;
