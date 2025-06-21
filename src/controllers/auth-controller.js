import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

// Mock user database (replace with real database)
const users = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@admin.com",
    password: "123", // password
    // password: "$2b$10$w8b8QwQwQwQwQwQwQwQwQeQwQwQwQwQwQwQwQwQwQwQwQwQwQwQ", // hashed password
    role: "admin",
  },
];

// Register controller
export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: (users.length + 1).toString(),
      name,
      email,
      password: hashedPassword,
      phone,
      role: "customer",
    };

    users.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login controller
export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = users.find((user) => user.email === email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password (note: simplified comparison for the mock)
    const isPasswordValid = password === user.password;
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Logout controller
export const logout = (req, res) => {
  // In a real application, you might want to blacklist the token
  res.json({ message: "Logout successful" });
};
