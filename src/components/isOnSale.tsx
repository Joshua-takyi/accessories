"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Wrapper } from "@/components/wrapper";
import { GetOnSale } from "@/server/apiCalls";
import { toast } from "sonner";
import { ProductCardSkeleton } from "@/components/skeleton";
import { ProductCard } from "@/components/productCard";

interface Product {
	_id: string;
	slug: string;
	image: string[];
	title: string;
	price: number;
	saleEnd?: Date;
}

export default function OnSaleProducts() {
	const [limit, setLimit] = useState<number>(10);
	const queryClient = useQueryClient(); // Access the query client for prefetching

	// Fetch data using useQuery
	const { data, isLoading, isError, error, isFetching } = useQuery({
		queryKey: ["isOnSale", limit], // Unique key for the query
		queryFn: async () => {
			try {
				const res = await GetOnSale({ limit });
				return res.data;
			} catch (error) {
				throw new Error("Failed to fetch on sale products", error);
			}
		},
		onSuccess: () => {
			toast.success("Products loaded successfully");
		},
		onError: (error) => {
			toast.error(
				`Error: ${error instanceof Error ? error.message : "Unknown error"}`
			);
		},
		staleTime: 1000 * 60 * 5, // 5 minutes (cached data is considered fresh for 5 minutes)
		cacheTime: 1000 * 60 * 60 * 24, // 24 hours (cache will be retained for 24 hours)
		refetchOnWindowFocus: false, // Prevent refetching when window is focused
	});

	// Prefetch the next set of data when the limit changes
	useEffect(() => {
		const nextLimit = limit + 10; // Calculate the next limit
		queryClient.prefetchQuery({
			queryKey: ["isOnSale", nextLimit], // Prefetch with the next limit
			queryFn: async () => {
				const res = await GetOnSale({ limit: nextLimit });
				return res.data;
			},
		});
	}, [limit, queryClient]);

	// Function to increase the limit and load more products
	const increaseLimit = () => {
		setLimit((prevLimit) => prevLimit + 10);
	};

	// Loading skeleton component
	const LoadingSkeleton = () => (
		<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
			{[...Array(5)].map((_, i) => (
				<div key={i} className="w-full">
					<ProductCardSkeleton />
				</div>
			))}
		</div>
	);

	// Render a message if there are no products on sale
	if (data?.length === 0) {
		return (
			<div className="w-full min-h-screen bg-gray-50">
				<Wrapper className="py-8">
					<p className="text-center text-gray-500">
						No products on sale at the moment. Please check back later!
					</p>
				</Wrapper>
			</div>
		);
	}

	return (
		<div className="w-full">
			<Wrapper className="py-8">
				{/* Header and "View More" button */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-2">
					<div className="flex flex-col gap-3 col-span-1 md:col-span-2">
						<h2 className="text-h4 font-semibold capitalize">hot sales 🔥🔥</h2>
						<p className="text-bodyXs text-gray-500">
							We are currently selling the best products on the market.
						</p>
					</div>
					<div className="w-full flex justify-end">
						<button
							onClick={increaseLimit}
							disabled={isLoading || isFetching}
							className="mt-4 md:mt-8 md:px-6 md:py-2 bg-[#f17716] text-white font-semibold rounded-sm text-bodyXs px-3 py-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
						>
							{isFetching ? (
								<div className="flex items-center">
									<svg
										className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										/>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
										/>
									</svg>
									Loading...
								</div>
							) : (
								"View more"
							)}
						</button>
					</div>
				</div>

				{/* Error message */}
				{isError && (
					<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
						<div className="flex items-center">
							<svg
								className="w-5 h-5 text-red-500 mr-2"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<p className="text-red-700">
								{error instanceof Error
									? error.message
									: "Failed to load products"}
							</p>
						</div>
					</div>
				)}

				{/* Render loading skeleton or product grid */}
				{isLoading ? (
					<LoadingSkeleton />
				) : (
					<div className="flex flex-col px-4">
						<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
							{data?.map((product: Product) => (
								<div key={product._id} className="w-full">
									<ProductCard
										image={product.image[0]}
										images={product.image}
										name={product.title}
										id={product._id}
										slug={product.slug}
										discount={product.discount}
										price={product.price}
									/>
								</div>
							))}
						</div>
					</div>
				)}
			</Wrapper>
		</div>
	);
}
