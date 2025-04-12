const Amadeus = require('amadeus');
require('dotenv').config(); // Ensure environment variables are loaded

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY,
  clientSecret: process.env.AMADEUS_API_SECRET
});

module.exports = amadeus;
