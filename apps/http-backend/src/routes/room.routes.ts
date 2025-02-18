import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { createRoom } from "../controllers/room.controller";

const router: Router = Router();

router.route("/create").post(verifyJWT, createRoom);

export default router;
