import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SupervisorHomePage } from './SupervisorHomePage';

export const SupervisorRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<SupervisorHomePage />} />
        </Routes>
    );
};