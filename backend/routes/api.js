// routes/api.js
const express = require('express');
const QuizItem = require('../models/QuizItem');
const mongoose = require('mongoose');
const router = express.Router();

// Get all quiz items matching the search query with pagination
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q.toLowerCase();
    console.log(query);
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 20; // Default to 20 records per page
    const skip = (page - 1) * limit;

    // Find items matching the query with pagination
    const results = await QuizItem.find({ title: { $regex: query, $options: 'i' } })
    .skip(skip)
    .limit(limit)
    
    // Get the total count of items for pagination
    const totalResults = await QuizItem.countDocuments({ title: { $regex: query, $options: 'i' } });
    
    res.json({
      results,
      totalResults,
       totalPages: Math.ceil(totalResults / limit),
       currentPage: page
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});
// Add a new quiz item
router.post('/add-quiz-item', async (req, res) => {
    try {
      const { type, title, anagramType, blocks, options, solution, siblingId } = req.body;
  
      // Create a new quiz item
      const quizItem = new QuizItem({
        type,
        title,
        anagramType,
        blocks,
        options,
        solution,
        siblingId,
      });
  
      // Save to MongoDB
      const savedQuizItem = await quizItem.save();
      res.status(201).json({
        message: 'Quiz item added successfully',
        data: savedQuizItem,
      });
    } catch (error) {
      console.error('Error adding quiz item:', error);
      res.status(500).json({ error: 'Server Error: Unable to save quiz item' });
    }
  });

module.exports = router;
