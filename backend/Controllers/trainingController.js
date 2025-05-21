import Training from "../Models/Trainings.js";
import User from "../Models/User.js";

import { calculateDailyCalories } from "../utils/calculateDailyCalories.js";

export const addTraining = async (req, res) => {
  try {
    const { type, duration, MET } = req.body;
    if (!type || !duration || !MET)
      return res.status(400).json({ error: "Не всі дані про тренування" });

    const user = await User.findById(req.user._id).select("-password");
    if (!user)
      return res.status(404).json({ error: "Користувач не знайдений" });
    const userWeight = user.weight;

    const calories = (duration / 60) * MET * userWeight * 1.05;

    const newTraining = new Training({
      type,
      duration,
      MET,
      calories,
      userId: user.id,
    });
    await newTraining.save();
    res.status(200).json({ message: "Тренування додано", newTraining });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const todayInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user)
      return res.status(404).json({ error: "Користувач не знайдений" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const userTodayTrainings = await Training.find({
      userId: req.user._id,
      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    const amountOfCalories = userTodayTrainings.reduce((a, c) => {
      return a + (c.calories || 0);
    }, 0);

    return res.status(200).json({ userTodayTrainings, amountOfCalories });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const allUsersTrainigns = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.query.username }).select(
      "-password"
    );
    if (!user)
      return res.status(404).json({ error: "Користувач не знайдений" });
    const allTrainings = await Training.find({
      userId: user.id,
    });

    return res.status(200).json(allTrainings);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getDailyCalories = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.query.username }).select(
      "-password"
    );
    if (!user) return res.status(404);

    const trainings = await Training.find({ userId: user.id });
    const dailyCaloriesSummary = calculateDailyCalories(trainings);

    res.status(200).json(dailyCaloriesSummary);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getWall = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user)
      return res.status(404).json({ error: "Користувач не знайдений" });

    const userFriends = user.friends;

    const filteredTrainings = await Training.find({
      userId: { $in: userFriends },
    });

    const friendsTraining = await Promise.all(
      filteredTrainings.map(async (t) => {
        const friendUser = await User.findById(t.userId).select("-password");
        return { username: friendUser?.username || "", training: t };
      })
    );

    res.status(200).json(friendsTraining);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
