const express = require("express");
const Order = require("../models/Order");
const auth = require("../middleware/authMiddleware");
const Product = require("../models/Product");

const router = express.Router();

// Create a new order
router.post("/customer/create_order", auth("customer"), async (req, res) => {
  const { items } = req.body;

  try {
    // Initialize totalPrice to zero
    let totalPrice = 0;

    // Iterate over each item and calculate the total price
    for (const item of items) {
      const { product, quantity } = item;

      // Fetch the product details from the database
      const productDetails = await Product.findById(product);

      if (!productDetails) {
        return res
          .status(404)
          .json({ error: `Product with ID ${product} not found` });
      }

      // Calculate the total price for the current item
      const itemTotalPrice = productDetails.sellingPrice * quantity;

      // Add the item's total price to the order's total price
      totalPrice += itemTotalPrice;
    }

    // Create new order object
    const newOrder = new Order({
      user: req.user.id,
      items,
      totalPrice,
      status: "Pending",
      paymentMethod: "Cash", // default payment method
    });

    // Save the order to the database
    await newOrder.save();

    // Respond with the newly created order
    res.json(newOrder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Customer can view their orders
router.get("/customer/orders", auth("customer"), async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.json(orders);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Admin can view all orders
router.get("/admin/all_orders", auth("admin"), async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.json(orders);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
