import React, { useState, useEffect, useMemo } from 'react';
import { X, Search, User, Mail, Phone, Building, Lock } from 'lucide-react';
import { FormInput } from '../ui/FormInput';
import { FormSelect } from '../ui/FormSelect';
import { MenuItem } from '@mui/material';
import { FormAutocomplete } from '../ui/FormAutocomplete';
import { adminService } from '../../services/adminService';
import { UTFPR_DEPARTMENTS } from '../../constants/departments';
import Swal from 'sweetalert2';

interface AdvisorManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AdvisorManagementModal = ({ isOpen, onClose }: AdvisorManagementModalProps) => {
    const [advisorEmailsList, setAdvisorEmailsList] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [emailSearch, setEmailSearch] = useState('');
    const [loadedEmail, setLoadedEmail] = useState('');
    const [isGoogleLinked, setIsGoogleLinked] = useState(false);

    const [formData, setFormData] = useState({ name: '', email: '', phone: '', department: '' });
    const [originalData, setOriginalData] = useState({ name: '', email: '', phone: '', department: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            adminService.getAdvisorEmails().then(setAdvisorEmailsList).catch(console.error);
            handleReset();
        }
    }, [isOpen]);

    const handleReset = () => {
        setEmailSearch('');
        setLoadedEmail('');
        setFormData({ name: '', email: '', phone: '', department: '' });
        setOriginalData({ name: '', email: '', phone: '', department: '' });
        setErrors({});
        setIsGoogleLinked(false);
    };

    const handleClose = () => {
        handleReset();
        onClose();
    };

    const fetchAdvisorData = async (email: string) => {
        if (!email || !email.includes('@')) return;

        setIsLoading(true);
        try {
            const userData = await adminService.getUserByEmail(email);

            if (userData.role !== 'advisor') {
                Swal.fire({
                    icon: 'warning',
                    title: 'Usuário Incorreto',
                    text: 'Este e-mail pertence a um usuário que não é orientador.',
                    confirmButtonColor: '#1e293b'
                });
                handleReset();
                return;
            }

            const data = {
                name: userData.name || '',
                email: userData.email || '',
                phone: userData.phone || '',
                department: userData.department || ''
            };

            setFormData(data);
            setOriginalData(data);
            setErrors({});
            setLoadedEmail(email);
            setIsGoogleLinked(!!userData.google_id);

        } catch (error: any) {
            if (error.response?.status === 404) {
                Swal.fire({
                    icon: 'info',
                    title: 'Não Encontrado',
                    text: 'Nenhum orientador encontrado com este e-mail.',
                    confirmButtonColor: '#1e293b'
                });
                handleReset();
            }
        } finally {
            setIsLoading(false);
        }
    };

    const validateField = (name: string, value: string) => {
        if (!value) return '';
        switch (name) {
            case 'email':
                return !value.endsWith('@utfpr.edu.br') ? 'Deve terminar em @utfpr.edu.br' : '';
            case 'phone':
                return (value.length < 10 || value.length > 11) ? 'Obrigatório incluir o DDD (10-11 dígitos)' : '';
            default: return '';
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        let finalValue = value;

        if (name === 'phone') finalValue = finalValue.replace(/\D/g, '').substring(0, 11);
        if (name === 'name') finalValue = finalValue.replace(/[0-9!@#$%^&*()_+=[\]{};:"\\|,.<>/?-]/g, '');

        setFormData(prev => ({ ...prev, [name]: finalValue }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const isModified = useMemo(() => {
        if (!loadedEmail || emailSearch !== loadedEmail) return false;

        const hasChanges = formData.name !== originalData.name ||
            formData.email !== originalData.email ||
            formData.phone !== originalData.phone ||
            formData.department !== originalData.department;

        const hasNoErrors = Object.values(errors).every(err => err === '');

        return hasChanges && hasNoErrors;
    }, [formData, originalData, loadedEmail, emailSearch, errors]);

    const handleSave = async () => {
        const emailError = validateField('email', formData.email);
        const phoneError = validateField('phone', formData.phone);

        if (emailError || phoneError) {
            setErrors({ email: emailError, phone: phoneError });
            return;
        }

        if (formData.email !== originalData.email && advisorEmailsList.includes(formData.email)) {
            Swal.fire({
                icon: 'warning',
                title: 'E-mail em uso',
                text: 'O e-mail informado já está cadastrado para outro orientador no sistema. Escolha outro e-mail ou busque diretamente por este orientador na barra acima.',
                confirmButtonColor: '#1e293b'
            });
            return;
        }

        try {
            setIsLoading(true);

            await adminService.updateAdvisor(loadedEmail, formData);

            Swal.fire({
                icon: 'success',
                title: 'Sucesso',
                text: 'Dados do orientador atualizados!',
                confirmButtonColor: '#10b981'
            });
            handleClose();
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || 'Falha ao atualizar dados.';
            Swal.fire({ icon: 'error', text: errorMessage, confirmButtonColor: '#1e293b' });
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[999] bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4 animate-in fade-in duration-300">
            <div
                className="bg-white w-full max-w-4xl rounded-[32px] shadow-2xl flex flex-col overflow-hidden text-left border border-slate-100"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Gestão de Orientador</h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Atualização Cadastral</p>
                    </div>
                    <button onClick={handleClose} className="p-2 hover:bg-slate-200/60 rounded-full cursor-pointer transition-colors outline-none">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Search size={16} className="text-slate-400" />
                            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Buscar Orientador</span>
                        </div>
                        <FormAutocomplete
                            label="Pesquisar por E-mail Institucional"
                            name="search_email"
                            icon={Search}
                            value={emailSearch}
                            options={advisorEmailsList}
                            onChange={(e) => {
                                const newValue = e.target.value;
                                setEmailSearch(newValue);

                                if (newValue !== loadedEmail) {
                                    setLoadedEmail('');
                                    setOriginalData({ name: '', email: '', phone: '', department: '' });
                                    setErrors({});
                                }

                                if (advisorEmailsList.includes(newValue)) {
                                    fetchAdvisorData(newValue);
                                }
                            }}
                            onBlur={() => {
                                if (emailSearch && emailSearch !== loadedEmail) {
                                    fetchAdvisorData(emailSearch);
                                }
                            }}
                            placeholder="Selecione ou digite o e-mail..."
                        />
                    </div>

                    {(loadedEmail && originalData.name) ? (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4">
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                    <User size={16} className="text-emerald-500" />
                                    Dados do Perfil
                                </h3>
                                {isGoogleLinked && (
                                    <span className="flex items-center gap-1 text-[10px] font-black uppercase text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
                                        <Lock size={12} /> Conta Google
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput
                                    label="Nome Completo"
                                    name="name"
                                    icon={User}
                                    value={formData.name}
                                    onChange={handleChange}
                                    isEdit={true}
                                    isModified={formData.name !== originalData.name}
                                    disabled={isGoogleLinked}
                                    isGoogleLinked={isGoogleLinked}
                                    className={isGoogleLinked ? "cursor-not-allowed opacity-80" : ""}
                                />

                                <FormInput
                                    label="E-mail"
                                    name="email"
                                    icon={Mail}
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={errors.email}
                                    isEdit={true}
                                    isModified={formData.email !== originalData.email}
                                    disabled={isGoogleLinked}
                                    isGoogleLinked={isGoogleLinked}
                                    className={isGoogleLinked ? "cursor-not-allowed opacity-80" : ""}
                                />

                                <FormInput
                                    label="Telefone (DDD + Número)"
                                    name="phone"
                                    icon={Phone}
                                    value={formData.phone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={errors.phone}
                                    isEdit={true}
                                    isModified={formData.phone !== originalData.phone}
                                    placeholder="Ex: 41999999999"
                                />

                                <FormSelect
                                    label="Departamento"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    icon={Building}
                                    isEdit={true}
                                    isModified={formData.department !== originalData.department}
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled className="text-slate-400">Selecione um departamento...</MenuItem>
                                    {UTFPR_DEPARTMENTS.map(dept => (
                                        <MenuItem key={dept.value} value={dept.value}>{dept.label}</MenuItem>
                                    ))}
                                </FormSelect>
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* Footer */}
                <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                    <button
                        onClick={handleClose}
                        className="cursor-pointer px-6 py-2.5 text-[10px] font-black uppercase text-slate-500 hover:bg-slate-200 rounded-xl transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!isModified || isLoading}
                        className="cursor-pointer disabled:cursor-not-allowed px-8 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-40 hover:bg-emerald-700 transition-all shadow-sm"
                    >
                        {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </div>
        </div>
    );
};