import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useInternshipData = (ra: string | undefined) => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        await new Promise(resolve => setTimeout(resolve, 600));

        const mockDatabase: Record<string, any> = {
          "1561464": {
            student: { 
              id: 101, 
              google_id: "102774325338101431184",
              name: "Pedro Tortola", 
              ra: "1561464", 
              email: "pedper@alunos.utfpr.edu.br" 
            },
            process: {
              id: 50,
              advisor_id: "107587443452051703746",
              company: { name: "Google Cloud", supervisor: "Heitor" },
              status: "ACTIVE",
              type: "NON_MANDATORY",
              startDate: "2026-02-15",
              weeklyHours: 30,
              sei_number: "23064.015432/2026-11"
            },
            goal: { total_target_hours: 400, reached_hours: 120 }
          }
        };

        const result = mockDatabase[ra || ""];

        if (!result) {
          setError("Processo de estágio não localizado para este RA.");
        } else if (!user) {
          setError("Usuário não autenticado.");
        } else {
          const currentGoogleId = String(user.google_id);
          const studentGoogleId = String(result.student.google_id);
          const advisorIdInProcess = String(result.process.advisor_id);

          const isOwner = user.role === 'student' && currentGoogleId === studentGoogleId;
          const isAdvisor = user.role === 'supervisor' && currentGoogleId === advisorIdInProcess;
          const isAdmin = user.role === 'admin';

          if (isOwner || isAdvisor || isAdmin) {
            setData(result);
            setError(null);
          } else {
            console.warn("Acesso Negado:", {
              tentouAcessar: ra,
              seuGoogleId: currentGoogleId,
              idEsperado: advisorIdInProcess,
              suaRole: user.role
            });
            setError("Você não possui permissão para visualizar este processo de estágio.");
          }
        }
      } catch (err) {
        setError("Erro interno ao carregar dados.");
      } finally {
        setLoading(false);
      }
    };

    if (ra && user) {
      fetchData();
    } else if (!ra) {
      setError("RA não informado.");
      setLoading(false);
    }
  }, [ra, user]);

  return { data, loading, error };
};