import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Container,
  Button,
  Divider,
} from "@mui/material";
import axios from "axios";

const OrderSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = location.state || { cartItems: [] };
  const [cart, setCart] = useState([]);
  console.log("cartItems", cartItems);

  // Calculate the total price of the cart items
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.sellingPrice * item.quantity,
    0
  );

  // Handle order placement
  const handlePlaceOrder = async () => {
    // try {
    //   // Check if user is logged in
    //   const token = localStorage.getItem("token");
    //   if (!token) {
    //     alert("You need to be logged in to place an order.");
    //     navigate("/login");
    //     return;
    //   }

    //   // Call the backend API to place the order
    //   const response = await axios.post(
    //     "http://localhost:5000/api/orders",
    //     { items: cartItems, totalPrice },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //   );

    //   // Order successfully placed, clear the cart and redirect
    //   localStorage.removeItem("cart");
    //   alert("Order placed successfully!");
    //   navigate("/customer/orders"); // Redirect to customer orders page
    // } catch (error) {
    //   console.error("Error placing order:", error);
    //   alert("Error placing order. Please try again.");
    // }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You need to be logged in to proceed with checkout.");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/orders/customer/checkout",
        {},
        {
          headers: {
            "x-auth-token": token, // Use x-auth-token as expected by the backend
          },
        }
      );

      alert("Order placed successfully!");
      console.log("Order response:", response.data);

      // Clear the cart in the frontend
      setCart([]);
      localStorage.removeItem("cart");

      navigate("/customer");

      // Redirect to the order summary or customer orders page
      //   navigate("/customer/orders");
      // navigate("/order-summary", { state: { cartItems: cart } });
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing order. Please try again.");
    }
  };

  // In OrderSummary.js
  if (!localStorage.getItem("token")) {
    alert("You need to be logged in to place an order.");
    navigate("/login");
    return;
  }

  return (
    <Container>
      <Typography variant="h4" sx={{ my: 2 }}>
        Order Summary
      </Typography>
      {cartItems.length === 0 ? (
        <Typography variant="h6" color="textSecondary">
          Your cart is empty. Go back to the shop to add products.
        </Typography>
      ) : (
        <>
          <List>
            {cartItems.map((item) => (
              <React.Fragment key={item.id}>
                <ListItem>
                  <ListItemText
                    primary={item.product.name}
                    secondary={`Quantity: ${item.quantity} | Price: $${
                      item.product.sellingPrice * item.quantity
                    }`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
          <Typography variant="h5" sx={{ my: 2 }}>
            Total Price: ${totalPrice.toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePlaceOrder}
            sx={{ mt: 2 }}
          >
            Confirm Order
          </Button>
        </>
      )}
    </Container>
  );
};

export default OrderSummary;
