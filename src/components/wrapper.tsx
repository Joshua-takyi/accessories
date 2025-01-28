import React from "react";

interface WrapperProps {
    children: React.ReactNode;
    className?: string; // Optional, if no className is passed
}

export function Wrapper({ children, className = "" }: WrapperProps) {
    return (
        <div className={`container mx-auto ${className}`}>
            {children}
        </div>
    );
}
