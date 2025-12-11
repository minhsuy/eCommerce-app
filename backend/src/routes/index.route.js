import adminRouter from "./admin.route.js";
import userRouter from "./user.route.js";

export const initRoute = (app) => {
  app.use("/api/admin", adminRouter);
  app.use("/api/users", userRouter);
};
