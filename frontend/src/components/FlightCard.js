import React, { useState } from 'react';
import { Card, Row, Col, Badge, Button, Collapse } from 'react-bootstrap';
import { verifyFlightPrice } from '../services/api';

function FlightCard({ offer, dictionaries, setIsLoading, setError }) {
  const [showDetails, setShowDetails] = useState(false);

  const formatDuration = (duration) => {
    // Format PT2H30M to 2h 30m
    const match = duration.match(/PT(\d+)H(\d+)M/);
    if (match) {
      const [, hours, minutes] = match;
      return `${hours}h ${minutes}m`;
    }
    return duration;
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const dateOptions = { day: 'numeric', month: 'short', weekday: 'short' };

    const time = date.toLocaleTimeString('en-US', timeOptions);
    const dayMonth = date.toLocaleDateString('en-US', dateOptions);

    return { time, date: dayMonth };
  };

  const getAirlineName = (code) => {
    return dictionaries?.carriers?.[code] || code;
  };

  const getAircraftName = (code) => {
    return dictionaries?.aircraft?.[code] || code;
  };

  const calculateTotalStops = () => {
    let stops = 0;
    offer.itineraries.forEach(itinerary => {
      itinerary.segments.forEach(segment => {
        stops += segment.numberOfStops || 0;
      });
    });
    return stops;
  };

  const totalStops = calculateTotalStops();
  const totalDuration = offer.itineraries.reduce((total, itinerary) => {
    const match = itinerary.duration.match(/PT(\d+)H(\d+)M/);
    if (match) {
      const [, hours, minutes] = match;
      return total + (parseInt(hours) * 60 + parseInt(minutes));
    }
    return total;
  }, 0);

  const formatTotalDuration = () => {
    const hours = Math.floor(totalDuration / 60);
    const minutes = totalDuration % 60;
    return `${hours}h ${minutes}m`;
  };

  const handleBookNow = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await verifyFlightPrice(offer);

      const airlineCode = offer.itineraries[0].segments[0].carrierCode;
      const airlineName = getAirlineName(airlineCode)
        .toLowerCase()
        .replace(/\s+/g, '');

      const airlineWebsites = {
        AI: 'https://www.airindia.com',
        UK: 'https://www.airindiaexpress.in',
        SG: 'https://www.spicejet.com',
        IX: 'https://www.goindigo.in',
        G8: 'https://www.goair.in',
        I5: 'https://www.airasiago.com',
        QP: 'https://www.akasaair.com',
        EK: 'https://www.emirates.com',
        LH: 'https://www.lufthansa.com',
        BA: 'https://www.britishairways.com',
        QR: 'https://www.qatarairways.com',
        EY: 'https://www.etihad.com',
        TG: 'https://www.thaiairways.com',
        SQ: 'https://www.singaporeair.com',
      };

      const websiteUrl = airlineWebsites[airlineCode] || `https://www.${airlineName}.com`;

      window.open(websiteUrl, '_blank');
    } catch (error) {
      console.error('Error verifying flight price:', error);
      setError('Could not verify price. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get the first segment of the first itinerary for summary display
  const firstSegment = offer.itineraries[0].segments[0];
  const lastSegment = offer.itineraries[0].segments[offer.itineraries[0].segments.length - 1];
  const departureInfo = formatDateTime(firstSegment.departure.at);
  const arrivalInfo = formatDateTime(lastSegment.arrival.at);

  return (
    <Card className="mb-4 shadow flight-card">
      {/* Flight Summary (Always Visible) */}
      <Card.Body className="p-3 p-md-4">
        <Row className="align-items-center">
          {/* Airline Logo & Info */}
          <Col xs={12} md={2} className="mb-3 mb-md-0 text-center">
            <div className="airline-logo-container mb-2">
              <img 
                src={`/api/placeholder/50/50`} 
                alt={getAirlineName(firstSegment.carrierCode)} 
                className="airline-logo" 
                width="50" 
                height="50"
              />
            </div>
            <div className="airline-name">
              <strong>{getAirlineName(firstSegment.carrierCode)}</strong>
              <div className="flight-number small text-muted">{firstSegment.number}</div>
            </div>
          </Col>
          
          {/* Times & Cities */}
          <Col xs={12} md={5} className="mb-3 mb-md-0">
            <div className="d-flex justify-content-between align-items-center">
              {/* Departure */}
              <div className="text-center text-md-start">
                <div className="time fw-bold fs-5">{departureInfo.time}</div>
                <div className="airport fw-bold">{firstSegment.departure.iataCode}</div>
                <div className="date small text-muted">{departureInfo.date}</div>
              </div>
              
              {/* Flight Path */}
              <div className="flight-path text-center flex-grow-1 px-2">
                <div className="duration small text-muted mb-1">{formatTotalDuration()}</div>
                <div className="path-line">
                  <div className="path-dot"></div>
                  <div className="path-dash"></div>
                  <div className="path-plane">
                    <i className="bi bi-airplane"></i>
                  </div>
                  <div className="path-dash"></div>
                  <div className="path-dot"></div>
                </div>
                <div className="stops mt-1">
                  <Badge 
                    bg={totalStops === 0 ? "success" : totalStops === 1 ? "warning" : "secondary"}
                    text={totalStops === 1 ? "dark" : "white"}
                  >
                    {totalStops === 0 ? 'Direct' : `${totalStops} Stop${totalStops > 1 ? 's' : ''}`}
                  </Badge>
                </div>
              </div>
              
              {/* Arrival */}
              <div className="text-center text-md-end">
                <div className="time fw-bold fs-5">{arrivalInfo.time}</div>
                <div className="airport fw-bold">{lastSegment.arrival.iataCode}</div>
                <div className="date small text-muted">{arrivalInfo.date}</div>
              </div>
            </div>
          </Col>
          
          {/* Price & Action */}
          <Col xs={12} md={5}>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
              <div className="price-container text-center mb-3 mb-md-0">
                <div className="price-value fs-3 fw-bold text-primary">
                  ₹{parseFloat(offer.price.total).toLocaleString('en-IN')}
                </div>
                <div className="price-info">
                  <span className="badge bg-info text-white me-2">
                    {offer.numberOfBookableSeats} seats left
                  </span>
                </div>
              </div>
              <div className="action-container d-flex flex-column">
                <Button 
                  variant="success" 
                  size="lg" 
                  className="book-btn mb-2 px-4" 
                  onClick={handleBookNow}
                >
                  Book Now
                </Button>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  className="details-btn" 
                  onClick={() => setShowDetails(!showDetails)}
                >
                  {showDetails ? 'Hide Details' : 'Show Details'}
                </Button>
              </div>
            </div>
          </Col>
        </Row>
        
        {/* Expanded Flight Details */}
        <Collapse in={showDetails}>
          <div className="flight-details mt-4">
            <hr className="divider" />
            
            {offer.itineraries.map((itinerary, itineraryIndex) => (
              <div key={`itinerary-${itineraryIndex}`} className="mb-4">
                <h6 className="text-uppercase fw-bold text-secondary mb-3">
                  {itineraryIndex === 0 ? 'Outbound' : 'Return'} · {formatDuration(itinerary.duration)}
                </h6>
                
                {itinerary.segments.map((segment, segmentIndex) => {
                  const segDepartureInfo = formatDateTime(segment.departure.at);
                  const segArrivalInfo = formatDateTime(segment.arrival.at);
                  
                  return (
                    <div key={`segment-${itineraryIndex}-${segmentIndex}`} className="segment">
                      {segmentIndex > 0 && (
                        <div className="connection-info text-center my-3 position-relative">
                          <Badge bg="warning" text="dark" className="connection-badge">
                            <i className="bi bi-clock me-1"></i>
                            Connection: {formatDuration(segment.connection || 'PT1H30M')}
                          </Badge>
                        </div>
                      )}
                      
                      <div className="segment-details p-3 rounded bg-light mb-3">
                        <Row className="align-items-center">
                          {/* Airline Info */}
                          <Col md={3} className="text-center mb-3 mb-md-0">
                            <div className="d-flex align-items-center justify-content-center">
                              <img 
                                src={`/api/placeholder/40/40`} 
                                alt={getAirlineName(segment.carrierCode)} 
                                className="airline-logo me-2" 
                                width="40" 
                                height="40"
                              />
                              <div className="text-start">
                                <div className="fw-bold">{getAirlineName(segment.carrierCode)}</div>
                                <div className="small text-muted">Flight {segment.number}</div>
                              </div>
                            </div>
                          </Col>
                          
                          {/* Departure */}
                          <Col md={3} className="text-center mb-3 mb-md-0">
                            <div className="time fw-bold">{segDepartureInfo.time}</div>
                            <div className="date small">{segDepartureInfo.date}</div>
                            <div className="airport fw-bold">{segment.departure.iataCode}</div>
                          </Col>
                          
                          {/* Flight Info */}
                          <Col md={3} className="text-center mb-3 mb-md-0">
                            <div className="duration-badge">
                              <Badge bg="info" className="px-3 py-2">
                                <i className="bi bi-clock me-1"></i>
                                {formatDuration(segment.duration)}
                              </Badge>
                            </div>
                            <div className="aircraft small text-muted mt-2">
                              <i className="bi bi-airplane-engines me-1"></i>
                              {getAircraftName(segment.aircraft.code)}
                            </div>
                          </Col>
                          
                          {/* Arrival */}
                          <Col md={3} className="text-center">
                            <div className="time fw-bold">{segArrivalInfo.time}</div>
                            <div className="date small">{segArrivalInfo.date}</div>
                            <div className="airport fw-bold">{segment.arrival.iataCode}</div>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            
            {/* Fare Details */}
            <div className="fare-details mt-4 p-3 bg-light rounded">
              <h6 className="text-uppercase fw-bold text-secondary mb-3">Fare Details</h6>
              <Row>
                <Col md={6}>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <i className="bi bi-person me-2"></i>
                      Adults: {offer.travelerPricings ? offer.travelerPricings.filter(tp => tp.travelerType === 'ADULT').length : 'N/A'}
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-briefcase me-2"></i>
                      Cabin Class: {offer.travelerPricings ? offer.travelerPricings[0].fareDetailsBySegment[0].cabin : 'N/A'}
                    </li>
                  </ul>
                </Col>
                <Col md={6}>
                  <div className="d-flex justify-content-between">
                    <span>Base Fare:</span>
                    <span>₹{parseFloat(offer.price.base || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Taxes & Fees:</span>
                    <span>₹{(parseFloat(offer.price.total) - parseFloat(offer.price.base || 0)).toLocaleString('en-IN')}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold">
                    <span>Total:</span>
                    <span className="text-primary">₹{parseFloat(offer.price.total).toLocaleString('en-IN')}</span>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  );
}

export default FlightCard;