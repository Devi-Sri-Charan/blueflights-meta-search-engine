import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './SearchSummary.css'; // Import your CSS file for custom styles

function SearchSummary({ searchParams }) {
  // Extract search parameters
  const {
    originLocationCode,
    destinationLocationCode,
    departureDate,
    returnDate,
    adults,
    children,
    infants,
    travelClass
  } = searchParams;

  // Format dates
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Calculate total passengers
  const totalPassengers = 
    (parseInt(adults) || 0) + 
    (parseInt(children) || 0) + 
    (parseInt(infants) || 0);

  // Format class name
  const formatClass = (classCode) => {
    switch (classCode) {
      case 'ECONOMY': return 'Economy';
      case 'PREMIUM_ECONOMY': return 'Premium Economy';
      case 'BUSINESS': return 'Business';
      case 'FIRST': return 'First Class';
      default: return classCode;
    }
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Flight Search Summary</h5>
        <Link to="/">
          <Button variant="outline-light" size="sm">
            <i className="bi bi-arrow-left me-1"></i>
            Back to Search
          </Button>
        </Link>
      </Card.Header>
      <Card.Body>
        {/* Route display with arrow in the middle */}
        <div className="d-flex justify-content-center align-items-center mb-3">
          <div className="text-center">
            <div className="d-flex align-items-center">
              <h3 className="mb-0 me-3">{originLocationCode}</h3>
              <div className="d-flex flex-column align-items-center mx-3">
                <hr className="w-100 my-2" />
                <i className="bi bi-airplane fs-4 text-primary"></i>
              </div>
              <h3 className="mb-0 ms-3">{destinationLocationCode}</h3>
            </div>
          </div>
        </div>
        
        {/* Travel details */}
        <div className="row text-center">
          <div className="col">
            <div className="mb-2"><strong>Departure</strong></div>
            <div>{formatDate(departureDate)}</div>
          </div>
          
          {returnDate && (
            <div className="col">
              <div className="mb-2"><strong>Return</strong></div>
              <div>{formatDate(returnDate)}</div>
            </div>
          )}
          
          <div className="col">
            <div className="mb-2"><strong>Passengers</strong></div>
            <div>{totalPassengers} {totalPassengers === 1 ? 'traveler' : 'travelers'}</div>
          </div>
          
          <div className="col">
            <div className="mb-2"><strong>Class</strong></div>
            <div>{formatClass(travelClass)}</div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default SearchSummary;