import React, { useState, useEffect, useContext } from "react";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Typography,
  Container,
  Divider,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "axios";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Load cart items from localStorage when component mounts
  //   useEffect(() => {
  //     const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
  //     setCart(savedCart);
  //   }, []);

  // Load cart items from API when component mounts
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/orders/customer/cart",
          {
            headers: {
              "x-auth-token": token, // Use x-auth-token as expected by the backend
            },
          }
        );
        setCart(response.data); // Set cart with data from the API
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    if (user) {
      fetchCartItems(); // Call the function to fetch cart items if user is logged in
    }
  }, [user]);

  // Remove item from cart and update localStorage
  //   const removeFromCart = (id) => {
  //     const updatedCart = cart.filter((item) => item.id !== id);
  //     setCart(updatedCart);
  //     localStorage.setItem("cart", JSON.stringify(updatedCart));
  //   };

  // Remove item from cart and update using API
  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.delete(
        `http://localhost:5000/api/orders/cart/remove/${productId}`,
        {
          headers: {
            "x-auth-token": token, // Use x-auth-token as expected by the backend
          },
        }
      );
      setCart(response.data.data); // Update cart with the new data from the API
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  };

  // Handle checkout button click
  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert(
        "Your cart is empty. Add some products before proceeding to checkout."
      );
      return;
    }

    // Navigate to the order summary page (or you can implement order placement logic here)
    navigate("/order-summary", { state: { cartItems: cart } });
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ my: 2 }}>
        Shopping Cart
      </Typography>
      {cart.length === 0 ? (
        <Typography variant="h6" color="textSecondary">
          Your cart is empty. Start adding some products!
        </Typography>
      ) : (
        <List>
          {cart.map((item) => (
            <React.Fragment key={item.id}>
              <ListItem>
                <ListItemText
                  primary={item.product.name}
                  secondary={`Quantity: ${item.quantity} | Price: $${
                    item.product.sellingPrice * item.quantity
                  }`}
                />
                <IconButton onClick={() => removeFromCart(item._id)}>
                  <Delete />
                </IconButton>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}
      {cart.length > 0 && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleCheckout}
          sx={{ mt: 2 }}
        >
          Proceed to Checkout
        </Button>
      )}
    </Container>
  );
};

export default Cart;
