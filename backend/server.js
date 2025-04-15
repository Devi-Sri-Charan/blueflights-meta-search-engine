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
app.use(cors({
  origin: [
    'https://blueflights-meta-search-engine.vercel.app', // Remove trailing slash
    'http://localhost:3000' // For local development
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Routes
app.use('/api/flights', flightRoutes);
app.use('/api/airports', airportRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Blueflights API is running' });
});

// Add this after all other routes
app.all('/api/*', (req, res) => {
  console.log('Received unhandled API request:', req.path);
  res.status(404).json({ 
    error: 'Endpoint not found',
    requestedPath: req.path,
    availableEndpoints: [
      '/api/flights',
      '/api/airports',
      '/api/test'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
