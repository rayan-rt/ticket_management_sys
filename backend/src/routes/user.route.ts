import { Router } from "express";
import { AuthController } from "../controllers/user.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
// --

const router: Router = Router();

router.route("/signup").post(AuthController.signup);
router.route("/signin").post(AuthController.signin);
router
  .route("/signout")
  .get(AuthMiddleware.authenticate, AuthController.signOut);

export { router as userRouter };
