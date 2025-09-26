// File: apps/client/src/app/(shop)/page.js (Homepage)

import ProductCard from "@/components/product/ProductCard";
import BannerSlider from "@/components/home/BannerSlider";
import { getFeaturedProducts, getActiveBanners } from "@/lib/productApi";

// This new function fetches data safely, returning empty arrays if the API fails.
async function getHomePageData() {
  try {
    // Fetch banners and products in parallel for better performance
    const [bannersRes, products] = await Promise.all([
      getActiveBanners(),
      getFeaturedProducts(),
    ]);

    // Safely access the nested data property for banners
    const banners = bannersRes?.data?.data || [];

    return { banners, products };
  } catch (error) {
    // If ANY API call fails during the Vercel build, this will catch the error.
    console.error("Failed to fetch homepage data during build:", error.message);
    // It returns empty arrays, allowing the page to build successfully without data.
    return { banners: [], products: [] };
  }
}

export default async function HomePage() {
  const { banners, products } = await getHomePageData();

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <BannerSlider banners={banners} />

        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mt-12">
          Featured Products
        </h2>

        {products.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-gray-500">
            Could not load featured products at this time. Please check back
            later.
          </p>
        )}
      </div>
    </div>
  );
}
