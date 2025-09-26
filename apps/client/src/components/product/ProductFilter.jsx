// File: apps/client/src/components/product/ProductFilter.jsx

"use client";

import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Checkbox,
  FormControlLabel,
  Slider,
  Button,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getCategories } from "@/lib/productApi";

// Pass onFilterChange as a prop
const ProductFilter = ({ onFilterChange }) => {
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSort, setSelectedSort] = useState("newest");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        if (res.success) {
          setCategories(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories for filter:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target; // The 'value' will be the category _id
    setSelectedCategories((prev) =>
      checked ? [...prev, value] : prev.filter((id) => id !== value)
    );
  };

  const applyFilters = () => {
    onFilterChange({
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      category: selectedCategories.join(","), // Join the IDs into a string
      sort: selectedSort,
    });
  };

  // Mock data - in a real app, you might fetch these from the API
  // const categories = [
  //   "T-Shirts",
  //   "Hoodies",
  //   "Jeans",
  //   "Dresses",
  //   "Shoes",
  //   "Jackets",
  // ];

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  // const handleCategoryChange = (event) => {
  //   const { name, checked } = event.target;
  //   setSelectedCategories((prev) =>
  //     checked ? [...prev, name] : prev.filter((cat) => cat !== name)
  //   );
  // };

  const handleSortChange = (event) => {
    setSelectedSort(event.target.value);
  };

  // const applyFilters = () => {
  //   onFilterChange({
  //     minPrice: priceRange[0],
  //     maxPrice: priceRange[1],
  //     category: selectedCategories.join(","), // API can split by comma
  //     sort: selectedSort,
  //   });
  // };

  return (
    <div className="p-4 border rounded-lg shadow-sm space-y-4">
      <Typography variant="h6">Filters</Typography>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Category</Typography>
        </AccordionSummary>
        <AccordionDetails className="flex flex-col">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <FormControlLabel
                key={cat._id}
                label={cat.name}
                control={
                  <Checkbox
                    value={cat._id} // --- FIX: Use the ID as the value ---
                    onChange={handleCategoryChange}
                  />
                }
              />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              Loading categories...
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Price Range</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Slider
            value={priceRange}
            onChange={handlePriceChange}
            max={10000}
            step={100}
            valueLabelDisplay="auto"
            getAriaLabel={() => "Price range"}
          />
          <div className="flex justify-between">
            <Typography variant="body2">${priceRange[0]}</Typography>
            <Typography variant="body2">${priceRange[1]}</Typography>
          </div>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Sort By</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl>
            <RadioGroup value={selectedSort} onChange={handleSortChange}>
              <FormControlLabel
                value="newest"
                control={<Radio />}
                label="Newest"
              />
              <FormControlLabel
                value="price_asc"
                control={<Radio />}
                label="Price: Low to High"
              />
              <FormControlLabel
                value="price_desc"
                control={<Radio />}
                label="Price: High to Low"
              />
              <FormControlLabel
                value="rating"
                control={<Radio />}
                label="Top Rated"
              />
            </RadioGroup>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      <Button
        variant="contained"
        color="primary"
        className="w-full"
        onClick={applyFilters}
      >
        Apply Filters
      </Button>
    </div>
  );
};

export default ProductFilter;
