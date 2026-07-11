import User from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { generateToken } from "../utils/tokens.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ApiError(400, "User already exists");

  const user = await User.create({ name, email, password });
  const token = generateToken({ id: user._id, role: user.role });

  res.status(201).json({
    success: true,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken({ id: user._id, role: user.role });
  res.json({
    success: true,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});
