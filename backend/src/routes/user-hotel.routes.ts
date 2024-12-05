import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel, { HotelType } from "../models/hotel.model";
import { verifyToken } from "../middlewares/auth.middleware";
import { body } from "express-validator";

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
   async (req: Request, res: Response) => {
      try {
         const imageFiles = req.files as Express.Multer.File[];
         const hotel: HotelType = req.body;

         const uploadPromises = imageFiles.map(async (image) => {
            const b64 = Buffer.from(image.buffer).toString("base64");
            let dataURI = "data:" + image.mimetype + ";base64," + b64;

            const uploadedImage = await cloudinary.v2.uploader.upload(dataURI);

            return uploadedImage.url;
         });

         const imageUrls = await Promise.all(uploadPromises);

         hotel.imageUrls = imageUrls;
         hotel.lastUpdated = new Date();
         hotel.userId = req.userId; // from middleware

         const newHotel = new Hotel(hotel);

         await newHotel.save();

         res.status(201).send(newHotel);
      } catch (error) {
         console.log(error);
         res.status(500).send("Internal Server Error");
      }
   }
);

export default router;
