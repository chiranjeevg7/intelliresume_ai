import jwt from "jsonwebtoken";
import env from "../config/env.js";
import User from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;
  if (!token) throw new ApiError(401, "Unauthorized");

  const decoded = jwt.verify(token, env.jwtSecret);
  const user = await User.findById(decoded.id).select("-password");
  if (!user) throw new ApiError(401, "Invalid token");
  req.user = user;
  next();
});

export const adminOnly = (req, _res, next) => {
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Admin access required");
  }
  next();
};
