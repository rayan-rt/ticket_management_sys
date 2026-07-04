import { Router } from "express";
import { AuthController } from "../controllers/user.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { authRateLimit } from "../middlewares/rate_limit.middleware";
// --

const router: Router = Router();

router.route("/signup").post(authRateLimit, AuthController.signup);
router.route("/signin").post(authRateLimit, AuthController.signin);
router
  .route("/signout")
  .get(AuthMiddleware.authenticate, AuthController.signOut);

export { router as userRouter };
