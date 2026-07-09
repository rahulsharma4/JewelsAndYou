import React from "react";
import { motion } from "framer-motion";

const TermsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold font-heading text-brand-dark">Terms of Service</h1>
          <div className="w-20 h-1 bg-brand-gold rounded-full mx-auto" />
          <p className="text-brand-dark/60 font-medium">Last Updated: October 2023</p>
        </div>
        
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 md:p-10 rounded-3xl border border-brand-gold/15 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-xl hover:shadow-brand-gold/5 transition-all"
          >
            <h2 className="text-2xl font-bold font-heading mb-4 text-brand-dark flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-brand-gold" /> 1. Acceptance of Terms
            </h2>
            <p className="text-brand-dark/70 font-medium leading-relaxed">
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 md:p-10 rounded-3xl border border-brand-gold/15 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-xl hover:shadow-brand-gold/5 transition-all"
          >
            <h2 className="text-2xl font-bold font-heading mb-4 text-brand-dark flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-brand-gold" /> 2. Use License
            </h2>
            <p className="text-brand-dark/70 font-medium leading-relaxed mb-4">
              Permission is granted to temporarily download one copy of the materials on Jewels And You's website for personal, 
              non-commercial transitory viewing only.
            </p>
            <p className="text-brand-dark/70 font-medium leading-relaxed mb-4">
              This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-outside ml-5 space-y-2 text-brand-dark/70 font-medium marker:text-brand-gold">
              <li>modify or copy the materials</li>
              <li>use the materials for any commercial purpose or for any public display</li>
              <li>attempt to reverse engineer any software contained on the website</li>
              <li>remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-8 md:p-10 rounded-3xl border border-brand-gold/15 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-xl hover:shadow-brand-gold/5 transition-all"
          >
            <h2 className="text-2xl font-bold font-heading mb-4 text-brand-dark flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-brand-gold" /> 3. Product Information
            </h2>
            <p className="text-brand-dark/70 font-medium leading-relaxed">
              We strive to provide accurate product descriptions and images. However, we do not warrant that product 
              descriptions or other content is accurate, complete, reliable, current, or error-free.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-8 md:p-10 rounded-3xl border border-brand-gold/15 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-xl hover:shadow-brand-gold/5 transition-all"
          >
            <h2 className="text-2xl font-bold font-heading mb-4 text-brand-dark flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-brand-gold" /> 4. Pricing and Payment
            </h2>
            <p className="text-brand-dark/70 font-medium leading-relaxed">
              All prices are subject to change without notice. We reserve the right to modify or discontinue any product 
              or service without notice. Payment must be received before order processing.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-8 md:p-10 rounded-3xl border border-brand-gold/15 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-xl hover:shadow-brand-gold/5 transition-all"
          >
            <h2 className="text-2xl font-bold font-heading mb-4 text-brand-dark flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-brand-gold" /> 5. Limitation of Liability
            </h2>
            <p className="text-brand-dark/70 font-medium leading-relaxed">
              In no event shall Jewels And You or its suppliers be liable for any damages (including, without limitation, 
              damages for loss of data or profit, or due to business interruption) arising out of the use or inability 
              to use the materials on Jewels And You's website.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default TermsPage;
