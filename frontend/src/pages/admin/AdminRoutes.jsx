import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminHomePage } from './AdminHomePage';

export const AdministratorRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<AdminHomePage />} />
        </Routes>
    );
};