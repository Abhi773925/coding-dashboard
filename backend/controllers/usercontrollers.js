// controllers/userController.js
const User = require("../models/User");

exports.checkUserEmail = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "❌ Email is required", exists: false });
    }
    
    const user = await User.findOne({ email });
    
    return res.json({ 
      exists: !!user, 
      message: user ? "✅ User found" : "❌ User not found" 
    });
  } catch (error) {
    console.error("❌ Error checking user email:", error);
    res.status(500).json({ message: "❌ Server error", error: error.message, exists: false });
  }
};