import { Router } from "express";
import { getAllChats } from "../controllers/chat.controller";

const router: Router = Router();

router.route('/get/:roomId').get(getAllChats)

export default router;
