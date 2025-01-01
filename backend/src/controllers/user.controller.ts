import { Request, Response } from "express";
import { User } from "../models/user.model";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../util/async-handler";
import ApiResponse from "../util/api-response";

export const me = asyncHandler(async (req: Request, res: Response): Promise<any> => {
   const userId = req.userId;

   const user = await User.findById(userId).select("-password");

   if (!user) {
      return res.status(404).json(new ApiResponse(404, {}, "User not found"));
   }

   return res.status(201).json(user);
});

export const signUp = asyncHandler(async (req: Request, res: Response): Promise<any> => {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res
         .status(400)
         .json(new ApiResponse(400, { errors: errors.array() }, "Validation failed"));
   }

   let user = await User.findOne({
      email: req.body.email,
   });

   if (user) {
      return res.status(400).json(new ApiResponse(400, {}, "User already exists"));
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
      secure: true,
      maxAge: 86400000, // TODO: change to 900000 for production
   });

   return res.status(200).json(new ApiResponse(200, {}, "User created"));
});
