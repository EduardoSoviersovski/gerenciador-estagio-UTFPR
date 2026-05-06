import React, { useState, useEffect, useRef } from 'react';
import { Column } from '../types';
import { SmartTooltipCell } from './ui/SmartTooltipCell';

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    selectable?: boolean;
    selectedIds?: string[];
    onSelectionChange?: (selectedItems: T[]) => void;
    idKey?: keyof T;
}

export function DataTable<T>({
    columns,
    data,
    selectable = false,
    selectedIds = [],
    onSelectionChange,
    idKey = 'id' as keyof T
}: DataTableProps<T>) {
    const [localSelected, setLocalSelected] = useState<Set<string>>(new Set(selectedIds));
    const lastSelectedIdsRef = useRef(selectedIds);

    useEffect(() => {
        if (JSON.stringify(lastSelectedIdsRef.current) !== JSON.stringify(selectedIds)) {
            setLocalSelected(new Set(selectedIds));
            lastSelectedIdsRef.current = selectedIds;
        }
    }, [selectedIds]);

    const isAllPageSelected = data.length > 0 && data.every(item => localSelected.has(String(item[idKey])));

    const toggleAll = () => {
        const newSelected = new Set(localSelected);
        if (isAllPageSelected) {
            data.forEach(item => newSelected.add(String(item[idKey]))); // Garante que estão lá antes de remover
            data.forEach(item => newSelected.delete(String(item[idKey])));
        } else {
            data.forEach(item => newSelected.add(String(item[idKey])));
        }
        const updatedArray = Array.from(newSelected);
        setLocalSelected(newSelected);
        onSelectionChange?.(updatedArray as any);
    };

    const toggleOne = (e: React.MouseEvent, item: T) => {
        e.stopPropagation();
        const id = String(item[idKey]);
        const newSelected = new Set(localSelected);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        const updatedArray = Array.from(newSelected);
        setLocalSelected(newSelected);
        onSelectionChange?.(updatedArray as any);
    };
    return (
        <div className="w-full border border-slate-200 rounded-2xl bg-white shadow-sm flex flex-col overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left table-fixed">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            {selectable && (
                                <th className="px-4 py-4 w-12 text-center">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        checked={isAllPageSelected}
                                        onChange={toggleAll}
                                    />
                                </th>
                            )}
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    className={`py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 ${index === 0 && col.header === '' ? 'px-0 w-10' : 'px-6'}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.map((item, rowIndex) => {
                            const isSelected = localSelected.has(String(item[idKey]));
                            return (
                                <tr
                                    key={rowIndex}
                                    className={`transition-colors h-16 ${isSelected ? 'bg-blue-50/40' : 'hover:bg-slate-50/50'}`}
                                >
                                    {selectable && (
                                        <td className="px-4 py-4 w-12 text-center">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                checked={isSelected}
                                                onChange={(e) => e.stopPropagation()}
                                                onClick={(e) => toggleOne(e, item)}
                                            />
                                        </td>
                                    )}
                                    {columns.map((col, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className={`py-4 text-sm text-slate-600 font-medium truncate ${colIndex === 0 && col.header === '' ? 'px-0 text-center' : 'px-6'}`}
                                        >
                                            {col.render ? (
                                                col.render(item[col.key as keyof T], item)
                                            ) : (
                                                <SmartTooltipCell>
                                                    {String(item[col.key as keyof T])}
                                                </SmartTooltipCell>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                        {data.length < 10 && Array.from({ length: 10 - data.length }).map((_, i) => (
                            <tr key={`empty-${i}`} className="h-16 border-none select-none pointer-events-none">
                                <td colSpan={columns.length + (selectable ? 1 : 0)}>&nbsp;</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}