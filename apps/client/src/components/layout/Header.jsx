// File: apps/client/src/components/layout/Header.jsx

"use client";
import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, User, Menu, X, Search } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { SearchBar } from "./SearchBar";

const Header = () => {
  const { getCartItemCount } = useCart();
  const itemCount = getCartItemCount();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navLinks = [
    { href: "/products", label: "Shop" },
    { href: "#", label: "New Arrivals" },
    { href: "#", label: "Sales" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8"
        aria-label="Global"
      >
        {/* Hamburger Menu Icon (Mobile) */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link
            href="/"
            className="-m-1.5 p-1.5 text-2xl font-bold text-primary-600"
          >
            BlashBerry
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-x-12">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary-600"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Search Bar (Desktop) */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-center px-8">
          <SearchBar />
        </div>

        {/* Icons (Desktop) */}
        <div className="flex-row flex justify-end items-center">
          <Link href="/cart" className="relative">
            <ShoppingCart className="h-6 w-6 text-gray-600 hover:text-primary-600" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs font-medium text-white">
                {itemCount}
              </span>
            )}
          </Link>
          <Link href="/auth/login">
            <User className="h-6 w-6 text-gray-600 hover:text-primary-600" />
          </Link>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden ${isMenuOpen ? "block" : "hidden"}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="fixed inset-0 z-50" />
        <div className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="-m-1.5 p-1.5 text-2xl font-bold text-primary-600"
            >
              BlashBerry
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <div className="px-2">
                  <SearchBar />
                </div>
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
