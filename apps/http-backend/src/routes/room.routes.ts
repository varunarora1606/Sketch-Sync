import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { createRoom, getRooms } from "../controllers/room.controller";

const router: Router = Router();

router.route("/create").post(verifyJWT, createRoom);
router.route("/get").get(verifyJWT, getRooms);

export default router;
