const mongoose = require('mongoose');

const SearchSchema = new mongoose.Schema({
  originLocationCode: {
    type: String,
    required: true
  },
  destinationLocationCode: {
    type: String,
    required: true
  },
  departureDate: {
    type: String,
    required: true
  },
  returnDate: {
    type: String,
    required: false
  },
  adults: {
    type: Number,
    required: true,
    default: 1
  },
  children: {
    type: Number,
    default: 0
  },
  infants: {
    type: Number,
    default: 0
  },
  travelClass: {
    type: String,
    enum: ['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST'],
    default: 'ECONOMY'
  },
  currencyCode: {
    type: String,
    default: 'INR'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Search', SearchSchema);