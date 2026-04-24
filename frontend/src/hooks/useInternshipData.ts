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
              email: "pedper@alunos.utfpr.edu.br",
              course: "Engenharia de Computação"
            },
            process: {
              id: 50,
              advisor_id: "117648604559387549217", 
              advisor_name: "Godogodogodo",
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

        const result = mockDatabase[ra || ""];

        if (!result) {
          setError("Processo de estágio não localizado.");
        } else if (!user) {
          setError("Usuário não autenticado.");
        } else {
          const currentGoogleId = String(user.google_id);
          const studentGoogleId = String(result.student.google_id);
          const advisorIdInProcess = String(result.process.advisor_id);

          const isOwner = user.role === 'student' && currentGoogleId === studentGoogleId;
          const isAdvisor = user.role === 'supervisor' && currentGoogleId === advisorIdInProcess;

          if (isOwner || isAdvisor) {
            setData(result);
            setError(null);
          } else {
            setError("Você não possui permissão para visualizar este processo.");
          }
        }
      } catch (err) {
        setError("Erro ao carregar dados.");
      } finally {
        setLoading(false);
      }
    };

    if (ra && user) fetchData();
  }, [ra, user]);

  return { data, loading, error };
};