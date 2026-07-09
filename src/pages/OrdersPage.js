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
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-brand-dark/60 pb-24 md:pb-16">
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
      <div className="flex items-center gap-3 border-b border-brand-dark/10 pb-6 mb-8">
        <Package className="w-8 h-8 text-brand-gold" />
        <h1 className="text-3xl font-bold font-heading text-brand-dark">My Orders</h1>
      </div>
      
      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-12 rounded-3xl border border-brand-gold/20 shadow-2xl shadow-brand-gold/5 text-center max-w-xl mx-auto"
        >
          <ShoppingBag className="w-16 h-16 text-brand-gold/20 mx-auto mb-6" />
          <h2 className="text-2xl font-bold font-heading mb-2 text-brand-dark">No Orders Found</h2>
          <p className="text-brand-dark/60 text-sm mb-8 font-medium">You haven't placed any orders yet. Discover our premium collection.</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/products')}
            className="px-8 py-3.5 bg-brand-gold text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-brand-gold/20 hover:bg-brand-gold/90 transition-all"
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
              className="bg-white p-6 md:p-8 rounded-3xl border border-brand-gold/20 shadow-[0_8px_30px_rgb(0,0,0,0.08)] space-y-5 hover:shadow-2xl hover:shadow-brand-gold/5 transition-all duration-300"
            >
              {/* Order Header info */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-brand-dark/10 pb-5">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-brand-dark/50 uppercase tracking-widest font-bold">Order ID:</span>
                    <span className="font-mono text-sm font-bold text-brand-dark">#{order._id.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-brand-dark/60 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>

                <div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider ${
                    order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                    order.status === 'shipped' ? 'bg-sky-50 text-sky-600 border border-sky-200' :
                    order.status === 'processing' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                    'bg-[#FDFBF7] text-brand-dark/60 border border-brand-dark/15'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      order.status === 'delivered' ? 'bg-emerald-500' :
                      order.status === 'shipped' ? 'bg-sky-500' :
                      order.status === 'processing' ? 'bg-amber-500' :
                      'bg-brand-dark/40'
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
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-dark/10 flex-shrink-0" />
                      <span className="truncate text-brand-dark font-semibold">{item.product?.name || 'Jewelry Piece'}</span>
                      {item.color && (
                        <span className="text-[10px] text-brand-dark/70 font-bold px-2 py-0.5 rounded-md bg-[#FDFBF7] border border-brand-dark/10 inline-block ml-1 uppercase tracking-wider">
                          {item.color}
                        </span>
                      )}
                      <span className="text-xs text-brand-dark/50 font-bold px-2 py-0.5 rounded-md bg-[#FDFBF7]">x{item.quantity}</span>
                    </div>
                    <span className="text-brand-dark font-bold ml-4">₹{item.price ? (item.price * item.quantity).toLocaleString('en-IN') : '0'}</span>
                  </div>
                ))}
              </div>
              
              {/* Footer info */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-5 border-t border-brand-dark/10 mt-2">
                <div className="space-y-1">
                  <span className="text-[10px] text-brand-dark/50 font-bold block uppercase tracking-widest">Total Amount Paid</span>
                  <span className="text-xl font-bold text-brand-dark font-heading">₹{order.total.toLocaleString('en-IN')}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3 bg-white border border-brand-dark/15 hover:border-brand-dark/30 shadow-sm rounded-xl text-xs font-bold uppercase tracking-wider text-brand-dark transition-all"
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
