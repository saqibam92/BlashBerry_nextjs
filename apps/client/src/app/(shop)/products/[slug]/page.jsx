// File: apps/client/src/app/(shop)/products/[slug]/page.jsx

import { getProductBySlug, getSimilarProducts } from "@/lib/productApi";
import ProductDetailsClient from "@/components/product/ProductDetailsClient";
import { notFound } from "next/navigation";

// This is the main Server Component
export default async function ProductDetailPage({ params }) {
  const { slug } = params;

  // --- FIX: Prevent fetching if slug is invalid ---
  if (!slug || slug === "undefined") {
    notFound();
  }

  // Fetch product and similar products in parallel
  const [product, similarProducts] = await Promise.all([
    getProductBySlug(slug),
    getSimilarProducts(slug),
  ]);

  // If the product doesn't exist, show a 404 page
  if (!product) {
    notFound();
  }

  // Render the client component with the fetched data
  return (
    <ProductDetailsClient product={product} similarProducts={similarProducts} />
  );
}
