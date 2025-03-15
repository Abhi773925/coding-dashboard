const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  profilePicture: { type: String },
  role: { type: String, default: "viewer", enum: ["viewer", "subadmin", "admin"] }, // Add role field
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model("User", userSchema);
module.exports = User;
