import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { createOrder, getUserOrders } from "../controllers/order.controller.js";

const orderRouter = express.Router();
orderRouter.use(protectedRoute);

orderRouter.post("/", createOrder);
orderRouter.get("/", getUserOrders);

export default orderRouter;
