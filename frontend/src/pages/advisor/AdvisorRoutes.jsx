import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdvisorHomePage } from './AdvisorHomePage';

//TODO: adicionar redirecionamento de unauthorized

export const AdvisorRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<AdvisorHomePage />} />
        </Routes>
    );
};