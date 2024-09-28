const express = require("express");
const Product = require("../models/Product");
const auth = require("../middleware/authMiddleware");
const upload = require("../utils/utils");

const router = express.Router();

// Get all products
router.get("/allProducts", async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ result: "success", data: products });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Admin can create products
router.post(
  "/addProduct",
  upload.single("image"),
  auth("admin"),
  async (req, res) => {
    const {
      name,
      description,
      originalPrice,
      discountPrice,
      sellingPrice,
      quantity,
      uom,
      hsnCode,
    } = req.body;
    try {
      // Check if file is uploaded
      if (!req.file) {
        return res.status(400).json({ error: "Image is required" });
      }

      const newProduct = new Product({
        name,
        description,
        image: req.file.path,
        originalPrice,
        discountPrice,
        sellingPrice,
        quantity,
        uom,
        hsnCode,
      });
      await newProduct.save();
      res.json({
        result: "success",
        message: "Product added successfully",
        data: newProduct,
      });
    } catch (err) {
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
