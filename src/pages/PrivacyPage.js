import React from "react";
import { motion } from "framer-motion";

const PrivacyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold font-heading text-brand-dark">Privacy Policy</h1>
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
              <span className="w-2 h-2 rounded-full bg-brand-gold" /> Information We Collect
            </h2>
            <p className="text-brand-dark/70 font-medium leading-relaxed mb-4">
              We collect information you provide directly to us, such as when you create an account, make a purchase, 
              or contact us for support.
            </p>
            <ul className="list-disc list-outside ml-5 space-y-2 text-brand-dark/70 font-medium marker:text-brand-gold">
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
            className="bg-white p-8 md:p-10 rounded-3xl border border-brand-gold/15 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-xl hover:shadow-brand-gold/5 transition-all"
          >
            <h2 className="text-2xl font-bold font-heading mb-4 text-brand-dark flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-brand-gold" /> How We Use Your Information
            </h2>
            <p className="text-brand-dark/70 font-medium leading-relaxed mb-4">We use the information we collect to:</p>
            <ul className="list-disc list-outside ml-5 space-y-2 text-brand-dark/70 font-medium marker:text-brand-gold">
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
            className="bg-white p-8 md:p-10 rounded-3xl border border-brand-gold/15 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-xl hover:shadow-brand-gold/5 transition-all"
          >
            <h2 className="text-2xl font-bold font-heading mb-4 text-brand-dark flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-brand-gold" /> Information Sharing
            </h2>
            <p className="text-brand-dark/70 font-medium leading-relaxed">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, 
              except as described in this privacy policy. We may share your information with trusted third parties who 
              assist us in operating our website, conducting our business, or servicing you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-8 md:p-10 rounded-3xl border border-brand-gold/15 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-xl hover:shadow-brand-gold/5 transition-all"
          >
            <h2 className="text-2xl font-bold font-heading mb-4 text-brand-dark flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-brand-gold" /> Data Security
            </h2>
            <p className="text-brand-dark/70 font-medium leading-relaxed">
              We implement appropriate security measures to protect your personal information against unauthorized access, 
              alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic 
              storage is 100% secure.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-8 md:p-10 rounded-3xl border border-brand-gold/15 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-xl hover:shadow-brand-gold/5 transition-all"
          >
            <h2 className="text-2xl font-bold font-heading mb-4 text-brand-dark flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-brand-gold" /> Your Rights
            </h2>
            <p className="text-brand-dark/70 font-medium leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc list-outside ml-5 space-y-2 text-brand-dark/70 font-medium marker:text-brand-gold">
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
            className="bg-white p-8 md:p-10 rounded-3xl border border-brand-gold/15 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-xl hover:shadow-brand-gold/5 transition-all"
          >
            <h2 className="text-2xl font-bold font-heading mb-4 text-brand-dark flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-brand-gold" /> Contact Us
            </h2>
            <p className="text-brand-dark/70 font-medium leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@jewelsandyou.com" className="text-brand-gold hover:underline font-bold">privacy@jewelsandyou.com</a>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyPage;
