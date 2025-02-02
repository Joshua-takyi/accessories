"use client";
import React from "react";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";

interface ModelSelectProps {
    itemModel: string[];
    value: string;
    onChange: (value: string) => void;
    title?: string;
}

export default function SelectPhoneModel({
                                             itemModel = [],
                                             value,
                                             onChange,
                                             title = "Select Model",
                                         }: ModelSelectProps) {
    // Sorting logic
    const sortedModels = React.useMemo(() => {
        return itemModel.sort((a, b) => {
            // Prioritize 'pro max', then 'pro', then alphabetical
            const priorityOrder = ["pro max", "pro"];

            for (let priority of priorityOrder) {
                const aHasPriority = a.includes(priority);
                const bHasPriority = b.includes(priority);

                if (aHasPriority && !bHasPriority) return -1;
                if (!aHasPriority && bHasPriority) return 1;
            }

            return a.localeCompare(b);
        });
    }, [itemModel]);

    // Format model name
    const formatModelName = (model: string) => {
        return model
            .replace("iphone", "")
            .trim()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <div className="w-full space-y-2 px-3">
            {title && (
                <label className="block text-sm font-medium text-gray-700">
                    {title}
                </label>
            )}

            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="w-full rounded-none">
                    <SelectValue placeholder="Choose a model"/>
                </SelectTrigger>
                <SelectContent>
                    {sortedModels.map((model) => (
                        <SelectItem
                            key={model}
                            value={model}
                            className="capitalize"
                        >
                            {formatModelName(model)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}