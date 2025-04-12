import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form } from 'react-bootstrap';
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

  // Initialize flight offers
  useEffect(() => {
    if (results && results.length > 0) {
      setFlightOffers(results);
      // Get unique airlines from results
      const airlineSet = new Set();
      
      // Get unique stop counts
      const stopsSet = new Set();
      
      results.forEach(offer => {
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
    }
  }, [results]);

  // Apply filters and sorting
  useEffect(() => {
    if (flightOffers.length > 0) {
      // Filter by airline and stops
      let filtered = flightOffers.filter(offer => {
        let includeOffer = true;
        
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
  }, [flightOffers, selectedAirlines, selectedStops, sortOption]);

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

  // Handle sort change
  const handleSortChange = (option) => {
    setSortOption(option);
  };

  return (
    <div className="search-results">
      <h2 className="mb-4">Flight Search Results</h2>
      
      <Row>
        {/* Filters sidebar */}
        <Col md={3}>
          <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Filters</h5>
            </Card.Header>
            <Card.Body>
              <h6>Airlines</h6>
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
              
              <hr />
              
              <h6>Stops</h6>
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
            </Card.Body>
          </Card>
        </Col>
        
        {/* Results */}
        <Col md={9}>
          <SortingOptions 
            sortOption={sortOption} 
            onSortChange={handleSortChange} 
          />
          
          {filteredOffers.length === 0 ? (
            <div className="alert alert-info">
              No flights match your filters. Please try different filter options.
            </div>
          ) : (
            filteredOffers.map((offer, index) => (
              <FlightCard 
                key={`${offer.id}-${index}`}
                offer={offer}
                dictionaries={dictionaries}
                setIsLoading={setIsLoading}
                setError={setError}
              />
            ))
          )}
        </Col>
      </Row>
    </div>
  );
}

export default SearchResults;