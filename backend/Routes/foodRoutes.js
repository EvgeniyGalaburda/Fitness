import { Router } from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { addFood, allFood, todayInfo } from "../Controllers/foodContoller.js";

const router = new Router();

router.post("/add", protectRoute, addFood);
router.get("/today-info", protectRoute, todayInfo);
router.get("/all-food", protectRoute, allFood);

export default router;
