const express = require('express');
const { getStreak, updateStreak } = require('../controllers/streakcontroller');
const cors = require('cors');

const router = express.Router();

// Enable CORS with credentials for multiple origins
router.use(cors({
    origin: ["https://www.prepmate.site", "http://localhost:5173", "https://prepmate-kvol.onrender.com"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

router.get('/streak', getStreak);
router.post('/streak/update', updateStreak);

module.exports = router;