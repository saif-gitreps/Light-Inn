import express from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { param } from "express-validator";
import {
   addBooking,
   createBookingPaymentIntent,
   fetchHotelById,
   fetchHotels,
} from "../controllers/hotel.controller";

const router = express.Router();

router.get("/search");

router.get("/", fetchHotels);

router.get(
   "/:id",
   [param("id").notEmpty().withMessage("Hotel id is required")],
   fetchHotelById
);

router.post("/:id/bookings/payment-intent", verifyToken, createBookingPaymentIntent);

router.post("/:id/bookings", verifyToken, addBooking);

export default router;
