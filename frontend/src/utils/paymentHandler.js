// Payment Handler Utility for Razorpay Integration with razorpay.me/@prepmate
import axios from 'axios';
import config from '../config/config';

const API_BASE = config.API_BASE_URL + '/api';

export class PaymentHandler {
  constructor() {
    this.baseURL = API_BASE;
  }

  // Create subscription payment link
  async createSubscriptionPayment(data) {
    try {
      const response = await axios.post(`${this.baseURL}/payments/subscription/payment-link`, data, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      return this.handlePaymentResponse(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Create one-time session payment link
  async createSessionPayment(data) {
    try {
      const response = await axios.post(`${this.baseURL}/payments/session/payment-link`, data, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      return this.handlePaymentResponse(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Create CV review payment link
  async createCVReviewPayment(data) {
    try {
      const response = await axios.post(`${this.baseURL}/payments/cv-review/payment-link`, data, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      return this.handlePaymentResponse(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Handle payment response and open payment links
  handlePaymentResponse(response) {
    if (response.success) {
      // Open Razorpay payment link in new tab
      if (response.paymentLink) {
        window.open(response.paymentLink, '_blank');
      }

      // Show options to user
      const message = `Payment options:\n1. Razorpay: ${response.paymentLink}\n2. Direct: ${response.prepmateLinkQR}`;
      
      // Create a more user-friendly modal instead of alert
      this.showPaymentModal(response);
      
      return {
        success: true,
        paymentLink: response.paymentLink,
        prepmateLinkQR: response.prepmateLinkQR,
        shortUrl: response.shortUrl
      };
    } else {
      throw new Error(response.message || 'Payment link creation failed');
    }
  }

  // Show payment modal with options
  showPaymentModal(response) {
    const modal = document.createElement('div');
    modal.innerHTML = `
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 class="text-lg font-bold mb-4">Payment Options</h3>
          <div class="space-y-3">
            <div class="p-3 border rounded-lg">
              <h4 class="font-medium text-sm text-gray-600">Option 1: Razorpay Checkout</h4>
              <a href="${response.paymentLink}" target="_blank" 
                 class="text-blue-600 text-sm break-all hover:underline">
                ${response.paymentLink}
              </a>
            </div>
            <div class="p-3 border rounded-lg">
              <h4 class="font-medium text-sm text-gray-600">Option 2: Direct Payment</h4>
              <a href="${response.prepmateLinkQR}" target="_blank" 
                 class="text-blue-600 text-sm break-all hover:underline">
                razorpay.me/@prepmate
              </a>
            </div>
          </div>
          <div class="flex gap-2 mt-4">
            <button onclick="window.open('${response.paymentLink}', '_blank')" 
                    class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Pay with Razorpay
            </button>
            <button onclick="window.open('${response.prepmateLinkQR}', '_blank')" 
                    class="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              Pay Direct
            </button>
          </div>
          <button onclick="this.closest('.fixed').remove()" 
                  class="w-full mt-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400">
            Close
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Auto-remove modal after 30 seconds
    setTimeout(() => {
      if (modal.parentNode) {
        modal.remove();
      }
    }, 30000);
  }

  // Handle errors
  handleError(error) {
    if (error.response) {
      return new Error(error.response.data.message || 'Payment processing failed');
    } else if (error.request) {
      return new Error('Network error. Please check your connection.');
    } else {
      return new Error(error.message || 'An unexpected error occurred');
    }
  }

  // Verify payment status
  async verifyPayment(paymentId) {
    try {
      const response = await axios.get(`${this.baseURL}/payments/verify/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get payment history
  async getPaymentHistory() {
    try {
      const response = await axios.get(`${this.baseURL}/payments/history`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

// Create singleton instance
export const paymentHandler = new PaymentHandler();

// Export helper functions for direct use
export const createSubscriptionPayment = (data) => paymentHandler.createSubscriptionPayment(data);
export const createSessionPayment = (data) => paymentHandler.createSessionPayment(data);
export const createCVReviewPayment = (data) => paymentHandler.createCVReviewPayment(data);
export const verifyPayment = (paymentId) => paymentHandler.verifyPayment(paymentId);
export const getPaymentHistory = () => paymentHandler.getPaymentHistory();

export default paymentHandler;
