// File: apps/client/src/components/product/ProductCard.jsx

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, Typography, Rating } from "@mui/material";
import { formatPrice } from "@/lib/utils";

const ProductCard = ({ product }) => {
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
            {product.category}
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
    </Card>
  );
};

export default ProductCard;
