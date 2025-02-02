"use client"
import React from 'react';
import {motion} from 'framer-motion';
import {ArrowRight, Shield, Zap, HeartHandshake} from 'lucide-react';
import CategoriesClient from "@/app/(with navbar)/(homepage)/filterByCategory";
import OnSaleProducts from "@/components/isOnSale";

const Page = () => {
    return (
        <>
            {/* Hero Section */}
            <motion.div
                className="relative min-h-[90vh] overflow-hidden"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 0.8}}
            >
                {/* Background Image */}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: `url(/images/back.png)`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />

                {/* Lighter Overlay */}
                <div className="absolute inset-0 bg-slate-900/60 z-[1]">
                    {/* Decorative Elements */}
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                </div>

                {/* Main Content */}
                <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
                    <div className="max-w-6xl mx-auto space-y-8 py-20">
                        {/* Badge */}
                        <motion.div
                            className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm px-6 py-2 rounded-full border border-blue-400/20"
                            initial={{scale: 0.8, opacity: 0}}
                            animate={{scale: 1, opacity: 1}}
                            transition={{delay: 0.2}}
                        >
                            <span className="animate-pulse bg-green-400 h-2 w-2 rounded-full"></span>
                            <span className="text-white text-sm">Latest Flagship Phones Available</span>
                        </motion.div>

                        {/* Main Heading */}
                        <motion.div
                            className="space-y-4"
                            initial={{y: 20, opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{delay: 0.4}}
                        >
                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white">
                                Discover Next-Gen
                                <br/>
                                Mobile Technology
                            </h1>
                            <p className="text-slate-200 text-lg md:text-xl max-w-2xl">
                                Experience the future of mobile technology with our curated selection
                                of premium devices and accessories backed by expert support.
                            </p>
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div
                            className="flex flex-wrap gap-4"
                            initial={{y: 20, opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{delay: 0.6}}
                        >
                            <button
                                className="group px-8 py-3 bg-blue-500 rounded-full flex items-center gap-2 text-white font-medium hover:bg-blue-600 transition-all duration-300">
                                Explore Products
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                            </button>
                            <button
                                className="px-8 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors duration-300">
                                View Deals
                            </button>
                        </motion.div>

                        {/* Features Grid */}
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12"
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{delay: 0.8}}
                        >
                            <div
                                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/20 transition-colors">
                                <Zap className="w-5 h-5 text-blue-400"/>
                                <span className="text-white">Fast Next-Day Delivery</span>
                            </div>
                            <div
                                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/20 transition-colors">
                                <Shield className="w-5 h-5 text-blue-400"/>
                                <span className="text-white">Extended Warranty</span>
                            </div>
                            <div
                                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/20 transition-colors">
                                <HeartHandshake className="w-5 h-5 text-blue-400"/>
                                <span className="text-white">Premium Support</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
            <section className={`md:py-10 py-4 flex flex-col space-y-8`}>
                <CategoriesClient/>
                <OnSaleProducts/>
            </section>
        </>
    );
};

export default Page;