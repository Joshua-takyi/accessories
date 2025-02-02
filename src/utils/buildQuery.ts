/**
 * Builds a MongoDB query object based on URLSearchParams.
 * @param searchParams - The URLSearchParams object containing query parameters.
 * @returns A MongoDB query object.
 */
export const BuildQuery = (
	searchParams: URLSearchParams
): Record<string, any> => {
	const query: Record<string, any> = {}; // Use a generic object to store query conditions

	/**
	 * Helper function to add regex-based conditions.
	 * @param key - The field name in the database.
	 * @param value - The value to match (case-insensitive).
	 */
	const addRegexCondition = (key: string, value: string | null) => {
		if (value) {
			query[key] = { $regex: value, $options: "i" }; // Case-insensitive regex match
		}
	};

	/**
	 * Helper function to handle array-like parameters.
	 * @param key - The field name in the database.
	 * @param value - A comma-separated string to convert into an array.
	 */
	const addArrayCondition = (key: string, value: string | null) => {
		if (value) {
			const array = value.split(",").map((item) => item.trim()); // Split and trim values
			query[key] = { $in: array.map((item) => new RegExp(item, "i")) }; // Case-insensitive regex match
		}
	};

	// General search across multiple fields
	const search = searchParams.get("type");
	if (search) {
		const searchTerms = search
			.split(" ")
			.map((term) => term.trim())
			.filter(Boolean); // Remove empty strings
		query.$or = [
			{ title: { $regex: `\\b${search}\\b`, $options: "i" } },
			{ category: { $regex: `\\b${search}\\b`, $options: "i" } },
			{ tags: { $in: [new RegExp(`\\b${search}\\b`, "i")] } },
			{ description: { $regex: `\\b${search}\\b`, $options: "i" } },
			{
				models: {
					$in: searchTerms.map((term) => new RegExp(`\\b${term}\\b`, "i")),
				},
			},
		];
	}

	// Add individual query parameters
	addRegexCondition("title", searchParams.get("title"));
	addRegexCondition("category", searchParams.get("category"));

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

	// Array-like fields
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
