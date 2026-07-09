import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const PaymentAnalytics = () => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
    loadPaymentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAdminAccess = async () => {
    try {
      const user = await api.getProfile();
      if (user.role !== 'admin') {
        navigate('/');
        return;
      }
    } catch (error) {
      navigate('/login');
    }
  };

  const loadPaymentData = async () => {
    try {
      const balanceData = await api.getAccountBalance();
      setBalance(balanceData);
    } catch (error) {
      console.error('Error loading payment data:', error);
      setError('Failed to load payment data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream text-brand-dark flex items-center justify-center">
        <div className="text-center">Loading payment analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream text-brand-dark p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Payment Analytics</h1>
          <div className="flex gap-2">
            <motion.button
              onClick={() => navigate('/admin/dashboard')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-brand-gold text-brand-light rounded-lg font-semibold"
            >
              Back to Dashboard
            </motion.button>
            <motion.button
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 border border-brand-dark/30 rounded-lg"
            >
              Back to Store
            </motion.button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Account Balance */}
        {balance && balance.success && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-brand-light p-6 rounded-lg border border-brand-gold/20"
            >
              <h3 className="text-lg font-semibold mb-2">Available Balance</h3>
              <p className="text-3xl font-bold text-brand-gold">
                ${(balance.available[0]?.amount / 100).toFixed(2) || '0.00'}
              </p>
              <p className="text-sm text-brand-dark/80 mt-1">
                {balance.available[0]?.currency?.toUpperCase() || 'USD'}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-brand-light p-6 rounded-lg border border-brand-gold/20"
            >
              <h3 className="text-lg font-semibold mb-2">Pending Balance</h3>
              <p className="text-3xl font-bold text-yellow-400">
                ${(balance.pending[0]?.amount / 100).toFixed(2) || '0.00'}
              </p>
              <p className="text-sm text-brand-dark/80 mt-1">
                {balance.pending[0]?.currency?.toUpperCase() || 'USD'}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-brand-light p-6 rounded-lg border border-brand-gold/20"
            >
              <h3 className="text-lg font-semibold mb-2">Total Balance</h3>
              <p className="text-3xl font-bold text-green-400">
                ${((balance.available[0]?.amount || 0) + (balance.pending[0]?.amount || 0) / 100).toFixed(2)}
              </p>
              <p className="text-sm text-brand-dark/80 mt-1">
                Available + Pending
              </p>
            </motion.div>
          </div>
        )}

        {/* Payment Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-brand-light rounded-lg border border-brand-gold/20 p-6"
        >
          <h2 className="text-xl font-bold mb-4">Payment Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Stripe Integration</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-green-400">✅ Connected</span>
                </div>
                <div className="flex justify-between">
                  <span>Mode:</span>
                  <span className="text-yellow-400">Test Mode</span>
                </div>
                <div className="flex justify-between">
                  <span>Currency:</span>
                  <span>USD</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Next Steps</h3>
              <div className="space-y-2 text-sm">
                <p>• Configure your Stripe keys in .env files</p>
                <p>• Test payments with test cards</p>
                <p>• Switch to live mode for production</p>
                <p>• Set up webhooks for real-time updates</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Test Cards Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-brand-light rounded-lg border border-brand-gold/20 p-6 mt-6"
        >
          <h2 className="text-xl font-bold mb-4">Test Cards (Stripe Test Mode)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-green-400">Successful Payments</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Visa:</span>
                  <code className="bg-brand-cream/20 px-2 py-1 rounded">4242424242424242</code>
                </div>
                <div className="flex justify-between">
                  <span>Mastercard:</span>
                  <code className="bg-brand-cream/20 px-2 py-1 rounded">5555555555554444</code>
                </div>
                <div className="flex justify-between">
                  <span>Amex:</span>
                  <code className="bg-brand-cream/20 px-2 py-1 rounded">378282246310005</code>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3 text-red-400">Declined Payments</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Card Declined:</span>
                  <code className="bg-brand-cream/20 px-2 py-1 rounded">4000000000000002</code>
                </div>
                <div className="flex justify-between">
                  <span>Insufficient Funds:</span>
                  <code className="bg-brand-cream/20 px-2 py-1 rounded">4000000000009995</code>
                </div>
                <div className="flex justify-between">
                  <span>Lost Card:</span>
                  <code className="bg-brand-cream/20 px-2 py-1 rounded">4000000000009987</code>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentAnalytics;




