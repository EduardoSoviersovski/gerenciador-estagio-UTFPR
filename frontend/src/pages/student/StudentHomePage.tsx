import React from 'react';
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import { ActionMenu } from '../../components/ActionMenu';

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

      <ActionMenu actions={{
        onReports: () => handleAction('reports'),
        onDocuments: () => handleAction('docuements'),
        onLog: () => handleAction('logs')
      }} />
    </div>
  );
};