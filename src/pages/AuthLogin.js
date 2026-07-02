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
        navigate('/');
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
    <div className="max-w-md mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-brand-tealDark text-brand-off rounded-lg p-6 shadow-sm border border-brand-gold/20">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={submit} className="space-y-3">
          <input 
            className="w-full rounded border border-brand-off/30 bg-transparent px-3 py-2" 
            placeholder="Email" 
            type="email" 
            name="email" 
            value={form.email} 
            onChange={handle}
            required
          />
          <div className="relative">
            <input 
              className="w-full rounded border border-brand-off/30 bg-transparent px-3 py-2 pr-10" 
              placeholder="Password" 
              type={showPassword ? "text" : "password"} 
              name="password" 
              value={form.password} 
              onChange={handle}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-off/60 hover:text-brand-off transition-colors"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.98 }} 
            transition={{ type:'spring', stiffness:300, damping:20 }} 
            className="w-full rounded-md bg-brand-gold text-brand-tealDark py-2 font-semibold disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </motion.button>
        </form>
        
        <div className="mt-4 text-center text-sm space-y-2">
          <p>
            Don't have an account?{" "}
            <button 
              onClick={() => navigate('/register')}
              className="text-brand-gold hover:underline"
            >
              Sign up
            </button>
          </p>
          <p>
            <button 
              onClick={() => navigate('/forgot-password')}
              className="text-brand-gold hover:underline"
            >
              Forgot your password?
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLogin;


