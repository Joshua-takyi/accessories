"use client";

import {Plus, X} from "lucide-react";

interface DynamicListProps {
    label: string;
    items: string[];
    onAddItem: () => void;
    onChangeItem: (index: number, value: string) => void;
    onDeleteItem: (index: number) => void;
    placeholder?: string;
    className?: string;
    error?: string;
}

export const FormDynamicList = ({
                                    label,
                                    items,
                                    onAddItem,
                                    onChangeItem,
                                    onDeleteItem,
                                    placeholder,
                                    className,
                                    error,
                                }: DynamicListProps) => {
    return (
        <div className={`space-y-4 ${className}`}>
            <p className="text-xl font-semibold text-gray-800">{label}</p>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={item}
                        onChange={(e) => onChangeItem(index, e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder={placeholder}
                        aria-label={`${label} ${index + 1}`}
                    />
                    <button
                        type="button"
                        onClick={() => onDeleteItem(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-sm"
                        aria-label={`Remove ${label} ${index + 1}`}
                    >
                        <X size={16}/>
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={onAddItem}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-sm hover:bg-gray-800 transition-colors"
            >
                <Plus size={16}/>
                <span>Add {label}</span>
            </button>
        </div>
    );
};