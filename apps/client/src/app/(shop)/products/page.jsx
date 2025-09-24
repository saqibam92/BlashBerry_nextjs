// File: apps/client/src/app/(shop)/products/page.jsx

import ProductFilter from "@/components/product/ProductFilter";
import ProductCard from "@/components/product/ProductCard";

// Mock data - you will fetch this from your API
const mockProducts = [
  {
    id: 1,
    name: "Classic Cotton T-Shirt",
    slug: "classic-cotton-t-shirt",
    category: "T-Shirts",
    price: 599,
    rating: 4.5,
    imageUrl:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
  },
  {
    id: 2,
    name: "Premium Hoodie",
    slug: "premium-hoodie",
    category: "Hoodies",
    price: 1299,
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
  },
  // ... more products
];

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Shop All Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters Column */}
        <div className="col-span-1">
          <ProductFilter />
        </div>

        {/* Products Grid */}
        <div className="col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
