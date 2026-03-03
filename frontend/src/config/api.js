export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

// In dev, call backend through Vite proxy to prevent CORS/network fetch errors.
export const API_FETCH_BASE = import.meta.env.DEV ? '/api' : API_BASE_URL
