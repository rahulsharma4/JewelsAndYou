import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CheckoutAddress = () => {
  const [form, setForm] = useState({ name: "", address: "", city: "", country: "", zip: "" });
  const navigate = useNavigate();
  
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = (e) => { 
    e.preventDefault(); 
    // Store address in localStorage for checkout process
    localStorage.setItem('shippingAddress', JSON.stringify(form));
    navigate('/checkout/shipping');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Shipping Address</h1>
      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit} className="bg-brand-tealDark text-brand-off p-6 rounded-lg border border-brand-gold/20 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input className="rounded border border-brand-off/30 bg-transparent px-3 py-2" placeholder="Full Name" name="name" value={form.name} onChange={handle} />
        <input className="rounded border border-brand-off/30 bg-transparent px-3 py-2 sm:col-span-2" placeholder="Address" name="address" value={form.address} onChange={handle} />
        <input className="rounded border border-brand-off/30 bg-transparent px-3 py-2" placeholder="City" name="city" value={form.city} onChange={handle} />
        <input className="rounded border border-brand-off/30 bg-transparent px-3 py-2" placeholder="Country" name="country" value={form.country} onChange={handle} />
        <input className="rounded border border-brand-off/30 bg-transparent px-3 py-2" placeholder="ZIP" name="zip" value={form.zip} onChange={handle} />
        <div className="sm:col-span-2 text-right">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={{ type:'spring', stiffness:300, damping:20 }} className="rounded-md bg-brand-gold text-brand-tealDark px-6 py-2 font-semibold">Continue</motion.button>
        </div>
      </motion.form>
    </div>
  );
};

export default CheckoutAddress;


