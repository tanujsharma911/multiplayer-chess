import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const verifyJWT = (req, res, next) => {
    try {
        const accessToken = req.cookies?.accessToken;
        if (!accessToken) {
            return res.status(403).json({
                status: "error",
                message: "Forbidden :: Missing access token",
            });
        }
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        if (!decoded) {
            return res.status(403).json({
                status: "error",
                message: "Forbidden :: Invalid access token can't decode it",
            });
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({
            status: "error",
            message: "Unauthorized :: Invalid or expired token",
        });
    }
};
//# sourceMappingURL=auth.middleware.js.map