"use client";
import { Wrapper } from "@/components/wrapper";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/app/loading";
import ProductCard from "@/components/productCard";
import FilterComponent from "@/components/filter";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState, useEffect } from "react";

interface Product {
	_id: string;
	title: string;
	price: number;
	image: string[];
	slug: string;
	model?: string;
	material?: string;
	rating?: number;
	isOnSale?: boolean;
	isBestSeller?: boolean;
}

interface FilterState {
	category: string;
	model: string;
	material: string;
	rating: string;
	sortBy: "price" | "createdAt";
	sortOrder: "asc" | "desc";
	minPrice: number;
	maxPrice: string;
	isOnSale: boolean;
	isBestSeller: boolean;
}

export default function CollectionComponent() {
	const searchParams = useSearchParams();

	// Initialize filters from URL parameters
	const [filters, setFilters] = useState<FilterState>({
		category: searchParams.get("category") || "all",
		model: searchParams.get("model") || "",
		material: searchParams.get("material") || "",
		rating: searchParams.get("rating") || "",
		sortBy: (searchParams.get("sortBy") as "price" | "createdAt") || "price",
		sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
		minPrice: parseInt(searchParams.get("minPrice") || "0"),
		maxPrice: searchParams.get("maxPrice") || "",
		isOnSale: searchParams.get("isOnSale") === "true",
		isBestSeller: searchParams.get("isBestSeller") === "true",
	});

	const API_URI = process.env.NEXT_PUBLIC_API_URL;

	// Update URL when filters change
	useEffect(() => {
		const params = new URLSearchParams();
		Object.entries(filters).forEach(([key, value]) => {
			if (value && value !== "all" && value !== "") {
				params.set(key, value.toString());
			}
		});

		// Update URL without refreshing the page
		const url = `${window.location.pathname}?${params.toString()}`;
		window.history.pushState({}, "", url);
	}, [filters]);

	// Fetch products using React Query
	const { data, isLoading, isError, refetch } = useQuery({
		queryKey: ["products", filters],
		queryFn: async (): Promise<Product[]> => {
			try {
				const queryString = new URLSearchParams();

				// Add all non-empty filters to query string
				Object.entries(filters).forEach(([key, value]) => {
					if (value && value !== "all" && value !== "") {
						queryString.append(key, value.toString());
					}
				});

				const uri = `${API_URI}/products/getItem?${queryString.toString()}`;
				const res = await axios.get(uri);

				if (res.status !== 200) {
					throw new Error("Error fetching products");
				}
				return res.data.data || [];
			} catch (error) {
				console.error("Error fetching products:", error);
				throw error;
			}
		},
	});

	// Handle filter updates
	const handleApplyFilters = (newFilters: FilterState) => {
		setFilters(newFilters);
	};

	// Handle filter reset
	const handleResetFilters = () => {
		setFilters({
			category: "all",
			model: "",
			material: "",
			rating: "",
			sortBy: "price",
			sortOrder: "desc",
			minPrice: 0,
			maxPrice: "",
			isOnSale: false,
			isBestSeller: false,
		});
		refetch();
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loading />
			</div>
		);
	}

	if (isError) {
		return (
			<main>
				<Wrapper>
					<div className="text-center py-8">
						<p className="text-lg text-red-600">Error fetching products.</p>
						<Button
							variant="outline"
							className="mt-4"
							onClick={() => refetch()}
						>
							Try Again
						</Button>
					</div>
				</Wrapper>
			</main>
		);
	}

	return (
		<main className="min-h-screen px-4 py-6">
			<Wrapper>
				<div className="flex flex-col gap-6">
					<div className="flex justify-between items-center">
						<h1 className="text-2xl font-semibold">
							{filters.category === "all" ? "All Products" : filters.category}
						</h1>
						<div className="flex gap-4 items-center">
							<FilterComponent applyFilters={handleApplyFilters} />
							{Object.values(filters).some(
								(value) =>
									value && value !== "all" && value !== "" && value !== 0
							) && (
								<Button variant="ghost" size="sm" onClick={handleResetFilters}>
									Clear All
								</Button>
							)}
						</div>
					</div>

					{data && data.length > 0 ? (
						<section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
							{data.map((product) => (
								<ProductCard
									key={product._id}
									name={product.title}
									price={product.price}
									image={product.image[0]}
									images={product.image}
									slug={product.slug}
								/>
							))}
						</section>
					) : (
						<div className="text-center py-12">
							<p className="text-lg text-muted-foreground mb-4">
								No products found with the selected filters.
							</p>
							<Button variant="outline" onClick={handleResetFilters}>
								Reset Filters
							</Button>
						</div>
					)}
				</div>
			</Wrapper>
		</main>
	);
}
