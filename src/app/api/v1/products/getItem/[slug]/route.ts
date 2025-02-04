// Import necessary modules
import NodeCache from "node-cache";
import { NextResponse } from "next/server";
import ConnectDb from "@/utils/connect";
import mongoose from "mongoose";
import { ProductModel } from "@/models/schema";
import logger from "@/utils/logger";

// Add this interface near the top of the file, after the imports
interface Product {
	_id: string;
	slug: string;
	title: string;
	description: string;
	price: number;
	stock: number;
	image: string;
	details?: string;
	features?: string[];
	materials?: string[];
	category: string;
	reviews?: any[]; // If you have a specific review type, use that instead
	comments?: any[]; // If you have a specific comment type, use that instead
	discount?: number;
	colors?: string[];
	models?: string[];
}

// Configure cache settings for production
// - Increased TTL to 5 minutes
// - Check period set to 10 minutes
// - Disabled cloning for better performance
const cache = new NodeCache({
	stdTTL: 300, // Cache expires after 5 minutes
	checkperiod: 600, // Cache cleanup every 10 minutes
	useClones: false, // Disable cloning for performance
});

// Define a reusable projection object for database queries
// This ensures only necessary fields are fetched, reducing data transfer
const PRODUCT_PROJECTION = {
	slug: 1,
	title: 1,
	description: 1,
	price: 1,
	stock: 1,
	image: 1,
	details: 1,
	features: 1,
	materials: 1,
	category: 1,
	reviews: 1,
	comments: 1,
	discount: 1,
	colors: 1,
	models: 1,
	_id: 1,
};

// Middleware to ensure MongoDB connection is established once
let isConnected = false;

async function ensureDbConnection() {
	if (!isConnected) {
		await ConnectDb(); // Establish connection
		isConnected = true;
	}
}

// API handler for fetching a single product by slug
export async function GET(
	req: Request,
	{ params }: { params: { slug: string } }
) {
	const { slug } = await params; // Extract slug from route parameters

	try {
		// Step 1: Check if the product is cached
		const cachedProduct = cache.get<Product>(slug);
		if (cachedProduct) {
			return NextResponse.json({
				message: "Product found",
				data: cachedProduct,
				source: "cache",
			});
		}

		// Step 2: Ensure the database connection is established
		await ensureDbConnection();

		// Step 3: Query the database for the product using findOne
		const product = await ProductModel.findOne(
			{ slug }, // Match by slug
			PRODUCT_PROJECTION // Use projection to limit fields
		).lean(); // Use lean() to get plain JavaScript objects instead of Mongoose documents

		// Step 4: Handle cases where the product is not found
		if (!product) {
			logger.warn("Product not found", { slug });
			return NextResponse.json(
				{ message: "Product not found" },
				{ status: 404 }
			);
		}

		// Step 5: Cache the product for future requests
		cache.set(slug, product); // Store in cache
		logger.info("Product cached", { slug });

		// Step 6: Return the product as JSON response
		return NextResponse.json({
			message: "Product found",
			data: product,
			source: "database",
		});
	} catch (error) {
		// Step 7: Log and handle errors gracefully
		logger.error("Failed to fetch product", { error, slug });
		const statusCode = error instanceof mongoose.Error ? 400 : 500;
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json(
			{ message: "Failed to fetch product", error: errorMessage },
			{ status: statusCode }
		);
	}
}
