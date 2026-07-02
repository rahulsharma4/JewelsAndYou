import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { getImageUrl, ImageWithFallback } from "../utils/imageUtils";

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (orderId) {
      loadTrackingInfo();
    }
  }, [orderId]);

  const loadTrackingInfo = async () => {
    try {
      const [trackingData, orderData] = await Promise.all([
        api.getOrderTracking(orderId),
        api.getOrder(orderId)
      ]);
      
      setTrackingInfo(trackingData);
      setOrder(orderData);
    } catch (err) {
      setError(err.message || "Failed to load tracking information");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-green-600';
      case 'shipped': return 'text-blue-600';
      case 'processing': return 'text-yellow-600';
      case 'pending': return 'text-gray-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return '✓';
      case 'shipped': return '🚚';
      case 'processing': return '⚙️';
      case 'pending': return '⏳';
      case 'cancelled': return '❌';
      default: return '📦';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-teal text-brand-off flex items-center justify-center">
        <div className="text-center">Loading tracking information...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-brand-teal text-brand-off flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-brand-off/80 mb-6">{error}</p>
          <motion.button
            onClick={() => navigate('/orders')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-brand-gold text-brand-tealDark rounded-lg font-semibold"
          >
            Back to Orders
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-teal text-brand-off p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-brand-tealDark rounded-lg border border-brand-gold/20 p-6 mb-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Order Tracking</h1>
            <motion.button
              onClick={() => navigate('/orders')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 border border-brand-off/30 rounded-lg"
            >
              Back to Orders
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Order Information</h3>
              <div className="space-y-2">
                <p><span className="font-semibold">Order ID:</span> {trackingInfo?.orderId}</p>
                <p><span className="font-semibold">Status:</span> 
                  <span className={`ml-2 ${getStatusColor(trackingInfo?.status)}`}>
                    {getStatusIcon(trackingInfo?.status)} {trackingInfo?.status}
                  </span>
                </p>
                <p><span className="font-semibold">Order Date:</span> {new Date(trackingInfo?.createdAt).toLocaleDateString()}</p>
                <p><span className="font-semibold">Shipping Method:</span> {trackingInfo?.shippingMethod}</p>
                {trackingInfo?.trackingNumber && (
                  <p><span className="font-semibold">Tracking Number:</span> {trackingInfo.trackingNumber}</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>
              <div className="bg-brand-teal/20 p-4 rounded-lg">
                <p>{trackingInfo?.shippingAddress?.name}</p>
                <p>{trackingInfo?.shippingAddress?.address}</p>
                <p>{trackingInfo?.shippingAddress?.city}, {trackingInfo?.shippingAddress?.country} {trackingInfo?.shippingAddress?.zip}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Order Items */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-brand-tealDark rounded-lg border border-brand-gold/20 p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-brand-teal/20 rounded-lg">
                  <ImageWithFallback
                    src={item.product?.image}
                    alt={item.product?.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.product?.name}</h4>
                    <p className="text-brand-off/80">Quantity: {item.quantity}</p>
                    <p className="text-brand-gold">${item.price?.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Status Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-brand-tealDark rounded-lg border border-brand-gold/20 p-6 mt-6"
        >
          <h3 className="text-lg font-semibold mb-4">Order Status Timeline</h3>
          <div className="space-y-4">
            {['pending', 'processing', 'shipped', 'delivered'].map((status, index) => {
              const isActive = trackingInfo?.status === status;
              const isCompleted = ['pending', 'processing', 'shipped', 'delivered'].indexOf(trackingInfo?.status) > index;
              
              return (
                <div key={status} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isActive ? 'bg-brand-gold text-brand-tealDark' :
                    isCompleted ? 'bg-green-600 text-white' :
                    'bg-gray-400 text-white'
                  }`}>
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  <div>
                    <p className={`font-semibold capitalize ${
                      isActive ? 'text-brand-gold' : isCompleted ? 'text-green-600' : 'text-brand-off/60'
                    }`}>
                      {status}
                    </p>
                    {isActive && (
                      <p className="text-sm text-brand-off/80">Current status</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderTracking;
