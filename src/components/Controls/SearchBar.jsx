import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';
import '../../styles/glass.css';
import axios from 'axios';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

    // Close suggestions when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.trim().length < 2) {
                setSuggestions([]);
                return;
            }

            try {
                // Using Open-Meteo Geocoding API (Free, No Key)
                const response = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5&language=en&format=json`);
                if (response.data.results) {
                    setSuggestions(response.data.results);
                    setShowSuggestions(true);
                } else {
                    setSuggestions([]);
                }
            } catch (error) {
                console.error("Error fetching suggestions:", error);
                setSuggestions([]);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchSuggestions();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
        if (query.trim()) {
            onSearch(query);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (city) => {
        const locationQuery = `${city.name}, ${city.country}`; // Format: London, United Kingdom
        setQuery(locationQuery);
        onSearch(locationQuery);
        setShowSuggestions(false);
    };

    return (
        <div ref={wrapperRef} style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
            <form onSubmit={handleSearchSubmit} style={{ width: '100%' }}>
                <input
                    type="text"
                    className="glass-input"
                    placeholder="Search city..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (e.target.value.length === 0) setShowSuggestions(false);
                    }}
                    onFocus={() => {
                        if (suggestions.length > 0) setShowSuggestions(true);
                    }}
                    style={{ width: '100%', paddingLeft: '45px', boxSizing: 'border-box' }}
                />
                <button type="submit" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', padding: 0 }}>
                    <Search size={20} />
                </button>
            </form>

            {showSuggestions && suggestions.length > 0 && (
                <ul className="suggestion-dropdown">
                    {suggestions.map((city) => (
                        <li key={city.id} className="suggestion-item" onClick={() => handleSuggestionClick(city)}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <MapPin size={14} style={{ opacity: 0.5 }} />
                                <span>{city.name}</span>
                            </div>
                            <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>{city.country_code?.toUpperCase()}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;
