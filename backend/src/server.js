import express from "express";
import cors from "cors";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/connectDB.js";
import { clerkMiddleware } from "@clerk/express";
import { errorHandler } from "./middleware/errorHandler.js";
import Groq from "groq-sdk";
import { functions, inngest } from "./config/inngest.js";
import { serve } from "inngest/express";
import { initRoute } from "./routes/index.route.js";

const app = express();

app.use(express.json());
app.use(clerkMiddleware());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.get("/", (_, res) =>
  res.status(200).json({ message: "Hi . This is E-commerce API" })
);
const groq = new Groq({ apiKey: ENV.GROQ_API_KEY });
const model = ENV.GROQ_MODEL || "llama-3.3-70b-versatile";
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body || {};
    if (!message || typeof message !== "string") {
      return res
        .status(400)
        .json({ error: "Body must contain { message: string }" });
    }

    const completion = await groq.chat.completions.create({
      model,
      messages: [{ role: "user", content: message }],
      temperature: 0.7,
    });

    const text = completion?.choices?.[0]?.message?.content ?? "";
    return res.json({ model, text });
  } catch (err) {
    const status = err?.status || err?.code;
    return res.status(status === 429 ? 429 : 500).json({
      error: "GROQ_REQUEST_FAILED",
      message: err?.message || String(err),
    });
  }
});

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
