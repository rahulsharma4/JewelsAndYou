import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import api from '../services/api';

// Initialize Stripe with fallback
const stripePromise = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)
  : null;

const StripePaymentForm = ({ amount, orderId, items, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create payment intent when component mounts
    createPaymentIntent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createPaymentIntent = async () => {
    try {
      const response = await api.createPaymentIntent(amount, 'usd', orderId, items);
      if (response.success) {
        setClientSecret(response.clientSecret);
      } else {
        setError(response.message || 'Failed to create payment intent');
      }
    } catch (err) {
      setError('Failed to initialize payment');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError('');

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      });

      if (error) {
        setError(error.message);
        onError?.(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess?.(paymentIntent);
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
      onError?.(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-brand-teal/20 rounded-lg border border-brand-gold/20">
        <h3 className="text-lg font-semibold mb-3">Payment Information</h3>
        <div className="p-3 bg-white rounded border">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold">
          Total: ${amount.toFixed(2)}
        </div>
        <motion.button
          type="submit"
          disabled={!stripe || loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 bg-brand-gold text-brand-tealDark rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
        </motion.button>
      </div>
    </form>
  );
};

const StripePayment = ({ amount, orderId, items, onSuccess, onError }) => {
  // Check if Stripe is configured
  if (!process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY === 'pk_test_placeholder') {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
        <h3 className="font-semibold mb-2">Stripe Not Configured</h3>
        <p className="text-sm mb-2">Please configure your Stripe keys to enable payments.</p>
        <p className="text-sm">Add REACT_APP_STRIPE_PUBLISHABLE_KEY to your .env file</p>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <h3 className="font-semibold mb-2">Payment Error</h3>
        <p className="text-sm">Unable to initialize payment system. Please try again later.</p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <StripePaymentForm
        amount={amount}
        orderId={orderId}
        items={items}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
};

export default StripePayment;
