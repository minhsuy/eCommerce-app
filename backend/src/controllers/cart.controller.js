import asyncHandler from "express-async-handler";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
export const getCart = asyncHandler(async (req, res) => {
  const { user } = req;
  let cart = await Cart.findOne({ clerkId: user.clerkId }).populate(
    "items.product"
  );
  if (!cart) {
    cart = await Cart.create({
      user: user._id,
      clerkId: user.clerkId,
      items: [],
    });
  }
  res.status(200).json({ cart });
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const { user } = req;
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  if (product.stock < quantity) {
    return res.status(400).json({ error: "Product out of stock" });
  }
  let cart = await Cart.findOne({ clerkId: user.clerkId });
  if (!cart) {
    const user = req.user;

    cart = await Cart.create({
      user: user._id,
      clerkId: user.clerkId,
      items: [],
    });
  }
  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );
  if (existingItem) {
    const updatedQuantity = existingItem.quantity + quantity;
    if (product.stock < updatedQuantity) {
      return res.status(400).json({ error: "Product out of stock" });
    }
    existingItem.quantity = updatedQuantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }
  await cart.save();
  res.status(200).json({ message: "Item added to cart", cart });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const { user } = req;
  if (quantity < 1)
    return res.status(400).json({ error: "Quantity must be at least 1" });
  const cart = await Cart.findOne({ clerkId: user.clerkId });
  if (!cart) {
    return res.status(404).json({ error: "Cart not found" });
  }
  const item = cart.items.find((item) => item.product.toString() === productId);
  if (!item) {
    return res.status(404).json({ error: "Item not found in cart" });
  }
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  if (product.stock < quantity) {
    return res.status(400).json({ error: "Product out of stock" });
  }
  item.quantity = quantity;
  await cart.save();
  res.status(200).json({ message: "Cart updated successfully", cart });
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { user } = req;
  const cart = await Cart.findOne({ clerkId: user.clerkId });
  if (!cart) {
    return res.status(404).json({ error: "Cart not found" });
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );
  await cart.save();

  res.status(200).json({ message: "Item removed from cart", cart });
});
export const clearCart = asyncHandler(async (req, res) => {
  const { user } = req;
  const cart = await Cart.findOne({ clerkId: user.clerkId });
  if (!cart) {
    return res.status(404).json({ error: "Cart not found" });
  }
  cart.items = [];
  await cart.save();
  res.status(200).json({ message: "Cart cleared successfully", cart });
});
