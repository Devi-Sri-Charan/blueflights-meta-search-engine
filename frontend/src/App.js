import React from 'react';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import FlightSearch from './components/FlightSearch';
import SearchResults from './components/SearchResults';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css';

function App() {
  const [searchResults, setSearchResults] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [dictionaries, setDictionaries] = React.useState(null);

  const handleSearchResults = (results, dict) => {
    setSearchResults(results);
    setDictionaries(dict);
    window.scrollTo(0, 0);
  };

  return (
    <div className="app">
      <Header />
      <Container className="py-4">
        <FlightSearch 
          onSearchResults={handleSearchResults} 
          setIsLoading={setIsLoading}
          setError={setError}
        />
        
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
      </Container>
      <footer className="bg-dark text-light py-3 text-center">
        <Container>
          <p className="mb-0">© 2025 Blueflights - Flight Meta-Search Engine</p>
        </Container>
      </footer>
    </div>
  );
}

export default App;