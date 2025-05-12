// controllers/authController.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

export const registerUser = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        status: false,
        message: "Missing request body",
      });
    }

    const { email, password } = req.body;

    if (!email || typeof email !== "string" || email.trim() === "") {
      return res.status(400).json({
        status: false,
        message:
          'Invalid input: "email" is required and must be a non-empty string.',
      });
    }
    if (!password || typeof password !== "string" || password.trim() === "") {
      return res.status(400).json({
        status: false,
        message:
          'Invalid input: "password" is required and must be a non-empty string.',
      });
    }

    const cleanedEmail = email.trim();
    const cleanedPassword = password.trim();

    const userExists = await User.findOne({ email: cleanedEmail });
    if (userExists)
      return res
        .status(400)
        .json({ status: false, message: "User already exists" });

    const user = await User.create({
      email: cleanedEmail,
      password: cleanedPassword,
    });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User registration failed",
      });
    }
    // Generate JWT token
    res.status(201).json({
      status: true,
      message: "User registered successfully",
      _id: user._id,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Error at controllers/authController/registerUser:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        status: false,
        message: "Missing request body",
      });
    }
    const { email, password } = req.body;
    if (!email || typeof email !== "string" || email.trim() === "") {
      return res.status(400).json({
        status: false,
        message:
          'Invalid input: "email" is required and must be a non-empty string.',
      });
    }
    if (!password || typeof password !== "string" || password.trim() === "") {
      return res.status(400).json({
        status: false,
        message:
          'Invalid input: "password" is required and must be a non-empty string.',
      });
    }
    const cleanedEmail = email.trim();
    const cleanedPassword = password.trim();

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      status: true,
      message: "User logged in successfully",
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Error at controllers/authController/loginUser:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude sensitive info
    res.status(200).json({
      status: true,
      message: `${users.length} user(s) found`,
      data: users,
    });
  } catch (error) {
    console.error("Error at controllers/authController/getAllUsers:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};
