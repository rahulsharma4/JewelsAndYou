import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MapPin, ArrowRight, ShieldCheck } from "lucide-react";
import { useCart } from "../contexts/CartContext";

const CheckoutSteps = ({ currentStep }) => {
  const steps = [
    { id: 1, name: "Address" },
    { id: 2, name: "Delivery" },
    { id: 3, name: "Payment" }
  ];
  return (
    <div className="flex items-center justify-center gap-2 mb-8 max-w-lg mx-auto">
      {steps.map((step, idx) => (
        <React.Fragment key={step.id}>
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              currentStep === step.id ? 'bg-brand-gold text-brand-tealDark font-extrabold shadow-lg shadow-brand-gold/15' :
              currentStep > step.id ? 'bg-emerald-600 text-white' : 'bg-brand-tealDark text-brand-off/40 border border-brand-off/10'
            }`}>
              {currentStep > step.id ? "✓" : step.id}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${
              currentStep === step.id ? 'text-brand-gold' : 'text-brand-off/40'
            }`}>{step.name}</span>
          </div>
          {idx < steps.length - 1 && (
            <div className={`w-12 h-px transition-all ${currentStep > step.id ? 'bg-emerald-600' : 'bg-brand-off/15'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const CheckoutAddress = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login?redirect=/checkout/address');
    } else if (cart.length === 0) {
      navigate('/cart');
    }
  }, [token, cart, navigate]);

  const savedAddress = JSON.parse(localStorage.getItem('shippingAddress') || '{}');
  
  const [form, setForm] = useState({
    name: savedAddress.name || "",
    address: savedAddress.address || "",
    city: savedAddress.city || "",
    country: savedAddress.country || "",
    zip: savedAddress.zip || ""
  });

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const submit = (e) => { 
    e.preventDefault(); 
    localStorage.setItem('shippingAddress', JSON.stringify(form));
    navigate('/checkout/shipping');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 pb-24 md:pb-10">
      {/* Steps indicator */}
      <CheckoutSteps currentStep={1} />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-tealDark p-6 md:p-8 rounded-2xl border border-brand-gold/15 shadow-xl space-y-6"
      >
        <div className="flex items-center gap-2 border-b border-brand-gold/10 pb-4">
          <MapPin className="w-5 h-5 text-brand-gold" />
          <h2 className="text-xl font-bold font-heading text-brand-gold">Shipping Address</h2>
        </div>

        <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase text-brand-off/60 mb-2">Full Name</label>
            <input 
              className="w-full rounded-lg border border-brand-off/15 bg-brand-teal/30 px-3.5 py-2.5 text-sm focus:border-brand-gold/40 focus:outline-none" 
              placeholder="e.g. Rahul Sharma" 
              name="name" 
              value={form.name} 
              onChange={handle} 
              required
            />
          </div>

          {/* Address */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase text-brand-off/60 mb-2">Street Address</label>
            <input 
              className="w-full rounded-lg border border-brand-off/15 bg-brand-teal/30 px-3.5 py-2.5 text-sm focus:border-brand-gold/40 focus:outline-none" 
              placeholder="e.g. 123 Luxury Lane, Apartment 4B" 
              name="address" 
              value={form.address} 
              onChange={handle} 
              required
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-semibold uppercase text-brand-off/60 mb-2">City</label>
            <input 
              className="w-full rounded-lg border border-brand-off/15 bg-brand-teal/30 px-3.5 py-2.5 text-sm focus:border-brand-gold/40 focus:outline-none" 
              placeholder="e.g. Mumbai" 
              name="city" 
              value={form.city} 
              onChange={handle} 
              required
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-xs font-semibold uppercase text-brand-off/60 mb-2">Country</label>
            <input 
              className="w-full rounded-lg border border-brand-off/15 bg-brand-teal/30 px-3.5 py-2.5 text-sm focus:border-brand-gold/40 focus:outline-none" 
              placeholder="e.g. India" 
              name="country" 
              value={form.country} 
              onChange={handle} 
              required
            />
          </div>

          {/* ZIP */}
          <div>
            <label className="block text-xs font-semibold uppercase text-brand-off/60 mb-2">ZIP / Postal Code</label>
            <input 
              className="w-full rounded-lg border border-brand-off/15 bg-brand-teal/30 px-3.5 py-2.5 text-sm focus:border-brand-gold/40 focus:outline-none" 
              placeholder="e.g. 400001" 
              name="zip" 
              value={form.zip} 
              onChange={handle} 
              required
            />
          </div>

          {/* Secure Assurances */}
          <div className="sm:col-span-2 bg-brand-teal/20 rounded-xl p-3 border border-brand-gold/5 flex gap-2.5 items-center mt-3">
            <ShieldCheck className="w-5 h-5 text-brand-gold flex-shrink-0" />
            <span className="text-[10px] text-brand-off/60">SSL Encryption protocols are active. Your shipping details are protected.</span>
          </div>

          {/* Actions */}
          <div className="sm:col-span-2 border-t border-brand-gold/10 pt-4 mt-2 flex justify-between items-center">
            <button 
              type="button" 
              onClick={() => navigate('/cart')} 
              className="text-xs text-brand-off/50 hover:text-brand-gold transition"
            >
              Return to Shopping Bag
            </button>
            <button 
              type="submit" 
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-brand-gold text-brand-tealDark rounded-lg text-sm font-bold shadow-lg shadow-brand-gold/10 hover:bg-brand-gold/90 transition"
            >
              Continue to Delivery <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CheckoutAddress;
