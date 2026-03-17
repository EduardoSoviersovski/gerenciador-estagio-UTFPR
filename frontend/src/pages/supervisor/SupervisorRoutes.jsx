import { Routes, Route } from 'react-router-dom';
import { SupervisorHomePage } from './SupervisorHomePage';

export const SupervisorRoutes = () => (
    <Routes>
        <Route path="/" element={<SupervisorHomePage />} />
    </Routes>
);