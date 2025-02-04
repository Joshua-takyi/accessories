"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, Share2, Eye } from "lucide-react";

const formatPrice = (price: number, currency = "GHS") => {
	return new Intl.NumberFormat("en-GH", {
		style: "currency",
		currency,
	}).format(price);
};

interface ProductCardProps {
	name: string;
	color?: string;
	price: number;
	image: string;
	discount?: number;
	images: string[];
	slug: string;
	inStock?: boolean;
	isNew?: boolean;
}

export const ProductCard = ({
	name,
	color,
	price,
	image,
	discount = 0,
	images,
	slug,
	inStock = true,
	isNew = false,
}: ProductCardProps) => {
	const [isHovered, setIsHovered] = useState(false);
	const [isWishlist, setIsWishlist] = useState(false);

	const hasDiscount = discount > 0;
	const discountedPrice = hasDiscount
		? price - (price * discount) / 100
		: price;
	const formattedPrice = formatPrice(price);
	const formattedDiscountedPrice = hasDiscount
		? formatPrice(discountedPrice)
		: null;
	const formattedName = name.length > 25 ? `${name.substring(0, 25)}...` : name;

	const handleWishlist = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsWishlist((prev) => !prev);
	};

	const handleShare = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		try {
			await navigator.share({
				title: name,
				text: `Check out this ${name}`,
				url: window.location.origin + `/product/${slug}`,
			});
		} catch (err) {
			console.error("Share failed:", err);
		}
	};

	return (
		<Link
			href={`/product/${slug}`}
			prefetch // Preload the target page
			passHref // Ensure proper handling of href
			className="group relative w-full max-w-[280px]"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)} // Reset hover state instantly
		>
			{/* Image Container */}
			<div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg">
				{/* Badges */}
				<div className="absolute left-2 top-2 z-10 flex flex-col gap-1.5">
					{hasDiscount && (
						<span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
							-{discount}%
						</span>
					)}
					{isNew && (
						<span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs font-medium text-white">
							New
						</span>
					)}
					{!inStock && (
						<span className="rounded-full bg-gray-500 px-2 py-0.5 text-xs font-medium text-white">
							Out of Stock
						</span>
					)}
				</div>

				{/* Quick Action Buttons */}
				<div
					className="absolute right-2 top-2 z-10 flex flex-col gap-1.5 transition-all duration-300 ease-in-out"
					style={{
						opacity: isHovered ? 1 : 0,
						transform: isHovered ? "translateX(0)" : "translateX(10px)",
					}}
				>
					<button
						onClick={handleWishlist}
						className="rounded-full bg-white/90 p-1.5 shadow-sm transition-transform duration-200 hover:scale-110 active:scale-95"
					>
						<Heart
							className={`h-4 w-4 transition-colors duration-200 ${
								isWishlist ? "fill-red-500 text-red-500" : "text-gray-600"
							}`}
						/>
					</button>
					<button
						onClick={handleShare}
						className="rounded-full bg-white/90 p-1.5 shadow-sm transition-transform duration-200 hover:scale-110 active:scale-95"
					>
						<Share2 className="h-4 w-4 text-gray-600" />
					</button>
				</div>

				{/* Main Image */}
				<div
					className="absolute inset-0 transition-opacity duration-500 ease-in-out"
					style={{ opacity: isHovered && images.length > 1 ? 0 : 1 }}
				>
					<Image
						src={image}
						alt={`${name} - ${color}`}
						fill
						sizes="(max-width: 640px) 90vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
						className="object-contain object-center transition-transform duration-500 ease-in-out"
						priority={false}
					/>
				</div>

				{/* Secondary Image */}
				{images.length > 1 && (
					<div
						className="absolute inset-0 transition-opacity duration-500 ease-in-out"
						style={{ opacity: isHovered ? 1 : 0 }}
					>
						<Image
							src={images[1]}
							alt={`${name} - ${color} - Alternate`}
							fill
							sizes="(max-width: 640px) 90vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
							className="object-contain object-center"
							priority={false}
						/>
					</div>
				)}

				{/* Quick View Button */}
				<div
					className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2 transform transition-all duration-300 ease-in-out"
					style={{
						opacity: isHovered ? 1 : 0,
						transform: `translate(-50%, ${isHovered ? "0" : "10px"})`,
					}}
				>
					<button
						className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-transform duration-200 hover:scale-105 active:scale-95"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation(); // Prevent navigation
						}}
					>
						<Eye className="h-3 w-3" />
						Quick View
					</button>
				</div>
			</div>

			{/* Product Info */}
			<div className="mt-3 space-y-1">
				<h3 className="text-sm font-medium text-gray-900 line-clamp-2 transition-colors duration-200 group-hover:text-orange-600">
					{formattedName}
				</h3>
				{color && <p className="text-xs text-gray-500 capitalize">{color}</p>}
				<div className="flex items-center gap-2">
					{hasDiscount ? (
						<>
							<p className="text-sm font-medium text-gray-900">
								{formattedDiscountedPrice}
							</p>
							<p className="text-xs text-gray-400 line-through">
								{formattedPrice}
							</p>
						</>
					) : (
						<p className="text-sm font-medium text-gray-900">
							{formattedPrice}
						</p>
					)}
				</div>
				{!inStock && <p className="text-xs text-red-500">Out of Stock</p>}
			</div>
		</Link>
	);
};

export default ProductCard;
