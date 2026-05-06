import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useInternshipData = (ra: string | undefined | null) => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

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
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 400));

        const mockDatabase: Record<string, any> = {
          "1561464": {
            student: { 
              id: 101, 
              google_id: "102774325338101431184",
              name: "Pedro Tortola", 
              ra: "1561464", 
              email: "pedper@alunos.utfpr.edu.br",
              course: "Engenharia de Computação"
            },
            process: {
              id: 50,
              advisor_id: "117648604559387549217", 
              advisor_name: "Gabriel Godinho",
              advisor_email: "gabrielgodinho@alunos.utfpr.edu.br",
              company: { 
                name: "Google Cloud", 
                supervisor: "Heitor Amor",
                supervisor_email: "heitor.amor@google.com"
              },
              status: "ACTIVE",
              type: "NON_MANDATORY",
              startDate: "2026-02-15",
              weeklyHours: 30,
              sei_number: "23064.015432/2026-11"
            }
          }
        };

        const result = mockDatabase[ra as string];

        if (!result) {
          setError("NOT_FOUND");
          setData(null);
        } else {
          const studentUid = String(result.student.google_id).trim();
          const advisorUid = String(result.process.advisor_id).trim();

          const isOwner = role === 'student' && currentGoogleId === studentUid;
          const isAdvisor = role === 'advisor' && currentGoogleId === advisorUid;
          const isAdmin = role === 'admin';

          if (isOwner || isAdvisor || isAdmin) {
            setData(result);
            setError(null);
          } else {
            setError("UNAUTHORIZED");
            setData(null);
          }
        }
      } catch (err) {
        setError("ERROR");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ra, user]);

  return { data, loading, error };
};