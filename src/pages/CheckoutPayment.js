import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import api from "../services/api";
import { CreditCard, ShieldCheck, ArrowLeft } from "lucide-react";

// Helper function to load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CheckoutSteps = ({ currentStep }) => {
  const steps = [
    { id: 1, name: "Address" },
    { id: 2, name: "Delivery" },
    { id: 3, name: "Payment" }
  ];
  return (
    <div className="flex items-center justify-center gap-2 mb-8 max-w-lg mx-auto">
      {steps.map((step, idx) => (
        <React.Fragment key={step.id}>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              currentStep === step.id ? 'bg-brand-gold text-white font-extrabold shadow-lg shadow-brand-gold/20 scale-110' :
              currentStep > step.id ? 'bg-brand-dark text-white shadow-sm' : 'bg-white text-brand-dark/40 border border-brand-dark/15 shadow-sm'
            }`}>
              {currentStep > step.id ? "✓" : step.id}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${
              currentStep === step.id ? 'text-brand-gold' : 'text-brand-dark/40'
            }`}>{step.name}</span>
          </div>
          {idx < steps.length - 1 && (
            <div className={`w-12 h-px transition-all ${currentStep > step.id ? 'bg-emerald-600' : 'bg-brand-dark/15'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const CheckoutPayment = () => {
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart } = useCart();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login?redirect=/checkout/address');
    } else if (cart.length === 0) {
      navigate('/cart');
    } else if (!localStorage.getItem('shippingAddress')) {
      navigate('/checkout/address');
    } else if (!localStorage.getItem('shippingMethod')) {
      navigate('/checkout/shipping');
    }
  }, [token, cart, navigate]);
  
  const baseTotal = getTotalPrice();
  const appliedCoupon = JSON.parse(localStorage.getItem('appliedCoupon') || 'null');
  const totalAmount = appliedCoupon ? Math.max(0, baseTotal - appliedCoupon.discountAmount) : baseTotal;
  const orderId = `order_${Date.now()}`;
  const items = cart.map(item => ({
    product: item.product._id || item.product.id,
    name: item.product.name,
    quantity: item.quantity,
    price: item.product.price,
    color: item.color || ''
  }));

  const handleRazorpayCheckout = async () => {
    try {
      setLoading(true);
      setError('');
      
      const res = await loadRazorpayScript();
      if (!res) {
        setError("Razorpay SDK failed to load. Are you offline?");
        setLoading(false);
        return;
      }

      // Step 1: Create Order in Backend (Razorpay)
      const createOrderData = await api.fetchWithAuth('/payments/create-order', {
        method: 'POST',
        body: {
          amount: totalAmount,
          currency: 'INR',
          receipt: orderId
        }
      });

      if (!createOrderData.success) {
        setError(createOrderData.message || 'Failed to create payment order');
        setLoading(false);
        return;
      }

      // Prepare Database Order Payload
      const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress') || '{}');
      const shippingMethod = JSON.parse(localStorage.getItem('shippingMethod') || '{}').method || 'standard';
      
      const orderPayload = {
        items,
        shippingAddress,
        paymentMethod: 'razorpay',
        paymentInfo: {
          paymentIntentId: 'pending', // Will update after verification
          status: 'pending',
          method: 'razorpay'
        },
        shippingMethod,
        subtotal: baseTotal,
        total: totalAmount,
        couponId: appliedCoupon ? appliedCoupon.couponId : undefined,
        discountAmount: appliedCoupon ? appliedCoupon.discountAmount : 0
      };

      // Create initial DB Order
      const dbOrder = await api.createOrder(orderPayload);

      // Step 2: Open Razorpay Widget
      const options = {
        key: createOrderData.key,
        amount: createOrderData.order.amount,
        currency: createOrderData.order.currency,
        name: "Jewels And You",
        description: "Test Transaction",
        order_id: createOrderData.order.id,
        handler: async function (response) {
          try {
            setLoading(true);
            // Step 3: Verify Payment Signature
            const verifyData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              orderId: dbOrder._id
            };

            const verificationResult = await api.fetchWithAuth('/payments/verify-payment', {
              method: 'POST',
              body: verifyData
            });

            if (verificationResult.success) {
              await clearCart();
              localStorage.removeItem('shippingAddress');
              localStorage.removeItem('shippingMethod');
              localStorage.removeItem('appliedCoupon');
              
              navigate('/checkout/success', { 
                state: { 
                  orderId: dbOrder._id,
                  paymentIntentId: response.razorpay_payment_id 
                } 
              });
            } else {
              setError("Payment verification failed.");
              setLoading(false);
            }
          } catch (err) {
            console.error("Verification Error:", err);
            setError("Payment verification failed.");
            setLoading(false);
          }
        },
        prefill: {
          name: shippingAddress.name || "Customer Name",
          email: "customer@example.com",
          contact: shippingAddress.phone || "9999999999"
        },
        theme: {
          color: "#D4AF37" // Brand Gold
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response){
        setError(`Payment Failed: ${response.error.description}`);
      });
      paymentObject.open();

    } catch (err) {
      console.error("Razorpay Error:", err);
      setError('An error occurred during payment setup.');
    } finally {
      setLoading(false);
    }
  };

  const handleCodOrderSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      
      const orderData = {
        items: items,
        shippingAddress: JSON.parse(localStorage.getItem('shippingAddress') || '{}'),
        paymentMethod: 'cod',
        paymentInfo: {
          paymentIntentId: `cod_${Date.now()}`,
          status: 'pending'
        },
        shippingMethod: JSON.parse(localStorage.getItem('shippingMethod') || '{}').method || 'standard',
        subtotal: baseTotal,
        total: totalAmount,
        couponId: appliedCoupon ? appliedCoupon.couponId : undefined,
        discountAmount: appliedCoupon ? appliedCoupon.discountAmount : 0
      };

      const order = await api.createOrder(orderData);
      
      await clearCart();
      localStorage.removeItem('shippingAddress');
      localStorage.removeItem('shippingMethod');
      localStorage.removeItem('appliedCoupon');
      
      navigate('/checkout/success', { 
        state: { 
          orderId: order._id,
          paymentIntentId: orderData.paymentInfo.paymentIntentId 
        } 
      });
    } catch (err) {
      setError('Order creation failed. Please contact support.');
      console.error('Order creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 pb-24 md:pb-10">
      <CheckoutSteps currentStep={3} />

      {loading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-brand-light p-8 rounded-2xl border border-brand-gold/20 text-center space-y-4 max-w-xs mx-auto shadow-2xl">
            <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto" />
            <h3 className="text-brand-gold font-bold font-heading">Processing...</h3>
            <p className="text-brand-dark/60 text-xs">Please do not refresh the page.</p>
          </div>
        </div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 16 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-white p-6 md:p-8 rounded-3xl border border-brand-gold/20 shadow-2xl shadow-brand-gold/5 space-y-6"
      >
        <div className="flex items-center justify-between border-b border-brand-gold/10 pb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-brand-gold" />
            <h2 className="text-2xl font-bold font-heading text-brand-dark">Payment Details</h2>
          </div>
          <span className="text-xl font-bold text-brand-gold">Total: ₹{totalAmount.toLocaleString('en-IN')}</span>
        </div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-lg"
          >
            {error}
          </motion.div>
        )}

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase text-brand-dark/60">Choose Payment Method</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className={`flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${
                paymentMethod === 'razorpay' 
                  ? 'border-brand-gold bg-[#FDFBF7] text-brand-dark shadow-md shadow-brand-gold/10 scale-[1.02]'
                  : 'border-brand-dark/10 hover:border-brand-gold/40 text-brand-dark/70 hover:shadow-sm bg-white'
              }`}>
                <input 
                  type="radio" 
                  name="method" 
                  value="razorpay" 
                  checked={paymentMethod === "razorpay"} 
                  onChange={(e) => setPaymentMethod(e.target.value)} 
                  className="accent-brand-gold w-4.5 h-4.5" 
                />
                <div>
                  <div className="text-sm font-bold">UPI / Cards / NetBanking</div>
                  <div className="text-xs text-brand-dark/50 mt-0.5">Secure payment via Razorpay</div>
                </div>
              </label>

              <label className={`flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${
                paymentMethod === 'cod' 
                  ? 'border-brand-gold bg-[#FDFBF7] text-brand-dark shadow-md shadow-brand-gold/10 scale-[1.02]'
                  : 'border-brand-dark/10 hover:border-brand-gold/40 text-brand-dark/70 hover:shadow-sm bg-white'
              }`}>
                <input 
                  type="radio" 
                  name="method" 
                  value="cod" 
                  checked={paymentMethod === "cod"} 
                  onChange={(e) => setPaymentMethod(e.target.value)} 
                  className="accent-brand-gold w-4.5 h-4.5" 
                />
                <div>
                  <div className="text-sm font-bold">Cash on Delivery (COD)</div>
                  <div className="text-xs text-brand-dark/50 mt-0.5">Pay upon delivery</div>
                </div>
              </label>
            </div>
          </div>

          {paymentMethod === "razorpay" && (
            <div className="bg-[#FDFBF7] p-8 rounded-2xl border border-brand-dark/15 shadow-inner text-center space-y-5">
              <p className="text-sm text-brand-dark/70">
                You will be securely redirected to Razorpay to complete your payment using UPI, Credit/Debit Card, or NetBanking.
              </p>
              <motion.button
                onClick={handleRazorpayCheckout}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-brand-gold text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-brand-gold/20 hover:bg-brand-gold/90 transition-all disabled:opacity-50"
              >
                Pay Now
              </motion.button>
            </div>
          )}

          {paymentMethod === "cod" && (
            <div className="bg-[#FDFBF7] p-8 rounded-2xl border border-brand-dark/15 shadow-inner text-center space-y-5">
              <p className="text-sm text-brand-dark/70">
                You have selected Cash on Delivery. Place a test order instantly without entering card details.
              </p>
              <motion.button
                onClick={handleCodOrderSubmit}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-brand-gold text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-brand-gold/20 hover:bg-brand-gold/90 transition-all disabled:opacity-50"
              >
                Place Order (COD)
              </motion.button>
            </div>
          )}

          <div className="bg-[#FDFBF7] rounded-xl p-4 border border-brand-gold/15 shadow-inner flex gap-3 items-center mt-4">
            <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <span className="text-[10px] text-brand-dark/70 font-medium">Payment transactions are fully protected by Razorpay 256-bit SSL encryption.</span>
          </div>

          <div className="border-t border-brand-gold/10 pt-4 mt-2 flex justify-between items-center">
            <button 
              type="button" 
              onClick={() => navigate('/checkout/shipping')} 
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white border border-brand-dark/15 hover:border-brand-dark/30 shadow-sm rounded-xl text-xs font-bold uppercase tracking-wider text-brand-dark transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="text-right text-[10px] text-brand-dark/40 font-bold">
              Powered by <span className="text-[#3395FF]">Razorpay</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckoutPayment;
