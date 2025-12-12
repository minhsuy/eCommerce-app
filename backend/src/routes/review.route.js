import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import {
  createReview,
  deleteReview,
} from "../controllers/review.controller.js";

const reviewRouter = express.Router();

reviewRouter.use(protectedRoute);

reviewRouter.post("/", createReview);
reviewRouter.delete("/:reviewId", deleteReview);

export default reviewRouter;
