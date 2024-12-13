import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel.model";
import { verifyToken } from "../middlewares/auth.middleware";
import { body, param, validationResult } from "express-validator";
import { HotelSearchResponse, HotelType } from "../shared/types";
import { constructSearchQuery } from "../util/search-query-builder";

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

export default router;
