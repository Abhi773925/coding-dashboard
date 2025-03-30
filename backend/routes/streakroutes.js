const express = require('express');
const { getStreak, updateStreak } = require('../controllers/streakcontroller');
const cors = require('cors');

const router = express.Router();

// Enable CORS for all routes
router.use(cors());

router.get('/streak', getStreak);
router.post('/streak/update', updateStreak);

module.exports = router;