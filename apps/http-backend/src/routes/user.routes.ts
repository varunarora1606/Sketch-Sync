import { Router } from "express";
import { authCheck, logOutUser, signInUser, signUpUser } from "../controllers/user.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router: Router = Router();

router.route('/signup').post(signUpUser)
router.route('/signin').post(signInUser)
router.route('/logout').get(verifyJWT, logOutUser)
router.route('/auth-check').get(verifyJWT, authCheck)

export default router;