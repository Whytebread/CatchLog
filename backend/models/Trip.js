const mongoose = require('mongoose');

const catchSchema = new mongoose.Schema({
  species: String,
  length: Number,
  weight: Number,
  bait: String
}, { _id: false });

const tripSchema = new mongoose.Schema({
  bodyOfWater: String,
  weather: String,
  temperature: String,
  catchDate: Date,
  notes: String,
  catches: {
    type: [catchSchema],
    default: []
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
