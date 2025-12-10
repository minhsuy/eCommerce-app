import express from "express";
import { createProduct } from "../controllers/admin.controller.js";

const adminRouter = express.Router();

adminRouter.post("/products", createProduct);
export default adminRouter;
