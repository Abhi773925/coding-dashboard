const express = require('express');
const router = express.Router();
const {
  createCourse,
  getCourseByName,
  updateQuestionStatus
} = require('../controllers/courseController');

// Define routes with appropriate middleware
router.post('/', createCourse);
router.get('/:name', getCourseByName);
router.put('/:courseId/days/:dayNumber/questions/:questionId', updateQuestionStatus);

module.exports = router;