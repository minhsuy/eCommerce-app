import express from "express";
import cors from "cors";
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
app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  })
);
app.get("/", (_, res) =>
  res.status(200).json({ message: "Hi . This is E-commerce API" })
);
app.use("/api/inngest", serve({ client: inngest, functions }));
initRoute(app);
app.use(errorHandler);
const startServer = async () => {
  try {
    await connectDB();

    const PORT = Number(process.env.PORT) || Number(ENV.PORT) || 3000;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${PORT}`);
      console.log("NODE_ENV:", ENV.NODE_ENV);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

startServer();
