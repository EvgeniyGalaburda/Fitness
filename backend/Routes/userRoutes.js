import express from "express";
import {
  addMetrics,
  getMe,
  getUser,
  getUserById,
  getUsersSearch,
  loginUser,
  logoutUser,
  registerUser,
  sendFriendRequest,
} from "../Controllers/userController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/me", protectRoute, getMe);
router.get("/getUser/:username", getUser);
router.get("/getUserById/:id", getUserById);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.patch("/add-metrics", protectRoute, addMetrics);
router.post("/friend-request", protectRoute, sendFriendRequest);
router.post("/logout", logoutUser);
router.get("/search", getUsersSearch);

export default router;
