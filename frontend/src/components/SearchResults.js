import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Badge, Accordion, Button } from 'react-bootstrap';
import FlightCard from './FlightCard';
import SortingOptions from './SortingOptions';

function SearchResults({ results, dictionaries, setIsLoading, setError }) {
  const [flightOffers, setFlightOffers] = useState([]);
  const [sortOption, setSortOption] = useState('price-asc');
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [stopOptions, setStopOptions] = useState([]);
  const [selectedStops, setSelectedStops] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000, current: 100000 });
  const [durationRange, setDurationRange] = useState({ min: 0, max: 3000, current: 3000 });
  const [showFilters, setShowFilters] = useState(false);
  const [searchSummary, setSearchSummary] = useState({
    origin: '',
    destination: '',
    date: '',
    passengers: 0
  });
  const validMinPrice = isNaN(priceRange.min) ? 0 : priceRange.min;
  const validMaxPrice = isNaN(priceRange.max) ? 10000 : priceRange.max;
  const validPriceValue = isNaN(priceRange.current) ? validMaxPrice : priceRange.current;

  const validMinDuration = isNaN(durationRange.min) ? 0 : durationRange.min;
  const validMaxDuration = isNaN(durationRange.max) ? 1440 : durationRange.max; // 24 hrs in mins
  const validDurationValue = isNaN(durationRange.current) ? validMaxDuration : durationRange.current;


  // Initialize flight offers
  useEffect(() => {
    if (results && results.length > 0) {
      setFlightOffers(results);

      // Get unique airlines from results
      const airlineSet = new Set();

      // Get unique stop counts
      const stopsSet = new Set();

      // Get price range
      let minPrice = Number.MAX_VALUE;
      let maxPrice = 0;

      // Get duration range
      let minDuration = Number.MAX_VALUE || Infinity;
      let maxDuration = 0;

      results.forEach(offer => {
        // Get price range
        const price = parseFloat(offer.price.total);
        minPrice = Math.min(minPrice, price);
        maxPrice = Math.max(maxPrice, price);

        // Get trip duration
        const duration = getDuration(offer);
        minDuration = Math.min(minDuration, duration);
        maxDuration = Math.max(maxDuration, duration);

        offer.itineraries.forEach(itinerary => {
          // Get airline codes
          itinerary.segments.forEach(segment => {
            airlineSet.add(segment.carrierCode);
          });

          // Get number of stops
          const stopCount = itinerary.segments.length - 1;
          stopsSet.add(stopCount);
        });
      });

      // Convert sets to arrays and sort
      const airlineArray = Array.from(airlineSet).sort();
      const stopsArray = Array.from(stopsSet).sort((a, b) => a - b);

      setAirlines(airlineArray);
      setSelectedAirlines(airlineArray); // Select all airlines by default

      setStopOptions(stopsArray);
      setSelectedStops(stopsArray); // Select all stop options by default

      // Set price range
      setPriceRange({
        min: Math.floor(minPrice),
        max: Math.ceil(maxPrice),
        current: Math.ceil(maxPrice)
      });

      // Set duration range
      setDurationRange({
        min: Math.floor(minDuration),
        max: Math.ceil(maxDuration),
        current: Math.ceil(maxDuration)
      });

      // Extract search summary from the first result
      if (results[0] && results[0].itineraries && results[0].itineraries.length > 0) {
        const firstItinerary = results[0].itineraries[0];
        const firstSegment = firstItinerary.segments[0];
        const lastSegment = firstItinerary.segments[firstItinerary.segments.length - 1];

        setSearchSummary({
          origin: firstSegment.departure.iataCode,
          destination: lastSegment.arrival.iataCode,
          date: new Date(firstSegment.departure.at).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }),
          passengers: results[0].numberOfBookableSeats || 1
        });
      }
    }
  }, [results]);

  // Apply filters and sorting
  useEffect(() => {
    if (flightOffers.length > 0) {
      // Filter by airline, stops, price and duration
      let filtered = flightOffers.filter(offer => {
        let includeOffer = true;

        // Check price filter
        const price = parseFloat(offer.price.total);
        if (price > priceRange.current) {
          includeOffer = false;
          return includeOffer;
        }

        // Check duration filter
        const duration = getDuration(offer);
        if (duration > durationRange.current) {
          includeOffer = false;
          return includeOffer;
        }

        // Check if any itinerary matches our filters
        for (const itinerary of offer.itineraries) {
          // Check airline filter
          const airlineMatch = itinerary.segments.every(segment =>
            selectedAirlines.includes(segment.carrierCode)
          );

          // Check stops filter
          const stopCount = itinerary.segments.length - 1;
          const stopsMatch = selectedStops.includes(stopCount);

          if (!airlineMatch || !stopsMatch) {
            includeOffer = false;
            break;
          }
        }

        return includeOffer;
      });

      // Apply sorting
      filtered = [...filtered].sort((a, b) => {
        switch (sortOption) {
          case 'price-asc':
            return parseFloat(a.price.total) - parseFloat(b.price.total);
          case 'price-desc':
            return parseFloat(b.price.total) - parseFloat(a.price.total);
          case 'duration-asc':
            return getDuration(a) - getDuration(b);
          case 'duration-desc':
            return getDuration(b) - getDuration(a);
          default:
            return 0;
        }
      });

      setFilteredOffers(filtered);
    }
  }, [flightOffers, selectedAirlines, selectedStops, sortOption, priceRange, durationRange]);

  // Helper to get total duration
  const getDuration = (offer) => {
    let totalDuration = 0;
    offer.itineraries.forEach(itinerary => {
      totalDuration += parseInt(itinerary.duration.replace(/PT(\d+)H(\d+)M/, (_, hours, minutes) => {
        return parseInt(hours) * 60 + parseInt(minutes);
      }));
    });
    return totalDuration;
  };

  // Toggle all airlines
  const toggleAllAirlines = (select) => {
    setSelectedAirlines(select ? [...airlines] : []);
  };

  // Toggle all stops
  const toggleAllStops = (select) => {
    setSelectedStops(select ? [...stopOptions] : []);
  };

  // Handle airline filter change
  const handleAirlineChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setSelectedAirlines([...selectedAirlines, value]);
    } else {
      setSelectedAirlines(selectedAirlines.filter(airline => airline !== value));
    }
  };

  // Handle stops filter change
  const handleStopsChange = (e) => {
    const { value, checked } = e.target;
    const stopValue = parseInt(value);

    if (checked) {
      setSelectedStops([...selectedStops, stopValue]);
    } else {
      setSelectedStops(selectedStops.filter(stop => stop !== stopValue));
    }
  };

  // Handle price range change
  const handlePriceChange = (e) => {
    setPriceRange(prev => ({
      ...prev,
      current: parseInt(e.target.value)
    }));
  };

  // Handle duration range change
  const handleDurationChange = (e) => {
    setDurationRange(prev => ({
      ...prev,
      current: parseInt(e.target.value)
    }));
  };

  // Handle sort change
  const handleSortChange = (option) => {
    setSortOption(option);
  };

  // Format duration for display
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Format price for display
  const formatPrice = (price) => {
    return `₹${parseInt(price).toLocaleString('en-IN')}`;
  };

  // Toggle filters on mobile
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  console.log(searchSummary)

  return (
    <div className="search-results">
      <div className="search-summary bg-light p-3 rounded mb-4 shadow-sm">
        <Row className="align-items-center">
          {/* <Col md={6}>
            <h5 className="mb-0">
              <i className="bi bi-airplane me-2 text-primary"></i>
              {searchSummary.origin} to {searchSummary.destination}
            </h5>
            <p className="text-muted mb-0">
              {searchSummary.date}
            </p>
          </Col> */}
          <Col md={6} className="d-flex justify-content-between align-items-center mt-2 mt-md-0">
            <Button
              variant="outline-primary"
              size="sm"
              className="d-md-none"
              onClick={toggleFilters}
            >
              <i className="bi bi-sliders me-1"></i>
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>

            <Badge bg="success" className="me-2">
              <i className="bi bi-check-circle-fill me-1"></i>
              {filteredOffers.length} Flights Found
            </Badge>
          </Col>

        </Row>
      </div>

      <Row>
        {/* Filters sidebar */}
        <Col md={3} className={`filters-sidebar ${showFilters ? 'd-block' : 'd-none d-md-block'}`}>
          <Card className="mb-4 shadow-sm filter-card sticky-md-top" style={{ top: '20px' }}>
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="bi bi-funnel-fill me-2"></i>
                Filters
              </h5>
              <Button
                variant="outline-light"
                size="sm"
                className="d-md-none"
                onClick={toggleFilters}
              >
                <i className="bi bi-x-lg"></i>
              </Button>
            </Card.Header>
            <Card.Body>
              <Accordion defaultActiveKey={['0', '1', '2']} alwaysOpen>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Price Range</Accordion.Header>
                  <Accordion.Body>
                    <Form.Label className="d-flex justify-content-between">
                      <span>Max Price: {formatPrice(priceRange.current)}</span>
                      <span className="text-muted">
                        {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
                      </span>
                    </Form.Label>
                    <Form.Range
                      min={validMinPrice}
                      max={validMaxPrice}
                      step={500}
                      value={validPriceValue}
                      onChange={handlePriceChange}
                      className="mb-3"
                    />
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                  <Accordion.Header>Duration</Accordion.Header>
                  <Accordion.Body>
                    <Form.Label className="d-flex justify-content-between">
                      <span>Max Duration: {formatDuration(durationRange.current)}</span>
                      {/* <span className="text-muted">
                        {formatDuration(durationRange.min)} - {formatDuration(durationRange.max)}
                      </span> */}
                    </Form.Label>
                    <Form.Range
                      min={validMinDuration}
                      max={validMaxDuration}
                      step={30}
                      value={validDurationValue}
                      onChange={handleDurationChange}
                      className="mb-3"
                    />
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                  <Accordion.Header>Airlines</Accordion.Header>
                  <Accordion.Body>
                    <div className="d-flex justify-content-between mb-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => toggleAllAirlines(true)}
                      >
                        Select All
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => toggleAllAirlines(false)}
                      >
                        Clear All
                      </Button>
                    </div>
                    {airlines.map(airline => (
                      <Form.Check
                        key={airline}
                        type="checkbox"
                        id={`airline-${airline}`}
                        label={dictionaries && dictionaries.carriers ? dictionaries.carriers[airline] : airline}
                        value={airline}
                        checked={selectedAirlines.includes(airline)}
                        onChange={handleAirlineChange}
                        className="mb-2"
                      />
                    ))}
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="3">
                  <Accordion.Header>Stops</Accordion.Header>
                  <Accordion.Body>
                    <div className="d-flex justify-content-between mb-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => toggleAllStops(true)}
                      >
                        Select All
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => toggleAllStops(false)}
                      >
                        Clear All
                      </Button>
                    </div>
                    {stopOptions.map(stop => (
                      <Form.Check
                        key={`stop-${stop}`}
                        type="checkbox"
                        id={`stop-${stop}`}
                        label={stop === 0 ? 'Non-stop' : stop === 1 ? '1 Stop' : `${stop} Stops`}
                        value={stop}
                        checked={selectedStops.includes(stop)}
                        onChange={handleStopsChange}
                        className="mb-2"
                      />
                    ))}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Card.Body>
          </Card>
        </Col>

        {/* Results */}
        <Col md={9}>
          <SortingOptions
            sortOption={sortOption}
            onSortChange={handleSortChange}
            resultsCount={filteredOffers.length}
          />

          {filteredOffers.length === 0 ? (
            <div className="alert alert-info text-center p-4">
              <i className="bi bi-exclamation-circle display-4 d-block mb-3 text-warning"></i>
              <h4>No flights match your filters</h4>
              <p>Please try different filter options or adjust your price/duration ranges.</p>
              <Button
                variant="primary"
                onClick={() => {
                  setSelectedAirlines([...airlines]);
                  setSelectedStops([...stopOptions]);
                  setPriceRange(prev => ({ ...prev, current: prev.max }));
                  setDurationRange(prev => ({ ...prev, current: prev.max }));
                }}
              >
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="flight-results-container">
              {filteredOffers.map((offer, index) => (
                <FlightCard
                  key={`${offer.id}-${index}`}
                  offer={offer}
                  dictionaries={dictionaries}
                  setIsLoading={setIsLoading}
                  setError={setError}
                />
              ))}

              {filteredOffers.length > 5 && (
                <div className="text-center my-4">
                  <p className="text-muted">
                    Showing all {filteredOffers.length} flights that match your criteria
                  </p>
                  <Button
                    variant="outline-primary"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    <i className="bi bi-arrow-up-circle me-2"></i>
                    Back to Top
                  </Button>
                </div>
              )}
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default SearchResults;