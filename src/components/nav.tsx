"use client";
import Link from "next/link";
import {useState, useEffect} from "react";
import {
    Menu,
    X,
    ChevronDown,
    ChevronUp,
    Heart,
    ShoppingCart,
} from "lucide-react";
import {categories} from "@/database/db";
import DropdownMenu from "@/components/dropDown";
import {Wrapper} from "@/components/wrapper";
import SearchComponent from "@/components/search";
import CartSheet from "@/components/cart";
// import DropdownMenu from "../dropdown/dropdown";
// import {Wrapper} from "../wrapper";
// import {categories} from "@/database/db";

export default function Nav() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeGroup, setActiveGroup] = useState(null);

    // Close mobile menu when screen size changes to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false);
                setActiveGroup(null);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        setActiveGroup(null);
    };

    const toggleGroup = (id) => {
        setActiveGroup(activeGroup === id ? null : id);
    };

    return (
        <nav className="sticky top-0 shadow-sm z-[9999] bg-white px-2 md:px-0">
            <Wrapper>
                <div className="flex items-center justify-between py-1">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="md:hidden p-2"
                        aria-label="Toggle mobile menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-6 w-6"/>
                        ) : (
                            <Menu className="h-6 w-6"/>
                        )}
                    </button>

                    {/* Logo */}
                    <header className="font-gotham_thin text-xl md:text-2xl font-bold">
                        <Link href="/">PhoneXcess</Link>
                    </header>


                    {/* Desktop Navigation - Centered */}
                    <div className="hidden md:flex items-center justify-center flex-1">
                        <div className="flex items-center space-x-4">
                            <DropdownMenu header="Products" items={categories}/>
                            {/*<DropdownMenu header="Brands" items={categories}/>*/}
                            {/*<DropdownMenu header="Categories" items={categories}/>*/}
                        </div>
                    </div>

                    {/* Icons */}
                    <div className="flex items-center gap-2">
                        <div>
                            <SearchComponent/>
                        </div>
                        <div>
                            <CartSheet/>
                        </div>
                        <Link
                            href="/wishlist"
                            className="hover:text-gray-600 transition-colors p-2"
                        >
                            <Heart className="w-5 h-5"/>
                        </Link>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`md:hidden text-bodyXs overflow-hidden transition-all duration-300 ease-in-out ${
                        isMobileMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                    <div className="pb-4 divide-y divide-gray-100 text-normalText">
                        {categories.map((group) => (
                            <div key={group.id} className="py-2">
                                <button
                                    onClick={() => toggleGroup(group.id)}
                                    className="flex items-center justify-between w-full p-2 text-left transition-all duration-100 ease-in-out"
                                >
                                    <span className="font-medium">{group.header}</span>
                                    {activeGroup === group.id ? (
                                        <ChevronUp className="h-5 w-5"/>
                                    ) : (
                                        <ChevronDown className="h-5 w-5"/>
                                    )}
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-200 ${
                                        activeGroup === group.id ? "max-h-96" : "max-h-0"
                                    }`}
                                >
                                    <div className="pl-4 py-2 space-y-2">
                                        {group.items.map((item, index) => (
                                            <Link
                                                key={index}
                                                href={item.href}
                                                className="block p-2 hover:bg-gray-50"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Wrapper>
        </nav>
    );
}
