import React from 'react';
import { ButtonGroup, Button, Card, Dropdown } from 'react-bootstrap';
import './SortingOptions.css'; // Import your CSS file for custom styles

function SortingOptions({ sortOption, onSortChange, resultsCount }) {
  const getSortLabel = (option) => {
    switch (option) {
      case 'price-asc':
        return 'Price: Low to High';
      case 'price-desc':
        return 'Price: High to Low';
      case 'duration-asc':
        return 'Duration: Shortest';
      case 'duration-desc':
        return 'Duration: Longest';
      default:
        return 'Sort by';
    }
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body className="p-2 p-md-3">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
          <div className="mb-3 mb-md-0">
            <h6 className="mb-0 d-flex align-items-center">
              <i className="bi bi-sort-down me-2 text-primary"></i>
              Sort Results:
              {resultsCount !== undefined && (
                <span className="ms-2 badge bg-light text-dark">
                  {resultsCount} {resultsCount === 1 ? 'flight' : 'flights'}
                </span>
              )}
            </h6>
          </div>
          
          {/* Desktop view - buttons */}
          <div className="d-none d-md-block">
            <ButtonGroup>
              <Button 
                variant={sortOption === 'price-asc' ? 'primary' : 'outline-primary'}
                className="px-3"
                onClick={() => onSortChange('price-asc')}
              >
                <i className="bi bi-arrow-down me-1"></i>
                Price: Low to High
              </Button>
              <Button 
                variant={sortOption === 'price-desc' ? 'primary' : 'outline-primary'}
                className="px-3"
                onClick={() => onSortChange('price-desc')}
              >
                <i className="bi bi-arrow-up me-1"></i>
                Price: High to Low
              </Button>
              <Button 
                variant={sortOption === 'duration-asc' ? 'primary' : 'outline-primary'}
                className="px-3"
                onClick={() => onSortChange('duration-asc')}
              >
                <i className="bi bi-clock me-1"></i>
                Duration: Shortest
              </Button>
              <Button 
                variant={sortOption === 'duration-desc' ? 'primary' : 'outline-primary'}
                className="px-3"
                onClick={() => onSortChange('duration-desc')}
              >
                <i className="bi bi-clock-history me-1"></i>
                Duration: Longest
              </Button>
            </ButtonGroup>
          </div>
          
          {/* Mobile view - dropdown */}
          <div className="d-md-none w-100">
            <Dropdown className="w-100">
              <Dropdown.Toggle variant="primary" className="w-100 d-flex align-items-center justify-content-between">
                <span>
                  <i className="bi bi-sort-down me-2"></i>
                  {getSortLabel(sortOption)}
                </span>
                <i className="bi bi-chevron-down"></i>
              </Dropdown.Toggle>

              <Dropdown.Menu className="w-100">
                <Dropdown.Item 
                  active={sortOption === 'price-asc'}
                  onClick={() => onSortChange('price-asc')}
                >
                  <i className="bi bi-arrow-down me-2"></i>
                  Price: Low to High
                </Dropdown.Item>
                <Dropdown.Item 
                  active={sortOption === 'price-desc'}
                  onClick={() => onSortChange('price-desc')}
                >
                  <i className="bi bi-arrow-up me-2"></i>
                  Price: High to Low
                </Dropdown.Item>
                <Dropdown.Item 
                  active={sortOption === 'duration-asc'}
                  onClick={() => onSortChange('duration-asc')}
                >
                  <i className="bi bi-clock me-2"></i>
                  Duration: Shortest
                </Dropdown.Item>
                <Dropdown.Item 
                  active={sortOption === 'duration-desc'}
                  onClick={() => onSortChange('duration-desc')}
                >
                  <i className="bi bi-clock-history me-2"></i>
                  Duration: Longest
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default SortingOptions;