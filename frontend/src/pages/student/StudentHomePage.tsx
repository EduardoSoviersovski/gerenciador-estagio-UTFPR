import React from 'react';
import { useAuth } from "../../contexts/AuthContext";
import { StudentPage } from '../common/StudentPage';
import { useNavigate } from 'react-router-dom';

export const StudentHomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAction = (tipo: string) => {
    if (tipo === 'reports') {
          navigate('/student/reports');
        } else if (tipo === 'docuements') {
          navigate('/student/documents');
        } else if (tipo === 'logs') {
          navigate('/student/logs');
        }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <h1 className="text-2xl font-bold">Menu Principal</h1>
      
      <StudentPage actions={{
        onReports: () => handleAction('reports'),
        onDocuments: () => handleAction('docuements'),
        onLog: () => handleAction('logs')
      }} />
    </div>
  );
};