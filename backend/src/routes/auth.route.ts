import express from "express";
import { check } from "express-validator";
import { verifyToken } from "../middlewares/auth.middleware";
import { logout, signIn, validateToken } from "../controllers/auth.controller";

const router = express.Router();

router.post(
   "/sign-in",
   [
      check("email", "Email is required").isEmail(),
      check("password", "Password is required").isLength({ min: 6 }),
   ],
   signIn
);

router.get("/validate-token", verifyToken, validateToken);

router.post("/logout", logout);

export default router;
