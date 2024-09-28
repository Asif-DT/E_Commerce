import React from "react";
import { TextField, ButtonGroup, Button } from "@mui/material";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";

const FilterBar = ({ filter, setFilter, viewMode, setViewMode }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "20px",
      }}
    >
      <TextField
        label="Search Products"
        variant="outlined"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <ButtonGroup>
        <Button
          onClick={() => setViewMode("grid")}
          startIcon={<ViewModuleIcon />}
          variant={viewMode === "grid" ? "contained" : "outlined"}
        >
          Grid
        </Button>
        <Button
          onClick={() => setViewMode("list")}
          startIcon={<ViewListIcon />}
          variant={viewMode === "list" ? "contained" : "outlined"}
        >
          List
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default FilterBar;
