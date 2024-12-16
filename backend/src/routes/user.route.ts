import express, { Request, Response } from "express";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import { verifyToken } from "../middlewares/auth.middleware";

const router = express.Router();

// TODO : Refactor the validation logic into a separate file

router.get("/me", verifyToken, async (req: Request, res: Response): Promise<any> => {
   const userId = req.userId;

   try {
      const user = await User.findById(userId).select("-password");

      if (!user) {
         return res.status(404).json({ message: "No such user" });
      }

      return res.status(201).json(user);
   } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
   }
});

router.post(
   "/sign-up",
   [
      check("firstName", "First name is required").isString(),
      check("lastName", "Last name is required").isString(),
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

      try {
         let user = await User.findOne({
            email: req.body.email,
         });

         if (user) {
            return res.status(400).send({
               message: "User already exists",
            });
         }

         user = new User(req.body);

         await user.save();

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
            maxAge: 86400000, // TODO: change to 900000 for production
         });

         return res.status(200).send({ message: "User account created successfully" });
      } catch (error) {
         console.error(error);

         return res.status(400).send({
            message: "An error occurred",
         });
      }
   }
);

export default router;
