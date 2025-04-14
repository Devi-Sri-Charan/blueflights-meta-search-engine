import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Form, Spinner } from 'react-bootstrap';
import { searchAirports } from '../services/api';

function AirportAutoComplete({ label, placeholder, onChange, required }) {
  const [keyword, setKeyword] = useState('');
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [recentSelections, setRecentSelections] = useState([]);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Load recent selections from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(`recent_${label.toLowerCase()}`);
    if (stored) {
      try {
        setRecentSelections(JSON.parse(stored).slice(0, 3));
      } catch (e) {
        console.error('Error parsing recent selections', e);
      }
    }
  }, [label]);

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

  const saveToRecentSelections = (location) => {
    const newRecent = [
      location,
      ...recentSelections.filter(item => item.iataCode !== location.iataCode)
    ].slice(0, 3);
    
    setRecentSelections(newRecent);
    localStorage.setItem(`recent_${label.toLowerCase()}`, JSON.stringify(newRecent));
  };

  const handleLocationSelect = (location) => {
    const display = `${location.name} (${location.iataCode})`;

    setKeyword(display);
    setSelectedLocation(location);
    setShowDropdown(false);
    saveToRecentSelections(location);

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
    } else if (value.length >= 2) {
      setShowDropdown(true);
    }
  };

  const handleInputFocus = () => {
    if (keyword.length >= 2) {
      setShowDropdown(true);
    } else if (recentSelections.length > 0) {
      setLocations([]);
      setShowDropdown(true);
    }
  };

  return (
    <div className="position-relative mb-3">
      <Form.Group controlId={`location-${label.toLowerCase().replace(/\s+/g, '-')}`}>
        <Form.Label className="fw-bold">{label}</Form.Label>
        <div className="input-group input-group-lg shadow-sm">
          <span className="input-group-text bg-light border-end-0">
            <i className="bi bi-geo-alt text-primary"></i>
          </span>
          <Form.Control
            type="text"
            className="form-control border-start-0"
            placeholder={placeholder}
            value={keyword}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            required={required}
            ref={inputRef}
            name={label.toLowerCase().replace(/\s+/g, '_')}
            autoComplete="off"
          />
          {isLoading && (
            <div className="input-group-text bg-white border-start-0">
              <Spinner animation="border" size="sm" />
            </div>
          )}
        </div>
      </Form.Group>

      {showDropdown && (
        <div
          ref={dropdownRef}
          className="dropdown-menu show w-100 airport-dropdown shadow"
          style={{ maxHeight: '300px', overflowY: 'auto' }}
        >
          {recentSelections.length > 0 && keyword.length < 2 && (
            <>
              <h6 className="dropdown-header">Recent Selections</h6>
              {recentSelections.map((location) => (
                <button
                  key={`recent-${location.iataCode}`}
                  className="dropdown-item recent-item"
                  type="button"
                  onClick={() => handleLocationSelect(location)}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <i className="bi bi-clock-history me-2 text-muted"></i>
                      <strong>{location.name}</strong>
                      {location.address && (
                        <small className="text-muted d-block ms-4">
                          {location.address.cityName}, {location.address.countryName}
                        </small>
                      )}
                    </div>
                    <div className="badge bg-light text-dark">{location.iataCode}</div>
                  </div>
                </button>
              ))}
              {keyword.length < 2 && locations.length === 0 && <div className="dropdown-divider"></div>}
            </>
          )}

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
                <div className="badge bg-primary text-white">{location.iataCode}</div>
              </div>
            </button>
          ))}

          {showDropdown && keyword.length >= 2 && locations.length === 0 && !isLoading && (
            <div className="dropdown-item disabled text-center py-3">
              <i className="bi bi-search me-2"></i>
              No locations found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AirportAutoComplete;