import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import { requestIdHandler } from "./middlewares/req-handler";
import userRoutes from "./routes/user.route";
import authRoutes from "./routes/auth.route";

mongoose.connect(process.env.MONGODB_URI as string);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestIdHandler as express.RequestHandler);

app.get("/", (req, res) => {
   res.send("Hello!");
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
