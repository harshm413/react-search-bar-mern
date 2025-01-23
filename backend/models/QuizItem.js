const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
  text: { type: String, required: true },
  showInOption: { type: Boolean, default: true },
  isAnswer: { type: Boolean, default: false },
});

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrectAnswer: { type: Boolean, default: false },
});

const quizItemSchema = new mongoose.Schema({
  type: { type: String, enum: ['ANAGRAM', 'MCQ', 'READ_ALONG'], required: true },
  title: { type: String, required: true },
  anagramType: { type: String, enum: ['WORD', 'SENTENCE'], default: null },
  blocks: [blockSchema], // For 'ANAGRAM'
  options: [optionSchema], // For 'MCQ'
  solution: { type: String, default: null }, // For 'ANAGRAM' or 'MCQ'
  siblingId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuizItem', default: null },
});

module.exports = mongoose.model('QuizItem', quizItemSchema);
