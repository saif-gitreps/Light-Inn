import express from "express";
import multer from "multer";
import { verifyToken } from "../middlewares/auth.middleware";
import { body } from "express-validator";
import {
   addHotel,
   fetchMyHotelById,
   fetchMyHotels,
   updateMyHotel,
} from "../controllers/my-hotel.controller";

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
   storage: storage,
   limits: {
      fieldSize: 3 * 1024 * 1024, // 3 MB
   },
});

router.post(
   "/",
   verifyToken,
   [
      body("name").isString().notEmpty().withMessage("Name is required"),
      body("city").isString().notEmpty().withMessage("City is required"),
      body("country").isString().notEmpty().withMessage("Country is required"),
      body("description").isString().notEmpty().withMessage("Description is required"),
      body("type").isString().notEmpty().withMessage("Type is required"),
      body("pricePerNight").isNumeric().notEmpty().withMessage("Price is required"),
      body("rating").isNumeric().notEmpty().withMessage("Rating is required"),
      body("facilities").notEmpty().isArray().withMessage("Facilities is required"),
      body("adultCount").isNumeric().notEmpty().withMessage("Adult count is required"),
      body("childCount").isNumeric().notEmpty().withMessage("Child count is required"),
   ],
   upload.array("imageFiles", 6),
   addHotel
);

router.get("/", verifyToken, fetchMyHotels);

router.get("/:id", verifyToken, fetchMyHotelById);

router.put("/:id", verifyToken, upload.array("imageFiles"), updateMyHotel);

export default router;
