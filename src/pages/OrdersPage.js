import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../services/api";
import { Package, Truck, Calendar, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.getOrders();
        // Sort orders to show latest first
        const sortedOrders = (data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sortedOrders);
      } catch (err) {
        setError("Failed to load orders. Please try again later.");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-brand-off/60 pb-24 md:pb-16">
        <div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold">Loading orders history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-rose-400 pb-24 md:pb-16">
        <p className="text-sm font-bold mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-5 py-2 border border-rose-500/30 rounded-lg text-xs hover:bg-rose-500/10 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 pb-24 md:pb-10">
      <div className="flex items-center gap-2 border-b border-brand-gold/15 pb-4 mb-6">
        <Package className="w-6 h-6 text-brand-gold" />
        <h1 className="text-3xl font-bold font-heading text-brand-gold">My Orders</h1>
      </div>
      
      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-brand-tealDark text-brand-off p-10 rounded-2xl border border-brand-gold/15 text-center max-w-xl mx-auto"
        >
          <ShoppingBag className="w-12 h-12 text-brand-gold/30 mx-auto mb-4" />
          <h2 className="text-lg font-bold font-heading mb-1">No Orders Found</h2>
          <p className="text-brand-off/60 text-xs mb-6">You haven't placed any orders yet.</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/products')}
            className="px-6 py-2.5 bg-brand-gold text-brand-tealDark rounded-lg font-bold text-xs shadow-lg shadow-brand-gold/10"
          >
            Start Shopping
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-brand-tealDark p-5 md:p-6 rounded-2xl border border-brand-gold/15 shadow-lg space-y-4 hover:border-brand-gold/30 transition-all duration-300"
            >
              {/* Order Header info */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-brand-gold/10 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-brand-off/40 uppercase tracking-wider font-semibold">Order ID:</span>
                    <span className="font-mono text-sm font-semibold text-brand-off">#{order._id.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-brand-off/50">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>

                <div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize tracking-wide ${
                    order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    order.status === 'shipped' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                    order.status === 'processing' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-brand-teal/30 text-brand-off/60 border border-brand-off/10'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      order.status === 'delivered' ? 'bg-emerald-400' :
                      order.status === 'shipped' ? 'bg-sky-400' :
                      order.status === 'processing' ? 'bg-amber-400' :
                      'bg-brand-off/30'
                    }`} />
                    {order.status}
                  </span>
                </div>
              </div>
              
              {/* Item details */}
              <div className="space-y-3">
                {order.items && order.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex justify-between items-center text-sm py-1">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-gold/20 flex-shrink-0" />
                      <span className="truncate text-brand-off/80 font-medium">{item.product?.name || 'Jewelry Piece'}</span>
                      {item.color && (
                        <span className="text-[10px] text-sky-300 font-semibold px-2 py-0.5 rounded bg-sky-300/10 border border-sky-300/20 inline-block ml-1">
                          {item.color}
                        </span>
                      )}
                      <span className="text-xs text-brand-off/40 font-semibold px-2 py-0.5 rounded bg-brand-teal/20">x{item.quantity}</span>
                    </div>
                    <span className="text-brand-gold font-bold ml-4">₹{item.price ? (item.price * item.quantity).toLocaleString('en-IN') : '0'}</span>
                  </div>
                ))}
              </div>
              
              {/* Footer info */}
              <div className="flex justify-between items-center pt-4 border-t border-brand-gold/10 mt-1">
                <div className="space-y-0.5">
                  <span className="text-xs text-brand-off/40 font-semibold block uppercase">Total Amount Paid</span>
                  <span className="text-lg font-bold text-brand-gold font-heading">₹{order.total.toLocaleString('en-IN')}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-brand-gold/20 text-brand-gold hover:bg-brand-gold/5 rounded-lg text-xs font-bold transition"
                  onClick={() => navigate(`/order-tracking/${order._id}`)}
                >
                  <Truck className="w-4 h-4" /> Track Order
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
