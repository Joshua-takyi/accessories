"use client";
import React, {useState, useRef, useEffect} from "react";
import {Search, X, History, TrendingUp} from "lucide-react";
import {motion, AnimatePresence} from "framer-motion";
import {useRouter} from "next/navigation";

export default function SearchComponent() {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [recentSearches, setRecentSearches] = useState([]); // Use state for recent searches
    const inputRef = useRef(null);
    const router = useRouter();

    // Load recent searches from sessionStorage on component mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedSearches = sessionStorage.getItem("recentSearches");
            if (storedSearches) {
                setRecentSearches(JSON.parse(storedSearches));
            }
        }
    }, []);

    // Save searches to sessionStorage
    const saveSearch = (query) => {
        const timestamp = Date.now();
        const newSearches = [{query, timestamp}, ...recentSearches.filter(s => s.query !== query)]
            .slice(0, 5); // Keep only 5 recent searches

        sessionStorage.setItem("recentSearches", JSON.stringify(newSearches));
        setRecentSearches(newSearches); // Update state
    };

    // Remove expired searches (older than 1 hour)
    useEffect(() => {
        const now = Date.now();
        const filteredSearches = recentSearches.filter(s => now - s.timestamp < 3600000); // 1 hour
        sessionStorage.setItem("recentSearches", JSON.stringify(filteredSearches));
        setRecentSearches(filteredSearches); // Update state
    }, []);

    const handleSearch = (query) => {
        if (!query.trim()) return;

        saveSearch(query);
        setIsOpen(false); // Close search modal before navigating
        router.push(`/search?type=${encodeURIComponent(query)}&available=true&sortBy=price&order=asc&page=1`);
    };

    // Remove a specific search from recent searches
    const removeRecentSearch = (query) => {
        const updatedSearches = recentSearches.filter(search => search.query !== query);
        sessionStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
        setRecentSearches(updatedSearches); // Update state
    };

    useEffect(() => {
        if (isOpen) {
            const timeoutId = setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
            return () => clearTimeout(timeoutId);
        }
    }, [isOpen]);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(true)}
                aria-expanded={isOpen}
                aria-label="Toggle search"
                className="p-2 hover:bg-orange-100 rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#e2780c] focus:ring-offset-2"
            >
                <Search className="w-5 h-5"/>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* BACKDROP ANIMATION */}
                        <motion.div
                            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50"
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            transition={{duration: 0.3, ease: "easeOut"}}
                            onClick={() => setIsOpen(false)}
                        />

                        {/* MODAL ANIMATION */}
                        <motion.div
                            className="fixed inset-x-0 top-0 w-full bg-white/95 backdrop-blur-md shadow-2xl z-50"
                            initial={{y: "-100%", opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            exit={{y: "-100%", opacity: 0}}
                            transition={{duration: 0.4, ease: "easeInOut"}}
                        >
                            <div className="max-w-4xl mx-auto">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-semibold text-gray-800">Search Products</h2>
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="p-2 hover:bg-orange-100 rounded-full transition-colors duration-150"
                                        >
                                            <X className="w-5 h-5 text-[#e2780c]"/>
                                        </button>
                                    </div>

                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSearch(searchQuery);
                                    }}>
                                        <div className="flex gap-3 items-center">
                                            <div className="relative flex-1 group">
                                                <Search
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors duration-150 group-focus-within:text-[#e2780c]"
                                                />
                                                <input
                                                    ref={inputRef}
                                                    type="search"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    placeholder="Type to search..."
                                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e2780c] focus:border-transparent transition-all duration-150"
                                                    aria-label="Search input"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="bg-[#e2780c] hover:bg-[#c66a0b] text-white px-8 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e2780c] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 font-medium"
                                                disabled={!searchQuery.trim()}
                                            >
                                                Search
                                            </button>
                                        </div>

                                        <div className="mt-8 space-y-6">
                                            {/* Recent Searches */}
                                            {recentSearches.length > 0 && (
                                                <div className="space-y-3">
                                                    <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                                        <History className="w-4 h-4"/>
                                                        Recent Searches
                                                    </h3>
                                                    <div className="flex gap-2 flex-wrap">
                                                        {recentSearches.map(({query}) => (
                                                            <div key={query} className="flex items-center gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleSearch(query)}
                                                                    className="px-4 py-2 bg-orange-50 hover:bg-orange-100 rounded-lg text-sm text-gray-700 transition-colors duration-150"
                                                                >
                                                                    {query}
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeRecentSearch(query)}
                                                                    className="text-gray-500 hover:text-red-500"
                                                                >
                                                                    <X className="w-4 h-4"/>
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Quick Links */}
                                            <div className="space-y-3">
                                                <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                                    <TrendingUp className="w-4 h-4"/>
                                                    Popular Categories
                                                </h3>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}