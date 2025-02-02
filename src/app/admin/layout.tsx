import AdminSidebar from "@/components/adminSidebar";
import React from "react";

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({children}: LayoutProps) {
    return (
        <div className="flex h-screen">
            <AdminSidebar/>
            <main className="flex-1 overflow-x-hidden overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
