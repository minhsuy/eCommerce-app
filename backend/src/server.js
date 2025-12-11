import express from "express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/connectDB.js";
import { clerkMiddleware } from "@clerk/express";
import { errorHandler } from "./middleware/errorHandler.js";
import { functions, inngest } from "./config/inngest.js";
import { serve } from "inngest/express";
import { initRoute } from "./routes/index.route.js";
const app = express();

app.use(express.json());
app.use(clerkMiddleware());
app.use("/api/inngest", serve({ client: inngest, functions }));
initRoute(app);
app.use(errorHandler);
const startServer = async () => {
  try {
    await connectDB();
    if (ENV.NODE_ENV !== "development") {
      app.listen(ENV.PORT, () => {
        console.log(`Server is running on port ${ENV.PORT}`);
      });
      return;
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
startServer();
