import logger from "@/utils/logger";
import { NextResponse } from "next/server";
import ConnectDb from "@/utils/connect";
import mongoose from "mongoose";
 import bcrypt from "bcryptjs";
import {UserAuth} from "@/models/schema";

export async function POST(req: Request) {
    try {
        // Parse the request body
        const { name, email, password } = await req.json();

        // Validate input
        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "Name, email, and password are required" },
                { status: 400 }
            );
        }

        // Check MongoDB connection
        if (mongoose.connection.readyState !== 1) {
            await ConnectDb();
        }

        // Check if the user already exists
        const existingUser = await UserAuth.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: "User with this email already exists" },
                { status: 409 }
            );
        }

        //     hash password
        const hashedPassword= await bcrypt.hash(password, 12);
        // Create a new user
        const newUser = await UserAuth.create({ name, email, password:hashedPassword, role: "user" });

        // Return success response
        return NextResponse.json(
            { message: "User created successfully", user: newUser },
            { status: 201 }
        );
    } catch (error) {
        // Log the error
        logger.error(`Failed to create account: ${error instanceof Error ? error.message : "Unknown error"}`);

        // Return error response
        return NextResponse.json(
            { message: "Failed to create account" },
            { status: 500 }
        );
    }
}