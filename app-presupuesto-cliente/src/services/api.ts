import axios from 'axios';

// Codificamos las credenciales en Base64 tal como lo espera el middleware del backend
const credentials = btoa(`${import.meta.env.VITE_API_USER}:${import.meta.env.VITE_API_PASSWORD}`);

export const api = axios.create({
    baseURL: 'http://localhost:3000/api', // La URL de tu backend
    headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
    }
});
