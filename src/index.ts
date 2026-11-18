
import dotenv from "dotenv";
import app from "./app";
import connectDB from "./config/db";

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async (): Promise<void> => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Start Express server for local development
        app.listen(PORT, () => {
            console.log(`UniFlow server running on port ${PORT}`);
            console.log(`Server URL: http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Failed to start UniFlow server:", error);
        process.exitCode = 1;
    }
};

// Start local server
startServer();
