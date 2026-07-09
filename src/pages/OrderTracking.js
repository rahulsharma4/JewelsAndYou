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
      case 'pending': return 'text-brand-dark/60';
      case 'cancelled': return 'text-rose-400';
      default: return 'text-brand-dark/60';
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
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-brand-dark/60 pb-24 md:pb-16">
        <div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold">Retrieving delivery logs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-rose-400 pb-24 md:pb-16">
        <h1 className="text-2xl font-bold font-heading mb-3">Error Loading Order</h1>
        <p className="text-brand-dark/60 text-sm mb-6">{error}</p>
        <motion.button
          onClick={() => navigate('/orders')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-2.5 bg-brand-gold text-brand-light rounded-lg font-bold text-xs shadow-lg shadow-brand-gold/10"
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-brand-dark/10 pb-6 gap-4">
        <div className="flex items-center gap-3">
          <Truck className="w-8 h-8 text-brand-gold" />
          <h1 className="text-3xl font-bold font-heading text-brand-dark">Track Order</h1>
        </div>
        <motion.button
          onClick={() => navigate('/orders')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white border border-brand-dark/15 hover:border-brand-dark/30 shadow-sm rounded-xl text-xs font-bold uppercase tracking-wider text-brand-dark transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </motion.button>
      </div>

      {/* Main Status Log */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 md:p-8 rounded-3xl border border-brand-gold/20 shadow-[0_8px_30px_rgb(0,0,0,0.08)] space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 md:divide-x md:divide-brand-dark/10">
          {/* Metadata */}
          <div className="space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-dark font-heading">Order Info</h3>
            <div className="space-y-2.5 text-sm">
              <p className="flex justify-between md:justify-start gap-4">
                <span className="text-brand-dark/50">Order Number:</span> 
                <span className="font-mono font-semibold">#{trackingInfo?.orderId.toUpperCase()}</span>
              </p>
              <p className="flex justify-between md:justify-start gap-4">
                <span className="text-brand-dark/50">Current Status:</span> 
                <span className={`font-semibold ${getStatusColor(trackingInfo?.status)}`}>
                  {getStatusLabel(trackingInfo?.status)}
                </span>
              </p>
              <p className="flex justify-between md:justify-start gap-4">
                <span className="text-brand-dark/50">Order Date:</span> 
                <span className="font-semibold">
                  {new Date(trackingInfo?.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </p>
              <p className="flex justify-between md:justify-start gap-4">
                <span className="text-brand-dark/50">Shipping Type:</span> 
                <span className="font-semibold uppercase tracking-wider text-xs">{trackingInfo?.shippingMethod || 'Standard'}</span>
              </p>
              {trackingInfo?.trackingNumber && (
                <p className="flex justify-between md:justify-start gap-4">
                  <span className="text-brand-dark/50">Tracking Waybill:</span> 
                  <span className="font-mono font-semibold text-brand-gold">{trackingInfo.trackingNumber}</span>
                </p>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-5 md:pl-12">
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-dark font-heading">Delivery Address</h3>
            <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-brand-dark/15 shadow-inner text-sm text-brand-dark/80 leading-relaxed">
              <p className="font-bold text-brand-dark mb-2 text-base">{trackingInfo?.shippingAddress?.name}</p>
              <p className="font-medium">{trackingInfo?.shippingAddress?.address}</p>
              <p className="font-medium">{trackingInfo?.shippingAddress?.city}, {trackingInfo?.shippingAddress?.country} {trackingInfo?.shippingAddress?.zip}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress Timeline Tracker */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-6 md:p-10 rounded-3xl border border-brand-gold/20 shadow-[0_8px_30px_rgb(0,0,0,0.08)] space-y-8"
      >
        <h3 className="text-xs font-bold uppercase tracking-widest text-brand-dark font-heading">Delivery Timeline</h3>
        
        {/* Timeline representation */}
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0 pt-2">
          {/* Horizontal line for desktop, vertical line for mobile */}
          <div className="absolute left-[15px] top-6 bottom-6 w-0.5 bg-brand-dark/10 md:hidden" />
          <div className="absolute left-6 right-6 top-[26px] h-0.5 bg-brand-dark/10 hidden md:block" />

          {trackingSteps.map((status, index) => {
            const isCompleted = currentStepIdx >= index;
            const isCurrent = currentStepIdx === index;
            
            return (
              <div key={status} className="relative z-10 flex md:flex-col items-center gap-4 md:gap-3 md:flex-1 text-left md:text-center">
                {/* Node icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isCurrent ? 'bg-brand-gold text-white shadow-xl shadow-brand-gold/20 scale-110 font-bold' :
                  isCompleted ? 'bg-brand-dark text-white shadow-md' :
                  'bg-[#FDFBF7] text-brand-dark/30 border border-brand-dark/15 shadow-inner'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-4 h-4" />}
                </div>

                {/* Text details */}
                <div className="md:mt-2 space-y-1">
                  <p className={`text-xs font-bold uppercase tracking-widest ${
                    isCurrent ? 'text-brand-gold' : isCompleted ? 'text-brand-dark' : 'text-brand-dark/40'
                  }`}>
                    {status}
                  </p>
                  {isCurrent && (
                    <p className="text-[10px] text-brand-dark/60 font-medium">In Progress</p>
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
          className="bg-white p-6 md:p-8 rounded-3xl border border-brand-gold/20 shadow-[0_8px_30px_rgb(0,0,0,0.08)] space-y-6"
        >
          <div className="flex items-center gap-2 border-b border-brand-dark/10 pb-5">
            <FileText className="w-5 h-5 text-brand-gold" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-dark font-heading">Package Content</h3>
          </div>
          
          <div className="space-y-4 pt-2">
            {order.items?.map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 bg-[#FDFBF7] rounded-2xl border border-brand-dark/15 shadow-sm">
                <ImageWithFallback
                  src={item.product?.image}
                  alt={item.product?.name}
                  className="w-20 h-20 sm:w-16 sm:h-16 object-cover rounded-xl border border-brand-dark/10 shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-brand-dark truncate">{item.product?.name}</h4>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-brand-dark/60 font-semibold">
                    <span>Qty: {item.quantity}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="text-brand-dark font-bold">₹{item.price?.toLocaleString('en-IN')} each</span>
                  </div>
                </div>
                <div className="text-base font-bold text-brand-gold sm:ml-4">
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
