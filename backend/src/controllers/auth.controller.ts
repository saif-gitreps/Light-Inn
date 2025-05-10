import { Request, Response } from "express";
import { User } from "../models/user.model";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { asyncHandler } from "../util/async-handler";
import ApiResponse from "../util/api-response";

export const signIn = asyncHandler(async (req: Request, res: Response): Promise<any> => {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res
         .status(200)
         .json(new ApiResponse(400, { errors: errors.array() }, "Validation failed"));
   }

   const { email, password } = req.body;

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
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
   });

   return res.status(200).json({
      userId: user._id,
      token,
   });
});

export const validateToken = asyncHandler((req: Request, res: Response): any => {
   return res.status(200).json({
      userId: req.userId,
   });
});

export const logout = asyncHandler((req: Request, res: Response): any => {
   res.clearCookie("auth_token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
   });

   res.status(200).json(new ApiResponse(200, {}, "Logged out successfully"));
});
