import React, { useState, useEffect, useRef } from 'react';
import { FormInput } from '../ui/FormInput';
import { FormSelect } from '../ui/FormSelect';
import { FormAutocomplete } from '../ui/FormAutocomplete';
import { User, Mail, Phone, Building, Lock, Search, Plus, AlertCircle, Info } from 'lucide-react';
import { ProcessFormData } from '../../types';
import { MenuItem, SelectChangeEvent } from '@mui/material';
import { UTFPR_DEPARTMENTS } from '../../constants/departments';

interface SectionProps {
    formData: ProcessFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | SelectChangeEvent<any>) => void;
    handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    modifiedFields: string[];
    errors: Record<string, string>;
    isEdit: boolean;
    isGoogleLinked?: boolean;
    advisorEmailsList?: string[];
}

export const AdvisorSection = ({ formData, handleChange, handleBlur, modifiedFields, errors, isEdit, isGoogleLinked = false, advisorEmailsList = [] }: SectionProps) => {
    const [mode, setMode] = useState<'search' | 'create'>('search');

    const searchDataRef = useRef({
        advisor_email: '',
        advisor_name: '',
        advisor_phone: '',
        advisor_department: ''
    });

    const createDataRef = useRef({
        advisor_email: '',
        advisor_name: '',
        advisor_phone: '',
        advisor_department: ''
    });

    useEffect(() => {
        if (isEdit && formData.advisor_email && advisorEmailsList.length > 0) {
            if (!advisorEmailsList.includes(formData.advisor_email)) {
                setMode('create');
            }
        }
    }, [isEdit, advisorEmailsList, formData.advisor_email]);

    const handleModeSwitch = (newMode: 'search' | 'create') => {
        if (mode === newMode) return;

        const currentData = {
            advisor_email: formData.advisor_email || '',
            advisor_name: formData.advisor_name || '',
            advisor_phone: formData.advisor_phone || '',
            advisor_department: formData.advisor_department || ''
        };

        if (mode === 'search') {
            searchDataRef.current = currentData;
        } else {
            createDataRef.current = currentData;
        }

        setMode(newMode);

        const targetData = newMode === 'search' ? searchDataRef.current : createDataRef.current;

        const updateEvent = (name: string, value: string) => ({ target: { name, value } } as any);
        handleChange(updateEvent('advisor_email', targetData.advisor_email));
        handleChange(updateEvent('advisor_name', targetData.advisor_name));
        handleChange(updateEvent('advisor_phone', targetData.advisor_phone));
        handleChange(updateEvent('advisor_department', targetData.advisor_department));
    };

    const isExistingEmail = advisorEmailsList.includes(formData.advisor_email);

    const lockFields = mode === 'search' || isExistingEmail;

    const activeGoogleLinked = isGoogleLinked && isExistingEmail;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <User size={20} />
                </div>
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                        Dados do Orientador
                    </h3>
                    {activeGoogleLinked && (
                        <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                            <Lock size={12} /> Conta Google Vinculada
                        </span>
                    )}
                </div>
            </div>

            <div className="flex p-1 bg-slate-100/80 rounded-xl">
                <button
                    type="button"
                    onClick={() => handleModeSwitch('search')}
                    className={`flex items-center justify-center gap-2 flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${mode === 'search'
                        ? 'bg-white text-emerald-700 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                        }`}
                >
                    <Search size={14} />
                    Buscar Existente
                </button>
                <button
                    type="button"
                    onClick={() => handleModeSwitch('create')}
                    className={`flex items-center justify-center gap-2 flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${mode === 'create'
                        ? 'bg-white text-emerald-700 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                        }`}
                >
                    <Plus size={14} />
                    Cadastrar Novo
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start animate-in fade-in duration-300">
                {mode === 'search' ? (
                    <FormAutocomplete
                        label="Pesquisar por E-mail"
                        name="advisor_email"
                        icon={Search}
                        value={formData.advisor_email}
                        options={advisorEmailsList}
                        onChange={(e) => {
                            const novoEmail = e.target.value;
                            handleChange(e);
                            if (novoEmail !== formData.advisor_email) {
                                handleChange({ target: { name: 'advisor_name', value: '' } } as any);
                                handleChange({ target: { name: 'advisor_phone', value: '' } } as any);
                                handleChange({ target: { name: 'advisor_department', value: '' } } as any);
                            }
                        }}
                        onBlur={(e: any) => handleBlur(e)}
                        isEdit={isEdit}
                        isModified={modifiedFields.includes('advisor_email')}
                        error={errors.advisor_email}
                        placeholder="Selecione ou digite o e-mail..."
                    />
                ) : (
                    <div className="flex flex-col gap-1.5">
                        <FormInput
                            label="E-mail do Novo Orientador"
                            name="advisor_email"
                            icon={Mail}
                            value={formData.advisor_email}
                            onChange={handleChange as any}
                            onBlur={(e: any) => handleBlur(e)}
                            isModified={modifiedFields.includes('advisor_email')}
                            error={errors.advisor_email}
                            isEdit={isEdit}
                            placeholder="exemplo@utfpr.edu.br"
                        />
                        {isExistingEmail && (
                            <span className="flex items-center gap-1 text-[10px] font-black text-amber-600 uppercase tracking-widest ml-1 animate-in fade-in zoom-in duration-300">
                                <AlertCircle size={12} />
                                E-mail já cadastrado. Os dados serão carregados.
                            </span>
                        )}
                    </div>
                )}

                <FormInput
                    label="Nome do Orientador"
                    name="advisor_name"
                    icon={User}
                    value={formData.advisor_name}
                    onChange={handleChange as any}
                    onBlur={handleBlur}
                    isModified={modifiedFields.includes('advisor_name')}
                    error={errors.advisor_name}
                    isEdit={isEdit}
                    placeholder={lockFields ? "Preenchido automaticamente" : "Apenas letras"}
                    disabled={lockFields || activeGoogleLinked}
                    isGoogleLinked={activeGoogleLinked}
                />

                <FormInput
                    label="Telefone de Contato"
                    name="advisor_phone"
                    icon={Phone}
                    value={formData.advisor_phone}
                    onChange={handleChange as any}
                    onBlur={handleBlur}
                    isEdit={isEdit}
                    isModified={modifiedFields.includes('advisor_phone')}
                    error={errors.advisor_phone}
                    placeholder={lockFields ? "Preenchido automaticamente" : "Ex: 41999999999"}
                    disabled={lockFields}
                />

                <FormSelect
                    label="Departamento"
                    name="advisor_department"
                    value={formData.advisor_department || ''}
                    onChange={handleChange}
                    icon={Building}
                    isEdit={isEdit}
                    isModified={modifiedFields.includes('advisor_department')}
                    displayEmpty
                    disabled={lockFields}
                >
                    <MenuItem value="" disabled className="text-slate-400">
                        {lockFields ? "Preenchido automaticamente" : "Selecione o departamento..."}
                    </MenuItem>
                    {UTFPR_DEPARTMENTS.map(dept => (
                        <MenuItem key={dept.value} value={dept.value}>{dept.label}</MenuItem>
                    ))}
                </FormSelect>
            </div>

            {mode === 'search' && isExistingEmail && (
                <div className="flex items-center justify-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl animate-in fade-in zoom-in duration-300">
                    <Info size={16} className="text-slate-400 shrink-0" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
                        Para modificar os dados deste orientador, acesse: Gestão de Dados → Gestão de Orientador
                    </span>
                </div>
            )}
        </div>
    );
};