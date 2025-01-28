import mongoose, { Schema, Document, Model } from "mongoose";

// Define the UserData interface
interface UserData extends Document {
    name: string; // Use `string` instead of `String`
    password: string;
    role: string;
    email: string;
    image?: string;
    providersId?: string;
}

// Define the schema for the user authentication
const userAuthSchema: Schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            select: false, // Ensure password is not returned by default
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        image: {
            type: String,
            required: false, // Explicitly mark as not required
        },
        role: {
            type: String,
            default: "user",
            enum: ["user", "admin"], // Limit to specific roles
        },
        providersId: {
            type: String,
            required: false, // Explicitly mark as not required
        },
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt
    }
);

// Create or reuse the User model
const UserAuth: Model<UserData> = mongoose?.models?.UserAuth || mongoose.model<UserData>("UserAuth", userAuthSchema);

export { UserAuth };
