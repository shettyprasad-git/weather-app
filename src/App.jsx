import React, { useState } from 'react';
import { fetchCurrentWeather, fetchHistoricalWeather } from './services/weatherApi';
import GlassContainer from './components/Layout/GlassContainer';
import SearchBar from './components/Controls/SearchBar';
import UnitToggle from './components/Controls/UnitToggle';
import CurrentWeather from './components/Weather/CurrentWeather';
import HistoricalWeather from './components/Weather/HistoricalWeather';
import { CloudOff } from 'lucide-react';
import './index.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [unit, setUnit] = useState('m'); // 'm' for Celsius, 'f' for Fahrenheit
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentQuery, setCurrentQuery] = useState('');

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    setHistoricalData(null); // Reset historical when searching new location
    setCurrentQuery(query);

    try {
      const data = await fetchCurrentWeather(query, unit);
      setWeatherData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleHistoricalSearch = async (date) => {
    if (!currentQuery) {
      setError("Please search for a location first.");
      return;
    }

    // Optimistic UI or separate loading for historical?
    // Let's just set loading false for now but show meaningful state in component if needed.
    // Actually passing a loading prop to HistoricalWeather would be better, but for now simple await is fine.

    try {
      const data = await fetchHistoricalWeather(currentQuery, date, unit);
      setHistoricalData(data);
    } catch (err) {
      // If it's a plan limit error, it usually comes as a 200 response with error field, handled in service.
      // But if it throws, we catch here.
      console.error("Historical fetch error", err);
      setHistoricalData({ error: { info: err.message || "Failed to fetch historical data" } });
    }
  };

  const toggleUnit = () => {
    setUnit(prev => prev === 'm' ? 'f' : 'm');
    // If we have data, we should refetch or convert. 
    // API supports 'units' param. Refetching is safer for accuracy.
    if (currentQuery) {
      // Trigger refetch effectively
      const newUnit = unit === 'm' ? 'f' : 'm';
      // We can't await here easily inside toggle, but we can fire and forget or use useEffect dependent on unit.
      // For simplicity, let's just clear data or let user search again? 
      // Better: auto-refetch
      setLoading(true);
      fetchCurrentWeather(currentQuery, newUnit)
        .then(data => {
          setWeatherData(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }
  };

  return (
    <div className="app-wrapper" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <GlassContainer>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <SearchBar onSearch={handleSearch} />
          <UnitToggle unit={unit} onToggle={toggleUnit} />
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.3)', borderRadius: '50%', borderTopColor: 'white', animation: 'spin 1s linear infinite' }}></div>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#ff6b6b', background: 'rgba(50,0,0,0.3)', borderRadius: '10px' }}>
            <CloudOff size={40} style={{ marginBottom: '10px' }} />
            <p>{error}</p>
          </div>
        )}

        {weatherData && !loading && !error && (
          <>
            <CurrentWeather data={weatherData} unit={unit} />
            <HistoricalWeather
              onFetchHistorical={handleHistoricalSearch}
              historicalData={historicalData}
              unit={unit}
            />
          </>
        )}

        {!weatherData && !loading && !error && (
          <div style={{ textAlign: 'center', padding: '60px', opacity: 0.6 }}>
            <h2>Weather App</h2>
            <p>Search for a city to get started</p>
          </div>
        )}
      </GlassContainer>

      <div style={{ marginTop: '20px', fontSize: '0.8rem', opacity: 0.5 }}>
        Weather data provided by Weatherstack
      </div>
    </div>
  );
}

export default App;
