const mongoose = require('mongoose');

// Define the schema for the 'times' collection
const bossSchema = new mongoose.Schema({
  bosses: {
    type: [String],
    required: true,
  },
});

const bossListCollection = mongoose.createConnection(process.env.MONGO_URI, {
  dbName: 'boss_list', // Set the specific database
});

// Create a model based on the schema
const Bosses = bossListCollection.model('bosses', bossSchema, 'bosses'); // Specify collection 'times'
module.exports = Bosses;
