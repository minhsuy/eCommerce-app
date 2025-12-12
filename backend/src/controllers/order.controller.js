import { Order } from "../models/order.model.js";
import asyncHandler from "express-async-handler";
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";

// create a new order
export const createOrder = asyncHandler(async (req, res) => {
  const user = req.user;
  const { orderItems, shippingAddress, paymentResult, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ error: "No order items" });
  }
  for (const orderItem of orderItems) {
    const product = await Product.findById(orderItem.product._id);
    if (!product) {
      return res
        .status(404)
        .json({ error: `Product ${orderItem.name} not found` });
    }
    if (product.stock < orderItem.quantity) {
      return res.status(400).json({ error: "Product out of stock" });
    }
  }
  const order = await Order.create({
    user: user._id,
    clerkId: user.clerkId,
    orderItems,
    shippingAddress,
    paymentResult,
    totalPrice,
  });
  for (const orderItem of orderItems) {
    const product = await Product.findById(orderItem.product._id);
    product.stock -= orderItem.quantity;
    await product.save();
  }
  res.status(201).json({ message: "Order created successfully", order });
});

// get user orders
export const getUserOrders = asyncHandler(async (req, res) => {
  const { user } = req;
  const orders = await Order.find({ clerkId: user.clerkId })
    .populate("orderItems.product")
    .sort({ createdAt: -1 });
  const orderIds = orders.map((order) => order._id);
  const reviews = await Review.find({ orderId: { $in: orderIds } });
  const reviewedOrderIds = new Set(
    reviews.map((review) => review.orderId.toString())
  );

  const ordersWithReviewStatus = await Promise.all(
    orders.map(async (order) => {
      return {
        ...order.toObject(),
        hasReviewed: reviewedOrderIds.has(order._id.toString()),
      };
    })
  );

  res.status(200).json({ orders: ordersWithReviewStatus });
});
