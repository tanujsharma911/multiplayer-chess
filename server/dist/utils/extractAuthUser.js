import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const extractAuthUser = (accessToken) => {
    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        return decoded;
    }
    catch (error) {
        console.error("❌ Failed to extract user from token:", error);
        return null;
    }
};
//# sourceMappingURL=extractAuthUser.js.map