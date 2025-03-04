import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { changeRoomName, createRoom, deleteRoom, getRoomById, getRooms } from "../controllers/room.controller";

const router: Router = Router();

router.route("/create").post(verifyJWT, createRoom);
router.route("/name").patch(verifyJWT, changeRoomName);
router.route("/get").get(verifyJWT, getRooms);
router.route("/get/:roomId").get(getRoomById);
router.route("/delete").delete(verifyJWT, deleteRoom);

export default router;
