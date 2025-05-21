import { Router } from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  addTraining,
  allUsersTrainigns,
  getDailyCalories,
  getWall,
  todayInfo,
} from "../Controllers/trainingController.js";

const router = new Router();

router.post("/add", protectRoute, addTraining);
router.get("/today-info", protectRoute, todayInfo);
router.get("/all-trainings", allUsersTrainigns);
router.get("/statistic", getDailyCalories);
router.get("/wall", protectRoute, getWall);

export default router;
