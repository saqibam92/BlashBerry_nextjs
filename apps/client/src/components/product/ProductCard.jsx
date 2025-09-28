// File: apps/client/src/components/product/ProductCard.jsx

"use client";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  Typography,
  Rating,
  Button,
  Box,
} from "@mui/material";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const router = useRouter();

  // Prevent rendering if the product object is invalid to avoid any errors.
  if (!product || !product.slug) {
    // This can happen during initial renders before data is loaded.
    return null;
  }

  // --- ULTRA-ROBUST FIX ---
  // This logic now finds the FIRST VALID, non-empty string in the images array.
  // It handles cases where the array might be missing, empty, or contain invalid entries.
  console.log("Product images:", product.images);

  const displayImage =
    product.images?.find((img) => {
      if (!img) return false;
      if (typeof img === "string") return img.length > 0;
      if (typeof img === "object" && typeof img.url === "string")
        return img.url.length > 0;
      return false;
    })?.url ||
    product.images?.[0] ||
    "https://placehold.co/400x400/f8fafc/64748b?text=No+Image";

  const handleAddToCartClick = (e) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation(); // Stop event bubbling
    router.push(`/products/${product.slug}`); // Redirect to select size
    toast("Please select a size to add to cart.", { icon: "ℹ️" });
  };

  return (
    <Card className="h-full flex flex-col transform transition-transform duration-300 hover:scale-105 hover:shadow-xl group">
      <Link
        href={`/products/${product.slug}`}
        passHref
        className="flex flex-col flex-grow"
      >
        <div className="aspect-square relative w-full overflow-hidden">
          <Image
            src={displayImage}
            alt={product.name || "Product Image"}
            fill
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardContent className="flex-grow flex flex-col">
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            className="truncate flex-grow"
          >
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" className="mb-2">
            {product.category?.name}
          </Typography>
          <div className="flex items-center justify-between mt-auto">
            <Typography variant="h5" color="primary">
              {formatPrice(product.price)}
            </Typography>
            <Rating
              name="read-only"
              value={product.rating}
              precision={0.5}
              readOnly
            />
          </div>
        </CardContent>
      </Link>
      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<ShoppingCart size={16} />}
          onClick={handleAddToCartClick}
        >
          Add to Cart
        </Button>
      </Box>
    </Card>
  );
};

export default ProductCard;
