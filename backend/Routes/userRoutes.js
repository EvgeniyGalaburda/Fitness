import express from "express";
import {
  addMetrics,
  getMe,
  loginUser,
  registerUser,
  sendFriendRequest,
} from "../Controllers/userController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/me", protectRoute, getMe);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.patch("/add-metrics", protectRoute, addMetrics);
router.post("/friend-request", protectRoute, sendFriendRequest);

export default router;
