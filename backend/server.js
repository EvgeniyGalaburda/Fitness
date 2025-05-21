import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./Routes/userRoutes.js";
import trainingRoutes from "./Routes/trainingRoutes.js";
import foodRoutes from "./Routes/foodRoutes.js";

import connectMongo from "./db/ConnectMongo.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRoutes);
app.use("/api/trainings", trainingRoutes);
app.use("/api/food", foodRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  connectMongo();
});
