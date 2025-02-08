"use client";
import {useState} from "react";
import {motion, AnimatePresence} from "framer-motion";
import Link from "next/link";
import {ChevronDown} from "lucide-react";

interface DropdownMenuProps {
    header: string;
    items: {
        id: number;
        header: string;
        items: {
            name: string;
            href: string;
        }[];
    }[];
}

const DropdownMenu = ({header, items}: DropdownMenuProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const toggleMobileDropdown = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    const underlineVariant = {
        hidden: {width: "0%"},
        show: {
            width: "100%",
            transition: {duration: 0.3, ease: "easeOut"},
        },
    };

    const dropdownVariant = {
        hidden: {
            opacity: 0,
            y: -10,
            transition: {duration: 0.2},
        },
        show: {
            opacity: 1,
            y: 0,
            transition: {duration: 0.3, staggerChildren: 0.05},
        },
    };

    const chevronVariant = {
        down: {rotate: 0},
        up: {rotate: 180},
    };

    const sectionVariant = {
        hidden: {opacity: 0, y: -10},
        show: {opacity: 1, y: 0},
    };

    return (
        <div
            // className=""
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Header */}
            <div
                className="relative inline-block py-2 cursor-pointer"
                onClick={toggleMobileDropdown}
            >
                <div className="flex items-center gap-1">
                    <p className="text-[1rem] font-semibold text-gray-700 p-2 capitalize">
                        {header}
                    </p>
                    <motion.div
                        animate={isHovered || isMobileOpen ? "up" : "down"}
                        variants={chevronVariant}
                        transition={{duration: 0.3}}
                    >
                        <ChevronDown className="w-4 h-4"/>
                    </motion.div>
                </div>
                <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-black w-full"
                    initial="hidden"
                    animate={isHovered || isMobileOpen ? "show" : "hidden"}
                    variants={underlineVariant}
                />
            </div>

            {/* Dropdown */}
            <AnimatePresence>
                {(isHovered || isMobileOpen) && (
                    <motion.div
                        className="absolute left-0 right-0 z-[9999] w-full bg-white shadow-sm md:block"
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        variants={dropdownVariant}
                        style={{
                            position: "fixed",
                            top: "4rem",
                            left: 0,
                            width: "100%",
                            marginTop: "0",
                        }}
                    >
                        <div className="container mx-auto px-4 py-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
                                {items.map((section) => (
                                    <motion.div key={section.id} variants={sectionVariant}>
                                        <p className="font-bold text-sm text-gray-800 mb-2">
                                            {section.header}
                                        </p>
                                        <div className="flex flex-col gap-2">
                                            {section.items.map((item, idx) => (
                                                <Link
                                                    key={idx}
                                                    href={`/collection?category=${section.header
                                                        .toLowerCase()
                                                        .replace(
                                                            /\s+/g,
                                                            "-"
                                                        )}&sortBy=price&sortOrder=desc&limit=50&page=1&tags=${item.name
                                                        .toLowerCase()
                                                        .replace(/\s+/g, "-")}`}
                                                >
													<span
                                                        className="block text-sm text-gray-600 hover:text-gray-900 hover:underline">
														{item.name}
													</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DropdownMenu;
