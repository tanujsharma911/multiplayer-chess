import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
dotenv.config();
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL + `/${DB_NAME}`);
        console.log("\x1b[32m%s\x1b[0m", "\n💾  Connected to MongoDB");
    }
    catch (error) {
        console.log("\x1b[31m%s\x1b[0m", "Error connecting to MongoDB:", error);
        process.exit(1);
    }
};
export { connectDB };
//# sourceMappingURL=index.js.map