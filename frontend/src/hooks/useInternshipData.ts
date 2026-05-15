import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { studentService, StudentProcessResponse } from '../services/studentService';

export const useInternshipData = (ra: string | undefined | null) => {
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

      console.log(user);

      const role = user.role?.toLowerCase().trim();
      const currentGoogleId = String(user.google_id).trim();

      if (role === 'student') {
        if (ra && ra !== user.ra) {
          setError("UNAUTHORIZED");
          setLoading(false);
          return;
        }
        
        if (!ra && !user.ra) {
          setData(null);
          setError(null);
          setLoading(false);
          return;
        }
      }

      if (role === 'advisor' && !ra) {
        setError("UNAUTHORIZED");
        setLoading(false);
        return;
      }

      try {
        console.log()
        setLoading(true);
        const targetRa = (ra || user.ra) as string;

        const result = await studentService.getProcessByRA(targetRa);
        console.log(result);

        if (!result || !result.process) {
          setError("NOT_FOUND");
          setData(null);
          return;
        }

        const studentUid = String(result.process?.student?.google_id).trim();
        const advisorUid = String(result.process?.process?.advisor_google_id).trim();

        const isOwner = role === 'student' && currentGoogleId === studentUid;
        const isAdvisor = role === 'advisor' && currentGoogleId === advisorUid;
        const isAdmin = role === 'admin';

        console.log(isOwner, isAdmin, isAdvisor);

        if (isOwner || isAdvisor || isAdmin) {
          setData(result);
          setError(null);
        } else {
          setError("UNAUTHORIZED");
          setData(null);
        }

      } catch (err: any) {
        if (err.response?.status === 404) {
          setError("NOT_FOUND");
        } else if (err.response?.status === 401 || err.response?.status === 403) {
          setError("UNAUTHORIZED");
        } else {
          setError("ERROR");
        }
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ra, user]);

  return { data, loading, error };
};