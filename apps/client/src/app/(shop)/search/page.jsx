// File: apps/client/src/app/(shop)/search/page.jsx

"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductFilter from "@/components/product/ProductFilter"; // Import the filter component
import { getAllProducts } from "@/lib/productApi";
import { CircularProgress, Pagination } from "@mui/material";
import ProductCard from "@/components/product/ProductCard";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});

  // This state now holds ALL query parameters, including the search term and filters
  const [filters, setFilters] = useState({
    search: query || "",
    page: 1,
    limit: 9,
    sort: "newest",
  });

  // This effect runs ONLY when the search query in the URL changes.
  // It resets the filters to their defaults but keeps the new search term.
  useEffect(() => {
    setFilters({
      search: query || "",
      page: 1,
      limit: 9,
      sort: "newest",
    });
  }, [query]);

  // This effect runs whenever the combined 'filters' state changes (e.g., new search, new filter applied, new page).
  useEffect(() => {
    const fetchProducts = async () => {
      // Only fetch if there is a search term
      if (!filters.search) {
        setLoading(false);
        setProducts([]);
        return;
      }
      setLoading(true);
      const result = await getAllProducts(filters);
      setProducts(result.data || []);
      setPagination(result.pagination || {});
      setLoading(false);
    };

    fetchProducts();
  }, [filters]);

  // This function is passed to the ProductFilter component
  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 })); // Apply new filters and reset to page 1
  };

  // This handles clicks on the pagination component
  const handlePageChange = (event, value) => {
    setFilters((prev) => ({ ...prev, page: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {query ? (
        <h1 className="text-3xl font-bold mb-8">
          Search results for:{" "}
          <span className="text-primary-600">"{query}"</span>
        </h1>
      ) : (
        <h1 className="text-3xl font-bold mb-8">Please enter a search term</h1>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters Column */}
        <div className="col-span-1">
          <ProductFilter onFilterChange={handleFilterChange} />
        </div>

        {/* Products Grid */}
        <div className="col-span-3">
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <CircularProgress size={50} />
            </div>
          ) : (
            <>
              {products.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                  <div className="flex justify-center mt-8">
                    {pagination.pages > 1 && (
                      <Pagination
                        count={pagination.pages || 1}
                        page={filters.page}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                      />
                    )}
                  </div>
                </>
              ) : (
                query && (
                  <p className="col-span-full text-center text-gray-500">
                    No products found matching your search.
                  </p>
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-96">
          <CircularProgress />
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
