import React, { useState, useEffect, useRef } from 'react';
import { FormInput } from '../ui/FormInput';
import { FormSelect } from '../ui/FormSelect';
import { FormAutocomplete } from '../ui/FormAutocomplete';
import { User, Mail, Phone, Hash, GraduationCap, Layers, Lock, Search, Plus, AlertCircle, Info } from 'lucide-react';
import { ProcessFormData } from '../../types';
import { MenuItem, SelectChangeEvent } from '@mui/material';
import { STUDENT_COURSES } from '../../constants/studentCourses';

interface SectionProps {
    formData: ProcessFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | SelectChangeEvent<any>) => void;
    handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    modifiedFields: string[];
    errors: Record<string, string>;
    isEdit: boolean;
    isGoogleLinked?: boolean;
    studentEmailsList?: string[];
}

export const StudentSection = ({
    formData,
    handleChange,
    handleBlur,
    modifiedFields,
    errors,
    isEdit,
    isGoogleLinked = false,
    studentEmailsList = []
}: SectionProps) => {
    const [mode, setMode] = useState<'search' | 'create'>('search');

    const searchDataRef = useRef({
        student_email: '',
        student_name: '',
        student_phone: '',
        student_ra: '',
        student_course: '' as number | string,
        student_period: '' as number | string
    });

    const createDataRef = useRef({
        student_email: '',
        student_name: '',
        student_phone: '',
        student_ra: '',
        student_course: '' as number | string,
        student_period: '' as number | string
    });

    useEffect(() => {
        if (isEdit && formData.student_email && studentEmailsList.length > 0) {
            if (!studentEmailsList.includes(formData.student_email)) {
                setMode('create');
            }
        }
    }, [isEdit, studentEmailsList, formData.student_email]);

    const handleModeSwitch = (newMode: 'search' | 'create') => {
        if (mode === newMode) return;

        const currentData = {
            student_email: formData.student_email || '',
            student_name: formData.student_name || '',
            student_phone: formData.student_phone || '',
            student_ra: formData.student_ra || '',
            student_course: formData.student_course || '',
            student_period: formData.student_period || ''
        };

        if (mode === 'search') {
            searchDataRef.current = currentData;
        } else {
            createDataRef.current = currentData;
        }

        setMode(newMode);

        const targetData = newMode === 'search' ? searchDataRef.current : createDataRef.current;

        const updateEvent = (name: string, value: any) => ({ target: { name, value } } as any);
        handleChange(updateEvent('student_email', targetData.student_email));
        handleChange(updateEvent('student_name', targetData.student_name));
        handleChange(updateEvent('student_phone', targetData.student_phone));
        handleChange(updateEvent('student_ra', targetData.student_ra));
        handleChange(updateEvent('student_course', targetData.student_course));
        handleChange(updateEvent('student_period', targetData.student_period));
    };

    const isExistingEmail = studentEmailsList.includes(formData.student_email);
    const lockFields = mode === 'search' || isExistingEmail;
    const activeGoogleLinked = isGoogleLinked && isExistingEmail;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <User size={20} />
                </div>
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                        Dados do Aluno
                    </h3>
                    {activeGoogleLinked && (
                        <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full animate-in fade-in zoom-in duration-300">
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
                        ? 'bg-white text-blue-700 shadow-sm'
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
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                        }`}
                >
                    <Plus size={14} />
                    Cadastrar Novo
                </button>
            </div>

            {/* Grid de Campos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start animate-in fade-in duration-300">

                {mode === 'search' ? (
                    <FormAutocomplete
                        label="Pesquisar por E-mail"
                        name="student_email"
                        icon={Search}
                        value={formData.student_email}
                        options={studentEmailsList}
                        onChange={(e) => {
                            const novoEmail = e.target.value;
                            handleChange(e);
                            if (novoEmail !== formData.student_email) {
                                const clearEvent = (fieldName: string) => ({ target: { name: fieldName, value: '' } } as any);
                                handleChange(clearEvent('student_name'));
                                handleChange(clearEvent('student_phone'));
                                handleChange(clearEvent('student_ra'));
                                handleChange(clearEvent('student_course'));
                                handleChange(clearEvent('student_period'));
                            }
                        }}
                        onBlur={(e: any) => handleBlur(e)}
                        isEdit={isEdit}
                        isModified={modifiedFields.includes('student_email')}
                        error={errors.student_email}
                        placeholder="Selecione ou digite o e-mail..."
                    />
                ) : (
                    <div className="flex flex-col gap-1.5">
                        <FormInput
                            label="E-mail do Novo Aluno"
                            name="student_email"
                            type="email"
                            icon={Mail}
                            value={formData.student_email}
                            onChange={handleChange as any}
                            onBlur={(e: any) => handleBlur(e)}
                            isModified={modifiedFields.includes('student_email')}
                            error={errors.student_email}
                            isEdit={isEdit}
                            placeholder="exemplo@alunos.utfpr.edu.br"
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
                    label="Nome Completo"
                    name="student_name"
                    icon={User}
                    value={formData.student_name}
                    onChange={handleChange as any}
                    onBlur={handleBlur}
                    isModified={modifiedFields.includes('student_name')}
                    error={errors.student_name}
                    isEdit={isEdit}
                    placeholder={lockFields ? "Preenchido automaticamente" : "Apenas letras"}
                    disabled={lockFields || activeGoogleLinked}
                    isGoogleLinked={activeGoogleLinked}
                />

                <FormInput
                    label="Registro Acadêmico (RA)"
                    name="student_ra"
                    icon={Hash}
                    value={formData.student_ra}
                    onChange={handleChange as any}
                    onBlur={handleBlur}
                    isModified={modifiedFields.includes('student_ra')}
                    error={errors.student_ra}
                    isEdit={isEdit}
                    placeholder={lockFields ? "Preenchido automaticamente" : "Apenas números"}
                    disabled={lockFields}
                />

                <FormInput
                    label="Telefone de Contato"
                    name="student_phone"
                    icon={Phone}
                    value={formData.student_phone}
                    onChange={handleChange as any}
                    onBlur={handleBlur}
                    isModified={modifiedFields.includes('student_phone')}
                    error={errors.student_phone}
                    isEdit={isEdit}
                    placeholder={lockFields ? "Preenchido automaticamente" : "Ex: 41999999999"}
                    disabled={lockFields}
                />

                <FormSelect
                    label="Curso"
                    name="student_course"
                    icon={GraduationCap}
                    value={formData.student_course || ''}
                    isEdit={isEdit}
                    onChange={handleChange}
                    isModified={modifiedFields.includes('student_course')}
                    disabled={lockFields}
                    displayEmpty
                >
                    <MenuItem value="" disabled className="text-slate-400">
                        {lockFields ? "Preenchido automaticamente" : "Selecione o curso..."}
                    </MenuItem>
                    {STUDENT_COURSES.map(course => (
                        <MenuItem key={course.value} value={course.value}>
                            {course.label}
                        </MenuItem>
                    ))}
                </FormSelect>

                <FormSelect
                    label="Período Atual"
                    name="student_period"
                    icon={Layers}
                    value={formData.student_period ? String(formData.student_period) : ''}
                    isEdit={isEdit}
                    onChange={handleChange}
                    isModified={modifiedFields.includes('student_period')}
                    disabled={lockFields}
                    displayEmpty
                >
                    <MenuItem value="" disabled className="text-slate-400">
                        {lockFields ? "Preenchido automaticamente" : "Selecione o período..."}
                    </MenuItem>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(period => (
                        <MenuItem key={period} value={String(period)}>{period}º Período</MenuItem>
                    ))}
                </FormSelect>
            </div>

            {mode === 'search' && isExistingEmail && (
                <div className="flex items-center justify-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl animate-in fade-in zoom-in duration-300">
                    <Info size={16} className="text-slate-400 shrink-0" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
                        Para modificar os dados deste estudante, acesse: Gestão de Alunos
                    </span>
                </div>
            )}
        </div>
    );
};