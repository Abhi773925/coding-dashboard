import React, { useState, useEffect } from 'react';
import { Calendar, CreditCard, Clock, CheckCircle, X, Star, Download, RefreshCw, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const SubscriptionManager = () => {
  const { isDarkMode, colors } = useTheme();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/subscriptions/user');
      setSubscriptions(response.data.subscriptions || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      setLoading(false);
      // Mock data for demo
      setSubscriptions([
        {
          _id: '1',
          mentor: {
            user: { name: 'Sarah Johnson', profileImage: 'https://randomuser.me/api/portraits/women/1.jpg' },
            profile: { title: 'Senior Full Stack Developer at Google', expertise: ['React', 'Node.js'] }
          },
          plan: {
            name: 'Premium Mentorship',
            description: 'Intensive mentorship program',
            price: 599,
            duration: 'monthly',
            features: ['8 sessions per month', 'Priority support', 'Project guidance'],
            sessionsIncluded: 8
          },
          status: 'active',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-02-01'),
          sessionsUsed: 3,
          autoRenewal: true,
          payment: { status: 'completed', amount: 599 },
          billing: { nextBillingDate: new Date('2024-02-01') }
        },
        {
          _id: '2',
          mentor: {
            user: { name: 'Michael Chen', profileImage: 'https://randomuser.me/api/portraits/men/2.jpg' },
            profile: { title: 'Principal Engineer at Netflix', expertise: ['System Design', 'Backend'] }
          },
          plan: {
            name: 'System Design Mastery',
            description: 'Focus on system design and architecture',
            price: 799,
            duration: 'monthly',
            features: ['6 sessions per month', 'System design practice'],
            sessionsIncluded: 6
          },
          status: 'cancelled',
          startDate: new Date('2023-12-01'),
          endDate: new Date('2024-01-01'),
          sessionsUsed: 6,
          autoRenewal: false,
          payment: { status: 'completed', amount: 799 }
        }
      ]);
    }
  };

  const cancelSubscription = async (subscriptionId) => {
    try {
      await axios.delete(`http://localhost:3001/api/subscriptions/${subscriptionId}`);
      alert('Subscription cancelled successfully');
      setShowCancelModal(false);
      fetchSubscriptions();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Error cancelling subscription');
    }
  };

  const renewSubscription = async (subscriptionId) => {
    try {
      await axios.post(`http://localhost:3001/api/subscriptions/${subscriptionId}/renew`);
      alert('Subscription renewed successfully');
      fetchSubscriptions();
    } catch (error) {
      console.error('Error renewing subscription:', error);
      alert('Error renewing subscription');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-zinc-900 text-slate-300' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-zinc-900' : 'bg-white'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">My Subscriptions</h1>
          <p className="text-gray-600">Manage your mentorship subscriptions and billing</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Subscription Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-zinc-900' : 'bg-white'} border`}>
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {subscriptions.filter(s => s.status === 'active').length}
            </div>
            <div className="text-sm text-gray-500">Active Subscriptions</div>
          </div>
          <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-zinc-900' : 'bg-white'} border`}>
            <div className="text-2xl font-bold text-green-600 mb-2">
              ${subscriptions.filter(s => s.status === 'active').reduce((sum, s) => sum + s.plan.price, 0)}
            </div>
            <div className="text-sm text-gray-500">Monthly Spend</div>
          </div>
          <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-zinc-900' : 'bg-white'} border`}>
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {subscriptions.reduce((sum, s) => sum + s.sessionsUsed, 0)}
            </div>
            <div className="text-sm text-gray-500">Sessions Completed</div>
          </div>
          <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-zinc-900' : 'bg-white'} border`}>
            <div className="text-2xl font-bold text-orange-600 mb-2">
              {subscriptions.filter(s => s.status === 'active').reduce((sum, s) => sum + (s.plan.sessionsIncluded - s.sessionsUsed), 0)}
            </div>
            <div className="text-sm text-gray-500">Sessions Remaining</div>
          </div>
        </div>

        {/* Subscriptions List */}
        <div className="space-y-6">
          {subscriptions.map((subscription) => (
            <div
              key={subscription._id}
              className={`p-6 rounded-xl border ${isDarkMode ? 'bg-zinc-900 border-gray-700' : 'bg-white border-gray-200'}`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                {/* Mentor Info */}
                <div className="flex items-start gap-4 mb-4 lg:mb-0">
                  <img
                    src={subscription.mentor.user.profileImage || `https://ui-avatars.com/api/?name=${subscription.mentor.user.name}&background=6366f1&color=fff`}
                    alt={subscription.mentor.user.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-lg">{subscription.mentor.user.name}</h3>
                    <p className="text-blue-600 mb-2">{subscription.mentor.profile.title}</p>
                    <div className="flex flex-wrap gap-1">
                      {subscription.mentor.profile.expertise.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 rounded-full text-xs ${isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'}`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Plan Details */}
                <div className="flex-1 lg:mx-8">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{subscription.plan.name}</h4>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.status)}`}>
                      {subscription.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{subscription.plan.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Sessions Used</span>
                      <span>{subscription.sessionsUsed}/{subscription.plan.sessionsIncluded}</span>
                    </div>
                    <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-zinc-900' : 'bg-gray-200'}`}>
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ 
                          width: `${(subscription.sessionsUsed / subscription.plan.sessionsIncluded) * 100}%` 
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Started:</span>
                      <span className="ml-2 font-medium">{formatDate(subscription.startDate)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">
                        {subscription.status === 'active' ? 'Renews:' : 'Ended:'}
                      </span>
                      <span className="ml-2 font-medium">{formatDate(subscription.endDate)}</span>
                    </div>
                  </div>

                  {subscription.status === 'active' && (
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">
                        {getDaysRemaining(subscription.endDate)} days remaining
                      </span>
                    </div>
                  )}
                </div>

                {/* Price and Actions */}
                <div className="flex flex-col items-end">
                  <div className="text-right mb-4">
                    <div className="text-2xl font-bold">${subscription.plan.price}</div>
                    <div className="text-sm text-gray-500">per {subscription.plan.duration}</div>
                    {subscription.autoRenewal && subscription.status === 'active' && (
                      <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                        <RefreshCw className="w-3 h-3" />
                        Auto-renewal ON
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 min-w-[120px]">
                    {subscription.status === 'active' && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedSubscription(subscription);
                            setShowCancelModal(true);
                          }}
                          className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm"
                        >
                          Cancel
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-slate-300 rounded-lg hover:bg-blue-700 text-sm">
                          Manage
                        </button>
                      </>
                    )}
                    {subscription.status === 'cancelled' && (
                      <button
                        onClick={() => renewSubscription(subscription._id)}
                        className="px-4 py-2 bg-green-600 text-slate-300 rounded-lg hover:bg-green-700 text-sm"
                      >
                        Renew
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Plan Features */}
              <div className="mt-4 pt-4 border-t">
                <h5 className="font-medium mb-2">Plan Features:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {subscription.plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Billing */}
              {subscription.status === 'active' && subscription.billing?.nextBillingDate && (
                <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? 'bg-zinc-900' : 'bg-gray-100'}`}>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>Next billing: {formatDate(subscription.billing.nextBillingDate)}</span>
                    <span className="text-gray-500">- ${subscription.plan.price}</span>
                  </div>
                </div>
              )}
            </div>
          ))}

          {subscriptions.length === 0 && (
            <div className={`p-12 text-center rounded-xl border ${isDarkMode ? 'bg-zinc-900 border-gray-700' : 'bg-white border-gray-200'}`}>
              <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">No subscriptions yet</h3>
              <p className="text-gray-500 mb-6">Start your mentorship journey by subscribing to a mentor</p>
              <button className="px-6 py-3 bg-blue-600 text-slate-300 rounded-lg hover:bg-blue-700">
                Browse Mentors
              </button>
            </div>
          )}
        </div>

        {/* Billing History */}
        {subscriptions.length > 0 && (
          <div className={`mt-12 p-6 rounded-xl border ${isDarkMode ? 'bg-zinc-900 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Billing History</h2>
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                <Download className="w-4 h-4" />
                Download All
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <th className="text-left py-3">Date</th>
                    <th className="text-left py-3">Mentor</th>
                    <th className="text-left py-3">Plan</th>
                    <th className="text-left py-3">Amount</th>
                    <th className="text-left py-3">Status</th>
                    <th className="text-left py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((subscription) => (
                    <tr key={subscription._id} className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className="py-3">{formatDate(subscription.startDate)}</td>
                      <td className="py-3">{subscription.mentor.user.name}</td>
                      <td className="py-3">{subscription.plan.name}</td>
                      <td className="py-3 font-medium">${subscription.payment.amount}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          subscription.payment.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {subscription.payment.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <button className="text-blue-600 hover:text-blue-700">
                          <Download className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Subscription Modal */}
      {showCancelModal && selectedSubscription && (
        <div className="fixed inset-0 bg-zinc-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className={`max-w-md w-full mx-4 p-6 rounded-xl ${isDarkMode ? 'bg-zinc-900' : 'bg-white'}`}>
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-bold">Cancel Subscription</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel your subscription to {selectedSubscription.mentor.user.name}? 
              You'll lose access to all benefits at the end of your current billing period.
            </p>

            <div className={`p-4 rounded-lg mb-6 ${isDarkMode ? 'bg-zinc-900' : 'bg-gray-100'}`}>
              <h4 className="font-medium mb-2">What happens when you cancel:</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Access continues until {formatDate(selectedSubscription.endDate)}</li>
                <li>• No future charges will be made</li>
                <li>• You can resubscribe anytime</li>
                <li>• Unused sessions will be forfeited</li>
              </ul>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Keep Subscription
              </button>
              <button
                onClick={() => cancelSubscription(selectedSubscription._id)}
                className="px-4 py-2 bg-red-600 text-slate-300 rounded-lg hover:bg-red-700"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManager;
