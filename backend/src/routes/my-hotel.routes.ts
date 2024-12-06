import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel.model";
import { verifyToken } from "../middlewares/auth.middleware";
import { body } from "express-validator";
import { HotelType } from "../shared/types";

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
   storage: storage,
   limits: {
      fieldSize: 3 * 1024 * 1024, // 3 MB
   },
});

async function uploadImages(imageFiles: Express.Multer.File[]): Promise<string[]> {
   const uploadPromises = imageFiles.map(async (image) => {
      const b64 = Buffer.from(image.buffer).toString("base64");
      let dataURI = "data:" + image.mimetype + ";base64," + b64;

      const uploadedImage = await cloudinary.v2.uploader.upload(dataURI);

      return uploadedImage.url;
   });

   return await Promise.all(uploadPromises);
}

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
   async (req: Request, res: Response): Promise<any> => {
      try {
         const imageFiles = req.files as Express.Multer.File[];
         const hotel: HotelType = req.body;

         const imageUrls = await uploadImages(imageFiles);

         hotel.imageUrls = imageUrls;
         hotel.lastUpdated = new Date();
         hotel.userId = req.userId; // from middleware

         const newHotel = new Hotel(hotel);

         await newHotel.save();

         return res.status(201).json(newHotel);
      } catch (error) {
         console.log(error);
         res.status(500).send("Internal Server Error");
      }
   }
);

router.get("/", verifyToken, async (req: Request, res: Response): Promise<any> => {
   try {
      const hotels = await Hotel.find({ userId: req.userId });

      return res.status(200).json(hotels);
   } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
   }
});

router.get("/:id", verifyToken, async (req: Request, res: Response): Promise<any> => {
   try {
      const id = req.params.id.toString();

      const hotel = await Hotel.findOne({
         _id: id,
         userId: req.userId,
      });

      return res.status(200).json(hotel);
   } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
   }
});

router.put(
   "/:id",
   verifyToken,
   upload.array("imageFiles"),
   async (req: Request, res: Response): Promise<any> => {
      try {
         const updatedHotel: HotelType = req.body;

         updatedHotel.lastUpdated = new Date();

         const hotel = await Hotel.findOneAndUpdate(
            {
               _id: req.params.id,
               userId: req.userId,
            },
            updatedHotel,
            { new: true }
         );

         if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
         }

         const files = req.files as Express.Multer.File[];

         const updatedImageUrls = await uploadImages(files);

         hotel.imageUrls = [...updatedImageUrls, ...(updatedHotel.imageUrls || [])]; // on top of existing images.

         await hotel.save();

         return res.status(201).json(hotel);
      } catch (error) {
         console.log(error);
         res.status(500).send("Internal Server Error");
      }
   }
);

export default router;
