const express = require("express");
const Order = require("../models/Order");
const auth = require("../middleware/authMiddleware");
const Product = require("../models/Product");
const User = require("../models/User");

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

// Add product to cart
router.post("/customer/cart/add", auth("customer"), async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    // Find the user making the request
    const user = await User.findById(req.user.id);

    // Find the product to be added to the cart
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if product already exists in the cart
    const cartItemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (cartItemIndex > -1) {
      // If product exists in the cart, update the quantity
      user.cart[cartItemIndex].quantity += quantity;
    } else {
      // If product doesn't exist, add it to the cart
      user.cart.push({ product: productId, quantity });
    }

    // Save the updated user with the modified cart
    await user.save();

    res.json(user.cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// View Cart - Get the current cart items for the user
router.get("/customer/cart", auth("customer"), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.product");
    res.json(user.cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Checkout and Place Order with Cash Payment
router.post("/customer/checkout", auth("customer"), async (req, res) => {
  try {
    // Fetch the user's cart
    const user = await User.findById(req.user.id).populate("cart.product");

    // Check if cart is empty
    if (user.cart.length === 0) {
      return res.status(400).json({ error: "Your cart is empty!" });
    }

    // Calculate total price and check product availability
    let totalPrice = 0;
    for (const item of user.cart) {
      const product = item.product;
      const quantity = item.quantity;

      // Check if product is still available and has enough stock
      if (product.quantity < quantity) {
        return res
          .status(400)
          .json({ error: `Insufficient stock for product: ${product.name}` });
      }

      totalPrice += product.sellingPrice * quantity;
    }

    // Create a new order
    const newOrder = new Order({
      user: req.user.id,
      items: user.cart.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      totalPrice,
      status: "Pending", // Afttr implement payment gateway, we can change the status
      paymentMethod: "Cash",
    });

    // Save the new order
    await newOrder.save();

    // Update product quantities in stock
    for (const item of user.cart) {
      const product = await Product.findById(item.product._id);
      product.quantity -= item.quantity;
      await product.save();
    }

    // Clear the user's cart
    user.cart = [];
    await user.save();

    // Respond with the new order details
    res.json(newOrder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get all orders
router.get("/all_orders", auth("admin"), async (req, res) => {
  try {
    // Fetch all orders and populate user and product details
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name sellingPrice");

    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// View Single Order Summary
router.get("/order/:orderId", auth("customer"), async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("items.product")
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check if the order belongs to the user
    if (order.user._id.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Unauthorized access to this order" });
    }

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
