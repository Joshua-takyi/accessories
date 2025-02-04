"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Wrapper } from "@/components/wrapper";
import { useState, useEffect } from "react";
import { SearchIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/productCard";
import axios from "axios";
import Loading from "@/app/loading";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SearchCom() {
	const [mobile, setMobile] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const [searchInput, setSearchInput] = useState("");

	const query = searchParams.get("type") || "";
	console.log("Search Query:", query);

	const {
		data: products = [],
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["search", query],
		queryFn: async () => {
			if (!query) return [];
			try {
				const { data } = await axios.get(
					`${API_URL}/products/getItem?type=${query}&sortBy=price&sortOrder=desc&page=1&limit=10`
				);
				return data.data || [];
			} catch (err) {
				console.error("Error fetching products:", err);
				throw err;
			}
		},
		enabled: !!query,
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
	});

	useEffect(() => {
		setSearchInput(query);
		const handleResize = () => setMobile(window.innerWidth < 768);
		window.addEventListener("resize", handleResize);
		handleResize();

		return () => window.removeEventListener("resize", handleResize);
	}, [query]);

	const handleSearch = () => {
		if (!searchInput.trim()) return;
		router.push(
			`/search?type=${encodeURIComponent(
				searchInput
			)}&sortBy=price&sortOrder=desc&page=1&limit=10`
		);
	};

	const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchInput(e.target.value);
	};

	if (isLoading) return <Loading />;

	if (isError) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center p-8 bg-red-50 rounded-lg">
					<p className="text-red-600 font-medium">Error: {error.message}</p>
					<button
						onClick={() => router.push("/")}
						className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
					>
						Return Home
					</button>
				</div>
			</div>
		);
	}

	const productCount = products.length;

	return (
		<div className="min-h-screen">
			<Wrapper>
				<div className="w-full md:h-[30dvh] flex justify-center items-center py-8 md:py-0">
					<div className="flex flex-col gap-y-6 md:gap-y-9 items-center justify-between w-full max-w-2xl px-4">
						<h1 className="md:text-4xl text-2xl font-bold text-gray-900">
							Results for &quot;{query}&quot;
						</h1>
						<div className="w-full flex gap-3">
							<div className="relative flex-1">
								<input
									type="text"
									placeholder="Search products..."
									value={searchInput}
									onChange={handleSearchInput}
									className="w-full h-12 px-4 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
								/>
								<SearchIcon className="absolute top-3 right-3 text-gray-400" />
							</div>
							<button
								onClick={handleSearch}
								className={`h-12 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
									mobile ? "px-4" : "px-8"
								}`}
							>
								Search
							</button>
						</div>
						<h2 className="text-gray-600 uppercase text-bodyXs font-semibold">
							{`Products (${productCount})`}
						</h2>
					</div>
				</div>

				<section className="py-8">
					{productCount > 0 ? (
						<div
							className={`grid gap-6 ${
								productCount === 1
									? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-center md:place-items-start"
									: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
							}`}
						>
							{products.map((product) => (
								<ProductCard
									key={product._id}
									name={product.title}
									price={product.price}
									image={product.image[0]}
									images={product.image}
									slug={product.slug}
								/>
							))}
						</div>
					) : (
						<div className="flex flex-col items-center justify-center py-16 px-4">
							<div className="text-center space-y-4">
								<p className="text-2xl font-semibold text-gray-900">
									No items found for &quot;{query}&quot;
								</p>
								<p className="text-gray-600 max-w-md mx-auto">
									Try checking your spelling or using different keywords to find
									what you&apos;re looking for.
								</p>
								<button
									onClick={() => router.push("/")}
									className="mt-4 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
								>
									Browse All Products
								</button>
							</div>
						</div>
					)}
				</section>
			</Wrapper>
		</div>
	);
}
