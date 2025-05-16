import Training from "../Models/Trainings.js";
import User from "../Models/User.js";

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
    const user = await User.findById(req.user._id);
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
    const user = await User.findById(req.user._id);
    if (!user)
      return res.status(404).json({ error: "Користувач не знайдений" });
    const allTrainings = await Training.find({
      userId: req.user._id,
    });

    return res.status(200).json(allTrainings);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
