import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import {
  addAddress,
  addToWishlist,
  deleteAddress,
  getAddresses,
  getUserInfo,
  getWishlist,
  removeFromWishlist,
  updateAddress,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

// check user auth
userRouter.use(protectedRoute);
// address routes
userRouter.post("/addresses", addAddress);
userRouter.get("/addresses", getAddresses);
userRouter.put("/addresses/:addressId", updateAddress);
userRouter.delete("/addresses/:addressId", deleteAddress);

// wishlist routes
userRouter.post("/wishlist", addToWishlist);
userRouter.delete("/wishlist/:productId", removeFromWishlist);
userRouter.get("/wishlist", getWishlist);
userRouter.get("/me", getUserInfo);
export default userRouter;
