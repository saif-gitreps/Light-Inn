import express, { Request, Response } from "express";
import { User } from "../models/user.model";
import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post(
   "/sign-in",
   [
      check("email", "Email is required").isEmail(),
      check("password", "Password is required").isLength({ min: 6 }),
   ],
   async (req: Request, res: Response): Promise<any> => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
         return res.status(400).json({
            message: errors.array(),
         });
      }

      const { email, password } = req.body;

      try {
         let user = await User.findOne({
            email,
         });

         if (!user) {
            return res.status(400).send({
               message: "Invalid credentials",
            });
         }

         const isMatch = await bcrypt.compare(password, user.password);

         if (!isMatch) {
            return res.status(400).send({
               message: "Invalid credentials",
            });
         }

         const token = jwt.sign(
            {
               userId: user._id,
            },
            process.env.JWT_SECRET_KEY as string,
            {
               expiresIn: "1d", // TODO: change to 15m for production
            }
         );

         res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000,
         });

         return res.status(200).json({
            userId: user._id,
         });
      } catch (error) {
         console.error(error);

         return res.status(500).send({
            message: "Internal server error",
         });
      }
   }
);

export default router;
