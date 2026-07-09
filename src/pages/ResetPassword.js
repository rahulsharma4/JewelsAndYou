import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      navigate('/forgot-password');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      await api.resetPassword(token, password);
      setMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to reset password");
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
          <h1 className="text-3xl font-bold font-heading text-brand-dark">Reset Password</h1>
          <p className="text-brand-dark/60 text-sm font-medium">
            Enter your new password below.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold rounded-xl text-center">
            {error}
          </div>
        )}

        {message && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-semibold rounded-xl text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 mb-1.5 ml-1">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-brand-dark/15 bg-[#FDFBF7] px-4 py-3.5 text-sm focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/30 focus:outline-none transition-all shadow-inner"
              placeholder="Enter new password"
              required
              minLength="6"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 mb-1.5 ml-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-brand-dark/15 bg-[#FDFBF7] px-4 py-3.5 text-sm focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/30 focus:outline-none transition-all shadow-inner"
              placeholder="Confirm new password"
              required
              minLength="6"
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-xl bg-brand-gold text-white py-4 font-bold text-xs uppercase tracking-widest shadow-xl shadow-brand-gold/20 hover:bg-brand-gold/90 transition-all mt-2 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </motion.button>
        </form>

        <div className="pt-4 border-t border-brand-dark/5 text-center text-sm">
          <button
            onClick={() => navigate('/login')}
            className="text-brand-dark/60 font-medium hover:text-brand-gold transition-all"
          >
            <span className="text-brand-gold font-bold">&larr;</span> Back to Login
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;




