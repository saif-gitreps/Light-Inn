import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/user.route";
import authRoutes from "./routes/auth.route";
import myHotelRoutes from "./routes/my-hotel.routes";
import hotelRoutes from "./routes/hotel.route";
import myBookingRoutes from "./routes/my-booking.route";
import chatRoutes from "./routes/my-booking.route";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import rateLimit from "express-rate-limit";
import http from "http";
import initializeSocket from "./websocket/wsServer";
// import path from "path";

cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const server = http.createServer(app);

mongoose.connect(process.env.MONGODB_URI as string);

app.use(cookieParser());
app.use(
   cors({
      origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
      credentials: true,
      optionsSuccessStatus: 200,
      allowedHeaders: ["Content-Type", "Authorization"],
   })
);
const limiter = rateLimit({
   windowMs: 5 * 60 * 1000,
   max: 1500,
   message: "Too many requests from this IP, please try again after 15 minutes",
   headers: true,
   statusCode: 429,
});
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.get("/", (req, res) => {
   res.send("Hello!");
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/my-hotels", myHotelRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/my-bookings", myBookingRoutes);
app.use("/api/chat", chatRoutes);

initializeSocket(server);

/*
   app.get("*", (req: Request, res: Response): any => {
      res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
   });
   
*/

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
   console.error(err.stack);

   res.status(500).send({
      message: err.message || "Internal server error",
   });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
