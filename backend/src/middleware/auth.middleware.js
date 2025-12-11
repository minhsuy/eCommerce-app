import { getAuth, requireAuth } from "@clerk/express";
import { User } from "../models/user.model.js";
export const protectedRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const { userId } = req.auth;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const user = await User.findOne({ clerkId: userId });
      if (!user) {
        return res
          .status(401)
          .json({ message: "Unauthorized - User not found" });
      }
      req.role = user.role;
      req.user = user;
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
];

export const isAdmin = (req, res, next) => {
  const role = req.role;
  if (role !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden - Admin access required" });
  }
  next();
};
