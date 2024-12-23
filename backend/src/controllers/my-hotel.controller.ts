import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel.model";
import { verifyToken } from "../middlewares/auth.middleware";
import { body } from "express-validator";
import { HotelType } from "../shared/types";
import { asyncHandler } from "../util/async-handler";

async function uploadImages(imageFiles: Express.Multer.File[]): Promise<string[]> {
   const uploadPromises = imageFiles.map(async (image) => {
      const b64 = Buffer.from(image.buffer).toString("base64");
      let dataURI = "data:" + image.mimetype + ";base64," + b64;

      const uploadedImage = await cloudinary.v2.uploader.upload(dataURI);

      return uploadedImage.url;
   });

   return await Promise.all(uploadPromises);
}

export const addHotel = asyncHandler(
   async (req: Request, res: Response): Promise<any> => {
      const imageFiles = req.files as Express.Multer.File[];
      const hotel: HotelType = req.body;

      const imageUrls = await uploadImages(imageFiles);

      hotel.imageUrls = imageUrls;
      hotel.lastUpdated = new Date();
      hotel.userId = req.userId; // from middleware

      const newHotel = new Hotel(hotel);

      await newHotel.save();

      return res.status(201).json(newHotel);
   }
);

export const fetchMyHotels = asyncHandler(
   async (req: Request, res: Response): Promise<any> => {
      const hotels = await Hotel.find({ userId: req.userId });

      return res.status(200).json(hotels);
   }
);

export const fetchMyHotelById = asyncHandler(
   async (req: Request, res: Response): Promise<any> => {
      const id = req.params.id.toString();

      const hotel = await Hotel.findOne({
         _id: id,
         userId: req.userId,
      });

      return res.status(200).json(hotel);
   }
);

export const updateMyHotel = asyncHandler(
   async (req: Request, res: Response): Promise<any> => {
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
   }
);
