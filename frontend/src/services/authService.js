import api from './api';

export const authService = {
    getCurrentUser: async () => {
        try {
            const response = await api.get('/');
            return response.data.user;
        } catch (error) {
            throw error;
        }
    },

    getLoginUrl: () => 'http://localhost:8000/login',
    getLoggoutUrl: () => 'http://localhost:8000/logout'
};