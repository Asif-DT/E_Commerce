import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import axios from "axios";
import AuthContext from "../context/AuthContext";

const CustomerPage = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          "http://localhost:5000/api/orders/customer/orders",
          {
            headers: {
              "x-auth-token": token, // Use x-auth-token as expected by the backend
            },
          }
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  return (
    <Container>
      <Typography variant="h4" sx={{ my: 2 }}>
        Your Orders
      </Typography>
      {orders.length === 0 ? (
        <Typography variant="h6" color="textSecondary">
          You have no orders yet.
        </Typography>
      ) : (
        <List>
          {orders.map((order) => (
            <React.Fragment key={order._id}>
              <ListItem>
                <ListItemText
                  primary={`Order ID: ${order._id}`}
                  secondary={`Total Price: $${order.totalPrice} | Status: ${order.status}`}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}
    </Container>
  );
};

export default CustomerPage;
