import api from './api';
import { User } from '../types/api';

export const authService = {
    getCurrentUser: async (): Promise<User> => {
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