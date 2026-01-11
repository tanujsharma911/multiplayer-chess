import { Router } from "express";
import {
  fetchUserGames,
  fetchGameById,
} from "../controllers/game.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router: Router = Router();

router.get("/getgames", verifyJWT, fetchUserGames);
router.get("/getgame", verifyJWT, fetchGameById);

export default router;
