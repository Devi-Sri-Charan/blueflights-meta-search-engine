const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');

// POST /api/flights/search - Search for flights
router.post('/search', flightController.searchFlights);

// POST /api/flights/verify-price - Verify flight price
router.post('/verify-price', flightController.verifyPrice);

// GET /api/flights/recent-searches - Get recent searches
router.get('/recent-searches', flightController.getRecentSearches);

module.exports = router;