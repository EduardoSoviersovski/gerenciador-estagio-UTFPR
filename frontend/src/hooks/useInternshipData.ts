import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { studentService, StudentProcessResponse } from '../services/studentService';

export const useInternshipData = (processId: string | undefined | null) => {
  const { user } = useAuth();
  const [data, setData] = useState<StudentProcessResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      if (!processId) {
        setData(null);
        setError(null);
        setLoading(false);
        return;
      }

      const role = user.role?.toLowerCase().trim();

      try {
        setLoading(true);
        const result = await studentService.getProcessById(processId);

        if (!result || !result.process) {
          setError(role === 'student' ? "UNAUTHORIZED" : "NOT_FOUND");
          setData(null);
          return;
        }

        const studentUid = String(result.process?.student?.google_id).trim();
        const studentEmail = String(result.process?.student?.email).toLowerCase().trim();
        const currentGoogleId = String(user.google_id).trim();
        const currentUserEmail = String(user.email).toLowerCase().trim();
        const advisorUid = String(result.process?.process?.advisor_google_id).trim();

        const isOwner = role === 'student' && (
          (studentUid && studentUid === currentGoogleId) ||
          (!studentUid && studentEmail === currentUserEmail)
        );
        const isAdvisor = role === 'advisor' && currentGoogleId === advisorUid;
        const isAdmin = role === 'admin';
        console.log(isAdvisor);
        if (isOwner || isAdvisor || isAdmin) {
          setData(result);
          setError(null);
        } else {
          setError("UNAUTHORIZED");
          setData(null);
        }
      } catch (err: any) {
        setError(role === 'admin' ? "NOT_FOUND" : "UNAUTHORIZED");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [processId, user]);

  return { data, loading, error };
};