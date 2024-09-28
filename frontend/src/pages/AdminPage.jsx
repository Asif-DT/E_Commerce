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

const AdminPage = () => {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Fetch all customers
        const customersResponse = await axios.get(
          "http://localhost:5000/api/auth/admin/customers",
          {
            headers: {
              "x-auth-token": token, // Use x-auth-token as expected by the backend
            },
          }
        );
        setCustomers(customersResponse.data);

        // Fetch all orders
        const ordersResponse = await axios.get(
          "http://localhost:5000/api/orders/admin/all_orders",
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        setOrders(ordersResponse.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    if (user && user.role === "admin") {
      fetchAdminData();
    }
  }, [user]);

  return (
    <Container>
      <Typography variant="h4" sx={{ my: 2 }}>
        Admin Dashboard
      </Typography>

      <Typography variant="h6" sx={{ my: 2 }}>
        Customers
      </Typography>
      {customers.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          No customers found.
        </Typography>
      ) : (
        <List>
          {customers.map((customer) => (
            <React.Fragment key={customer._id}>
              <ListItem>
                <ListItemText
                  primary={`${customer.name} (${customer.email})`}
                  // secondary={`Total Orders: ${customer.orders.length}`}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}

      <Typography variant="h6" sx={{ my: 2 }}>
        Orders
      </Typography>
      {orders.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          No orders found.
        </Typography>
      ) : (
        <List>
          {orders.map((order) => (
            <React.Fragment key={order._id}>
              <ListItem>
                <ListItemText
                  primary={`Order ID: ${order._id} | Customer: ${order.user.name}`}
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

export default AdminPage;
