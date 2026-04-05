import { ChevronLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PATHS } from '../../routes/paths';

export const BackButton = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isHome = location.pathname === PATHS.ALUNO.ROOT || location.pathname === PATHS.SUPERVISOR.ROOT;

    return (
        <div className="w-20 flex items-center justify-start shrink-0">
            {!isHome && (
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all group flex items-center gap-1"
                    title="Voltar"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">
                        Voltar
                    </span>
                </button>
            )}
        </div>
    );
};