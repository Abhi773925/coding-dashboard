const Streak = require('../models/Streak');
const moment = require('moment');

const checkAndUpdateStreak = async (streak) => {
  const today = moment().startOf('day');
  const lastCodedDate = streak.lastCodedDate ? moment(streak.lastCodedDate).startOf('day') : null;
  
  // If there's no last coded date, this is first time
  if (!lastCodedDate) {
    return streak;
  }

  const daysSinceLastCoded = today.diff(lastCodedDate, 'days');
  
  // If more than 1 day has passed, reset streak
  if (daysSinceLastCoded > 1) {
    streak.currentStreak = 0;
  }
  
  // Update longest streak if needed
  streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
  
  return streak;
};

exports.getStreak = async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    let streak = await Streak.findOne({ email });
    
    if (!streak) {
      streak = new Streak({ 
        email, 
        currentStreak: 0, 
        longestStreak: 0,
        lastCodedDate: null
      });
    } else {
      // Check and update streak based on time passed
      streak = await checkAndUpdateStreak(streak);
    }
    
    await streak.save();
    
    // Ensure dates are properly formatted
    const response = {
      currentStreak: streak.currentStreak || 0,
      longestStreak: streak.longestStreak || 0,
      lastCodedDate: streak.lastCodedDate ? streak.lastCodedDate.toISOString() : null
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error in getStreak:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};

exports.updateStreak = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    let streak = await Streak.findOne({ email });
    
    if (!streak) {
      streak = new Streak({ 
        email,
        currentStreak: 1,
        longestStreak: 1,
        lastCodedDate: new Date()
      });
    } else {
      const today = moment().startOf('day');
      const lastCodedDate = streak.lastCodedDate ? moment(streak.lastCodedDate).startOf('day') : null;
      
      // If this is first activity or if last activity was yesterday
      if (!lastCodedDate || today.diff(lastCodedDate, 'days') === 1) {
        // Increment streak
        streak.currentStreak += 1;
      } 
      // If last activity was today, don't increment but update timestamp
      else if (today.diff(lastCodedDate, 'days') === 0) {
        // Keep current streak, just update timestamp
      }
      // If more than a day has passed, reset streak
      else {
        streak.currentStreak = 1; // Start new streak
      }
      
      // Update longest streak if needed
      streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
      
      // Update last coded date
      streak.lastCodedDate = new Date();
    }
    
    await streak.save();
    
    // Ensure dates are properly formatted
    const response = {
      currentStreak: streak.currentStreak || 0,
      longestStreak: streak.longestStreak || 0,
      lastCodedDate: streak.lastCodedDate ? streak.lastCodedDate.toISOString() : null
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error in updateStreak:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};