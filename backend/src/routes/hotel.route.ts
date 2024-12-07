import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel.model";
import { verifyToken } from "../middlewares/auth.middleware";
import { body } from "express-validator";
import { HotelSearchResponse, HotelType } from "../shared/types";

const router = express.Router();

router.get("/search", async (req: Request, res: Response): Promise<any> => {
   try {
      const limit = 5;
      const page = parseInt(req.query.page ? req.query.page.toString() : "1");
      const skip = (page - 1) * limit;

      const hotels = await Hotel.find().skip(skip).limit(limit);

      const total = await Hotel.countDocuments();

      const response: HotelSearchResponse = {
         data: hotels,
         pagination: {
            total,
            page,
            pages: Math.ceil(total / limit),
         },
      };

      return res.status(200).json(response);
   } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
   }
});

export default router;
