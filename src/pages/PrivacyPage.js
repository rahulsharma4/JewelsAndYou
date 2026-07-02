import React from "react";
import { motion } from "framer-motion";

const PrivacyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-brand-tealDark text-brand-off p-6 rounded-lg border border-brand-gold/20"
          >
            <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
            <p className="text-brand-off/80 mb-3">
              We collect information you provide directly to us, such as when you create an account, make a purchase, 
              or contact us for support.
            </p>
            <ul className="list-disc list-inside space-y-1 text-brand-off/80">
              <li>Name and contact information</li>
              <li>Payment and billing information</li>
              <li>Shipping and delivery addresses</li>
              <li>Account preferences and settings</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-brand-tealDark text-brand-off p-6 rounded-lg border border-brand-gold/20"
          >
            <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
            <p className="text-brand-off/80 mb-3">We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-1 text-brand-off/80">
              <li>Process and fulfill your orders</li>
              <li>Provide customer support</li>
              <li>Send you important updates about your orders</li>
              <li>Improve our products and services</li>
              <li>Send you marketing communications (with your consent)</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-brand-tealDark text-brand-off p-6 rounded-lg border border-brand-gold/20"
          >
            <h2 className="text-2xl font-bold mb-4">Information Sharing</h2>
            <p className="text-brand-off/80">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, 
              except as described in this privacy policy. We may share your information with trusted third parties who 
              assist us in operating our website, conducting our business, or servicing you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-brand-tealDark text-brand-off p-6 rounded-lg border border-brand-gold/20"
          >
            <h2 className="text-2xl font-bold mb-4">Data Security</h2>
            <p className="text-brand-off/80">
              We implement appropriate security measures to protect your personal information against unauthorized access, 
              alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic 
              storage is 100% secure.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-brand-tealDark text-brand-off p-6 rounded-lg border border-brand-gold/20"
          >
            <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
            <p className="text-brand-off/80 mb-3">You have the right to:</p>
            <ul className="list-disc list-inside space-y-1 text-brand-off/80">
              <li>Access and update your personal information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt-out of marketing communications</li>
              <li>Request a copy of your data</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-brand-tealDark text-brand-off p-6 rounded-lg border border-brand-gold/20"
          >
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-brand-off/80">
              If you have any questions about this Privacy Policy, please contact us at privacy@jewelsandyou.com
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyPage;
