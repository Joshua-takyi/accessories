"use client";

import Image from "next/image";
import Link from "next/link";
import { categoryItems } from "@/database/db";
import Carousel from "@/components/carousel";
import { Wrapper } from "@/components/wrapper";

export default function CategoriesClient() {
	if (!categoryItems || categoryItems.length === 0) {
		return <div>No categories available.</div>;
	}

	return (
		<section className="bg-[#F9FAFB] py-16 md:py-24">
			<Wrapper>
				<div className="flex flex-col space-y-8">
					{/* Header Section */}
					<div className="text-center mb-8">
						<h2 className="md:text-3xl text-bodyMd font-bold text-gray-800 mb-4">
							Shop by Category
						</h2>
						<p className="md:text-lg text-bodySm text-gray-600 max-w-2xl mx-auto">
							Explore our curated selection of premium categories, each offering
							unique and carefully selected products.
						</p>
					</div>

					{/* Carousel Section */}
					<Carousel>
						{categoryItems.map((item) => (
							<Link
								key={item.id}
								href={`/collection?category=${item.search}&sortBy=price&sortOrder=desc&limit=10&page=1`}
								prefetch={true}
								className="flex flex-col justify-center items-center p-4 group cursor-pointer"
							>
								<div className="relative aspect-square w-full max-w-[220px] overflow-hidden rounded-full">
									<Image
										src={item.image}
										alt={`Category: ${item.name}`}
										fill
										loading="lazy"
										sizes="(max-width: 640px) 100px, (max-width: 768px) 150px, (max-width: 1024px) 200px, 220px"
										priority={item.id === 0}
										className="object-cover transition-all duration-500"
									/>
								</div>
								<p className="mt-4 text-body font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
									{item.name}
								</p>
							</Link>
						))}
					</Carousel>
				</div>
			</Wrapper>
		</section>
	);
}
