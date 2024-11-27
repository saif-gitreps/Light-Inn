import express, { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/sign-up", async (req: Request, res: Response): Promise<any> => {
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

      return res.sendStatus(200);
   } catch (error) {
      console.error(error);

      return res.status(400).send({
         message: "An error occurred",
      });
   }
});

export default router;
