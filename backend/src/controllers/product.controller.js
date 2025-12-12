import { Product } from "../models/product.model.js";
import asyncHandler from "express-async-handler";
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) return res.status(404).json({ message: "Product not found" });

  returnres.status(200).json(product);
});
