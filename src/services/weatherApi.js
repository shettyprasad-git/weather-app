import axios from 'axios';

const API_KEY = 'd320f824ad20434de10b210bffc54eee';
const BASE_URL = '/api/weather'; // Proxy path for local (Vite) and prod (Vercel)

const weatherApi = axios.create({
    baseURL: BASE_URL,
    params: {
        access_key: API_KEY,
    }
});

export const fetchCurrentWeather = async (query, units = 'm') => {
    try {
        const response = await weatherApi.get('/current', {
            params: { query, units }
        });
        if (response.data.error) {
            throw new Error(response.data.error.info);
        }
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchHistoricalWeather = async (query, date, units = 'm') => {
    try {
        const response = await weatherApi.get('/historical', {
            params: {
                query,
                historical_date: date,
                units
            }
        });
        if (response.data.error) {
            // Weatherstack returns 200 OK even for errors, but with an error object
            throw new Error(response.data.error.info);
        }
        return response.data;
    } catch (error) {
        throw error;
    }
};
