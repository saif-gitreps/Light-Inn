import express, { Request, Response } from "express";
import Hotel from "../models/hotel.model";

const router = express.Router();

router.get("/", async (req: Request, res: Response): Promise<any> => {
   try {
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
   } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
   }
});

export default router;
