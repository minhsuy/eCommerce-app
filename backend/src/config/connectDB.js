import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(ENV.DB_URL);
    console.log("Database connected");
  } catch (error) {
    console.log("Cannot connect to database", error);
  }
};
