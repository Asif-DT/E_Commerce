const express = require("express");
const Product = require("../models/Product");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Admin can create products
router.post("/", auth("admin"), async (req, res) => {
  const {
    name,
    description,
    image,
    originalPrice,
    discountPrice,
    sellingPrice,
    quantity,
    uom,
    hsnCode,
  } = req.body;
  try {
    const newProduct = new Product({
      name,
      description,
      image,
      originalPrice,
      discountPrice,
      sellingPrice,
      quantity,
      uom,
      hsnCode,
    });
    await newProduct.save();
    res.json(newProduct);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
