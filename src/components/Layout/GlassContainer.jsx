import React from 'react';
import '../../styles/glass.css';

const GlassContainer = ({ children }) => {
    return (
        <div className="glass-container">
            {children}
        </div>
    );
};

export default GlassContainer;
