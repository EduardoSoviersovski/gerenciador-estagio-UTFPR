import { Routes, Route, Navigate } from 'react-router-dom';
import { StudentHomePage } from './StudentHomePage';
import { Reports } from '../common/Reports';
import { Documents } from './Documents';
import { Logs } from './Logs';

export const StudentRoutes = () => (
  <Routes>
    <Route path="/" element={<StudentHomePage />} />
    <Route path="reports" element={<Reports />} />
    <Route path="documents" element={<Documents />} />
    <Route path="logs" element={<Logs />} />
  </Routes>
);