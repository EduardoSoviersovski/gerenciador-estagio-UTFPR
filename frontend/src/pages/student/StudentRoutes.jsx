import { Routes, Route, Navigate } from 'react-router-dom';
import { StudentHomePage } from './StudentHomePage';

export const StudentRoutes = () => (
  <Routes>
    <Route path="/" element={<StudentHomePage />} />
  </Routes>
);