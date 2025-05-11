import express from "express";
import { check } from "express-validator";
import { verifyToken } from "../middlewares/auth.middleware";
import { me, signUp } from "../controllers/user.controller";
import { User } from "../models/user.model";

const router = express.Router();

router.get("/me", verifyToken, me);

router.post(
   "/sign-up",
   [
      check("firstName", "First name is required").isString(),
      check("lastName", "Last name is required").isString(),
      check("email", "Email is required").isEmail(),
      check("password", "Password is required").isLength({ min: 6 }),
   ],
   signUp
);

router.get("/search", verifyToken, async (req, res): Promise<any> => {
   try {
      const { q } = req.query;
      const currentUserId = req.userId;

      // if (!q || typeof q !== "string") {
      //    return res.status(400).json({ message: "Search query is required" });
      // }

      // Find users whose name matches the search query (case insensitive)
      // Exclude the current user from results
      const users = await User.find({
         _id: { $ne: currentUserId },
         name: { $regex: q, $options: "i" },
      })
         .select("name avatar")
         .limit(10);

      res.status(200).json(users);
   } catch (error) {
      console.error("Error searching users:", error);
      res.status(500).json({ message: "Failed to search users" });
   }
});

export default router;
