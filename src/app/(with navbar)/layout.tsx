import React from "react";
import Nav from "@/components/nav";

interface ChildrenProps {
	children: React.ReactNode;
}

export default function NavbarLayout({ children }: ChildrenProps) {
	return (
		<div>
			<Nav />
			{children}
		</div>
	);
}
