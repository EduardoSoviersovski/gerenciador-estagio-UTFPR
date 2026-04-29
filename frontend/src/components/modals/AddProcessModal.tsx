import React, { useState } from 'react';
import { X, Plus, User, Hash, Building2, FileText, Calendar } from 'lucide-react';

interface AddProcessModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (newProcess: any) => void;
}

export const AddProcessModal = ({ isOpen, onClose, onSuccess }: AddProcessModalProps) => {
    const [formData, setFormData] = useState({
        studentName: '',
        ra: '',
        company: '',
        seiNumber: '',
        startDate: '',
        advisorId: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Novo processo:", formData);
        onSuccess(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden border border-slate-100">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Novo Processo de Estágio</h2>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-1">Cadastro Manual de Documentação</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome do Aluno</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input required className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    onChange={e => setFormData({ ...formData, studentName: e.target.value })} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">RA (Registro Acadêmico)</label>
                            <div className="relative">
                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input required className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    onChange={e => setFormData({ ...formData, ra: e.target.value })} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Empresa Concedente</label>
                            <div className="relative">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input required className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    onChange={e => setFormData({ ...formData, company: e.target.value })} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Número do Processo SEI</label>
                            <div className="relative">
                                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input required placeholder="23064.XXXXXX/202X-XX" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    onChange={e => setFormData({ ...formData, seiNumber: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 rounded-2xl transition-all">
                            Cancelar
                        </button>
                        <button type="submit" className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
                            <Plus size={16} />
                            Criar Processo
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};