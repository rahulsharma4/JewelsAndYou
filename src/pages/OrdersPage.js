import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../services/api";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.getOrders();
        setOrders(data);
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
      <div className="max-w-4xl mx-auto px-4 py-8 text-center text-brand-off">
        Loading orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center text-rose-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-brand-off">My Orders</h1>
      
      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-brand-tealDark text-brand-off p-8 rounded-lg border border-brand-gold/20 text-center"
        >
          <p className="text-lg">No orders found.</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-brand-tealDark text-brand-off p-6 rounded-lg border border-brand-gold/20"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold">Order #{order._id.substring(0, 8).toUpperCase()}</h3>
                  <p className="text-brand-off/70">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="mt-2 md:mt-0">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                    order.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-400' :
                    order.status === 'shipped' ? 'bg-sky-500/20 text-sky-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                {order.items && order.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex justify-between">
                    <span>{item.product?.name || 'Unknown Product'} x{item.quantity}</span>
                    <span className="text-brand-gold">${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-brand-off/20">
                <span className="text-lg font-bold text-brand-gold">Total: ${order.total.toLocaleString()}</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 rounded border border-brand-off/30 text-brand-off hover:bg-brand-teal/20"
                  onClick={() => window.location.href = `/order-tracking/${order._id}`}
                >
                  Track Order
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
