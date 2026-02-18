import React from 'react';
import '../../styles/glass.css';

const UnitToggle = ({ unit, onToggle }) => {
    return (
        <button className="glass-button" onClick={onToggle}>
            {unit === 'm' ? '°C' : '°F'}
        </button>
    );
};

export default UnitToggle;
