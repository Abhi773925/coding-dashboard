const Subscription = require('../models/Subscription');
const Mentor = require('../models/Mentor');
const User = require('../models/User');

// Create subscription
exports.createSubscription = async (req, res) => {
  try {
    const { mentorId, planName } = req.body;
    
    // Find mentor and plan
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }
    
    const plan = mentor.subscriptionPlans.find(p => p.name === planName && p.isActive);
    if (!plan) {
      return res.status(404).json({ message: 'Subscription plan not found or inactive' });
    }

    // Check if user already has an active subscription with this mentor
    const existingSubscription = await Subscription.findOne({
      user: req.user.id,
      mentor: mentorId,
      status: 'active',
      endDate: { $gte: new Date() }
    });

    if (existingSubscription) {
      return res.status(400).json({ message: 'You already have an active subscription with this mentor' });
    }

    // Calculate end date based on plan duration
    const startDate = new Date();
    const endDate = new Date(startDate);
    
    switch (plan.duration) {
      case 'weekly':
        endDate.setDate(endDate.getDate() + 7);
        break;
      case 'monthly':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case 'quarterly':
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case 'yearly':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
    }

    const subscription = new Subscription({
      user: req.user.id,
      mentor: mentorId,
      plan: {
        name: plan.name,
        description: plan.description,
        price: plan.price,
        duration: plan.duration,
        features: plan.features,
        sessionsIncluded: plan.sessionsIncluded
      },
      startDate,
      endDate,
      payment: {
        amount: plan.price,
        paymentDate: new Date(),
        status: 'pending'
      },
      billing: {
        nextBillingDate: endDate,
        lastBillingDate: startDate
      }
    });

    await subscription.save();

    res.status(201).json({
      message: 'Subscription created successfully',
      subscription
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating subscription', error: error.message });
  }
};

// Get user subscriptions
exports.getUserSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user.id })
      .populate('mentor', 'profile user')
      .populate({
        path: 'mentor',
        populate: {
          path: 'user',
          select: 'name email profileImage'
        }
      })
      .sort({ createdAt: -1 });

    res.json({ subscriptions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subscriptions', error: error.message });
  }
};

// Get mentor subscriptions
exports.getMentorSubscriptions = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ user: req.user.id });
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor profile not found' });
    }

    const subscriptions = await Subscription.find({ mentor: mentor._id })
      .populate('user', 'name email profileImage')
      .sort({ createdAt: -1 });

    res.json({ subscriptions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mentor subscriptions', error: error.message });
  }
};

// Update subscription status
exports.updateSubscriptionStatus = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const { status, paymentStatus } = req.body;

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Check authorization
    const mentor = await Mentor.findOne({ user: req.user.id });
    if (!mentor || subscription.mentor.toString() !== mentor._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to update this subscription' });
    }

    if (status) {
      subscription.status = status;
    }

    if (paymentStatus) {
      subscription.payment.status = paymentStatus;
      if (paymentStatus === 'completed') {
        subscription.status = 'active';
      }
    }

    await subscription.save();

    res.json({
      message: 'Subscription updated successfully',
      subscription
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating subscription', error: error.message });
  }
};

// Cancel subscription
exports.cancelSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const { reason } = req.body;

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Check authorization
    if (subscription.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to cancel this subscription' });
    }

    subscription.status = 'cancelled';
    subscription.autoRenewal = false;
    
    // Add cancellation reason to billing history
    subscription.billing.billingHistory.push({
      date: new Date(),
      amount: 0,
      status: 'cancelled',
      paymentId: `CANCEL-${Date.now()}`
    });

    await subscription.save();

    res.json({
      message: 'Subscription cancelled successfully',
      subscription
    });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling subscription', error: error.message });
  }
};

// Renew subscription
exports.renewSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Check authorization
    if (subscription.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to renew this subscription' });
    }

    // Calculate new end date
    const newEndDate = new Date(subscription.endDate);
    switch (subscription.plan.duration) {
      case 'weekly':
        newEndDate.setDate(newEndDate.getDate() + 7);
        break;
      case 'monthly':
        newEndDate.setMonth(newEndDate.getMonth() + 1);
        break;
      case 'quarterly':
        newEndDate.setMonth(newEndDate.getMonth() + 3);
        break;
      case 'yearly':
        newEndDate.setFullYear(newEndDate.getFullYear() + 1);
        break;
    }

    subscription.endDate = newEndDate;
    subscription.status = 'active';
    subscription.sessionsUsed = 0; // Reset sessions for new period
    subscription.billing.nextBillingDate = newEndDate;
    subscription.billing.lastBillingDate = new Date();

    // Add to billing history
    subscription.billing.billingHistory.push({
      date: new Date(),
      amount: subscription.plan.price,
      status: 'completed',
      paymentId: `REN-${Date.now()}`
    });

    await subscription.save();

    res.json({
      message: 'Subscription renewed successfully',
      subscription
    });
  } catch (error) {
    res.status(500).json({ message: 'Error renewing subscription', error: error.message });
  }
};

// Get subscription analytics
exports.getSubscriptionAnalytics = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ user: req.user.id });
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor profile not found' });
    }

    // Total revenue
    const totalRevenue = await Subscription.aggregate([
      {
        $match: {
          mentor: mentor._id,
          'payment.status': 'completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$payment.amount' }
        }
      }
    ]);

    // Monthly revenue
    const monthlyRevenue = await Subscription.aggregate([
      {
        $match: {
          mentor: mentor._id,
          'payment.status': 'completed',
          createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$payment.amount' }
        }
      }
    ]);

    // Subscription counts by status
    const statusCounts = await Subscription.aggregate([
      {
        $match: { mentor: mentor._id }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      monthlyRevenue: monthlyRevenue[0]?.total || 0,
      statusCounts
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subscription analytics', error: error.message });
  }
};

module.exports = exports;
