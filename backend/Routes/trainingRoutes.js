import { Router } from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  addTraining,
  allUsersTrainigns,
  todayInfo,
} from "../Controllers/trainingController.js";

const router = new Router();

router.post("/add", protectRoute, addTraining);
router.get("/today-info", protectRoute, todayInfo);
router.get("/all-trainings", protectRoute, allUsersTrainigns);

export default router;
