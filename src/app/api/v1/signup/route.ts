import {NextResponse} from "next/server";
import {z} from "zod";
import bcrypt from "bcryptjs";
import {UserAuth} from "@/models/schema";
import mongoose from "mongoose";
import ConnectDb from "@/utils/connect";


//  Zod Schema for validation
const SignupSchema = z.object({
    name: z.string().min(3, {message: "Name must be at least 3 characters."}),
    email: z.string().email({message: "Invalid email address."}),
    password: z.string().min(8, {message: "Password must be at least 8 characters."}),
});


export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Validate the request body against the schema
        const validatedData = SignupSchema.parse(body);

        const {name, email, password} = validatedData;

        if (mongoose.connection.readyState !== 1) {
            await ConnectDb()
        }
        // Check if user already exists (email check)
        const existingUser = await UserAuth.findOne({email});
        if (existingUser) {
            return NextResponse.json({
                message: `email already exists.`,
            }, {
                status: 400
            })
        }

        const hashedPassword = await bcrypt.hash(password, 12); // 12 is the salt rounds

        const newUser = await UserAuth.create({
            name,
            email,
            password: hashedPassword
        })


        // Return success response
        return NextResponse.json(
            {message: "User created successfully.", user: {id: newUser.id, name: newUser.name, email: newUser.email}},
            {status: 201} // Created
        );


    } catch (error) {
        console.error("Signup error:", error); // Log the error for debugging

        if (error instanceof z.ZodError) {
            // Handle Zod validation errors
            return NextResponse.json(
                {message: "Invalid input data.", errors: error.errors},
                {status: 400} // Bad Request
            );
        }

        return NextResponse.json(
            {
                message: "Failed to add user to DB.",
                error: error instanceof Error ? error.message : String(error),
            },
            {
                status: 500, // Internal Server Error
            }
        );
    }
}