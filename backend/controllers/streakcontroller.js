const Streak = require('../models/Streak');
const moment = require('moment');

exports.getStreak = async (req, res) => {
  try {
    const { email } = req.query;
    
    let streak = await Streak.findOne({ email });
    
    if (!streak) {
      streak = new Streak({ 
        email, 
        currentStreak: 0, 
        longestStreak: 0 
      });
      await streak.save();
    }
    
    res.json({
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStreak = async (req, res) => {
  try {
    const { email } = req.body;
    
    let streak = await Streak.findOne({ email });
    
    if (!streak) {
      streak = new Streak({ email });
    }
    
    const today = moment().startOf('day');
    const lastCodedDate = moment(streak.lastCodedDate).startOf('day');
    
    // Check if coding was done yesterday or today
    if (!streak.lastCodedDate || 
        today.diff(lastCodedDate, 'days') === 1) {
      // Increment current streak
      streak.currentStreak += 1;
      
      // Update longest streak if needed
      streak.longestStreak = Math.max(
        streak.longestStreak, 
        streak.currentStreak
      );
    } else if (today.diff(lastCodedDate, 'days') > 1) {
      // Streak broken
      streak.currentStreak = 1;
    }
    
    // Update last coded date
    streak.lastCodedDate = new Date();
    
    await streak.save();
    
    res.json({
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};