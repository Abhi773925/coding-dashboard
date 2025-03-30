// seedCourse.js
const mongoose = require('mongoose');
const Course = require('./models/Course');
require('dotenv').config();

const seedCourse = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Comprehensive Course Data
    const courseData = {
      name: 'DSA Placement Preparation',
      days: [
        {
          dayNumber: 1,
          dayTitle: 'Arrays',
          questions: [
            {
              id: 'set-matrix-zeros',
              title: 'Set Matrix Zeros',
              difficulty: 'Medium',
              links: {
                article: 'https://www.geeksforgeeks.org/set-matrix-zeros/',
                youtube: 'https://www.youtube.com/watch?v=M65xBxkfETY',
                practice: 'https://leetcode.com/problems/set-matrix-zeroes/'
              }
            },
            {
              id: 'pascals-triangle',
              title: 'Pascal\'s Triangle',
              difficulty: 'Medium',
              links: {
                article: 'https://www.geeksforgeeks.org/pascal-triangle/',
                youtube: 'https://www.youtube.com/watch?v=6qXTsIAzz5M',
                practice: 'https://leetcode.com/problems/pascals-triangle/'
              }
            },
            {
              id: 'next-permutation',
              title: 'Next Permutation',
              difficulty: 'Medium',
              links: {
                article: 'https://www.geeksforgeeks.org/next-permutation/',
                youtube: 'https://www.youtube.com/watch?v=LuLCLgMElus',
                practice: 'https://leetcode.com/problems/next-permutation/'
              }
            },
            {
              id: 'kadanes-algorithm',
              title: 'Kadane\'s Algorithm',
              difficulty: 'Easy',
              links: {
                article: 'https://www.geeksforgeeks.org/kadanes-algorithm-maximum-sum-subarray/',
                youtube: 'https://www.youtube.com/watch?v=w_KEWfU7LRQ',
                practice: 'https://leetcode.com/problems/maximum-subarray/'
              }
            },
            {
              id: 'sort-colors',
              title: 'Sort an array of 0\'s, 1\'s and 2\'s',
              difficulty: 'Medium',
              links: {
                article: 'https://www.geeksforgeeks.org/sort-an-array-of-0s-1s-and-2s/',
                youtube: 'https://www.youtube.com/watch?v=oaVa-axb9gg',
                practice: 'https://leetcode.com/problems/sort-colors/'
              }
            },
            {
              id: 'stock-buy-sell',
              title: 'Stock Buy and Sell',
              difficulty: 'Easy',
              links: {
                article: 'https://www.geeksforgeeks.org/stock-buy-sell/',
                youtube: 'https://www.youtube.com/watch?v=34WE6kwbwbk',
                practice: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/'
              }
            }
          ]
        },
        {
          dayNumber: 2,
          dayTitle: 'Arrays Part-II',
          questions: [
            {
              id: 'rotate-matrix',
              title: 'Rotate Matrix',
              difficulty: 'Medium',
              links: {
                article: 'https://www.geeksforgeeks.org/rotate-a-matrix-by-90-degree-in-clockwise-direction/',
                youtube: 'https://www.youtube.com/watch?v=Y72QN0ygpFE',
                practice: 'https://leetcode.com/problems/rotate-image/'
              }
            },
            {
              id: 'merge-intervals',
              title: 'Merge Intervals',
              difficulty: 'Medium',
              links: {
                article: 'https://www.geeksforgeeks.org/merge-intervals/',
                youtube: 'https://www.youtube.com/watch?v=2JzRjPsfa60',
                practice: 'https://leetcode.com/problems/merge-intervals/'
              }
            }
            // Add more questions for Day 2
          ]
        },
        // Add more days
      ]
    };

    // Calculate total questions
    courseData.totalQuestions = courseData.days.reduce((total, day) => 
      total + day.questions.length, 0
    );

    // Delete existing courses
    await Course.deleteMany({});

    // Create and save new course
    const course = new Course(courseData);
    await course.save();

    console.log('Course seeded successfully!');
    console.log(`Total Questions: ${courseData.totalQuestions}`);
  } catch (error) {
    console.error('Error seeding course:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
  }
};

// Run the seeding script
seedCourse();