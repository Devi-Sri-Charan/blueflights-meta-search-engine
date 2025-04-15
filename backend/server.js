const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const flightRoutes = require('./routes/flights');
const airportRoutes = require('./routes/airports');

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/flights', flightRoutes);
app.use('/api/airports', airportRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Blueflights API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});