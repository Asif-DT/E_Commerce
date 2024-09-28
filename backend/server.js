const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const authRoutes = require("./routes/authRoute");
const productRoutes = require("./routes/authRoute");
const orderRoutes = require("./routes/orderRoute");

const app = express();
connectDB();

// Middleware
app.use(express.json());

// Enable CORS
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
