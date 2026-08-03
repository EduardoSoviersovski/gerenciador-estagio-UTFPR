import React from 'react';
import { Column } from '../types';

export interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    selectable?: boolean;
    idKey?: keyof T;
    selectedIds?: string[];
    onSelectionChange?: (ids: string[]) => void;
    onRowClick?: (item: T) => void;
}

export function DataTable<T>({
    columns,
    data,
    selectable,
    idKey,
    selectedIds = [],
    onSelectionChange,
    onRowClick
}: DataTableProps<T>) {

    const isRowSelected = (item: T) => {
        if (!idKey) return false;
        return selectedIds.includes(String(item[idKey]));
    };

    const toggleRow = (item: T, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();

        if (!idKey || !onSelectionChange) return;

        const id = String(item[idKey]);
        if (selectedIds.includes(id)) {
            onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
        } else {
            onSelectionChange([...selectedIds, id]);
        }
    };

    const toggleAll = () => {
        if (!idKey || !onSelectionChange) return;

        if (selectedIds.length === data.length) {
            onSelectionChange([]);
        } else {
            onSelectionChange(data.map(item => String(item[idKey])));
        }
    };

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50 rounded-3xl border border-slate-100">
                <p className="text-slate-500 font-medium">Nenhum registro encontrado.</p>
                <p className="text-slate-400 text-sm mt-1">Tente ajustar seus filtros de busca.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto custom-scrollbar border border-slate-100 rounded-3xl">
            <table className="w-full text-sm text-left">
                <thead className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50">
                    <tr>
                        {selectable && (
                            <th className="px-6 py-4 w-12 rounded-tl-3xl">
                                <input
                                    type="checkbox"
                                    className="rounded-md border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                                    checked={selectedIds.length === data.length && data.length > 0}
                                    onChange={toggleAll}
                                />
                            </th>
                        )}
                        {columns.map((col, index) => (
                            <th
                                key={index}
                                className={`px-6 py-4 whitespace-nowrap ${index === columns.length - 1 && !selectable ? 'rounded-tr-3xl' : ''}`}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, rowIndex) => {
                        const isSelected = isRowSelected(item);
                        const rowId = idKey ? String(item[idKey]) : String(rowIndex);

                        return (
                            <tr
                                key={rowId}
                                onClick={() => onRowClick && onRowClick(item)}
                                className={`
                                    border-b border-slate-50 transition-colors last:border-0
                                    ${onRowClick ? 'cursor-pointer hover:bg-slate-50' : ''} 
                                    ${isSelected ? 'bg-blue-50/30' : ''}
                                `}
                            >
                                {selectable && (
                                    <td
                                        className="px-6 py-4 whitespace-nowrap w-12"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <input
                                            type="checkbox"
                                            className="rounded-md border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                                            checked={isSelected}
                                            onChange={() => toggleRow(item)}
                                        />
                                    </td>
                                )}
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-slate-600 font-medium">
                                        {col.render ? col.render((item as any)[col.key], item) : String((item as any)[col.key] || '-')}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}