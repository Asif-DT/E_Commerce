const express = require("express");
const Order = require("../models/Order");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new order
router.post("/", auth("customer"), async (req, res) => {
  const { items, totalPrice } = req.body;
  try {
    const newOrder = new Order({ user: req.user.id, items, totalPrice });
    await newOrder.save();
    res.json(newOrder);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Customer can view their orders
router.get("/", auth("customer"), async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.json(orders);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Admin can view all orders
router.get("/all", auth("admin"), async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.json(orders);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
