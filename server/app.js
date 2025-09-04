import express from "express";
import cors from "cors";
import mongoose from "mongoose"; // <-- properly import mongoose
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000; // Use environment variable or default 5000
const MONGO_URI = "mongodb://127.0.0.1:27017/omnivibe"; // Replace with your MongoDB URI

// Middleware
app.use(express.json());
app.use(cors());

// Routes with base path /omnivibe
app.use("/omnivibe/auth", authRoutes);

// MongoDB connection function
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
};

// Connect to MongoDB and start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}/omnivibe`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server due to DB connection error", err);
  });
