import { NextResponse } from "next/server";
import { auth } from "@/auth"; // Import authentication functions
import { CartModel, ProductModel } from "@/models/schema";
import mongoose from "mongoose";
import ConnectDb from "@/utils/connect"; // Import Mongoose models
import logger from "@/utils/logger";
/**
 * @description Adds an item to the user's cart.
 * @route POST /api/cart/addItemToCart
 * @access Private (requires authentication)
 */
export async function POST(req: Request) {
    try {
        // 1. Extract data from the request body
        const { productId, color, model, quantity } = await req.json();

        // 2. Input Validation: Ensure all required fields are present
        if (!productId || !color || !model || !quantity) {
            logger.warn("Missing required fields for adding to cart.");
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        if(mongoose.connection.readyState !== 1){
            await ConnectDb()
        }
        // 3. Authentication: Check if the user is authenticated and retrieve user ID
        const session = await auth();
        const accessToken = session?.user.accessToken;
        const userId = session?.user.id;

        // 4. Authentication Check: Ensure user is logged in and has a valid access token.  This is CRUCIAL for security!
        if (!accessToken ) {
            logger.warn("User is not authenticated.");
            return NextResponse.json(
                { message: "User is not authenticated" },
                { status: 401 }
            );
        }

        // 5. Product Existence Check: Verify that the product exists in the database
        const product = await ProductModel.findOne({ _id: productId })
            .select("price discount available stock title image") // Select only necessary fields to optimize query
            .lean(); // Use lean() for faster reads if you don't need Mongoose document functionality

        if (!product) {
            logger.warn(`Product with ID ${productId} not found.`);
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        // 6. Product Availability Check: Ensure the product is currently available
        if (!product.available) {
            logger.warn(`Product with ID ${productId} is not available.`);
            return NextResponse.json(
                { message: "Product is not available at the moment" },
                { status: 400 }
            );
        }

        // 7. Stock Check: Verify that there's sufficient stock to fulfill the requested quantity
        if (product.stock < quantity) {
            logger.warn(
                `Insufficient stock for product ID ${productId}.  Requested: ${quantity}, Available: ${product.stock}`
            );
            return NextResponse.json({
                message: "Quantity is greater than stock",
                availableStock: product.stock,
            });
        }

        // 8. Price Calculation: Calculate the total price, applying any discounts. Round the result to handle potential floating-point precision issues.
        const totalPrice = Math.round(
            product.price * (1 - (product.discount || 0) / 100)
        );

        // 9. Cart Handling:  Find or create the user's cart
        const cart = await CartModel.findOneAndUpdate(
            { userId: userId }, // Find the cart by user ID
            {}, // Update document
            {
                upsert: true, // Create a new cart if one doesn't exist
                new: true, // Return the updated cart
                setDefaultsOnInsert: true, // Apply schema defaults if a new cart is created
            }
        );

        // 10. Existing Product Check:  Determine if the product is already in the cart (with the same color and model)
        const existingProductIndex = cart.products.findIndex(
            (item) =>
                item.productId.equals(productId) &&
                item.color === color &&
                item.model === model
        );

        if (existingProductIndex > -1) {
            // A. Update Existing Product Quantity:  If the product already exists, increase the quantity
            const newQuantity = cart.products[existingProductIndex].quantity + quantity;

            // B. Stock Check (again): Ensure the updated quantity doesn't exceed the available stock
            if (newQuantity > product.stock) {
                logger.warn(
                    `New quantity for product ID ${productId} exceeds stock.  Requested: ${newQuantity}, Available: ${product.stock}`
                );
                return NextResponse.json(
                    { message: "New quantity is greater than stock" },
                    { status: 400 }
                );
            }

            // C. Update Cart Item: Update the quantity and total price of the existing item
            cart.products[existingProductIndex].quantity = newQuantity;
            cart.products[existingProductIndex].totalPrice = totalPrice * newQuantity;
        } else {
            // B. Add New Product to Cart: If the product doesn't exist in the cart, add it as a new item
            cart.products.push({
                productId: productId,
                quantity: quantity,
                color,
                model,
                totalPrice: totalPrice * quantity,
            });
        }

        // 11. Save Cart Changes: Update the cart's modification timestamp and save the changes to the database
        cart.updatedAt = new Date();
        await cart.save();

        // 12. Successful Response:  Return a success message with the cart details and updated product information
        return NextResponse.json({
            message: "Item added to cart",
            data: {
                cartId: cart._id,
                totalItems: cart.products.length,
                updatedProduct: {
                    item: product.title,
                    price: totalPrice,
                    quantity,
                    color,
                    model,
                    image: product.image[0],
                },
            },
        },{
            status:201
        });
    } catch (error: any) {
        // 13. Error Handling:  Catch any errors that occur during the process and return an error response
        logger.error("Error adding item to cart:", error); // Log the error for debugging
        return NextResponse.json(
            {
                message: "Failed to add items to cart",
                error: error instanceof Error ? error.message : String(error), // Provide a user-friendly error message
            },
            { status: 500 }
        );
    }
}

/**
 * @description Updates an item in the user's cart, including options to increase/decrease quantity.
 * @route PATCH /api/cart (The productId is passed in the request body)
 * @access Private (requires authentication)
 */
export async function PATCH(req: Request) {
       const {productId,color,model,quantity,action} = await req.json()
    try {
        if (!productId || !quantity || !action) {
            return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        }
        const session = await auth();
        if (!session?.user?.accessToken) {
            return NextResponse.json(
                { message: "Authentication required" },
                { status: 401 }
            );
        }
        const userId = session?.user?.id;
        if (!userId) {
            return NextResponse.json(
                { message: "User ID not found" },
                { status: 401 }
            );
        }

        if (mongoose.connection.readyState !== 1) {
            await ConnectDb();
        }

        // Fetch the product to get current price
        const productDetails = await ProductModel.findById(productId)
            .select("price discount")
            .lean();
        if (!productDetails) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        // Calculate price with discount
        const calculatedPrice =
           Math.round(productDetails.price * (1 - (productDetails.discount || 0) / 100))

        const cart = await CartModel.findOne({ userId });
        if (!cart) {
            return NextResponse.json({ message: "Cart not found" }, { status: 404 });
        }

        const productIndex = cart.products.findIndex(
            (item) =>
                item.productId.toString() === productId &&
                (!color || item.color === color) &&
                (!model || item.model === model)
        );
        if (productIndex === -1) {
            return NextResponse.json(
                { message: "Product not found in cart" },
                { status: 404 }
            );
        }
        if (quantity <= 0) {
            return NextResponse.json(
                { message: "Quantity must be a positive number" },
                { status: 400 }
            );
        }
        // Update the quantity based on the action
        const product = cart.products[productIndex];
        if (action === "increment") {
            product.quantity += quantity;
        } else if (action === "decrement") {
            product.quantity -= quantity;
        }
        // Update total price using the calculated price
        product.totalPrice = calculatedPrice * product.quantity;
        await cart.save();
        return NextResponse.json({
            message: `Product quantity ${action}ed successfully`,
            data: {
                cartId: cart._id,
                totalItems: cart.products.length,
                updatedProduct: {
                    productId: product.productId,
                    color: product.color,
                    model: product.model,
                    quantity: product.quantity,
                    totalPrice: product.totalPrice,
                },
            },
        });
    } catch (error: any) {
        logger.error("Error updating cart item:", error);
        return NextResponse.json(
            {
                message: "Failed to update cart item",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}





/**
 * @description Deletes a specific product from the user's cart.
 * @route DELETE /api/cart
 * @access Private (requires authentication)
 */
export async function DELETE(req: Request) {
    try {
        // 1. Database Connection Check (Optional): Ensure the database connection is active.  This might be handled globally in your app.
        if (mongoose.connection.readyState !== 1) {
            logger.log("Connecting to the database...");
            await ConnectDb(); // Establish database connection
        }

        // 2. Extract data from the request body (productId, color, model).
        const { productId, color, model } = await req.json();

        // 3. Validate productId.
        if (!productId || !/^[0-9a-fA-F]{24}$/.test(productId)) {
            logger.warn("Invalid productId provided.");
            return NextResponse.json(
                { message: "Invalid productId" },
                { status: 400 }
            );
        }

        // 4. Authentication: Verify user is authenticated and retrieve userId.
        const session = await auth();
        const accessToken= session?.user?.accessToken;
        const userId = session?.user.id;

        if (!accessToken) {
            logger.warn("User is not authenticated.");
            return NextResponse.json(
                { message: "User is not authenticated" },
                { status: 401 } // Use 401 for authentication failures
            );
        }

        // 5. Find the user's cart.
        const cart = await CartModel.findOne({ userId: userId });

        if (!cart) {
            logger.warn(`Cart not found for user ID ${userId}.`);
            return NextResponse.json(
                { message: "Cart not found" },
                { status: 404 }
            );
        }

        // 6. Find the index of the product to remove based on productId, color, and model (matching logic from POST/PATCH).  This is crucial!
        const productIndex = cart.products.findIndex(
            (product) =>
                product.productId.toString() === productId &&
                product.color === color &&
                product.model === model
        );

        if (productIndex === -1) {
            logger.warn(
                `Product with ID ${productId}, color ${color}, and model ${model} not found in the user's cart.`
            );
            return NextResponse.json(
                { message: "Product not found in cart" },
                { status: 404 }
            );
        }

        // 7. Remove the product from the cart's `products` array.
        cart.products.splice(productIndex, 1); // Remove 1 element at the productIndex

        // 8. Mark the cart as modified and save it.
        cart.markModified('products'); // Required to tell Mongoose the subdocument array changed
        cart.updatedAt = new Date(); // Update the updatedAt timestamp
        await cart.save();

        // 9. Success Response: Return a success message.
        return NextResponse.json(
            { message: "Product removed from cart successfully", cart },
            { status: 200 }
        );

    } catch (error: any) {
        // 10. Error Handling: Handle any errors during the process.
        logger.error("Error deleting cart item:", error);
        return NextResponse.json(
            {
                message: "Failed to delete item from cart",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}


/**
 * @description Retrieves the user's cart based on their user ID.
 * @route GET /api/cart
 * @access Private (requires authentication)
 */
export async function GET(req: Request) {
    try {
        // 1. Authentication: Verify user is authenticated and get their ID.
        const session = await auth();
        const userId = session?.user.id;

        if (!userId) {
            logger.warn("User is not authenticated.");
            return NextResponse.json(
                { message: "User is not authenticated" },
                { status: 401 } // Use 401 for unauthorized access
            );
        }

        // 2. Database Connection Check: Ensure the database connection is active.
        if (mongoose.connection.readyState !== 1) {
            logger.log("Connecting to the database...");
            await ConnectDb(); // Establish database connection
        }

        // 3. Find the cart based on the user ID and populate the product details
        const cart = await CartModel.findOne({ userId: userId }).populate({
            path: 'products.productId',
            select: 'title price image', // Select the fields you need from the ProductModel
            model: "ProductModel" //Added model parameter
        }).lean();

        // 4. Cart Not Found: If no cart is found for the user, return a 404.
        if (!cart) {
            return NextResponse.json(
                {
                    message: "Cart not found",
                    data: { products: [], total: 0 },
                },
                { status: 200 }
            );
        }

// Calculate total and format response
        const formattedProducts = cart.products.map((item) => {
            const product = item.productId;
            const calculatedPrice =
                product.price * (1 - (product.discount || 0) / 100);
            return {
                productId: product._id,
                slug: product.slug,
                name: product.title,
                price: calculatedPrice,
                originalPrice: product.price,
                discount: product.discount,
                quantity: item.quantity,
                color: item.color,
                model: item.model,
                totalPrice: calculatedPrice * item.quantity,
                image: product.image[0],
                stock: product.stock,
                available: product.available,
            };
        });

        const cartTotal = formattedProducts.reduce(
            (sum, item) => sum + item.totalPrice,
            0
        );

        return NextResponse.json({
            data: {
                products: formattedProducts,
                total: cartTotal,
                updatedAt: cart.updatedAt,
            },
        });
    } catch (error: any) {
        // 6. Error Handling: Catch and handle any errors.
        logger.error("Error getting cart:", error instanceof Error ? error.message : String(error));
        return NextResponse.json(
            {
                message: "Failed to get cart",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 } // Indicate server error
        );
    }
}