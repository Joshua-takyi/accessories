import AdminSidebar from "@/components/adminSidebar";
import React from "react";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex h-screen">
			<AdminSidebar />
			<main className="flex-1 overflow-x-hidden overflow-y-auto">
				{children}
			</main>
		</div>
	);
}
