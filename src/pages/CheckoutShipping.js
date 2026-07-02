import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CheckoutShipping = () => {
  const [form, setForm] = useState({ method: "standard", notes: "" });
  const navigate = useNavigate();
  
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = (e) => { 
    e.preventDefault(); 
    // Store shipping info in localStorage
    localStorage.setItem('shippingMethod', JSON.stringify(form));
    navigate('/checkout/payment');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Shipping Method</h1>
      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit} className="bg-brand-tealDark text-brand-off p-6 rounded-lg border border-brand-gold/20 space-y-4">
        <div>
          <label className="block font-semibold mb-2">Shipping Method</label>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 rounded border border-brand-off/30">
              <input type="radio" name="method" value="standard" checked={form.method === "standard"} onChange={handle} className="accent-brand-gold" />
              <div>
                <div className="font-medium">Standard Shipping (5-7 days)</div>
                <div className="text-sm text-brand-off/70">Free</div>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 rounded border border-brand-off/30">
              <input type="radio" name="method" value="express" checked={form.method === "express"} onChange={handle} className="accent-brand-gold" />
              <div>
                <div className="font-medium">Express Shipping (2-3 days)</div>
                <div className="text-sm text-brand-off/70">$15.00</div>
              </div>
            </label>
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-2">Special Instructions</label>
          <textarea className="w-full rounded border border-brand-off/30 bg-transparent px-3 py-2 h-20" placeholder="Any special delivery instructions..." name="notes" value={form.notes} onChange={handle} />
        </div>
        <div className="flex gap-3 justify-end">
          <motion.button type="button" onClick={() => navigate('/checkout/address')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="px-6 py-2 rounded border border-brand-off/30 text-brand-off hover:bg-brand-teal/20">Back</motion.button>
          <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="px-6 py-2 rounded-md bg-brand-gold text-brand-tealDark font-semibold">Continue</motion.button>
        </div>
      </motion.form>
    </div>
  );
};

export default CheckoutShipping;
