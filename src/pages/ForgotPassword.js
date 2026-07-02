import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await api.forgotPassword(email);
      setMessage("Password reset email sent! Please check your inbox.");
    } catch (err) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-brand-tealDark text-brand-off rounded-lg p-6 shadow-sm border border-brand-gold/20"
      >
        <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
        <p className="text-brand-off/80 mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-brand-off/30 bg-transparent px-3 py-2"
              placeholder="Enter your email"
              required
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="w-full rounded-md bg-brand-gold text-brand-tealDark py-2 font-semibold disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-brand-gold hover:underline"
          >
            Back to Login
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;




