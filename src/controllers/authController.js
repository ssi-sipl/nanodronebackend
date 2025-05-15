import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js"; // adjust path as needed

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        status: false,
        message:
          'Invalid input: "email" is required and must be a non-empty string.',
      });
    }

    if (!password || typeof password !== "string" || !password.trim()) {
      return res.status(400).json({
        status: false,
        message:
          'Invalid input: "password" is required and must be a non-empty string.',
      });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res
        .status(400)
        .json({ status: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      status: true,
      message: "User registered successfully",
      id: user.id,
      email: user.email,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        status: false,
        message:
          'Invalid input: "email" is required and must be a non-empty string.',
      });
    }

    if (!password || typeof password !== "string" || !password.trim()) {
      return res.status(400).json({
        status: false,
        message:
          'Invalid input: "password" is required and must be a non-empty string.',
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid credentials" });
    }

    res.status(200).json({
      status: true,
      message: "User logged in successfully",
      email: user.email,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
      },
    });

    res.status(200).json({
      status: true,
      message: `${users.length} user(s) found`,
      data: users,
    });
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};
