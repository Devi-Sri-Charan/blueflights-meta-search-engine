import React from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';

function SortingOptions({ sortOption, onSortChange }) {
  return (
    <div className="mb-4 d-flex justify-content-between align-items-center">
      <div>
        <h6 className="mb-0">Sort by:</h6>
      </div>
      <div>
        <ButtonGroup>
          <Button 
            variant={sortOption === 'price-asc' ? 'primary' : 'outline-primary'}
            onClick={() => onSortChange('price-asc')}
          >
            Price: Low to High
          </Button>
          <Button 
            variant={sortOption === 'price-desc' ? 'primary' : 'outline-primary'}
            onClick={() => onSortChange('price-desc')}
          >
            Price: High to Low
          </Button>
          <Button 
            variant={sortOption === 'duration-asc' ? 'primary' : 'outline-primary'}
            onClick={() => onSortChange('duration-asc')}
          >
            Duration: Shortest
          </Button>
          <Button 
            variant={sortOption === 'duration-desc' ? 'primary' : 'outline-primary'}
            onClick={() => onSortChange('duration-desc')}
          >
            Duration: Longest
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}

export default SortingOptions;