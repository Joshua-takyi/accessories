// First, let's define a type for the query object
type QueryValue =
	| string
	| number
	| boolean
	| Date
	| RegExp
	| { $regex: RegExp }
	| { $in: RegExp[] | string[] }
	| { $gte?: number; $lte?: number }
	| { $or: Array<{ [key: string]: { $regex: RegExp } | { $in: RegExp[] } }> };

export const BuildQuery = (
	searchParams: URLSearchParams
): Record<string, QueryValue> => {
	const query: Record<string, QueryValue> = {};

	// Helper function to add array conditions
	const addArrayCondition = (key: string, value: string | null) => {
		if (value) {
			const array = value.split(",").map((item) => item.trim());
			query[key] = { $in: array.map((item) => new RegExp(item, "i")) };
		}
	};

	// General search across multiple fields using the "type" parameter
	const search = searchParams.get("type");
	if (search) {
		const searchTerms = search
			.split(" ")
			.map((term) => term.trim())
			.filter(Boolean);

		query.$or = [
			{ title: { $regex: new RegExp(`\\b${search}\\b`, "i") } },
			{ category: { $regex: new RegExp(`\\b${search}\\b`, "i") } },
			{ tags: { $in: [new RegExp(`\\b${search}\\b`, "i")] } },
			{ description: { $regex: new RegExp(`\\b${search}\\b`, "i") } },
			{
				models: {
					$in: searchTerms.map((term) => new RegExp(`\\b${term}\\b`, "i")),
				},
			},
		];
	}

	// Update category query parameter to handle single or multiple categories.
	// This supports both comma-separated values and multiple category parameters.
	const categoryParams = searchParams.getAll("category");
	if (categoryParams.length > 0) {
		// Split by comma if necessary and flatten the result.
		const categories = categoryParams
			.flatMap((param) => param.split(","))
			.map((cat) => cat.trim())
			.filter(Boolean);

		// Use an exact match if only one category is provided,
		// otherwise use the $in operator.
		if (categories.length === 1) {
			query.category = categories[0];
		} else if (categories.length > 1) {
			query.category = { $in: categories };
		}
	}

	// Numeric fields
	const price = searchParams.get("price");
	if (price) query.price = parseFloat(price);

	const rating = searchParams.get("rating");
	if (rating) query.rating = parseFloat(rating);

	const discount = searchParams.get("discount");
	if (discount) query.discount = parseFloat(discount);

	// Boolean fields
	const isOnSale = searchParams.get("isOnSale");
	if (isOnSale !== null) query.isOnSale = isOnSale === "true";

	const isFeatured = searchParams.get("isFeatured");
	if (isFeatured !== null) query.isFeatured = isFeatured === "true";

	const isBestSeller = searchParams.get("isBestSeller");
	if (isBestSeller !== null) query.isBestSeller = isBestSeller === "true";

	const available = searchParams.get("available");
	if (available !== null) query.available = available === "true";

	// Date fields
	const salesStartAt = searchParams.get("salesStartAt");
	if (salesStartAt) query.salesStartAt = new Date(salesStartAt);

	const salesEndAt = searchParams.get("salesEndAt");
	if (salesEndAt) query.salesEndAt = new Date(salesEndAt);

	// Price filtering
	const minPrice = searchParams.get("minPrice");
	const maxPrice = searchParams.get("maxPrice");
	if (minPrice || maxPrice) {
		query.price = {};
		if (minPrice) query.price.$gte = parseFloat(minPrice);
		if (maxPrice) query.price.$lte = parseFloat(maxPrice);
	}

	// Array-like fields for tags and models
	addArrayCondition("tags", searchParams.get("tags"));
	addArrayCondition("models", searchParams.get("models"));

	return query;
};

interface SortProps {
	sortBy: string;
	sortOrder: string;
}

export const BuildSort = ({
	sortBy,
	sortOrder,
}: SortProps): Record<string, 1 | -1> => {
	return { [sortBy]: sortOrder === "desc" ? -1 : 1 };
};
