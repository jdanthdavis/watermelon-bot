require('dotenv').config();
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Time schema
const timeSchema = new Schema({
  players: { type: String, required: true },
  teamSize: { type: Number, required: true },
  killTime: { type: String, required: true },
});

// Define the Boss schema
const bossSchema = new Schema({
  bossName: { type: String, required: true },
  times: [timeSchema], // Embedding the time schema as an array
});

const bossTimesCollection = mongoose.createConnection(process.env.MONGO_URI, {
  dbName: 'time_list', // Set the specific database
});

// Create a model based on the schema
const BossTimes = bossTimesCollection.model('times', bossSchema, 'times');

module.exports = BossTimes;
