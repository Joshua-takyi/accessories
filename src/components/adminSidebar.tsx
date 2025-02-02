"use client";

import React, {useState, useEffect} from "react";
import {motion, AnimatePresence} from "framer-motion";
import {
    Menu,
    X,
    LayoutDashboard,
    ShoppingCart,
    Package,
    Plus,
    Users,
    Settings,
    BarChart,
    LogOut,
} from "lucide-react";
import Link from "next/link";
import {usePathname} from "next/navigation";

const AdminSidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();

    const links = [
        {name: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="w-5 h-5"/>},
        {name: "Analytics", href: "/admin/analytics", icon: <BarChart className="w-5 h-5"/>},
        {name: "Orders", href: "/admin/orders", icon: <ShoppingCart className="w-5 h-5"/>},
        {name: "Products", href: "/admin/products", icon: <Package className="w-5 h-5"/>},
        {name: "Add Product", href: "/admin/add-product", icon: <Plus className="w-5 h-5"/>},
        {name: "Customers", href: "/admin/customers", icon: <Users className="w-5 h-5"/>},
        {name: "Settings", href: "/admin/settings", icon: <Settings className="w-5 h-5"/>},
    ];

    useEffect(() => {
        const handleResize = () => {
            const isMobileView = window.innerWidth < 768;
            setIsMobile(isMobileView);
            setIsOpen(!isMobileView);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
                aria-label="Toggle Sidebar"
            >
                <Menu className="w-5 h-5"/>
            </button>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobile && isOpen && (
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <AnimatePresence>
                <motion.aside
                    className="fixed md:sticky top-0 h-screen bg-white border-r shadow-md flex flex-col justify-between z-50 overflow-hidden"
                    initial={isMobile ? {x: -280} : false}
                    animate={
                        isMobile
                            ? {x: isOpen ? 0 : -280}
                            : {width: isOpen ? 280 : 80}
                    }
                    transition={{
                        type: "spring",
                        damping: 25,
                        duration: 0.3
                    }}
                >
                    {/* Sidebar Content */}
                    <div className="flex flex-col flex-1 min-w-0">
                        {/* Header */}
                        <div className="h-16 flex items-center justify-between px-4 border-b">
                            <motion.div
                                animate={{opacity: isOpen ? 1 : 0}}
                                className="font-semibold text-lg overflow-hidden whitespace-nowrap"
                            >
                                Admin Dashboard
                            </motion.div>
                            {isMobile ? (
                                <button
                                    onClick={toggleSidebar}
                                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                    aria-label="Close Sidebar"
                                >
                                    <X className="w-5 h-5"/>
                                </button>
                            ) : (
                                <button
                                    onClick={toggleSidebar}
                                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                    aria-label="Toggle Sidebar"
                                >
                                    {isOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
                                </button>
                            )}
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex-1 overflow-y-auto p-3">
                            {links.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => isMobile && setIsOpen(false)}
                                        className={`flex items-center h-12 px-3 rounded-lg transition-colors relative group ${
                                            isActive ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50 text-gray-600"
                                        }`}
                                    >
                                        <span className="inline-flex items-center justify-center w-5 shrink-0">
                                            {link.icon}
                                        </span>
                                        <motion.span
                                            animate={{opacity: isOpen ? 1 : 0}}
                                            className="ml-3 overflow-hidden whitespace-nowrap"
                                        >
                                            {link.name}
                                        </motion.span>
                                        {!isOpen && !isMobile && (
                                            <div
                                                className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                                {link.name}
                                            </div>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Footer */}
                    <div className="border-t p-3">
                        <button
                            className="flex items-center w-full h-12 px-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors relative group"
                            onClick={() => console.log("Logout clicked")}
                        >
                            <span className="inline-flex items-center justify-center w-5 shrink-0">
                                <LogOut className="w-5 h-5"/>
                            </span>
                            <motion.span
                                animate={{opacity: isOpen ? 1 : 0}}
                                className="ml-3 overflow-hidden whitespace-nowrap"
                            >
                                Logout
                            </motion.span>
                            {!isOpen && !isMobile && (
                                <div
                                    className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                    Logout
                                </div>
                            )}
                        </button>
                    </div>
                </motion.aside>
            </AnimatePresence>
        </>
    );
};

export default AdminSidebar;