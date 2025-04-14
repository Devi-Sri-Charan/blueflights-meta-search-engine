import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchResults from '../SearchResults/SearchResults';
import SearchSummary from '../SearchSummary/SearchSummary';
import { searchFlights } from '../../services/api';
import './ResultsPage.css'; // Import your CSS file for custom styles

function ResultsPage() {
  const [searchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dictionaries, setDictionaries] = useState(null);
  
  // Create an object from searchParams for easier use
  const searchParamsObj = Object.fromEntries(searchParams.entries());

  useEffect(() => {
    // Convert searchParams to object
    const searchData = {};
    for (const [key, value] of searchParams.entries()) {
      searchData[key] = value;
    }

    // Validate required parameters
    if (!searchData.originLocationCode || !searchData.destinationLocationCode || !searchData.departureDate) {
      setError("Missing required search parameters");
      setIsLoading(false);
      return;
    }

    // Perform the search
    const performSearch = async () => {
      try {
        const response = await searchFlights(searchData);
        setSearchResults(response.data);
        setDictionaries(response.dictionaries);
        document.title = `${searchData.originLocationCode} to ${searchData.destinationLocationCode} - Blueflights`;
      } catch (error) {
        console.error("Error searching flights:", error);
        setError("Error searching flights. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [searchParams]);

  return (
    <div className="container mt-4">
      {/* Search Summary Card */}
      <SearchSummary searchParams={searchParamsObj} />
      
      {isLoading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Searching for the best flight deals...</p>
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger mt-4" role="alert">
          {error}
        </div>
      )}
      
      {searchResults && !isLoading && (
        <SearchResults 
          results={searchResults} 
          dictionaries={dictionaries}
          setIsLoading={setIsLoading}
          setError={setError}
        />
      )}
    </div>
  );
}

export default ResultsPage;