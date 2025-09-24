// File: apps/client/src/app/(shop)/products/page.jsx

"use client"; 

import { useState, useEffect } from 'react';
import ProductFilter from '@/components/product/ProductFilter'; 
import ProductCard from '@/components/ui/ProductCard'; 
import { getAllProducts } from '@/lib/productApi';
import { CircularProgress, Pagination } from '@mui/material';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 9, // Let's display 9 products per page
    sort: 'newest',
  });

  // This useEffect hook will run whenever the 'filters' state changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const result = await getAllProducts(filters);
      setProducts(result.data || []);
      setPagination(result.pagination || {});
      setLoading(false);
    };

    fetchProducts();
  }, [filters]);

  // This is the function that will be passed down to the filter component
  const handleFilterChange = (newFilters) => {
    // When filters are applied, update the state and reset to page 1
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  // This handles clicks on the pagination component
  const handlePageChange = (event, value) => {
    setFilters(prev => ({ ...prev, page: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Shop All Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Filters Column */}
        <div className="col-span-1">
          {/* CRUCIAL FIX: Pass the handleFilterChange function as a prop */}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.length > 0 ? (
                  products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))
                ) : (
                  <p className="col-span-full text-center text-gray-500">No products found with the current filters.</p>
                )}
              </div>
              <div className="flex justify-center mt-8">
                {pagination.pages > 1 && (
                  <Pagination
                    count={pagination.pages || 1}
                    page={pagination.current || 1}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
