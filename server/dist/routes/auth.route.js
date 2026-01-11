import { Router } from "express";
import { googleLogin, userLogout, getUserInfo, refreshAccessToken, } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const route = Router();
route.get("/google", googleLogin);
route.get("/getuser", verifyJWT, getUserInfo);
route.get("/refresh-token", refreshAccessToken);
route.post("/logout", verifyJWT, userLogout);
export default route;
//# sourceMappingURL=auth.route.js.map