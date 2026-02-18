import React, { useState } from 'react';
import { Search } from 'lucide-react';
import '../../styles/glass.css';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
            <input
                type="text"
                className="glass-input"
                placeholder="Search city..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ width: '100%', paddingLeft: '45px' }}
            />
            <Search
                size={20}
                style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.7)' }}
            />
        </form>
    );
};

export default SearchBar;
