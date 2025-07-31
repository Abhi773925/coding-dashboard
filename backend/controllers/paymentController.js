const Razorpay = require('razorpay');
const crypto = require('crypto');
const Subscription = require('../models/Subscription');
const CVAnalysis = require('../models/CVAnalysis');
const MentorshipSession = require('../models/MentorshipSession');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Prepmate Razorpay Payment Link Configuration
const PREPMATE_PAYMENT_LINK = 'https://razorpay.me/@prepmate';

// Create payment link for subscription
exports.createSubscriptionPaymentLink = async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    
    const subscription = await Subscription.findById(subscriptionId)
      .populate('mentor', 'profile user')
      .populate({
        path: 'mentor',
        populate: {
          path: 'user',
          select: 'name email'
        }
      })
      .populate('user', 'name email');

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Create payment link using Razorpay Payment Links API
    const paymentLinkOptions = {
      amount: subscription.plan.price * 100, // Amount in paise
      currency: 'INR',
      accept_partial: false,
      description: `${subscription.plan.name} - Mentorship with ${subscription.mentor.user.name}`,
      customer: {
        name: subscription.user.name,
        email: subscription.user.email,
      },
      notify: {
        sms: true,
        email: true
      },
      reminder_enable: true,
      notes: {
        subscriptionId: subscription._id.toString(),
        userId: subscription.user._id.toString(),
        mentorId: subscription.mentor._id.toString(),
        planName: subscription.plan.name,
        type: 'subscription'
      },
      callback_url: `${process.env.FRONTEND_URL}/subscriptions?payment=success`,
      callback_method: 'get'
    };

    const paymentLink = await razorpay.paymentLink.create(paymentLinkOptions);

    // Update subscription with payment link details
    subscription.payment.paymentId = paymentLink.id;
    subscription.payment.amount = subscription.plan.price;
    subscription.payment.currency = 'INR';
    await subscription.save();

    res.json({
      paymentLink: paymentLink.short_url || paymentLink.link_url,
      razorpayLink: `${PREPMATE_PAYMENT_LINK}/${subscription.plan.price}`,
      amount: subscription.plan.price,
      currency: 'INR',
      subscription: subscription,
      paymentLinkId: paymentLink.id
    });
  } catch (error) {
    console.error('Error creating subscription payment link:', error);
    res.status(500).json({ message: 'Error creating payment link', error: error.message });
  }
};

// Create payment link for one-time session
exports.createSessionPaymentLink = async (req, res) => {
  try {
    const { mentorId, sessionType, duration = 60 } = req.body;
    
    const mentor = await Mentor.findById(mentorId)
      .populate('user', 'name email');
      
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    const amount = mentor.profile.hourlyRate * (duration / 60);

    // Create session record
    const session = new MentorshipSession({
      mentor: mentorId,
      mentee: req.user.id,
      sessionDetails: {
        title: `One-on-one session with ${mentor.user.name}`,
        type: sessionType || 'one-on-one',
        duration: duration
      },
      payment: {
        amount: amount,
        currency: 'INR',
        paymentStatus: 'pending'
      }
    });

    await session.save();

    // Create payment link
    const paymentLinkOptions = {
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      accept_partial: false,
      description: `${duration}min session with ${mentor.user.name} - ${mentor.profile.title}`,
      customer: {
        name: req.user.name,
        email: req.user.email,
      },
      notify: {
        sms: true,
        email: true
      },
      reminder_enable: true,
      notes: {
        sessionId: session._id.toString(),
        userId: req.user.id,
        mentorId: mentorId,
        sessionType: sessionType,
        type: 'session'
      },
      callback_url: `${process.env.FRONTEND_URL}/mentorship/sessions?payment=success`,
      callback_method: 'get'
    };

    const paymentLink = await razorpay.paymentLink.create(paymentLinkOptions);

    // Update session with payment link details
    session.payment.paymentId = paymentLink.id;
    await session.save();

    res.json({
      paymentLink: paymentLink.short_url || paymentLink.link_url,
      razorpayLink: `${PREPMATE_PAYMENT_LINK}/${Math.round(amount)}`,
      amount: amount,
      currency: 'INR',
      session: session,
      paymentLinkId: paymentLink.id
    });
  } catch (error) {
    console.error('Error creating session payment link:', error);
    res.status(500).json({ message: 'Error creating payment link', error: error.message });
  }
};

// Create payment link for CV review
exports.createCVReviewPaymentLink = async (req, res) => {
  try {
    const { cvAnalysisId } = req.body;
    
    const cvAnalysis = await CVAnalysis.findById(cvAnalysisId)
      .populate('user', 'name email');
      
    if (!cvAnalysis) {
      return res.status(404).json({ message: 'CV analysis not found' });
    }

    // Create payment link
    const paymentLinkOptions = {
      amount: cvAnalysis.payment.amount * 100, // Amount in paise
      currency: 'INR',
      accept_partial: false,
      description: `CV Review Service - Professional Resume Analysis`,
      customer: {
        name: cvAnalysis.user.name,
        email: cvAnalysis.user.email,
      },
      notify: {
        sms: true,
        email: true
      },
      reminder_enable: true,
      notes: {
        cvAnalysisId: cvAnalysis._id.toString(),
        userId: cvAnalysis.user._id.toString(),
        service: 'cv-review',
        type: 'cv-review'
      },
      callback_url: `${process.env.FRONTEND_URL}/support?payment=success`,
      callback_method: 'get'
    };

    const paymentLink = await razorpay.paymentLink.create(paymentLinkOptions);

    // Update CV analysis with payment link details
    cvAnalysis.payment.paymentId = paymentLink.id;
    cvAnalysis.payment.currency = 'INR';
    await cvAnalysis.save();

    res.json({
      paymentLink: paymentLink.short_url || paymentLink.link_url,
      razorpayLink: `${PREPMATE_PAYMENT_LINK}/${Math.round(cvAnalysis.payment.amount)}`,
      amount: cvAnalysis.payment.amount,
      currency: 'INR',
      cvAnalysis: cvAnalysis,
      paymentLinkId: paymentLink.id
    });
  } catch (error) {
    console.error('Error creating CV review payment link:', error);
    res.status(500).json({ message: 'Error creating payment link', error: error.message });
  }
};

// Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      type, // 'subscription', 'session', or 'cv-review'
      entityId // subscriptionId, sessionId, or cvAnalysisId
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // Update entity based on type
    let updatedEntity;
    
    switch (type) {
      case 'subscription':
        updatedEntity = await Subscription.findById(entityId);
        if (updatedEntity) {
          updatedEntity.payment.status = 'completed';
          updatedEntity.payment.paymentId = razorpay_payment_id;
          updatedEntity.payment.paymentDate = new Date();
          updatedEntity.status = 'active';
          
          // Add to billing history
          updatedEntity.billing.billingHistory.push({
            date: new Date(),
            amount: updatedEntity.plan.price,
            status: 'completed',
            paymentId: razorpay_payment_id
          });
          
          await updatedEntity.save();
        }
        break;

      case 'session':
        updatedEntity = await MentorshipSession.findById(entityId);
        if (updatedEntity) {
          updatedEntity.payment.paymentStatus = 'paid';
          updatedEntity.payment.paymentId = razorpay_payment_id;
          updatedEntity.status = 'scheduled';
          await updatedEntity.save();
        }
        break;

      case 'cv-review':
        updatedEntity = await CVAnalysis.findById(entityId);
        if (updatedEntity) {
          updatedEntity.payment.paymentStatus = 'paid';
          updatedEntity.payment.paymentId = razorpay_payment_id;
          updatedEntity.status = 'in-review';
          await updatedEntity.save();
        }
        break;

      default:
        return res.status(400).json({ message: 'Invalid payment type' });
    }

    if (!updatedEntity) {
      return res.status(404).json({ message: 'Entity not found' });
    }

    res.json({
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id,
      status: 'success',
      entity: updatedEntity
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Error verifying payment', error: error.message });
  }
};

// Handle webhook
exports.handleWebhook = async (req, res) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (webhookSignature !== expectedSignature) {
      return res.status(400).json({ message: 'Invalid webhook signature' });
    }

    const event = req.body.event;
    const payment = req.body.payload.payment.entity;

    console.log('Razorpay webhook received:', event);

    switch (event) {
      case 'payment.captured':
        // Handle successful payment
        await handleSuccessfulPayment(payment);
        break;

      case 'payment.failed':
        // Handle failed payment
        await handleFailedPayment(payment);
        break;

      case 'subscription.charged':
        // Handle subscription renewal
        await handleSubscriptionCharged(req.body.payload.subscription.entity);
        break;

      default:
        console.log('Unhandled webhook event:', event);
    }

    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Webhook error', error: error.message });
  }
};

// Helper function to handle successful payment
const handleSuccessfulPayment = async (payment) => {
  try {
    const orderId = payment.order_id;
    const notes = payment.notes || {};

    if (notes.subscriptionId) {
      const subscription = await Subscription.findById(notes.subscriptionId);
      if (subscription) {
        subscription.payment.status = 'completed';
        subscription.status = 'active';
        await subscription.save();
      }
    } else if (notes.sessionId) {
      const session = await MentorshipSession.findById(notes.sessionId);
      if (session) {
        session.payment.paymentStatus = 'paid';
        session.status = 'scheduled';
        await session.save();
      }
    } else if (notes.cvAnalysisId) {
      const cvAnalysis = await CVAnalysis.findById(notes.cvAnalysisId);
      if (cvAnalysis) {
        cvAnalysis.payment.paymentStatus = 'paid';
        cvAnalysis.status = 'in-review';
        await cvAnalysis.save();
      }
    }
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
};

// Helper function to handle failed payment
const handleFailedPayment = async (payment) => {
  try {
    const notes = payment.notes || {};

    if (notes.subscriptionId) {
      const subscription = await Subscription.findById(notes.subscriptionId);
      if (subscription) {
        subscription.payment.status = 'failed';
        subscription.status = 'pending';
        await subscription.save();
      }
    }
  } catch (error) {
    console.error('Error handling failed payment:', error);
  }
};

// Get payment status
exports.getPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const payment = await razorpay.payments.fetch(paymentId);
    
    res.json({
      paymentId: payment.id,
      status: payment.status,
      amount: payment.amount / 100, // Convert from paise to rupees
      currency: payment.currency,
      method: payment.method,
      createdAt: new Date(payment.created_at * 1000)
    });
  } catch (error) {
    console.error('Error fetching payment status:', error);
    res.status(500).json({ message: 'Error fetching payment status', error: error.message });
  }
};

// Create Razorpay customer
exports.createCustomer = async (req, res) => {
  try {
    const { name, email, contact } = req.body;

    const customer = await razorpay.customers.create({
      name,
      email,
      contact,
      notes: {
        userId: req.user.id
      }
    });

    res.json({
      customerId: customer.id,
      customer
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ message: 'Error creating customer', error: error.message });
  }
};

module.exports = exports;
