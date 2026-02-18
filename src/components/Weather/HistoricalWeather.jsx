import React, { useState } from 'react';
import '../../styles/glass.css';

const HistoricalWeather = ({ onFetchHistorical, historicalData, unit }) => {
    const [date, setDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (date) {
            onFetchHistorical(date);
        }
    };

    return (
        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <h3>Historical Weather</h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '15px' }}>
                Enter a date in the past (Post 2008) to see historical data.
                <br />
                <span style={{ color: '#ffeb3b' }}>Note: Dependent on API Plan (Standard+ required).</span>
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                    type="date"
                    className="glass-input"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    required
                />
                <button type="submit" className="glass-button">Get History</button>
            </form>

            {historicalData && (
                <div className="glass-card" style={{ marginTop: '20px', animation: 'slideUp 0.5s' }}>
                    {historicalData.error ? (
                        <div style={{ color: '#ff6b6b' }}>
                            <strong>Error:</strong> {historicalData.error.info || "Access Restricted or Invalid Date"}
                        </div>
                    ) : (
                        <div>
                            <h4>Weather on {historicalData.historical?.[date]?.date}</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px' }}>
                                <div>
                                    <span style={{ opacity: 0.7 }}>Avg Temp</span>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                        {historicalData.historical[date].avgtemp}°{unit === 'm' ? 'C' : 'F'}
                                    </div>
                                </div>
                                <div>
                                    <span style={{ opacity: 0.7 }}>Min</span>
                                    <div>{historicalData.historical[date].mintemp}°</div>
                                </div>
                                <div>
                                    <span style={{ opacity: 0.7 }}>Max</span>
                                    <div>{historicalData.historical[date].maxtemp}°</div>
                                </div>
                                <div>
                                    <span style={{ opacity: 0.7 }}>Conditions</span>
                                    {/* Assuming hourly[0] has icons or checking mid-day */}
                                    <div>
                                        {/* Historical data often has 'hourly' array. We can take a representative sample or summarize. 
                                            The API response structure for historical is: historical: { "YYYY-MM-DD": { ... hourly: [...] } }
                                         */}
                                        {historicalData.historical[date].hourly?.[0]?.weather_descriptions?.[0]}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default HistoricalWeather;
