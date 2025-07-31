import React, { useState } from 'react';
import { CreditCard, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const RazorpayPayment = ({ 
  amount, 
  currency = 'INR', 
  description, 
  onSuccess, 
  onFailure, 
  disabled = false,
  buttonText = 'Pay Now',
  type, // 'subscription', 'session', 'cv-review'
  entityId, // subscriptionId, sessionId, cvAnalysisId
  userInfo = {}
}) => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createOrder = async () => {
    try {
      let endpoint = '';
      let payload = {};

      switch (type) {
        case 'subscription':
          endpoint = '/api/payments/subscription/create-order';
          payload = { subscriptionId: entityId };
          break;
        case 'session':
          endpoint = '/api/payments/session/create-order';
          payload = { mentorId: entityId, sessionType: 'one-on-one' };
          break;
        case 'cv-review':
          endpoint = '/api/payments/cv-review/create-order';
          payload = { cvAnalysisId: entityId };
          break;
        default:
          throw new Error('Invalid payment type');
      }

      const response = await axios.post(`http://localhost:3001${endpoint}`, payload);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const verifyPayment = async (paymentData) => {
    try {
      const response = await axios.post('http://localhost:3001/api/payments/verify', {
        ...paymentData,
        type,
        entityId
      });
      return response.data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      // Create order
      const orderData = await createOrder();

      // Razorpay options
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'PrepMate',
        description: description || 'Payment for PrepMate services',
        image: '/prepmate-logo.png',
        order_id: orderData.orderId,
        prefill: {
          name: userInfo.name || '',
          email: userInfo.email || '',
          contact: userInfo.phone || ''
        },
        notes: {
          type,
          entityId
        },
        theme: {
          color: '#3B82F6'
        },
        handler: async function (response) {
          try {
            // Verify payment
            const verificationResult = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (onSuccess) {
              onSuccess({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                verificationResult
              });
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            setError('Payment verification failed. Please contact support.');
            if (onFailure) {
              onFailure(error);
            }
          }
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            setError('Payment cancelled by user');
          }
        }
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();

      razorpay.on('payment.failed', function (response) {
        setError(`Payment failed: ${response.error.description}`);
        if (onFailure) {
          onFailure(response.error);
        }
      });

    } catch (error) {
      console.error('Payment error:', error);
      setError(error.response?.data?.message || error.message || 'Payment failed');
      if (onFailure) {
        onFailure(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className={`mb-4 p-3 rounded-lg border ${
          isDarkMode 
            ? 'bg-red-900/20 border-red-600 text-red-300' 
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={disabled || loading || !amount}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
          disabled || loading || !amount
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
        }`}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            <span>{buttonText}</span>
            <span className="ml-2 font-bold">₹{amount}</span>
          </>
        )}
      </button>

      {/* Payment Security Info */}
      <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Shield className="w-4 h-4 text-green-600" />
            <span>Secure Payment</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>SSL Encrypted</span>
          </div>
        </div>
        <div className="text-center mt-2">
          <img 
            src="https://razorpay.com/assets/razorpay-glyph.svg" 
            alt="Powered by Razorpay" 
            className="h-6 mx-auto opacity-60"
          />
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500 mb-2">Accepted Payment Methods:</p>
        <div className="flex justify-center gap-2 opacity-60">
          <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">UPI</div>
          <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Cards</div>
          <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Wallets</div>
          <div className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">Net Banking</div>
        </div>
      </div>
    </div>
  );
};

export default RazorpayPayment;
