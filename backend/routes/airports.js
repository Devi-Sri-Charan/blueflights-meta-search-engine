const express = require('express');
const router = express.Router();
const airportController = require('../controllers/airportController');

// GET /api/airports/search - Search for airports and cities
router.get('/search', airportController.searchLocations);

module.exports = router;