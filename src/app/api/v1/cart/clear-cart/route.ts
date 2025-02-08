// app/api/clear-cart/route.ts
import {NextResponse} from "next/server";
import mongoose from "mongoose";
import ConnectDb from "@/utils/connect"; // Adjust the import path as needed
import {CartModel} from "@/models/schema"; // Adjust the import path as needed
import {auth} from "@/auth";  // Adjust the import path as needed

export async function POST(req: Request, res: Response) {
    try {
        const session = await auth();
        const userId = session?.user.id;

        if (!userId) {
            return NextResponse.json({message: "Unauthorized - User not logged in"}, {status: 401});
        }

        if (mongoose.connection.readyState !== 1) {
            await ConnectDb();
        }

        const data = await CartModel.deleteMany({userId: userId});

        if (!data) {
            return NextResponse.json({message: "Cart not found or already empty"}, {status: 404});  // Use 404 for not found
        }

        return NextResponse.json({message: "Cart cleared successfully."}, {status: 200});
    } catch (error: any) {
        console.error("Error clearing cart:", error);
        return NextResponse.json({message: "Failed to clear cart", error: error.message}, {status: 500});
    }
}