// File: apps/client/src/components/products/ProductFilter.jsx

import { useState } from "react";
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

// Pass onFilterChange as a prop
const ProductFilter = ({ onFilterChange }) => {
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSort, setSelectedSort] = useState("newest");

  // Mock data - in a real app, you might fetch these from the API
  const categories = [
    "T-Shirts",
    "Hoodies",
    "Jeans",
    "Dresses",
    "Shoes",
    "Jackets",
  ];

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleCategoryChange = (event) => {
    const { name, checked } = event.target;
    setSelectedCategories((prev) =>
      checked ? [...prev, name] : prev.filter((cat) => cat !== name)
    );
  };

  const handleSortChange = (event) => {
    setSelectedSort(event.target.value);
  };

  const applyFilters = () => {
    onFilterChange({
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      category: selectedCategories.join(","), // API can split by comma
      sort: selectedSort,
    });
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm space-y-4">
      <Typography variant="h6">Filters</Typography>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Category</Typography>
        </AccordionSummary>
        <AccordionDetails className="flex flex-col">
          {categories.map((cat) => (
            <FormControlLabel
              key={cat}
              control={<Checkbox name={cat} onChange={handleCategoryChange} />}
              label={cat}
            />
          ))}
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
