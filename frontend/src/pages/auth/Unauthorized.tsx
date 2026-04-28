import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { PATHS } from '../../routes/paths';

export const Unauthorized = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const handleBack = () => {
        if (user?.role === 'supervisor') {
            navigate('/supervisor', { replace: true });
        } else if (user?.role === 'student') {
            navigate('/student', { replace: true });
        } else {
            navigate('/', { replace: true });
        }
    };

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6">
            <div className="bg-white rounded-[48px] shadow-2xl p-12 w-full max-w-xl border border-slate-100 text-center animate-in fade-in zoom-in duration-500">
                <div className="inline-flex p-5 bg-red-50 text-red-600 rounded-[28px] mb-8">
                    <ShieldAlert size={48} />
                </div>

                <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-4">
                    Acesso Restrito
                </h1>

                <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                    Você não possui as permissões necessárias para acessar esta área do sistema.
                    Sua tentativa foi registrada por motivos de segurança.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={handleBack}
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all cursor-pointer"
                    >
                        <ArrowLeft size={16} />
                        Voltar ao Início
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all cursor-pointer"
                    >
                        <LogOut size={16} />
                        Trocar de Conta
                    </button>
                </div>
            </div>
        </div>
    );
};