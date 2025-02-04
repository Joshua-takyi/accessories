import {NextResponse} from "next/server";
import ConnectDb from "@/utils/connect";
import {UserAuth} from "@/models/schema";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export async function POST(req: Request) {
    try {
        // Validate API key
        const apiKey = req.headers.get("x-api-key");
        if (apiKey !== process.env.API_SECRET_KEY) {
            return NextResponse.json(
                {message: "Unauthorized"},
                {status: 401}
            );
        }

        // Parse request body
        const {name, auth0Id, email, password, provider = "auth0", image} = await req.json();

        // Conditional validation
        if (provider === "credentials") {
            if (!name || !email || !password) {
                return NextResponse.json(
                    {message: "Name, email, and password are required"},
                    {status: 400}
                );
            }
        } else {
            if (!name || !email) {
                return NextResponse.json(
                    {message: "Name and email are required"},
                    {status: 400}
                );
            }
        }

        // Connect to MongoDB
        if (mongoose.connection.readyState !== 1) {
            await ConnectDb();
        }

        // Check for existing user
        const existingUser = await UserAuth.findOne({email});
        if (existingUser) {
            return NextResponse.json(
                {message: "User already exists"},
                {status: 400}
            );
        }

        // Hash password only for credentials users
        const hashedPassword = provider === "credentials"
            ? await bcrypt.hash(password, 12)
            : undefined;

        // Create user
        const newUser = await UserAuth.create({
            name,
            email,
            provider,
            image,
            providerId: auth0Id, // Map auth0Id to providerId for Auth0 users
            password: hashedPassword, // Will be undefined for Auth0 users
            role: "user",
        });


        return NextResponse.json(
            {
                message: "User created successfully",
                user: {...newUser.toObject(), password: undefined},
            },
            {status: 201}
        );
    } catch (error) {
        console.error("Failed to create user:", error);
        return NextResponse.json(
            {message: "Internal server error"},
            {status: 500}
        );
    }
}