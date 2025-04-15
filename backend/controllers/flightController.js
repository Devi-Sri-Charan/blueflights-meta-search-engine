const amadeus = require('../utils/amadeus');
const Search = require('../models/Search');

// Function to validate 3-letter airport codes
const isValidAirportCode = (code) => /^[A-Z]{3}$/.test(code);

// Search for flights
exports.searchFlights = async (req, res) => {
  try {
    let {
      originLocationCode,
      destinationLocationCode,
      departureDate,
      returnDate,
      adults = 1,
      children,
      infants,
      travelClass,
      currencyCode = 'INR',
      max = 20
    } = req.body;

    // Validate origin and destination codes
    if (!isValidAirportCode(originLocationCode) || !isValidAirportCode(destinationLocationCode)) {
      return res.status(400).json({ error: 'Invalid airport codes. They must be 3-letter IATA codes (e.g., DEL, BOM).' });
    }

    // Create search parameters
    const searchParams = {
      originLocationCode,
      destinationLocationCode,
      departureDate,
      adults,
      currencyCode
    };

    // Add optional parameters if provided
    if (returnDate) searchParams.returnDate = returnDate;
    if (children) searchParams.children = children;
    if (infants) searchParams.infants = infants;
    if (travelClass) searchParams.travelClass = travelClass;
    if (max) searchParams.max = max;

    // console.log('Searching flights with params:', searchParams);

    // Call Amadeus API
    const response = await amadeus.shopping.flightOffersSearch.get(searchParams);

    // Check if response contains data
    if (!response.data || response.data.length === 0) {
      return res.status(404).json({ error: 'No flight offers found for the given criteria.' });
    }

    // console.log(`Found ${response.data.length} flight offers`);

    // Save search to database
    await new Search(searchParams).save();

    // Return flight offers
    res.json({
      data: response.data,
      dictionaries: response.result.dictionaries
    });

  } catch (error) {
    console.error('Error searching flights:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Error searching flights',
      details: error.response?.data || error.message
    });
  }
};

// Verify flight price
exports.verifyPrice = async (req, res) => {
  try {
    const { flightOffer } = req.body;

    if (!flightOffer) {
      return res.status(400).json({ error: 'Flight offer data is required.' });
    }

    // console.log('Verifying price for flight offer');

    // Call Amadeus API to verify price
    const response = await amadeus.shopping.flightOffers.pricing.post(
      JSON.stringify({
        data: {
          type: 'flight-offers-pricing',
          flightOffers: [flightOffer]
        }
      })
    );

    res.json(response.data);

  } catch (error) {
    console.error('Error verifying flight price:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Error verifying flight price',
      details: error.response?.data || error.message
    });
  }
};

// Get recent searches
exports.getRecentSearches = async (req, res) => {
  try {
    const recentSearches = await Search.find().sort({ timestamp: -1 }).limit(10);
    res.json(recentSearches);
  } catch (error) {
    console.error('Error getting recent searches:', error.message);
    res.status(500).json({ error: 'Error getting recent searches' });
  }
};