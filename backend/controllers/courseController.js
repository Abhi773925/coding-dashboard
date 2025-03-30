const Course = require('../models/Course');
const asyncHandler = require('express-async-handler');

// Create Course
exports.createCourse = asyncHandler(async (req, res) => {
  try {
    const courseData = req.body;
    const course = new Course(courseData);
    
    await course.save();

    res.status(201).json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get course by name with user-specific progress
exports.getCourseByName = asyncHandler(async (req, res) => {
  try {
    const courseName = decodeURIComponent(req.params.name);
    const userEmail = req.query.userEmail; // Get from query params
    
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: 'User email is required'
      });
    }

    const course = await Course.findOne({ 
      name: { $regex: new RegExp(`^${courseName}$`, 'i') } 
    });
    
    if (!course) {
      return res.status(404).json({ 
        success: false,
        message: 'Course not found' 
      });
    }

    // Transform data to include only this user's progress
    const courseData = course.toObject();
    
    // Map days and questions to include only this user's progress
    courseData.days = courseData.days.map(day => {
      day.questions = day.questions.map(question => {
        // Find this user's progress for this question
        const userProgressEntry = question.userProgress?.find(
          p => p.userEmail === userEmail
        ) || {};
        
        // Return question with user-specific progress
        return {
          id: question.id,
          title: question.title,
          difficulty: question.difficulty,
          links: question.links,
          status: userProgressEntry.status || false,
          notes: userProgressEntry.notes || '',
          forRevision: userProgressEntry.forRevision || false
        };
      });
      return day;
    });
    
    // Calculate total and completed questions for this user
    const totalQuestions = courseData.days.reduce((total, day) => 
      total + (day.questions?.length || 0), 0
    );
    
    const completedQuestions = courseData.days.reduce((total, day) => 
      total + (day.questions?.filter(q => q.status).length || 0), 0
    );

    courseData.totalQuestions = totalQuestions;
    courseData.completedQuestions = completedQuestions;

    res.json({
      success: true,
      data: courseData
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
});

// Update question status for specific user
exports.updateQuestionStatus = asyncHandler(async (req, res) => {
  try {
    const { courseId, dayNumber, questionId } = req.params;
    const { status, notes, forRevision, userEmail } = req.body;

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: 'User email is required'
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ 
        success: false,
        message: 'Course not found' 
      });
    }

    const dayIndex = course.days.findIndex(d => d.dayNumber === parseInt(dayNumber));
    if (dayIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'Day not found' 
      });
    }

    const questionIndex = course.days[dayIndex].questions
      .findIndex(q => q.id === questionId);
    
    if (questionIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'Question not found' 
      });
    }

    const question = course.days[dayIndex].questions[questionIndex];
    
    // Find or create progress entry for this user
    let progressIndex = -1;
    
    if (!question.userProgress) {
      question.userProgress = [];
    } else {
      progressIndex = question.userProgress.findIndex(p => p.userEmail === userEmail);
    }
    
    if (progressIndex === -1) {
      // Create new progress entry for this user
      question.userProgress.push({
        userEmail,
        status: false,
        notes: '',
        forRevision: false
      });
      progressIndex = question.userProgress.length - 1;
    }
    
    // Update the progress
    if (status !== undefined) question.userProgress[progressIndex].status = status;
    if (notes !== undefined) question.userProgress[progressIndex].notes = notes;
    if (forRevision !== undefined) question.userProgress[progressIndex].forRevision = forRevision;
    question.userProgress[progressIndex].lastUpdated = new Date();

    await course.save();

    // Transform the course to return only this user's progress
    const courseData = course.toObject();
    
    // Map days and questions to include only this user's progress
    courseData.days = courseData.days.map(day => {
      day.questions = day.questions.map(question => {
        // Find this user's progress for this question
        const userProgressEntry = question.userProgress?.find(
          p => p.userEmail === userEmail
        ) || {};
        
        // Return question with user-specific progress
        return {
          id: question.id,
          title: question.title,
          difficulty: question.difficulty,
          links: question.links,
          status: userProgressEntry.status || false,
          notes: userProgressEntry.notes || '',
          forRevision: userProgressEntry.forRevision || false
        };
      });
      return day;
    });
    
    // Calculate total and completed questions for this user
    const totalQuestions = courseData.days.reduce((total, day) => 
      total + (day.questions?.length || 0), 0
    );
    
    const completedQuestions = courseData.days.reduce((total, day) => 
      total + (day.questions?.filter(q => q.status).length || 0), 0
    );

    courseData.totalQuestions = totalQuestions;
    courseData.completedQuestions = completedQuestions;

    res.json({
      success: true,
      data: courseData
    });
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
});