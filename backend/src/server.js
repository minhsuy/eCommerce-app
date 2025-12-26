import express from "express";
import cors from "cors";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/connectDB.js";
import { clerkMiddleware } from "@clerk/express";
import { errorHandler } from "./middleware/errorHandler.js";
import { functions, inngest } from "./config/inngest.js";
import { serve } from "inngest/express";
import { initRoute } from "./routes/index.route.js";
import { GoogleGenAI } from "@google/genai";

const app = express();

const ai = new GoogleGenAI({
  apiKey: ENV.GEMINI_API_KEY,
});
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
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "message is required (string)" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: message }] }],
    });

    res.json({ text: response.text ?? "" });
  } catch (err) {
    const msg = err?.message ?? String(err);

    // Gemini hay nhét json string trong message như bạn thấy
    if (msg.includes('"code":429') || msg.includes("RESOURCE_EXHAUSTED")) {
      return res.status(429).json({
        error: "rate_limited",
        message:
          "Gemini quota/rate limit exceeded. Reduce requests or enable billing/increase quota.",
      });
    }

    console.error(err);
    res.status(500).json({ error: "gemini_error", message: msg });
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
