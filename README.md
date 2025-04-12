Blueflights - Project README
Blueflights - MERN Stack Flight Search Engine
Blueflights is a full-stack flight search engine built using the **MERN stack** (MongoDB, Express, React,
Node.js) and integrates the **Amadeus Self-Service API** to deliver real-time flight data.
Features
- Flight search with parameters: origin, destination, dates, class, and passengers
- Airport autocomplete using IATA codes
- Real-time flight results from multiple airlines via Amadeus API
- Sort results by price, duration, stops, or airline
- Filter by number of stops or airline
- MongoDB Atlas integration for saving search history
- "Book Now" links redirect to official airline sites
Prerequisites
Blueflights - Project README
- Node.js (v14+)
- MongoDB Atlas account
- Amadeus developer account (Self-Service APIs)
Installation
Backend Setup
1. Clone the repository
```bash
git clone https://github.com/Devi-Sri-Charan/blueflights-meta-search-engine.git
cd blueflights-meta-search-engine
```
2. Install backend dependencies
```bash
cd backend
Blueflights - Project README
npm install
```
3. Create a `.env` file inside `backend/`
```env
AMADEUS_API_KEY=your_amadeus_api_key
AMADEUS_API_SECRET=your_amadeus_api_secret
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```
4. Run the backend server
```bash
npm start
```
Blueflights - Project README
Frontend Setup
1. Install frontend dependencies
```bash
cd ../frontend
npm install
```
2. Run the frontend server
```bash
npm start
```
MongoDB Atlas Setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
Blueflights - Project README
3. Set up a database user with read/write access
4. Whitelist your IP in "Network Access"
5. Copy the connection string and paste into `MONGODB_URI` in `.env`
Amadeus API Setup
1. Register at [Amadeus for Developers](https://developers.amadeus.com/)
2. Create an application to get your API credentials
3. Use Self-Service APIs
4. Add your credentials to `.env`
Testing Guide
Valid IATA Codes
Use these for sample searches:
- DEL (Delhi)
Blueflights - Project README
- BOM (Mumbai)
- BLR (Bangalore)
- HYD (Hyderabad)
- MAA (Chennai)
- CCU (Kolkata)
Search Parameters
| Field | Example | Notes |
|----------------|-------------|--------------------------------------|
| Origin | DEL | 3-letter IATA code |
| Destination | BOM | 3-letter IATA code |
| Departure Date | 2024-12-01 | Must be a future date |
| Return Date | Optional | Must be after the departure date |
| Adults | 19 | |
| Travel Class | ECONOMY / BUSINESS / FIRST | Case-sensitive |
Blueflights - Project README
API Endpoints (Backend)
| Route | Method | Description |
|---------------------------|--------|--------------------------------|
| /api/flights/search | POST | Search for flights |
| /api/flights/verify-price | POST | Verify flight pricing |
| /api/airports | GET | Autocomplete airport search |
| /api/search/history | GET | Fetch saved searches |
| /api/search/save | POST | Save a search entry |
Limitations
- API is limited by Amadeus Self-Service quota
- No booking users are redirected to airline websites
- Prices are displayed in INR () only
- Authentication is not implemented (demo mode)
Blueflights - Project README
Folder Structure
blueflights-meta-search-engine/
 backend/ # Express server + API routes
 .env # Add your environment config here
 frontend/ # React client app
 .gitignore # Ignores node_modules, .env, builds
 README.md # You're reading it
License
This project is for **educational and demo purposes** only. Not intended for production or commercial use.
---
Made with by [Charan](https://github.com/Devi-Sri-Charan)
