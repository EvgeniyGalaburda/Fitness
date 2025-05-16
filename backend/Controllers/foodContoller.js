import Food from "../Models/Food.js";
import User from "../Models/User.js";

export const addFood = async (req, res) => {
  try {
    const { title, weight, energyValue } = req.body;
    if (!title || !weight || !energyValue)
      return res
        .status(400)
        .json({ error: "Недостатньо даних для реєстрації прийому їжі" });
    const user = await User.findById(req.user._id);
    if (!user)
      return res.status(404).json({ error: "Користувача не знайдено" });
    const calories = weight * energyValue;
    const newFood = new Food({
      title,
      weight,
      energyValue,
      calories,
      userId: user.id,
    });
    await newFood.save();
    res.status(200).json({ message: "Прийом їжі зареєстровано!" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const todayInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user)
      return res.status(404).json({ error: "Користувача не знайдено" });
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const userFoodToday = await Food.find({
      userId: user.id,
      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
    });
    const amountOfCalories = userFoodToday.reduce((acc, cur) => {
      return acc + (cur.calories || 0);
    }, 0);
    return res.status(200).json({ userFoodToday, amountOfCalories });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const allFood = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user)
      return res.status(404).json({ error: "Користувача не знайдено" });
    const userFood = await Food.find({
      userId: user.id,
    });
    return res.status(200).json(userFood);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
