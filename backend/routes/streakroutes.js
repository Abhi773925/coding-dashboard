const express = require('express');
const { getStreak, updateStreak } = require('../controllers/streakcontroller');
const cors = require('cors');

const router = express.Router();

// Enable CORS with credentials
router.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

router.get('/streak', getStreak);
router.post('/streak/update', updateStreak);

module.exports = router;