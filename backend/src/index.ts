import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URI as string);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
   res.send("Hello World!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
