// File: apps/client/src/components/products/ProductDetailsClient.jsx

"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import ProductCard from "./ProductCard";
import ProductGallery from "./ProductGallery"; // Import new gallery
import ProductReviews from "./ProductReviews"; // Import new reviews component
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import toast from "react-hot-toast";
import { Breadcrumbs, Typography } from "@mui/material";
import Link from "next/link";

export default function ProductDetailsClient({ product, similarProducts }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size.");
      return;
    }
    addToCart(product, 1, selectedSize);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="bg-white">
      <div className="pt-6">
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:max-w-7xl lg:px-8">
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link href="/" style={{ textDecoration: "hover" }}>
              Home
            </Link>
            <Link href="/products" style={{ textDecoration: "hover" }}>
              Shop
            </Link>
            <Typography color="text.primary">
              {product.category?.name}
            </Typography>
          </Breadcrumbs>
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
            {/* --- CHANGE: Use the new ProductGallery component --- */}
            <ProductGallery images={product.images} altText={product.name} />

            {/* Product Info */}
            <div className="lg:border-l lg:border-gray-200 lg:pl-8 mt-8 lg:mt-0">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {product.name}
              </h1>
              <p className="text-3xl tracking-tight text-gray-900 mt-4">
                {formatPrice(product.price)}
              </p>

              <div className="mt-10">
                <h3 className="text-sm font-medium text-gray-900">
                  Description
                </h3>
                <div className="space-y-6 mt-4">
                  <p className="text-base text-gray-900">
                    {product.description}
                  </p>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-sm font-medium text-gray-900">Size</h3>
                <div className="flex items-center space-x-3 mt-4">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`border rounded-md py-2 px-4 text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? "bg-primary-600 text-white border-primary-600"
                          : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                className="mt-10 w-full"
                size="lg"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Bought Together / Similar Products Section */}
      {similarProducts && similarProducts.length > 0 && (
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Frequently Bought Together
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {similarProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      {similarProducts && similarProducts.length > 0 && (
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Related Products
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {similarProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* --- NEW: Add the ProductReviews component --- */}
      <ProductReviews
        productSlug={product.slug}
        reviews={product.reviews}
        initialRating={product.rating}
        initialNumReviews={product.numReviews}
      />
    </div>
  );
}
