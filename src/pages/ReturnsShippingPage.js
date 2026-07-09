import React from "react";
import { motion } from "framer-motion";

const ReturnsShippingPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold font-heading text-brand-dark">Returns & Shipping</h1>
          <div className="w-20 h-1 bg-brand-gold rounded-full mx-auto" />
          <p className="text-brand-dark/60 font-medium">Everything you need to know about deliveries and returns.</p>
        </div>
        
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 md:p-10 rounded-3xl border border-brand-gold/15 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-xl hover:shadow-brand-gold/5 transition-all"
          >
            <h2 className="text-2xl font-bold font-heading mb-6 text-brand-dark flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-brand-gold" /> Shipping Information
            </h2>
            <div className="space-y-6">
              <div className="p-5 bg-[#FDFBF7] rounded-2xl border border-brand-dark/10 shadow-sm">
                <h3 className="text-lg font-bold font-heading mb-2 text-brand-dark">Standard Shipping</h3>
                <p className="text-brand-dark/70 font-medium leading-relaxed">Free on orders over $500. 5-7 business days delivery.</p>
              </div>
              <div className="p-5 bg-[#FDFBF7] rounded-2xl border border-brand-dark/10 shadow-sm">
                <h3 className="text-lg font-bold font-heading mb-2 text-brand-dark">Express Shipping</h3>
                <p className="text-brand-dark/70 font-medium leading-relaxed">$15.00 for 2-3 business days delivery.</p>
              </div>
              <div className="p-5 bg-[#FDFBF7] rounded-2xl border border-brand-dark/10 shadow-sm">
                <h3 className="text-lg font-bold font-heading mb-2 text-brand-dark">International Shipping</h3>
                <p className="text-brand-dark/70 font-medium leading-relaxed">Available to select countries. Shipping costs vary by location.</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 md:p-10 rounded-3xl border border-brand-gold/15 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-xl hover:shadow-brand-gold/5 transition-all"
          >
            <h2 className="text-2xl font-bold font-heading mb-6 text-brand-dark flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-brand-gold" /> Return Policy
            </h2>
            <div className="space-y-6">
              <div className="p-5 bg-[#FDFBF7] rounded-2xl border border-brand-dark/10 shadow-sm">
                <h3 className="text-lg font-bold font-heading mb-2 text-brand-dark">30-Day Return Window</h3>
                <p className="text-brand-dark/70 font-medium leading-relaxed">You have 30 days from delivery to return items in original condition.</p>
              </div>
              <div className="p-5 bg-[#FDFBF7] rounded-2xl border border-brand-dark/10 shadow-sm">
                <h3 className="text-lg font-bold font-heading mb-2 text-brand-dark">Free Returns</h3>
                <p className="text-brand-dark/70 font-medium leading-relaxed">We provide free return shipping labels for all returns.</p>
              </div>
              <div className="p-5 bg-[#FDFBF7] rounded-2xl border border-brand-dark/10 shadow-sm">
                <h3 className="text-lg font-bold font-heading mb-2 text-brand-dark">Refund Process</h3>
                <p className="text-brand-dark/70 font-medium leading-relaxed">Refunds are processed within 5-7 business days after we receive your return.</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-8 md:p-10 rounded-3xl border border-brand-gold/15 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-xl hover:shadow-brand-gold/5 transition-all"
          >
            <h2 className="text-2xl font-bold font-heading mb-6 text-brand-dark flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-brand-gold" /> How to Return
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#FDFBF7] transition-colors border border-transparent hover:border-brand-dark/5">
                <div className="w-10 h-10 bg-[#FDFBF7] rounded-full flex items-center justify-center text-brand-gold font-bold shadow-inner border border-brand-gold/20 flex-shrink-0">1</div>
                <p className="text-brand-dark/70 font-medium">Contact our customer service to initiate a return.</p>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#FDFBF7] transition-colors border border-transparent hover:border-brand-dark/5">
                <div className="w-10 h-10 bg-[#FDFBF7] rounded-full flex items-center justify-center text-brand-gold font-bold shadow-inner border border-brand-gold/20 flex-shrink-0">2</div>
                <p className="text-brand-dark/70 font-medium">Package items securely in original packaging.</p>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#FDFBF7] transition-colors border border-transparent hover:border-brand-dark/5">
                <div className="w-10 h-10 bg-[#FDFBF7] rounded-full flex items-center justify-center text-brand-gold font-bold shadow-inner border border-brand-gold/20 flex-shrink-0">3</div>
                <p className="text-brand-dark/70 font-medium">Use the provided return label and drop off at any authorized location.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReturnsShippingPage;
