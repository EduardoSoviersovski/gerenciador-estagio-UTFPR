import React from 'react';
import { AlertCircle, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface UnregisteredStudentViewProps {
    userName: string;
    ra?: string | null;
}


export const UnregisteredStudentView = ({ userName, ra }: UnregisteredStudentViewProps) => {
    const { user } = useAuth();

    return (
        <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white rounded-[40px] border border-slate-200 p-12 text-center shadow-sm">
                <div className="inline-flex p-4 bg-amber-50 text-amber-600 rounded-3xl mb-6">
                    <AlertCircle size={32} />
                </div>

                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-4">
                    Processo não localizado
                </h2>

                <p className="text-slate-500 mb-10 max-w-md mx-auto">
                    Olá, <span className="font-bold text-slate-700">{userName}</span>.
                    {ra
                        ? <> Não encontramos nenhum processo de estágio vinculado ao RA (<span className="text-blue-600 font-bold">{ra}</span>).</>
                        : <> Não encontramos nenhum processo de estágio vinculado ao seu perfil em nossa base de dados.</>
                    }
                </p>
                {user?.role === 'student' &&
                    <div className="bg-slate-50 rounded-3xl p-8 mb-10 text-left border border-slate-100">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 text-center italic">
                            O que você pode fazer agora?
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex gap-3 text-xs font-medium text-slate-600">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                Verificar se o seu processo já foi devidamente registrado no sistema da UTFPR.
                            </li>
                            <li className="flex gap-3 text-xs font-medium text-slate-600">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                Entrar em contato com o Professor Responsável pelas Atividades de Estágio (PRAE) do seu curso.
                            </li>
                        </ul>
                    </div>
                }
            </div>
        </div>
    );
};