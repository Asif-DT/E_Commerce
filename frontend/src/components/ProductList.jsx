import React, { useState, useEffect } from "react";
import { Grid, Typography, Container } from "@mui/material";
import ProductCard from "./ProductCard";
import FilterBar from "./FilterBar";
import productsData from "../data/products.json"; // Assuming a JSON file with product data
import axios from "axios";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  // useEffect(() => {
  //   setProducts(productsData);
  // }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/products/allProducts"
        ); // Fetch products from the API
        console.log("products console", response.data);
        setProducts(response.data.data); // Set the products state with the data from the API
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts(); // Call the function to fetch products when the component mounts
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Container>
      <Typography variant="h4" sx={{ my: 2 }}>
        Product List
      </Typography>
      <FilterBar
        filter={filter}
        setFilter={setFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={viewMode === "grid" ? 6 : 12} key={product.id}>
            <ProductCard product={product} viewMode={viewMode} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProductList;
