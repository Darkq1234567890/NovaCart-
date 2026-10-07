const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");

const connectDatabase = require("./src/config/database");

const authRoutes = require("./src/routes/auth/authRoutes");
const userRoutes = require("./src/routes/users/userRoutes");
const healthRoutes = require("./src/routes/health/healthRoutes");
const productRoutes = require("./src/routes/products/productRoutes");
const categoryRoutes = require("./src/routes/categories/categoryRoutes");
const vendorRoutes = require("./src/routes/vendors/vendorRoutes");
const variantRoutes = require("./src/routes/variants/variantRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());

app.use(
cors({
origin: process.env.FRONTEND_URL || "*",
credentials: true
})
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/variants", variantRoutes);

app.get("/api/health", (req, res) => {
res.status(200).json({
success: true,
message: "NovaCart API is running",
timestamp: new Date().toISOString()
});
});

app.get("/", (req, res) => {
res.json({
success: true,
message: "Welcome to NovaCart API"
});
});

app.use((req, res) => {
res.status(404).json({
success: false,
message: "API route not found"
});
});

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
console.log("NovaCart API running on port ${PORT}");
});
};

startServer();