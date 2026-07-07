import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Truck, ArrowRight, ArrowLeft } from "lucide-react";
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

const CheckoutShipping = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login?redirect=/checkout/address');
    } else if (cart.length === 0) {
      navigate('/cart');
    } else if (!localStorage.getItem('shippingAddress')) {
      navigate('/checkout/address');
    }
  }, [token, cart, navigate]);

  const savedMethod = JSON.parse(localStorage.getItem('shippingMethod') || '{"method":"standard","notes":""}');
  
  const [form, setForm] = useState({
    method: savedMethod.method || "standard",
    notes: savedMethod.notes || ""
  });

  const handle = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const submit = (e) => { 
    e.preventDefault(); 
    localStorage.setItem('shippingMethod', JSON.stringify(form));
    navigate('/checkout/payment');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 pb-24 md:pb-10">
      {/* Steps */}
      <CheckoutSteps currentStep={2} />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-tealDark p-6 md:p-8 rounded-2xl border border-brand-gold/15 shadow-xl space-y-6"
      >
        <div className="flex items-center gap-2 border-b border-brand-gold/10 pb-4">
          <Truck className="w-5 h-5 text-brand-gold" />
          <h2 className="text-xl font-bold font-heading text-brand-gold">Delivery Preference</h2>
        </div>

        <form onSubmit={submit} className="space-y-6">
          {/* Method Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase text-brand-off/60">Choose Shipping Speed</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Standard */}
              <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                form.method === 'standard' 
                  ? 'border-brand-gold bg-brand-gold/5 text-brand-off'
                  : 'border-brand-off/10 hover:border-brand-gold/30 text-brand-off/70'
              }`}>
                <input 
                  type="radio" 
                  name="method" 
                  value="standard" 
                  checked={form.method === "standard"} 
                  onChange={handle} 
                  className="accent-brand-gold w-4.5 h-4.5"
                />
                <div>
                  <div className="text-sm font-bold">Standard Insured Delivery</div>
                  <div className="text-xs text-brand-off/50 mt-0.5">5-7 Business Days • FREE</div>
                </div>
              </label>

              {/* Express */}
              <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                form.method === 'express' 
                  ? 'border-brand-gold bg-brand-gold/5 text-brand-off'
                  : 'border-brand-off/10 hover:border-brand-gold/30 text-brand-off/70'
              }`}>
                <input 
                  type="radio" 
                  name="method" 
                  value="express" 
                  checked={form.method === "express"} 
                  onChange={handle} 
                  className="accent-brand-gold w-4.5 h-4.5"
                />
                <div>
                  <div className="text-sm font-bold">Express Air Shipping</div>
                  <div className="text-xs text-brand-off/50 mt-0.5">2-3 Business Days • ₹150</div>
                </div>
              </label>

            </div>
          </div>

          {/* Delivery Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase text-brand-off/60 mb-2">Special Delivery Instructions (Optional)</label>
            <textarea 
              className="w-full rounded-lg border border-brand-off/15 bg-brand-teal/30 px-3.5 py-2.5 text-sm focus:border-brand-gold/40 focus:outline-none h-20 resize-none" 
              placeholder="e.g. Leave with gatekeeper or ring bell..." 
              name="notes" 
              value={form.notes} 
              onChange={handle} 
            />
          </div>

          {/* Navigation Actions */}
          <div className="border-t border-brand-gold/10 pt-4 mt-2 flex justify-between items-center">
            <button 
              type="button" 
              onClick={() => navigate('/checkout/address')}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-brand-off/20 hover:bg-brand-off/5 rounded-lg text-xs font-semibold transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button 
              type="submit" 
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-brand-gold text-brand-tealDark rounded-lg text-sm font-bold shadow-lg shadow-brand-gold/10 hover:bg-brand-gold/90 transition"
            >
              Continue to Payment <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CheckoutShipping;
