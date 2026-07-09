import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AuthLogin = ({ onLogin }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const submit = async (e) => { 
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      console.log('🚀 Attempting login with:', form);
      const response = await api.login(form);
      console.log('📡 Login response:', response);
      
      if (response.token) {
        console.log('✅ Login successful, setting user:', response.user);
        onLogin?.(response.user);
        if (response.user?.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        console.log('❌ Login failed:', response.message);
        setError(response.message || "Login failed");
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }} 
        className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-brand-gold/20 space-y-8"
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold font-heading text-brand-dark">Welcome Back</h1>
          <p className="text-brand-dark/60 text-sm">Please sign in to your account</p>
        </div>
        
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold rounded-xl text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 mb-1.5 ml-1">Email Address</label>
            <input 
              className="w-full rounded-xl border border-brand-dark/15 bg-[#FDFBF7] px-4 py-3.5 text-sm focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/30 focus:outline-none transition-all shadow-inner" 
              placeholder="Enter your email" 
              type="email" 
              name="email" 
              value={form.email} 
              onChange={handle}
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5 px-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-dark/60">Password</label>
              <button 
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-[10px] font-bold text-brand-gold hover:text-brand-gold/80 hover:underline transition-all"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input 
                className="w-full rounded-xl border border-brand-dark/15 bg-[#FDFBF7] px-4 py-3.5 pr-12 text-sm focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/30 focus:outline-none transition-all shadow-inner" 
                placeholder="Enter your password" 
                type={showPassword ? "text" : "password"} 
                name="password" 
                value={form.password} 
                onChange={handle}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-brand-dark/40 hover:text-brand-gold transition-colors"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            className="w-full rounded-xl bg-brand-gold text-white py-4 font-bold text-xs uppercase tracking-widest shadow-xl shadow-brand-gold/20 hover:bg-brand-gold/90 transition-all mt-2 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </motion.button>
        </form>
        
        <div className="pt-4 border-t border-brand-dark/5 text-center text-sm">
          <p className="text-brand-dark/60 font-medium">
            Don't have an account?{" "}
            <button 
              onClick={() => navigate('/register')}
              className="text-brand-gold font-bold hover:underline transition-all"
            >
              Sign up
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLogin;


