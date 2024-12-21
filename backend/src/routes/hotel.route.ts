import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel.model";
import { verifyToken } from "../middlewares/auth.middleware";
import { body, param, validationResult } from "express-validator";
import { BookingType, HotelSearchResponse, HotelType } from "../shared/types";
import { constructSearchQuery } from "../util/search-query-builder";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

const router = express.Router();

router.get("/search", async (req: Request, res: Response): Promise<any> => {
   try {
      const query = constructSearchQuery(req.query);

      let sortOptions = {};

      switch (req.query.sortOption) {
         case "rating":
            sortOptions = { rating: -1 };
            break;
         case "pricePerNightAsc":
            sortOptions = { pricePerNight: 1 };
            break;
         case "pricePerNightDesc":
            sortOptions = { pricePerNight: -1 };
            break;
      }

      const limit = 5;
      const page = parseInt(req.query.page ? req.query.page.toString() : "1");
      const skip = (page - 1) * limit;

      const hotels = await Hotel.find(query).sort(sortOptions).skip(skip).limit(limit);

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

router.get(
   "/:id",
   [param("id").notEmpty().withMessage("Hotel id is required")],
   async (req: Request, res: Response): Promise<any> => {
      const errors = validationResult(req);

      if (!errors.isEmpty) {
         return res.status(400).json({ errors: errors.array() });
      }

      const id = req.params.id.toString();

      try {
         const hotel = await Hotel.findById(id);

         return res.status(200).json(hotel);
      } catch (error) {}
   }
);

router.post(
   "/:id/bookings/payment-intent",
   verifyToken,
   async (req: Request, res: Response): Promise<any> => {
      const { numberOfNights } = req.body;
      const id = req.params.id.toString();

      try {
         const hotel = await Hotel.findById(id);

         if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
         }

         const totalCost = hotel.pricePerNight * numberOfNights;

         const paymentIntent = await stripe.paymentIntents.create({
            amount: totalCost * 100,
            currency: "usd",
            metadata: {
               hotelId: id,
               userId: req.userId,
            },
         });

         if (!paymentIntent.client_secret) {
            return res.status(500).json({ message: "Error with payment intent" });
         }

         const response = {
            paymentIntentId: paymentIntent.id,
            clientSecret: paymentIntent.client_secret.toString(),
            totalCost,
         };

         return res.status(200).json(response);
      } catch (error) {
         console.log(error);
         return res.status(500).send("Internal Server Error");
      }
   }
);

router.post(
   "/:id/bookings",
   verifyToken,
   async (req: Request, res: Response): Promise<any> => {
      try {
         const paymentIntentId = req.body.paymentIntentId;

         const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

         if (!paymentIntent) {
            return res.status(404).json({ message: "Payment intent not found" });
         }

         if (
            paymentIntent.metadata.hotelId !== req.params.id ||
            paymentIntent.metadata.userId !== req.userId
         ) {
            return res.status(400).json({ message: "Invalid payment intent" });
         }

         if (paymentIntent.status !== "succeeded") {
            return res.status(400).json({ message: "Payment not successful" });
         }

         const booking: BookingType = {
            ...req.body,
            userId: req.userId,
         };

         const hotel = await Hotel.findByIdAndUpdate(req.params.id, {
            $push: { bookings: { booking } },
         });

         if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
         }

         await hotel.save();

         return res.status(201).json(booking);
      } catch (error) {
         console.log(error);
         return res.status(500).send("Internal Server Error");
      }
   }
);

export default router;
