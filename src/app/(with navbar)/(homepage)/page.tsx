import React from "react";
import { ArrowRight, Shield, Zap, HeartHandshake } from "lucide-react";
import CategoriesClient from "@/app/(with navbar)/(homepage)/filterByCategory";
import OnSaleProducts from "@/components/isOnSale";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

const Page = async () => {
	const session = await getSession();
	const user = session?.user;
	if (!user) {
		redirect("/api/auth/login");
	}
	return (
		<>
			{/* Hero Section */}
			<section className="relative min-h-[90vh] overflow-hidden">
				{/* Background Image */}
				<div
					className="absolute inset-0 z-0"
					style={{
						backgroundImage: `url(/images/back.png)`,
						backgroundSize: "cover",
						backgroundPosition: "center",
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
						{/* SEO-Friendly Badge */}
						<div className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm px-6 py-2 rounded-full border border-blue-400/20">
							<span
								className="animate-pulse bg-green-400 h-2 w-2 rounded-full"
								aria-hidden="true"
							></span>
							<span className="text-white text-sm">
								Best Prices on Latest Smartphones
							</span>
						</div>
						{/* SEO-Friendly Main Heading */}
						<div className="space-y-4">
							<h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white">
								Buy the Latest Smartphones at Unbeatable Prices
							</h1>
							<p className="text-slate-200 text-lg md:text-xl max-w-2xl">
								Discover a wide range of premium smartphones and accessories at
								competitive prices. Enjoy fast shipping, extended warranties,
								and exceptional customer support.
							</p>
						</div>
						{/* CTA Buttons */}
						<div className="flex flex-wrap gap-4">
							<button className="group px-8 py-3 bg-blue-500 rounded-full flex items-center gap-2 text-white font-medium hover:bg-blue-600 transition-all duration-300">
								Shop Now
								<ArrowRight
									className="w-4 h-4 group-hover:translate-x-1 transition-transform"
									aria-hidden="true"
								/>
							</button>
							<button className="px-8 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors duration-300">
								View Special Offers
							</button>
						</div>
						{/* Features Grid */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
							<div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/20 transition-colors">
								<Zap className="w-5 h-5 text-blue-400" aria-hidden="true" />
								<span className="text-white">Free Next-Day Delivery</span>
							</div>
							<div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/20 transition-colors">
								<Shield className="w-5 h-5 text-blue-400" aria-hidden="true" />
								<span className="text-white">2-Year Extended Warranty</span>
							</div>
							<div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/20 transition-colors">
								<HeartHandshake
									className="w-5 h-5 text-blue-400"
									aria-hidden="true"
								/>
								<span className="text-white">24/7 Customer Support</span>
							</div>
						</div>
					</div>
				</div>
			</section>
			<section className={`md:py-10 py-4 flex flex-col space-y-8`}>
				<CategoriesClient />
				<OnSaleProducts />
			</section>
		</>
	);
};

export default Page;
