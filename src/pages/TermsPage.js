import React from "react";
import { motion } from "framer-motion";

const TermsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-brand-tealDark text-brand-off p-6 rounded-lg border border-brand-gold/20"
          >
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="text-brand-off/80">
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-brand-tealDark text-brand-off p-6 rounded-lg border border-brand-gold/20"
          >
            <h2 className="text-2xl font-bold mb-4">2. Use License</h2>
            <p className="text-brand-off/80 mb-3">
              Permission is granted to temporarily download one copy of the materials on JewelsAndYou's website for personal, 
              non-commercial transitory viewing only.
            </p>
            <p className="text-brand-off/80">
              This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-1 text-brand-off/80">
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
            className="bg-brand-tealDark text-brand-off p-6 rounded-lg border border-brand-gold/20"
          >
            <h2 className="text-2xl font-bold mb-4">3. Product Information</h2>
            <p className="text-brand-off/80">
              We strive to provide accurate product descriptions and images. However, we do not warrant that product 
              descriptions or other content is accurate, complete, reliable, current, or error-free.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-brand-tealDark text-brand-off p-6 rounded-lg border border-brand-gold/20"
          >
            <h2 className="text-2xl font-bold mb-4">4. Pricing and Payment</h2>
            <p className="text-brand-off/80">
              All prices are subject to change without notice. We reserve the right to modify or discontinue any product 
              or service without notice. Payment must be received before order processing.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-brand-tealDark text-brand-off p-6 rounded-lg border border-brand-gold/20"
          >
            <h2 className="text-2xl font-bold mb-4">5. Limitation of Liability</h2>
            <p className="text-brand-off/80">
              In no event shall JewelsAndYou or its suppliers be liable for any damages (including, without limitation, 
              damages for loss of data or profit, or due to business interruption) arising out of the use or inability 
              to use the materials on JewelsAndYou's website.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default TermsPage;
