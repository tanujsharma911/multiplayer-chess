import { Router } from "express";
import {
  googleLogin,
  userLogout,
  getUserInfo,
  refreshAccessToken,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const route: Router = Router();

route.get("/google", googleLogin);
route.get("/getuser", verifyJWT, getUserInfo);
route.get("/refresh-token", refreshAccessToken);
route.get("/logout", verifyJWT, userLogout);

export default route;
