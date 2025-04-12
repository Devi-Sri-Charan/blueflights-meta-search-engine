import React from 'react';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { verifyFlightPrice } from '../services/api';

function FlightCard({ offer, dictionaries, setIsLoading, setError }) {
  const formatDuration = (duration) => {
    // Format PT2H30M to 2h 30m
    const match = duration.match(/PT(\d+)H(\d+)M/);
    if (match) {
      const [, hours, minutes] = match; // Removed unused '_'
      return `${hours}h ${minutes}m`;
    }
    return duration;
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const dateOptions = { day: 'numeric', month: 'short' };

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

  return (
    <Card className="mb-4 shadow-sm flight-card">
      <Card.Body>
        {offer.itineraries.map((itinerary, itineraryIndex) => (
          <div key={`itinerary-${itineraryIndex}`}>
            {itineraryIndex > 0 && <hr className="my-3" />}

            <Row className="mb-3">
              <Col>
                <h6 className="text-muted mb-1">
                  {itineraryIndex === 0 ? 'Outbound' : 'Return'} · {formatDuration(itinerary.duration)}
                </h6>
              </Col>
            </Row>

            {itinerary.segments.map((segment, segmentIndex) => {
              const departureInfo = formatDateTime(segment.departure.at);
              const arrivalInfo = formatDateTime(segment.arrival.at);

              return (
                <div key={`segment-${itineraryIndex}-${segmentIndex}`}>
                  {segmentIndex > 0 && (
                    <div className="connection-info text-center my-2">
                      <Badge bg="warning" text="dark">
                        Connection: {formatDuration(segment.connection || 'PT1H30M')}
                      </Badge>
                    </div>
                  )}

                  <Row className="align-items-center mb-3">
                    <Col md={2} className="text-center">
                      <div className="fw-bold">{departureInfo.time}</div>
                      <div className="small">{departureInfo.date}</div>
                      <div className="small text-muted">{segment.departure.iataCode}</div>
                    </Col>

                    <Col md={5} className="text-center">
                      <div className="flight-line">
                        <div className="airline">
                          <img 
                            src={`/api/placeholder/40/40`} 
                            alt={getAirlineName(segment.carrierCode)} 
                            className="airline-logo" 
                            width="40" 
                            height="40"
                          />
                        </div>
                        <div className="flight-info">
                          <div className="small">
                            {getAirlineName(segment.carrierCode)} {segment.number}
                          </div>
                          <div className="text-muted small">
                            {getAircraftName(segment.aircraft.code)}
                          </div>
                        </div>
                      </div>
                    </Col>

                    <Col md={2} className="text-center">
                      <div className="fw-bold">{arrivalInfo.time}</div>
                      <div className="small">{arrivalInfo.date}</div>
                      <div className="small text-muted">{segment.arrival.iataCode}</div>
                    </Col>

                    <Col md={3} className="text-center">
                      <Badge bg="info" className="me-2">
                        {segment.duration ? formatDuration(segment.duration) : 'N/A'}
                      </Badge>

                      <Badge bg={segment.numberOfStops === 0 ? 'success' : 'secondary'}>
                        {segment.numberOfStops === 0 ? 'Direct' : `${segment.numberOfStops} Stop(s)`}
                      </Badge>
                    </Col>
                  </Row>
                </div>
              );
            })}
          </div>
        ))}

        <hr />

        <Row className="align-items-center">
          <Col md={6}>
            <div className="d-flex align-items-center">
              <div className="me-3">
                <span className="fs-4 fw-bold text-primary">
                  ₹{parseFloat(offer.price.total).toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <Badge bg="secondary" className="me-2">
                  {offer.numberOfBookableSeats} seats left
                </Badge>
                <Badge bg="light" text="dark">
                  {offer.itineraries[0].segments[0].carrierCode}-{getAirlineName(offer.itineraries[0].segments[0].carrierCode)}
                </Badge>
              </div>
            </div>
          </Col>

          <Col md={6} className="text-end">
            <Button variant="success" onClick={handleBookNow}>
              <i className="bi bi-box-arrow-up-right me-2"></i>
              Book Now
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default FlightCard;
