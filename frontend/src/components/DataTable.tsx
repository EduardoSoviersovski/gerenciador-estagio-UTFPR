import React from 'react';
import { Column } from '../types';

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    maxHeight?: string;
    onRowClick?: (item: T) => void;
}

export function DataTable<T>({ columns, data, maxHeight, onRowClick }: DataTableProps<T>) {
    return (
        <div className={`w-full overflow-hidden border border-slate-200 rounded-2xl bg-white shadow-sm ${maxHeight ? 'flex flex-col' : ''}`}>
            <div className={`overflow-x-auto ${maxHeight ? 'overflow-y-auto' : ''}`} style={{ maxHeight }}>
                <table className="w-full border-collapse text-left">
                    <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
                        <tr>
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500"
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.length > 0 ? (
                            data.map((item, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    onClick={() => onRowClick?.(item)}
                                    className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-blue-50/30' : 'hover:bg-slate-50/50'}`}
                                >
                                    {columns.map((col, colIndex) => (
                                        <td key={colIndex} className="px-6 py-4 text-sm text-slate-600 font-medium">
                                            {col.render
                                                ? col.render(item[col.key as keyof T], item)
                                                : (item[col.key as keyof T] as unknown as React.ReactNode)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400 italic text-sm">
                                    Nenhum registo encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}