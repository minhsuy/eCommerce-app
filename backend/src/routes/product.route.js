import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { getAllProducts } from "../controllers/admin.controller.js";
import { getProductById } from "../controllers/product.controller.js";

const productRouter = express.Router();

productRouter.use(protectedRoute);
productRouter.get("/", getAllProducts);
productRouter.get("/:id", getProductById);
export default productRouter;
