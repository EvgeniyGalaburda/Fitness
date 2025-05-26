import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./Routes/userRoutes.js";
import trainingRoutes from "./Routes/trainingRoutes.js";
import foodRoutes from "./Routes/foodRoutes.js";
import path from "path";

import connectMongo from "./db/ConnectMongo.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRoutes);
app.use("/api/trainings", trainingRoutes);
app.use("/api/food", foodRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  connectMongo();
});
