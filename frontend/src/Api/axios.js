import axios from 'axios';

// LOGIC:
// If we are in Production (Render), use relative path '/api/v1'
// If we are in Development (Localhost), use full URL 'http://localhost:5000/api/v1'
const BASE_URL = import.meta.env.PROD
    ? '/api/v1'
    : 'http://localhost:5000/api/v1';

export default axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});