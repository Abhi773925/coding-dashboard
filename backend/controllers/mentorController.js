const Mentor = require('../models/Mentor');
const User = require('../models/User');
const MentorshipSession = require('../models/MentorshipSession');
const Subscription = require('../models/Subscription');

// Get all mentors with filtering and pagination
exports.getAllMentors = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      expertise,
      minRating = 0,
      maxRate,
      experience,
      sortBy = 'ratings.average'
    } = req.query;

    const filter = { status: 'active' };
    
    if (expertise) {
      filter['profile.expertise'] = { $in: expertise.split(',') };
    }
    
    if (maxRate) {
      filter['profile.hourlyRate'] = { $lte: parseFloat(maxRate) };
    }
    
    if (experience) {
      filter['profile.experience'] = { $gte: parseInt(experience) };
    }
    
    filter['ratings.average'] = { $gte: parseFloat(minRating) };

    const sortOptions = {};
    sortOptions[sortBy] = sortBy === 'profile.hourlyRate' ? 1 : -1;

    const mentors = await Mentor.find(filter)
      .populate('user', 'name email')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Mentor.countDocuments(filter);

    res.json({
      mentors,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mentors', error: error.message });
  }
};

// Get mentor details by ID
exports.getMentorById = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id)
      .populate('user', 'name email profileImage joinDate')
      .lean();

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    // Get recent reviews
    const recentSessions = await MentorshipSession.find({
      mentor: req.params.id,
      'feedback.menteeRating': { $exists: true }
    })
    .populate('mentee', 'name')
    .sort({ createdAt: -1 })
    .limit(5)
    .select('feedback createdAt mentee');

    res.json({
      mentor,
      recentReviews: recentSessions
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mentor details', error: error.message });
  }
};

// Create mentor profile
exports.createMentorProfile = async (req, res) => {
  try {
    const {
      title,
      expertise,
      experience,
      company,
      bio,
      hourlyRate,
      languages,
      timeZone,
      linkedIn,
      github,
      portfolio,
      subscriptionPlans
    } = req.body;

    // Check if user already has a mentor profile
    const existingMentor = await Mentor.findOne({ user: req.user.id });
    if (existingMentor) {
      return res.status(400).json({ message: 'Mentor profile already exists' });
    }

    const mentor = new Mentor({
      user: req.user.id,
      profile: {
        title,
        expertise: Array.isArray(expertise) ? expertise : [expertise],
        experience: parseInt(experience),
        company,
        bio,
        hourlyRate: parseFloat(hourlyRate),
        languages: Array.isArray(languages) ? languages : [languages],
        timeZone,
        linkedIn,
        github,
        portfolio
      },
      subscriptionPlans: subscriptionPlans || []
    });

    await mentor.save();

    res.status(201).json({
      message: 'Mentor profile created successfully',
      mentor
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating mentor profile', error: error.message });
  }
};

// Update mentor profile
exports.updateMentorProfile = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ user: req.user.id });
    
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor profile not found' });
    }

    const updates = req.body;
    
    // Update profile fields
    if (updates.profile) {
      Object.keys(updates.profile).forEach(key => {
        if (updates.profile[key] !== undefined) {
          mentor.profile[key] = updates.profile[key];
        }
      });
    }

    // Update availability
    if (updates.availability) {
      mentor.availability = updates.availability;
    }

    // Update subscription plans
    if (updates.subscriptionPlans) {
      mentor.subscriptionPlans = updates.subscriptionPlans;
    }

    await mentor.save();

    res.json({
      message: 'Mentor profile updated successfully',
      mentor
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating mentor profile', error: error.message });
  }
};

// Get mentor dashboard data
exports.getMentorDashboard = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ user: req.user.id });
    
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor profile not found' });
    }

    // Get upcoming sessions
    const upcomingSessions = await MentorshipSession.find({
      mentor: mentor._id,
      scheduledDate: { $gte: new Date() },
      status: { $in: ['scheduled', 'in-progress'] }
    })
    .populate('mentee', 'name email')
    .sort({ scheduledDate: 1 })
    .limit(5);

    // Get active subscriptions
    const activeSubscriptions = await Subscription.find({
      mentor: mentor._id,
      status: 'active',
      endDate: { $gte: new Date() }
    })
    .populate('user', 'name email')
    .sort({ createdAt: -1 });

    // Calculate earnings for this month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    
    const monthlyEarnings = await MentorshipSession.aggregate([
      {
        $match: {
          mentor: mentor._id,
          status: 'completed',
          createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$payment.amount' },
          totalSessions: { $sum: 1 }
        }
      }
    ]);

    res.json({
      mentor,
      upcomingSessions,
      activeSubscriptions,
      monthlyStats: monthlyEarnings[0] || { totalEarnings: 0, totalSessions: 0 }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mentor dashboard', error: error.message });
  }
};

// Search mentors
exports.searchMentors = async (req, res) => {
  try {
    const { query, page = 1, limit = 12 } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchFilter = {
      status: 'active',
      $or: [
        { 'profile.title': { $regex: query, $options: 'i' } },
        { 'profile.expertise': { $regex: query, $options: 'i' } },
        { 'profile.bio': { $regex: query, $options: 'i' } },
        { 'profile.company': { $regex: query, $options: 'i' } }
      ]
    };

    const mentors = await Mentor.find(searchFilter)
      .populate('user', 'name email')
      .sort({ 'ratings.average': -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Mentor.countDocuments(searchFilter);

    res.json({
      mentors,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      query
    });
  } catch (error) {
    res.status(500).json({ message: 'Error searching mentors', error: error.message });
  }
};

module.exports = exports;
