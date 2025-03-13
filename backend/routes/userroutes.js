// routes/userRoutes.js
const express = require("express");
const { checkUserEmail } = require("../controllers/usercontrollers");

const router = express.Router();

router.post("/check", checkUserEmail);

module.exports = router;