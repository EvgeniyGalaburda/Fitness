import bcrypt from "bcryptjs";

import User from "../Models/User.js";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import { calculateBMR } from "../utils/calculateBMR.js";

export const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username.includes(" "))
      return res
        .status(400)
        .json({ error: "Username must not includes spaces" });

    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ error: "Username is taken" });

    if (password.length < 6)
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, password: hashedPassword });
    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        username,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(201).json(user);
  } catch (error) {
    console.log("Error in getMe controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect)
      return res.status(400).json({ message: "Invalid username or password" });

    generateTokenAndSetCookie(user._id, res);
    const userRes = await User.findById(user._id).select("-password");

    res.status(200).json(userRes);
  } catch (error) {
    console.log(`Error in login Controller: ${error.message}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addMetrics = async (req, res) => {
  try {
    const { weight, height, age, sex } = req.body;
    const user = await User.findById(req.user._id).select("-password");

    if (!weight || !height || !age || !sex) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.weight = weight;
    user.height = height;
    user.age = age;
    user.sex = sex;
    user.imt = weight / (height / 100) ** 2;

    const BMR = calculateBMR(user);
    if (BMR == 0) return "Неможливо порахувати норму калорій для вашого полу";

    let calorieGoal = 0;
    if (user.imt <= 18.5) calorieGoal = BMR * 1.15 + 500;
    else if (user.imt > 18.5 || user.imt <= 24.9) calorieGoal = BMR * 1.15;
    else if (user.imt > 24.9) calorieGoal = BMR * 1.15 - 750;

    user.calorieGoal = calorieGoal;

    await user.save();

    return res
      .status(200)
      .json({ message: "Metrics added successfully", user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    const userRecipient = await User.findById(req.body.id).select("-password");

    if (user._id.toString() == userRecipient._id.toString())
      return res.status(400).json({ message: "Не можна додати себе в друзі" });

    if (!user || !userRecipient) {
      return res.status(404).json({ message: "Користувач не знайдений" });
    }

    const existingRequest = userRecipient.friendRequests.find(
      (req) => req.toString() === user._id.toString()
    );

    if (existingRequest) {
      return res.status(400).json({ message: "Запит вже надіслано" });
    }

    if (user.friends.includes(userRecipient.id)) {
      return res
        .status(400)
        .json({ message: "Користувач вже у списку друзів" });
    }

    const reverseRequest = user.friendRequests.find(
      (req) => req.toString() === userRecipient.id.toString()
    );

    if (reverseRequest) {
      user.friends.push(userRecipient.id);
      userRecipient.friends.push(user.id);
      user.friendRequests = user.friendRequests.filter(
        (id) => id.toString() !== userRecipient.id.toString()
      );

      await user.save();
      await userRecipient.save();
      return res.status(200).json({ message: "Запит на дружбу прийнято" });
    }

    userRecipient.friendRequests.push(user._id);
    await userRecipient.save();

    res.status(200).json({ message: "Запит на дружбу надіслано" });
  } catch (error) {
    console.error("Помилка надсилання запиту в друзі:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

export const getUser = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("-password");
    if (!user)
      return res.status(404).json({ error: "Користувача не знайдено!" });

    return res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user)
      return res.status(404).json({ error: "Користувача не знайдено!" });

    return res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUsersSearch = async (req, res) => {
  try {
    const query = req.query.username;
    const users = await User.find({
      username: { $regex: query, $options: "i" },
    }).select("-password");
    res.status(200).json(users || []);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
