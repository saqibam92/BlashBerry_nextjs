// File: apps/client/src/app/(shop)/page.js (Homepage)

import ProductCard from "@/components/product/ProductCard";
import BannerSlider from "@/components/home/BannerSlider";
import { getFeaturedProducts, getActiveBanners } from "@/lib/productApi";

// This new function fetches data safely, returning empty arrays on error
async function getHomePageData() {
  try {
    // Fetch banners and products in parallel for better performance
    const [bannersRes, productsRes] = await Promise.all([
      getActiveBanners(),
      getFeaturedProducts(),
    ]);

    // Ensure we return arrays even if the API response is malformed
    const banners = bannersRes?.data || [];
    const products = productsRes || []; // getFeaturedProducts already returns an array

    return { banners, products };
  } catch (error) {
    // If ANY API call fails during the build, log the error and return empty data.
    // This allows the page to still build successfully.
    console.error("Failed to fetch homepage data during build:", error.message);
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
            Could not load featured products at this time.
          </p>
        )}
      </div>
    </div>
  );
}
