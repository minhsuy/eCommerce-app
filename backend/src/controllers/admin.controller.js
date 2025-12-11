import asyncHnandler from "express-async-handler";
import { Product } from "../models/product.model.js";
import { uploadImageService } from "../services/cloudinary.services.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
// Create a new product
export const createProduct = asyncHnandler(async (req, res) => {
  const { name, description, price, stock, category } = req.body;
  if (!name || !description || !price || !stock || !category) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "At least one image is required" });
  }
  if (req.files.length > 3) {
    return res.status(400).json({ message: "Maximum 3 images allowed" });
  }
  const uploadPromises = await uploadImageService(req.files);
  const imageUrls = uploadPromises.map((image) => image.secure_url);
  const product = await Product.create({
    name,
    description,
    price: Number(price),
    stock: Number(stock),
    category,
    images: imageUrls,
  });
  res.status(201).json(product);
});

// Get all products
export const getAllProducts = asyncHnandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.status(200).json(products);
});

// Update a product
export const updateProduct = asyncHnandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, category } = req.body;
  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  if (name) product.name = name;
  if (description) product.description = description;
  if (price !== undefined) product.price = parseFloat(price);
  if (stock !== undefined) product.stock = parseInt(stock);
  if (category) product.category = category;
  if (req.files && req.files.length > 0) {
    if (req.files.length > 3) {
      return res.status(400).json({ message: "Maximum 3 images allowed" });
    }
    const uploadPromises = await uploadImageService(req.files);
    const imageUrls = uploadPromises.map((image) => image.secure_url);
    product.images = imageUrls;
  }
  await product.save();
  res.status(200).json(product);
});

// delete a product
export const deleteProduct = asyncHnandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.status(200).json({ message: "Product deleted successfully" });
});

// Get all orders
export async function getAllOrders(_, res) {
  const orders = await Order.find()
    .populate("user", "name email")
    .populate("orderItems.product")
    .sort({ createdAt: -1 });

  res.status(200).json({ orders });
}

// update order status
export async function updateOrderStatus(req, res) {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!["pending", "shipped", "delivered"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  order.status = status;

  if (status === "shipped" && !order.shippedAt) {
    order.shippedAt = new Date();
  }

  if (status === "delivered" && !order.deliveredAt) {
    order.deliveredAt = new Date();
  }

  await order.save();

  res.status(200).json({ message: "Order status updated successfully", order });
}

// Get all customers
export async function getAllCustomers(req, res) {
  const customers = await User.find().sort({ createdAt: -1 });
  res.status(200).json({ customers });
}

// Get dashboard stats
export async function getDashboardStats(req, res) {
  const totalOrders = await Order.countDocuments();

  const revenueResult = await Order.aggregate([
    // { $match: { status: "delivered" } },
    {
      $group: {
        _id: null,
        total: { $sum: "$totalPrice" },
      },
    },
  ]);

  const totalRevenue = revenueResult[0]?.total || 0;

  const totalCustomers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();

  res.status(200).json({
    totalRevenue,
    totalOrders,
    totalCustomers,
    totalProducts,
  });
}
