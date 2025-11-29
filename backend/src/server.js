import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import contactRoute from "./routes/contactRoute.js";
import newsRoutes from "./routes/newsRoutes.js";
import apiKeyRoutes from "./routes/apiKeyRoutes.js";
import publicNewsRoutes from "./routes/publicNewsRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();
// Middlewares
app.use(cors());
app.use(express.json());
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api", contactRoute);
app.use("/api/news", newsRoutes);

app.use("/api/user", apiKeyRoutes);
app.use("/api/public", publicNewsRoutes);

app.get("/", (req, res) => {
  res.send("✅ Backend API is running successfully!");
});

app.use((req, res, next) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(err.status || 500).json({ success: false, error: err.message || "Server Error" });
});

// Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
