import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllCustomers,
  getAllOrders,
  getAllProducts,
  getDashboardStats,
  updateOrderStatus,
  updateProduct,
  updateRoleUser,
} from "../controllers/admin.controller.js";
import { isAdmin, protectedRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const adminRouter = express.Router();

adminRouter.use(protectedRoute, isAdmin);
adminRouter.post("/products", upload.array("images", 3), createProduct);
adminRouter.get("/products", isAdmin, getAllProducts);
adminRouter.put("/products/:id", upload.array("images", 3), updateProduct);
adminRouter.delete("/products/:id", deleteProduct);

adminRouter.get("/orders", getAllOrders);
adminRouter.patch("/orders/:orderId/status", updateOrderStatus);

adminRouter.get("/customers", getAllCustomers);
adminRouter.patch("/customers/:userId", updateRoleUser);

adminRouter.get("/stats", getDashboardStats);
export default adminRouter;
