// File: apps/client/src/components/layout/SearchBar.jsx

"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { searchProducts } from "@/lib/productApi";
import { useDebounce } from "@/hooks/useDebounce"; // We will create this hook next
import { formatPrice } from "@/lib/utils";

export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const debouncedSearchTerm = useDebounce(searchTerm, 300); // 300ms delay

  const handleSearch = useCallback(async () => {
    if (debouncedSearchTerm) {
      const products = await searchProducts(debouncedSearchTerm);
      setResults(products);
    } else {
      setResults([]);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm) {
      router.push(`/search?q=${searchTerm}`);
      setSearchTerm("");
      setIsFocused(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setResults([]);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Delay to allow click on results
          placeholder="Search for products..."
          className="w-full pl-10 pr-10 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-10 top-1/2 -translate-y-1/2"
          >
            <X className="h-5 w-5 text-gray-500 hover:text-gray-800" />
          </button>
        )}
      </form>

      {isFocused && (searchTerm.length > 0 || results.length > 0) && (
        <div className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-lg z-50 overflow-hidden">
          {results.length > 0 ? (
            <ul>
              {results.map((product) => (
                <li key={product._id}>
                  <Link
                    href={`/products/${product.slug}`}
                    className="flex items-center p-3 hover:bg-gray-100"
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={50}
                      height={50}
                      className="rounded object-cover"
                    />
                    <div className="ml-4">
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-gray-600">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
              <li className="p-2 text-center border-t">
                <Link
                  href={`/search?q=${searchTerm}`}
                  className="text-sm font-semibold text-primary-600 hover:underline"
                >
                  Show all results
                </Link>
              </li>
            </ul>
          ) : (
            debouncedSearchTerm && (
              <p className="p-4 text-center text-gray-500">
                No products found.
              </p>
            )
          )}
        </div>
      )}
    </div>
  );
};
