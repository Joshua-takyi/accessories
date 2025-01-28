import mongoose from "mongoose";
import logger from "@/utils/logger";

async function ConnectDb(): Promise<void> {
    const uri = process.env.MONGODB_URI;

    // Validate the connection URI
    if (!uri) {
        throw new Error("Database connection URI is not defined in environment variables.");
    }

    try {
        // Use mongoose's readyState to check connection status
        if (mongoose.connection.readyState > 0) {
            logger.info("Reusing the existing database connection.");
            return;
        }

        // Establish a new connection
        await mongoose.connect(uri);
        logger.info("Database connection established successfully.");
    } catch (err) {
        if (err instanceof Error) {
            logger.error(`Error connecting to database: ${err.message}`);
        }
    }
}

export default ConnectDb;
