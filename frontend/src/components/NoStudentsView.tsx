import React from 'react';
import { UserPlus, Info, ArrowRight } from 'lucide-react';

export const NoStudentsView = () => {
    return (
        <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white rounded-[40px] border border-slate-200 p-12 text-center shadow-sm">
                <div className="inline-flex p-4 bg-blue-50 text-blue-600 rounded-3xl mb-6">
                    <UserPlus size={32} />
                </div>

                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-4">
                    Nenhum Aluno Vinculado
                </h2>

                <p className="text-slate-500 mb-10 max-w-md mx-auto leading-relaxed">
                    Você está autenticado como <span className="font-bold text-slate-700">Supervisor</span>,
                    mas ainda não existem alunos de estágio sob sua orientação registrados no sistema.
                </p>

                <div className="bg-slate-50 rounded-3xl p-8 mb-10 text-left border border-slate-100 flex gap-4 items-start">
                    <div className="p-2 bg-white rounded-xl shadow-sm text-blue-600 shrink-0">
                        <Info size={20} />
                    </div>
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 italic">
                            O que isso significa?
                        </h3>
                        <p className="text-xs font-medium text-slate-600 leading-relaxed">
                            Para visualizar o progresso, relatórios e documentos, os alunos precisam informar seu e-mail institucional no momento da abertura do processo no SEI ou o administrador deve realizar o vínculo manual.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};