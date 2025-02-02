// import ConnectDb from "@/utils/connect";
// import mongoose from "mongoose";
// import logger from "@/utils/logger";
// import {NextResponse} from "next/server";
// import {auth} from "@/auth"; // Use auth() for backend session retrieval
// import {CartModel, ProductModel} from "@/models/schema";
//
// interface CartProduct {
//     productId: mongoose.Types.ObjectId;
//     color: string;
//     model: string;
//     quantity: number;
//     totalPrice: number;
// }
//
// interface CartData {
//     userId: string;
//     products: CartProduct[];
//     updatedAt: Date;
// }
//
// export async function POST(req: Request) {
//     // Parse the request body to extract product details
//     const {productId, color, model, quantity} = await req.json();
//
//     try {
//         // Check if MongoDB is already connected; if not, establish a connection
//         if (mongoose.connection.readyState !== 1) {
//             await ConnectDb();
//         }
//
//         // Validate required fields
//         if (!productId || !color || !model || quantity < 1) {
//             return NextResponse.json(
//                 {message: "productId, color, model, and quantity are required"},
//                 {status: 400}
//             );
//         }
//
//         // Add debug logging
//         const session = await auth();
//         const accessToken = session?.user?.accessToken
//         if (!!accessToken) {
//             return NextResponse.json({
//                 message: "user is not authenticated",
//             }, {
//                 status: 401
//             })
//         }
//
//         // Authenticate the user and retrieve their session
//         if (!session?.user?.id) {
//             console.log("Authentication failed:", {session});
//             return NextResponse.json(
//                 {message: "user is not authenticated"},
//                 {status: 401}
//             );
//         }
//
//         // Find the product in the database using the provided productId
//         const product = await ProductModel.findOne({_id: productId});
//         if (!product) {
//             return NextResponse.json(
//                 {message: "product not found"},
//                 {status: 404}
//             );
//         }
//
//         // Check if the product is available for purchase
//         if (!product.available) {
//             return NextResponse.json(
//                 {message: "product is currently unavailable"},
//                 {status: 400}
//             );
//         }
//
//         // Check if the requested quantity exceeds the available stock
//         if (product.stock < quantity) {
//             return NextResponse.json(
//                 {message: "insufficient stock", availableStock: product.stock},
//                 {status: 400}
//             );
//         }
//
//         // Calculate the discounted price of the product and round it to two decimal places
//         const calculatedPrice =
//             Math.round(product.price * (1 - (product.discount || 0) / 100) * 100) /
//             100;
//
//         // Find the user's cart or create a new one if it doesn't exist
//         const cart = await CartModel.findOneAndUpdate<CartData>(
//             {userId: session.user.id},
//             {$setOnInsert: {products: []}},
//             {upsert: true, new: true, setDefaultsOnInsert: true}
//         );
//
//         // Check if the product already exists in the cart with the same color and model
//         const existingProductIndex = cart.products.findIndex(
//             (item) =>
//                 item.productId.equals(product._id) &&
//                 item.color === color &&
//                 item.model === model
//         );
//
//         if (existingProductIndex > -1) {
//             // If the product exists, update its quantity and total price
//             const newQuantity =
//                 cart.products[existingProductIndex].quantity + quantity;
//
//             // Check if the updated quantity exceeds the available stock
//             if (newQuantity > product.stock) {
//                 return NextResponse.json(
//                     {
//                         message: "quantity exceeds available stock",
//                         availableStock: product.stock,
//                         currentCartQuantity: cart.products[existingProductIndex].quantity,
//                     },
//                     {status: 400}
//                 );
//             }
//
//             // Update the quantity and total price of the existing product in the cart
//             cart.products[existingProductIndex].quantity = newQuantity;
//             cart.products[existingProductIndex].totalPrice =
//                 calculatedPrice * newQuantity;
//         } else {
//             // If the product doesn't exist in the cart, add it as a new item
//             cart.products.push({
//                 productId: product._id,
//                 color,
//                 model,
//                 quantity,
//                 totalPrice: calculatedPrice * quantity,
//             });
//         }
//
//         // Update the cart's last modified timestamp
//         cart.updatedAt = new Date();
//         await cart.save();
//
//         // Return a success response with the updated cart details
//         return NextResponse.json(
//             {
//                 message: "Item added to cart successfully",
//                 data: {
//                     cartId: cart._id,
//                     totalItems: cart.products.length,
//                     updatedProduct: {
//                         name: product.name,
//                         price: calculatedPrice,
//                         quantity,
//                         color,
//                         model,
//                         image: product.image[0],
//                     },
//                 },
//             },
//             {status: 201}
//         );
//     } catch (error: Error | any) {
//         // Log the error and return a 500 Internal Server Error response
//         logger.error("cart operation failed", {error});
//         return NextResponse.json(
//             {error: `failed to add item to cart: ${error.message}`},
//             {status: 500}
//         );
//     }
// }
