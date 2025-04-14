import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import FlightSearch from './components/FlightSearch';
import ResultsPage from './components/ResultsPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Container className="py-4">
          <Routes>
            <Route path="/" element={<FlightSearch />} />
            <Route path="/results" element={<ResultsPage />} />
          </Routes>
        </Container>
        <footer className="bg-dark text-light py-3 text-center">
          <Container>
            <p className="mb-0">© 2025 Blueflights - Flight Meta-Search Engine</p>
          </Container>
        </footer>
      </div>
    </Router>
  );
}

export default App;