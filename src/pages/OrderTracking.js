import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { ImageWithFallback } from "../utils/imageUtils";
import { Truck, ArrowLeft, FileText, CheckCircle2, Circle } from "lucide-react";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      case 'delivered': return 'text-emerald-400';
      case 'shipped': return 'text-sky-400';
      case 'processing': return 'text-amber-400';
      case 'pending': return 'text-brand-off/60';
      case 'cancelled': return 'text-rose-400';
      default: return 'text-brand-off/60';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'shipped': return 'Shipped (In Transit)';
      case 'processing': return 'Processing Order';
      case 'pending': return 'Order Placed';
      case 'cancelled': return 'Cancelled';
      default: return 'Pending';
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-brand-off/60 pb-24 md:pb-16">
        <div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold">Retrieving delivery logs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-rose-400 pb-24 md:pb-16">
        <h1 className="text-2xl font-bold font-heading mb-3">Error Loading Order</h1>
        <p className="text-brand-off/60 text-sm mb-6">{error}</p>
        <motion.button
          onClick={() => navigate('/orders')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-2.5 bg-brand-gold text-brand-tealDark rounded-lg font-bold text-xs shadow-lg shadow-brand-gold/10"
        >
          Back to Orders
        </motion.button>
      </div>
    );
  }

  const trackingSteps = ['pending', 'processing', 'shipped', 'delivered'];
  const currentStepIdx = trackingSteps.indexOf(trackingInfo?.status);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 pb-24 md:pb-10 space-y-6">
      {/* Top Header Card */}
      <div className="flex items-center justify-between border-b border-brand-gold/15 pb-4">
        <div className="flex items-center gap-2">
          <Truck className="w-6 h-6 text-brand-gold" />
          <h1 className="text-3xl font-bold font-heading text-brand-gold">Track Order</h1>
        </div>
        <motion.button
          onClick={() => navigate('/orders')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-brand-off/20 hover:bg-brand-off/5 rounded-lg text-xs font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </motion.button>
      </div>

      {/* Main Status Log */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-tealDark p-6 md:p-8 rounded-2xl border border-brand-gold/15 shadow-xl space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:divide-x md:divide-brand-gold/10">
          {/* Metadata */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-gold">Order Tracking Info</h3>
            <div className="space-y-2.5 text-sm">
              <p className="flex justify-between md:justify-start gap-4">
                <span className="text-brand-off/50">Order Number:</span> 
                <span className="font-mono font-semibold">#{trackingInfo?.orderId.toUpperCase()}</span>
              </p>
              <p className="flex justify-between md:justify-start gap-4">
                <span className="text-brand-off/50">Current Status:</span> 
                <span className={`font-semibold ${getStatusColor(trackingInfo?.status)}`}>
                  {getStatusLabel(trackingInfo?.status)}
                </span>
              </p>
              <p className="flex justify-between md:justify-start gap-4">
                <span className="text-brand-off/50">Order Date:</span> 
                <span className="font-semibold">
                  {new Date(trackingInfo?.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </p>
              <p className="flex justify-between md:justify-start gap-4">
                <span className="text-brand-off/50">Shipping Type:</span> 
                <span className="font-semibold uppercase tracking-wider text-xs">{trackingInfo?.shippingMethod || 'Standard'}</span>
              </p>
              {trackingInfo?.trackingNumber && (
                <p className="flex justify-between md:justify-start gap-4">
                  <span className="text-brand-off/50">Tracking Waybill:</span> 
                  <span className="font-mono font-semibold text-brand-gold">{trackingInfo.trackingNumber}</span>
                </p>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-4 md:pl-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-gold">Delivery Address</h3>
            <div className="bg-brand-teal/20 p-4 rounded-xl border border-brand-gold/5 text-sm text-brand-off/80 leading-relaxed">
              <p className="font-bold text-brand-off mb-1">{trackingInfo?.shippingAddress?.name}</p>
              <p>{trackingInfo?.shippingAddress?.address}</p>
              <p>{trackingInfo?.shippingAddress?.city}, {trackingInfo?.shippingAddress?.country} {trackingInfo?.shippingAddress?.zip}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress Timeline Tracker */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-brand-tealDark p-6 md:p-8 rounded-2xl border border-brand-gold/15 shadow-xl space-y-6"
      >
        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-gold">Delivery Timeline</h3>
        
        {/* Timeline representation */}
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0 pt-2">
          {/* Horizontal line for desktop, vertical line for mobile */}
          <div className="absolute left-[15px] top-6 bottom-6 w-0.5 bg-brand-off/10 md:hidden" />
          <div className="absolute left-6 right-6 top-[26px] h-0.5 bg-brand-off/10 hidden md:block" />

          {trackingSteps.map((status, index) => {
            const isCompleted = currentStepIdx >= index;
            const isCurrent = currentStepIdx === index;
            
            return (
              <div key={status} className="relative z-10 flex md:flex-col items-center gap-4 md:gap-2.5 md:flex-1 text-left md:text-center">
                {/* Node icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isCurrent ? 'bg-brand-gold text-brand-tealDark shadow-lg shadow-brand-gold/15 scale-110 font-bold border-2 border-brand-gold' :
                  isCompleted ? 'bg-emerald-600 text-white' :
                  'bg-brand-tealDark text-brand-off/30 border border-brand-off/10'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-3.5 h-3.5" />}
                </div>

                {/* Text details */}
                <div className="md:mt-1 space-y-0.5">
                  <p className={`text-xs font-bold uppercase tracking-wider ${
                    isCurrent ? 'text-brand-gold font-extrabold' : isCompleted ? 'text-emerald-400' : 'text-brand-off/40'
                  }`}>
                    {status}
                  </p>
                  {isCurrent && (
                    <p className="text-[10px] text-brand-off/60 leading-none">In Progress</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Package Items Table */}
      {order && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-brand-tealDark p-6 md:p-8 rounded-2xl border border-brand-gold/15 shadow-xl space-y-6"
        >
          <div className="flex items-center gap-2 border-b border-brand-gold/10 pb-4">
            <FileText className="w-4.5 h-4.5 text-brand-gold" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-gold">Package Content</h3>
          </div>
          
          <div className="space-y-4">
            {order.items?.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-brand-teal/20 rounded-xl border border-brand-off/5">
                <ImageWithFallback
                  src={item.product?.image}
                  alt={item.product?.name}
                  className="w-16 h-16 object-cover rounded-lg border border-brand-gold/10"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-brand-off truncate">{item.product?.name}</h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-brand-off/50 font-semibold">
                    <span>Qty: {item.quantity}</span>
                    <span>•</span>
                    <span className="text-brand-gold font-bold">₹{item.price?.toLocaleString('en-IN')} each</span>
                  </div>
                </div>
                <div className="text-sm font-bold text-brand-gold ml-4">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default OrderTracking;
