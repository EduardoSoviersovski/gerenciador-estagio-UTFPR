import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { PATHS } from '../../routes/paths';
import { useAuth } from '../../contexts/AuthContext';

export const BackButton = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { ra } = useParams();
    const { user } = useAuth();

    const currentPath = location.pathname.toLowerCase();
    const studentRoot = PATHS.ALUNO.ROOT.toLowerCase();
    const advisorRoot = PATHS.ADVISOR.ROOT.toLowerCase();
    const adminRoot = PATHS.ADMIN.ROOT.toLowerCase();


    const isStudentHome = user?.role === 'student' && (
        (user.ra && currentPath === `${studentRoot}/${user.ra}`.toLowerCase()) ||
        (!user.ra && currentPath === studentRoot)
    );

    const isAdvisorHome = user?.role === 'advisor' && currentPath === advisorRoot;
    const isAdminHome = user?.role === 'admin' && currentPath === adminRoot;
    const isAuthPage = currentPath === PATHS.LOGIN.toLowerCase() || currentPath === PATHS.UNAUTHORIZED.toLowerCase();

    const hideButton = isStudentHome || isAdvisorHome || isAdminHome || isAuthPage;

    if (hideButton) {
        return <div className="w-20 shrink-0" />;
    }

    return (
        <div className="w-20 flex items-center justify-start shrink-0">
            <button
                onClick={() => navigate(-1)}
                className="cursor-pointer p-2 -ml-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all group flex items-center gap-1"
                title="Voltar"
            >
                <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">
                    Voltar
                </span>
            </button>
        </div>
    );
};