import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/user.route";
import authRoutes from "./routes/auth.route";
import myHotelRoutes from "./routes/my-hotel.routes";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
// import path from "path";

cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose.connect(process.env.MONGODB_URI as string);

const app = express();
app.use(cookieParser());
app.use(
   cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
   })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.get("/", (req, res) => {
   res.send("Hello!");
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/my-hotels", myHotelRoutes);

/*
   app.get("*", (req: Request, res: Response): any => {
      res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
   });
   
*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
