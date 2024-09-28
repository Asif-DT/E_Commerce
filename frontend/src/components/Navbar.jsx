import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  console.log("user", user);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          E-Commerce
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Products
        </Button>

        {user ? (
          <>
            {user.role === "admin" && (
              <Button color="inherit" component={Link} to="/admin">
                Admin
              </Button>
            )}
            {user.role === "customer" && (
              <>
                <Button color="inherit" component={Link} to="/customer">
                  Customer
                </Button>
                <Button color="inherit" component={Link} to="/cart">
                  Cart
                </Button>
              </>
            )}
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/signup">
              Signup
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
