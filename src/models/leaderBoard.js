// models/Submission.js
const mongoose = require('mongoose');

const leaderBoardSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  submissionText: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
