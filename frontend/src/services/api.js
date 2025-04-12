const API_URL = 'http://localhost:5000/api';

// Search for flights
export const searchFlights = async (searchData) => {
  try {
    const response = await fetch(`${API_URL}/flights/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error searching flights');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in searchFlights:', error);
    throw error;
  }
};

// Verify flight price
export const verifyFlightPrice = async (flightOffer) => {
  try {
    const response = await fetch(`${API_URL}/flights/verify-price`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ flightOffer }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error verifying flight price');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in verifyFlightPrice:', error);
    throw error;
  }
};

// Search for airports and cities
export const searchAirports = async (keyword) => {
  try {
    const response = await fetch(`${API_URL}/airports/search?keyword=${encodeURIComponent(keyword)}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error searching airports');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in searchAirports:', error);
    throw error;
  }
};

// Get recent searches
export const getRecentSearches = async () => {
  try {
    const response = await fetch(`${API_URL}/flights/recent-searches`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error getting recent searches');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getRecentSearches:', error);
    throw error;
  }
};