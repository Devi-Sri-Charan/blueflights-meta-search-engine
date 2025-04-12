import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Form, Spinner } from 'react-bootstrap';
import { searchAirports } from '../services/api';

function AirportAutoComplete({ label, placeholder, onChange, required }) {
  const [keyword, setKeyword] = useState('');
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Handle outside clicks to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        inputRef.current && !inputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Search function wrapped in useCallback
  const searchLocations = useCallback(async () => {
    if (!keyword || keyword.length < 2) return;

    setIsLoading(true);
    try {
      const data = await searchAirports(keyword);
      setLocations(data);
      setShowDropdown(true);
    } catch (error) {
      console.error('Error searching locations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [keyword]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (keyword && keyword.length >= 2) {
        searchLocations();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword, searchLocations]);

  const handleLocationSelect = (location) => {
    const display = `${location.name} (${location.iataCode})`;

    setKeyword(display);
    setSelectedLocation(location);
    setShowDropdown(false);

    if (onChange) {
      onChange({
        target: {
          name: inputRef.current ? inputRef.current.name : '',
          value: location.iataCode,
        }
      });
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setKeyword(value);

    if (selectedLocation && value !== `${selectedLocation.name} (${selectedLocation.iataCode})`) {
      setSelectedLocation(null);
      onChange({
        target: {
          value: '',
          name: e.target.name,
          display: value
        }
      });
    }

    if (!value) {
      setShowDropdown(false);
      setLocations([]);
    }
  };

  return (
    <div className="position-relative mb-3">
      <Form.Group controlId={`location-${label.toLowerCase().replace(/\s+/g, '-')}`}>
        <Form.Label>{label}</Form.Label>
        <div className="input-group">
          <Form.Control
            type="text"
            placeholder={placeholder}
            value={keyword}
            onChange={handleInputChange}
            onFocus={() => keyword.length >= 2 && setShowDropdown(true)}
            required={required}
            ref={inputRef}
            name={label.toLowerCase().replace(/\s+/g, '_')}
            autoComplete="off"
          />
          {isLoading && (
            <div className="input-group-append">
              <span className="input-group-text bg-white border-start-0">
                <Spinner animation="border" size="sm" />
              </span>
            </div>
          )}
        </div>
      </Form.Group>

      {showDropdown && locations.length > 0 && (
        <div
          ref={dropdownRef}
          className="dropdown-menu show w-100 airport-dropdown"
          style={{ maxHeight: '300px', overflowY: 'auto' }}
        >
          {locations.map((location) => (
            <button
              key={location.id}
              className="dropdown-item"
              type="button"
              onClick={() => handleLocationSelect(location)}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{location.name}</strong>
                  {location.address && (
                    <small className="text-muted d-block">
                      {location.address.cityName}, {location.address.countryName}
                    </small>
                  )}
                </div>
                <div className="badge bg-light text-dark">{location.iataCode}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {showDropdown && keyword.length >= 2 && locations.length === 0 && !isLoading && (
        <div className="dropdown-menu show w-100">
          <div className="dropdown-item disabled">No locations found</div>
        </div>
      )}
    </div>
  );
}

export default AirportAutoComplete;
