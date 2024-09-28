import React, { useContext } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";
import axios from "axios";
import AuthContext from "../context/AuthContext";

const ProductCard = ({ product, viewMode }) => {
  const { user } = useContext(AuthContext);

  const addToCart = async () => {
    if (!user) {
      alert("You need to be logged in to add items to the cart.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/orders/customer/cart/add",
        { productId: product._id, quantity: 1 }, // Replace `product._id` with the appropriate field
        {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      alert("Product added to cart successfully!");
      console.log(response.data); // You can use this response to update the cart UI if needed
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Error adding product to cart. Please try again.");
    }
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: viewMode === "list" ? "row" : "column",
        alignItems: viewMode === "list" ? "center" : "flex-start",
      }}
    >
      <CardMedia
        component="img"
        height={viewMode === "list" ? "100" : "200"}
        image={`http://localhost:5000/${product.image}`}
        alt={product.name}
      />
      <CardContent>
        <Typography variant="h6">{product.name}</Typography>
        <Typography variant="body2" color="textSecondary">
          {product.description}
        </Typography>
        <Typography variant="h5">${product.sellingPrice}</Typography>
        <Button variant="contained" sx={{ mt: 1 }} onClick={addToCart}>
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
