const User = require('../models/User');

exports.getUserProfile = async (req, res) => {
  try {
    // Get email from params instead of req.params
    const { email } = req.params;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      name: user.name,
      email: user.email,
      avatar: user.picture || user.avatar || `https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`,
      leetcode: user.leetcode || '',
      github: user.github || '',
      geeksforgeeks: user.geeksforgeeks || ''
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    // Get email from params
    const { email } = req.params;
    const { name, leetcode, github, geeksforgeeks } = req.body;

    const updateData = { 
      name, 
      leetcode, 
      github, 
      geeksforgeeks 
    };

    const updatedUser = await User.findOneAndUpdate(
      { email }, 
      updateData, 
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        name: updatedUser.name,
        leetcode: updatedUser.leetcode,
        github: updatedUser.github,
        geeksforgeeks: updatedUser.geeksforgeeks
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};