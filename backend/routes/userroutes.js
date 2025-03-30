const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userController');

// Note the :email parameter in the route
router.get('/:email', getUserProfile);
router.put('/:email', updateUserProfile);

module.exports = router;