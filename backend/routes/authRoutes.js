import express from "express";
import {
  signupController,
  loginController,
  meController,
  logoutController,
} from "../controllers/authController.js";
import jwtMiddleware from "../middlewares/jwtMiddleware.js";

const router = express.Router();

router.post("/register", signupController);
router.post("/login", loginController);
router.get("/me", jwtMiddleware, meController);
router.post("/logout", logoutController);

export default router;
