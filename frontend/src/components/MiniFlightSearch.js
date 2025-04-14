import React, { useState } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import AirportAutoComplete from './AirportAutoComplete';
import { searchFlights } from '../services/api';

function MiniFlightSearch({ onSearchResults, setIsLoading, setError }) {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (!formData.originLocationCode || !formData.destinationLocationCode) {
            setError("Please select valid airports.");
            setIsLoading(false);
            return;
        }

        const searchData = { ...formData };

        if (tripType === "oneWay") {
            delete searchData.returnDate;
        }

        try {
            const response = await searchFlights(searchData);
            onSearchResults(response.data, response.dictionaries);
        } catch (error) {
            console.error("Error searching flights:", error);
            setError("Error searching flights. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="mb-4 shadow-sm mini-flight-search">
            <Card.Body>
                <Form onSubmit={handleSubmit} className="compact-form">
                    <Row className="align-items-end">
                        <Col md={1} className="mb-2">
                            <div className="d-flex">
                                <Form.Check
                                    type="radio"
                                    label="One Way"
                                    name="tripType"
                                    id="miniOneWay"
                                    value="oneWay"
                                    checked={tripType === 'oneWay'}
                                    onChange={handleTripTypeChange}
                                    className="me-2"
                                />
                                <Form.Check
                                    type="radio"
                                    label="Round"
                                    name="tripType"
                                    id="miniRoundTrip"
                                    value="roundTrip"
                                    checked={tripType === 'roundTrip'}
                                    onChange={handleTripTypeChange}
                                />
                            </div>
                        </Col>

                        <Col md={2} className="mb-2">
                            <AirportAutoComplete
                                label="From"
                                placeholder="Origin"
                                onChange={(event) => handleLocationChange("originLocationCode", event.target.value)}
                                required
                            />
                        </Col>
                        
                        <Col md={2} className="mb-2">
                            <AirportAutoComplete
                                label="To"
                                placeholder="Destination"
                                onChange={(event) => handleLocationChange("destinationLocationCode", event.target.value)}
                                required
                            />
                        </Col>

                        <Col md={2} className="mb-2">
                            <Form.Group controlId="miniDepartureDate">
                                <Form.Label>Departure</Form.Label>
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
                            <Col md={2} className="mb-2">
                                <Form.Group controlId="miniReturnDate">
                                    <Form.Label>Return</Form.Label>
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

                        <Col md={1} className="mb-2">
                            <Form.Group controlId="miniAdults">
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

                        <Col md={2} className="mb-2">
                            <Form.Group controlId="miniTravelClass">
                                <Form.Label>Class</Form.Label>
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

                        <Col md={2} className="mb-2">
                            <Button variant="primary" type="submit" className="w-100">
                                <i className="bi bi-search me-2"></i>
                                Search
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    );
}

export default MiniFlightSearch;