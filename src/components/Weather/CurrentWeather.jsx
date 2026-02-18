import React, { useState } from 'react';
import { Wind, Droplets, Gauge, Eye, CloudRain, Sun, Moon } from 'lucide-react';
import '../../styles/glass.css';

const CurrentWeather = ({ data, unit }) => {
    const { current, location } = data;
    const [showAstro, setShowAstro] = useState(false);
    const [showAirQuality, setShowAirQuality] = useState(false);

    if (!current || !location) return null;

    return (
        <div style={{ padding: '20px', color: 'white' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '2.5rem', margin: '0' }}>{location.name}</h2>
                <p style={{ opacity: 0.8, marginTop: '5px' }}>{location.country}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
                    <img src={current.weather_icons[0]} alt={current.weather_descriptions[0]} style={{ borderRadius: '10px', width: '80px', height: '80px' }} />
                    <div>
                        <h1 style={{ fontSize: '4rem', margin: '0', fontWeight: 'bold' }}>
                            {current.temperature}°{unit === 'm' ? 'C' : 'F'}
                        </h1>
                        <p style={{ fontSize: '1.2rem', margin: '0' }}>{current.weather_descriptions[0]}</p>
                    </div>
                </div>
            </div>

            {/* Grid for extra details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginTop: '30px' }}>
                <div className="glass-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                        <Wind size={20} /> <span style={{ opacity: 0.8 }}>Wind</span>
                    </div>
                    <div style={{ fontSize: '1.2rem' }}>{current.wind_speed} km/h {current.wind_dir}</div>
                </div>
                <div className="glass-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                        <Droplets size={20} /> <span style={{ opacity: 0.8 }}>Humidity</span>
                    </div>
                    <div style={{ fontSize: '1.2rem' }}>{current.humidity}%</div>
                </div>
                <div className="glass-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                        <Gauge size={20} /> <span style={{ opacity: 0.8 }}>Pressure</span>
                    </div>
                    <div style={{ fontSize: '1.2rem' }}>{current.pressure} mb</div>
                </div>
                <div className="glass-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                        <Eye size={20} /> <span style={{ opacity: 0.8 }}>Visibility</span>
                    </div>
                    <div style={{ fontSize: '1.2rem' }}>{current.visibility} km</div>
                </div>
            </div>

            {/* Additional Filters/Toggles */}
            <div style={{ marginTop: '30px', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '20px' }}>
                <h3 style={{ marginBottom: '15px' }}>Additional Filters & Data</h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                        className={`glass-button ${showAstro ? 'active' : ''}`}
                        onClick={() => setShowAstro(!showAstro)}
                        style={{ background: showAstro ? 'rgba(255,255,255,0.4)' : undefined }}
                    >
                        <Sun size={16} style={{ marginRight: '5px' }} /> Astro Data
                    </button>
                    {/* Air quality might not be available in standard response unless requested, but sticking to what's in 'current' object if available or simple toggle */}
                </div>
            </div>

            {/* Astro Data Section */}
            {showAstro && (
                <div className="glass-card" style={{ marginTop: '20px', animation: 'fadeIn 0.5s' }}>
                    <h4>Astronomy Data</h4>
                    {data.current.astro ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div>Sunrise: {data.current.astro.sunrise}</div>
                            <div>Sunset: {data.current.astro.sunset}</div>
                            <div>Moonrise: {data.current.astro.moonrise}</div>
                            <div>Moonset: {data.current.astro.moonset}</div>
                        </div>
                    ) : (
                        // Sometimes astro is not in 'current', it's in a separate 'astro' object in root, or inside forecast. 
                        // The documentation said 'astro' is invalid in 'current' for some plans? 
                        // Actually the example response showed "astro" KEY IS MISSING in "current" sometimes, but the doc example showed it inside "current" or root?
                        // Let's check the doc chunk again. 
                        // Chunk 4 showed: "current": { ... "astro": { ... } } 
                        // So it should be nested in current, or maybe at root level depending on endpoint.
                        // I'll check both locations or just handle missing.
                        <p>No astronomical data available for this view.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CurrentWeather;
