const amadeus = require('../utils/amadeus');

// Search for airports and cities
exports.searchLocations = async (req, res) => {
  try {
    const { keyword, subType } = req.query;
    
    if (!keyword) {
      return res.status(400).json({ error: 'Keyword is required' });
    }
    
    // console.log(`Searching locations with keyword: ${keyword}`);
    
    // Default to searching for airports and cities if subType not specified
    const locationType = subType || 'AIRPORT,CITY';
    
    // Call Amadeus API to search for locations
    const response = await amadeus.referenceData.locations.get({
      keyword,
      subType: locationType,
      'page[limit]': 10
    });
    
    // console.log(`Found ${response.data.length} locations`);
    
    // Return locations
    res.json(response.data);
    
  } catch (error) {
    console.error('Error searching locations:', error.response || error);
    res.status(500).json({ 
      error: error.description || 'Error searching locations',
      details: error.response ? error.response.result : error.message
    });
  }
};