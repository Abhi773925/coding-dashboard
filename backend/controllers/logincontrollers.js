const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await SignupDetails.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, role: user.role, email: user.email, username: user.username });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "An error occurred. Please try again." });
  }
};
