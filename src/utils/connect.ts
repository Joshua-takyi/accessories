import mongoose from "mongoose";
import logger from "@/utils/logger";

const isConnected = false;

async function ConnectDb(): Promise<void> {
    const uri = process.env.MONGODB_URI;
    try {
        if (isConnected) return;
        await mongoose.connect(uri);
        logger.info("Database connection established successfully.");
    } catch (err) {
        if (err instanceof Error) {
            logger.error(`Error connecting to database: ${err.message}`);
        }
    }
}

export default ConnectDb;
