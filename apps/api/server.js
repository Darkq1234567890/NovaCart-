const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");

const connectDatabase = require("./src/config/database");

dotenv.config();

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Security
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true
  })
);

// Request parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging
app.use(morgan("dev"));

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "NovaCart API is running",
    timestamp: new Date().toISOString()
  });
});

// Root
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to NovaCart API"
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found"
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error"
  });
});

const startServer = async () => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`NovaCart API running on port ${PORT}`);
  });
};

startServer();