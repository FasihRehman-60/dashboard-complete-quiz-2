import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, confirmEmail, password, confirmPassword, gender } = req.body;

    // ✅ Validate required fields
    if (!name || !email || !confirmEmail || !password || !confirmPassword || !gender)
      return res.status(400).json({ message: "All fields are required." });

    if (email !== confirmEmail)
      return res.status(400).json({ message: "Emails do not match." });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match." });

    // ✅ Strong password rule
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;
    if (!passwordRegex.test(password))
      return res.status(400).json({
        message:
          "Password must include at least 1 uppercase letter, 1 special character, and be at least 6 characters long.",
      });

    // ✅ Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      gender: gender.toLowerCase(),
    });

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Validate input
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required." });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password." });

    // ✅ Create JWT token
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET missing in environment variables.");
      return res.status(500).json({ message: "Server misconfiguration." });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
};
