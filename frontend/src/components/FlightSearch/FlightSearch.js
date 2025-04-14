import React, { useState } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import AirportAutoComplete from '../AirportAutoComplete/AirportAutoComplete';
import './FlightSearch.css'; // Import your CSS file for styling

function FlightSearch() {
    const today = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        originLocationCode: '',
        destinationLocationCode: '',
        departureDate: '',
        returnDate: '',
        adults: 1,
        children: 0,
        infants: 0,
        travelClass: 'ECONOMY',
        currencyCode: 'INR'
    });

    const [tripType, setTripType] = useState('oneWay');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleLocationChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleTripTypeChange = (e) => {
        setTripType(e.target.value);
        if (e.target.value === 'oneWay') {
            setFormData((prevState) => ({
                ...prevState,
                returnDate: ''
            }));
        }
    };

    // Function to create the search URL with query parameters
    const createSearchUrl = () => {
        const searchParams = new URLSearchParams();
        
        // Add all search parameters
        for (const [key, value] of Object.entries(formData)) {
            if (key === 'returnDate' && tripType === 'oneWay') continue;
            if (value) searchParams.append(key, value);
        }
        
        return `/results?${searchParams.toString()}`;
    };

    return (
        <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">
                    <i className="bi bi-search me-2"></i>
                    Search Flights
                </h5>
            </Card.Header>
            <Card.Body>
                <Form action={createSearchUrl()} method="get" target="_blank">
                    <Row className="mb-3">
                        <Col md={12} className="mb-3">
                            <div className="d-flex">
                                <Form.Check
                                    type="radio"
                                    label="One Way"
                                    name="tripType"
                                    id="oneWay"
                                    value="oneWay"
                                    checked={tripType === 'oneWay'}
                                    onChange={handleTripTypeChange}
                                    className="me-4"
                                />
                                <Form.Check
                                    type="radio"
                                    label="Round Trip"
                                    name="tripType"
                                    id="roundTrip"
                                    value="roundTrip"
                                    checked={tripType === 'roundTrip'}
                                    onChange={handleTripTypeChange}
                                />
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <AirportAutoComplete
                                label="Origin"
                                placeholder="Enter city or airport"
                                onChange={(event) => handleLocationChange("originLocationCode", event.target.value)}
                                required
                            />
                            <input 
                                type="hidden" 
                                name="originLocationCode" 
                                value={formData.originLocationCode} 
                            />
                        </Col>
                        <Col md={6}>
                            <AirportAutoComplete
                                label="Destination"
                                placeholder="Enter city or airport"
                                onChange={(event) => handleLocationChange("destinationLocationCode", event.target.value)}
                                required
                            />
                            <input 
                                type="hidden" 
                                name="destinationLocationCode" 
                                value={formData.destinationLocationCode} 
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col md={tripType === 'roundTrip' ? 6 : 12}>
                            <Form.Group className="mb-3" controlId="departureDate">
                                <Form.Label>Departure Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="departureDate"
                                    value={formData.departureDate}
                                    onChange={handleInputChange}
                                    min={today}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        {tripType === 'roundTrip' && (
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="returnDate">
                                    <Form.Label>Return Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="returnDate"
                                        value={formData.returnDate}
                                        onChange={handleInputChange}
                                        min={formData.departureDate || today}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        )}
                    </Row>

                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3" controlId="adults">
                                <Form.Label>Adults</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="adults"
                                    value={formData.adults}
                                    onChange={handleInputChange}
                                    min="1"
                                    max="9"
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3" controlId="children">
                                <Form.Label>Children (2-11)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="children"
                                    value={formData.children}
                                    onChange={handleInputChange}
                                    min="0"
                                    max="9"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3" controlId="infants">
                                <Form.Label>Infants (0-23m)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="infants"
                                    value={formData.infants}
                                    onChange={handleInputChange}
                                    min="0"
                                    max="9"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-3" controlId="travelClass">
                                <Form.Label>Travel Class</Form.Label>
                                <Form.Select
                                    name="travelClass"
                                    value={formData.travelClass}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="ECONOMY">Economy</option>
                                    <option value="PREMIUM_ECONOMY">Premium Economy</option>
                                    <option value="BUSINESS">Business</option>
                                    <option value="FIRST">First Class</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="d-grid">
                        <Button variant="primary" type="submit" size="lg">
                            <i className="bi bi-search me-2"></i>
                            Search Flights
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
}

export default FlightSearch;