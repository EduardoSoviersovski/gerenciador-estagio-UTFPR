import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdvisorHomePage } from './AdvisorHomePage';

export const AdvisorRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<AdvisorHomePage />} />
        </Routes>
    );
};