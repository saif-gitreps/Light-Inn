import express, { Request, Response } from "express";
import Hotel from "../models/hotel.model";
import { asyncHandler } from "../util/async-handler";

const router = express.Router();

router.get(
   "/",
   asyncHandler(async (req: Request, res: Response): Promise<any> => {
      const hotels = await Hotel.find({
         bookings: {
            $elemMatch: {
               userId: req.userId,
            },
         },
      });

      const results = hotels.map((hotel) => {
         const booking = hotel.bookings.find((booking) => booking.userId === req.userId);
         return {
            ...hotel.toObject(),
            booking,
         };
      });

      return res.status(200).json(results);
   })
);

export default router;
